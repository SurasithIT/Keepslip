import React, { Component } from "react";
import Loader from "../components/loader";
import compareValues from "../functions/sortdata";
import ReceiptMini from "../receipt/receiptMini";
import ReceiptMiniStore from "../receipt/receiptMiniStore";
import fetch from "isomorphic-unfetch";
import register from "../functions/registerSW";

export default class ReceiptsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      loadDisplay: "flex",
      dataDisplay: "none",
      search: "",
      db: "",
    };
  }

  isMounted = true;
  controller;

  componentDidMount = async () => {
    this.controller = new window.AbortController();
    console.log("isMounted", this.isMounted);
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      if ("serviceWorker" in navigator) {
        var register = await navigator.serviceWorker.register(
          "/service-worker.js",
          {
            scope: "/",
          }
        );
      }
    }

    this.initIndexedDB();

    let uri = "";
    if (this.props.role === "store") {
      uri = `http://api.keepslip.com/receipt/receiptByStore/${this.props.user_id}`;
    }
    if (this.props.role === "customer") {
      uri = `http://api.keepslip.com/receipt/receiptByCustomer/${this.props.user_id}`;
    }
    const res = await fetch(uri, { signal: this.controller.signal });
    const datas = await res.json();
    // console.log(datas);

    if (datas.error) {
      this.setState({
        datas: datas,
        loadDisplay: "none",
        dataDisplay: "grid",
      });
      return;
    }

    for (let i = 0; i < datas.length; i++) {
      if (this.isMounted == false) {
        break;
      } else {
        const receiptFetch = await fetch(
          `http://api.keepslip.com/smartcontract/fullReceipt/${datas[i].KeepSlip_receipt_id}`,
          {
            signal: this.controller.signal,
          }
        );
        const receipt = await receiptFetch.json();

        datas[i].items = receipt.items;
        //   console.log(datas[i].items);
        console.log(receipt);

        // get total price
        let total = 0;
        for (let i = 0; i < receipt.items.length; i++) {
          total += receipt.items[i].price * receipt.items[i].amount;
        }
        datas[i].total = total;
        let one_day = 1000 * 60 * 60 * 24;
        // add data in IndexedDB
        if (this.props.role == "customer") {
          for (let i = 0; i < receipt.items.length; i++) {
            if (receipt.items[i].warranty) {
              let expire = this.expireTime(
                receipt.receiptDate,
                receipt.items[i].warrantyTime
              );
              let remaining = this.remainTime(expire);
              if (
                receipt.items[i].warrantyTime >= 7 &&
                remaining >= 6 * one_day
              ) {
                // console.log("Add!!!", receipt.receiptId, i, remaining);
                this.addReceiptNoti(
                  register,
                  this.state.db,
                  receipt.receiptId,
                  i + 1,
                  remaining
                );
              }
            }
          }
        }
      }
    }

    let dataSorted;
    if (!datas.error) {
      dataSorted = datas.sort(compareValues("Receipt_date", "desc"));
    }

    this.setState({
      datas: dataSorted,
      loadDisplay: "none",
      dataDisplay: "grid",
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  initIndexedDB = () => {
    let db;
    let dbRequest = indexedDB.open("NotiDB", 1);
    dbRequest.onupgradeneeded = (e) => {
      db = e.target.result;
      this.setState({
        db: db,
      });
      if (!db.objectStoreNames.contains("Warranty")) {
        db.createObjectStore("Warranty", { keyPath: "noti_id" });
      }
    };

    dbRequest.onsuccess = (e) => {
      db = e.target.result;
      this.setState({
        db: db,
      });

      let tx = db.transaction(["Warranty"], "readonly");
      let store = tx.objectStore("Warranty");
      let req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          console.log("NotiDB", cursor.key, cursor.value);
          // alert(cursor);
          cursor.continue();
        }
      };
      db.close();
    };

    dbRequest.onerror = (e) => {
      alert("error opening database " + e.target.errorCode);
    };
  };

  remainTime = (expire) => {
    let one_day = 1000 * 60 * 60 * 24;
    let timeNow = Date.now();
    let remaining = expire - timeNow;
    // let remaining = createTime + one_day * warrantyTime - timeNow;

    // console.log("remaining", remaining);
    // console.log("remaining day", remaining / one_day);
    return remaining;
  };

  expireTime = (receiptDate, warrantyTime) => {
    let one_day = 1000 * 60 * 60 * 24;
    if (warrantyTime == 0) {
      return 0;
    }
    let createTime;
    createTime = new Date(receiptDate);
    createTime = createTime.getTime();
    let expire = createTime + one_day * warrantyTime;
    // let remaining = createTime + one_day * warrantyTime - timeNow;

    // console.log("expire", expire);
    // console.log("expire day", new Date(expire));
    return expire;
  };

  addReceiptNoti = (register, db, rec_id, item_num, remainTime) => {
    // Start a database transaction and get the notes object store
    let dbRequest = indexedDB.open("NotiDB", 1);
    dbRequest.onsuccess = (e) => {
      db = e.target.result;
      let tx = db.transaction(["Warranty"], "readwrite");
      let store = tx.objectStore("Warranty");
      // Put the sticky note into the object store
      let receipt = {
        noti_id: `${rec_id}_${item_num}`,
        receipt_id: rec_id,
        item_id: item_num,
        remain: remainTime,
        timestamp: Date.now(),
      };
      store.add(receipt);
      tx.oncomplete = function () {
        console.log("stored receipt!");
        register.active.postMessage(
          JSON.stringify({
            status: "sent",
            rec_id: rec_id,
            item_id: item_num,
            remain: remainTime,
          })
        );
      };
      tx.onerror = function (event) {
        console.log("error storing receipt " + event.target.error);
      };
      db.close();
    };
    // Wait for the database transaction to complete
  };
  componentWillUnmount = () => {
    // let abortController = new window.AbortController();
    // abortController.abort();
    this.controller.abort();
    console.log("componentWillUnmount");
    this.isMounted = false;
    console.log("isMounte", this.isMounted);
  };
  // controller = new window.AbortController();

  render() {
    return (
      <div className="container">
        <div
          className="content-loader-overlay"
          style={{
            display: this.state.loadDisplay,
          }}
        >
          <Loader />
        </div>
        <div className="search-box">
          <input
            className="search-txt"
            type="text"
            placeholder="Search"
            name="search"
            value={this.state.search}
            onChange={this.handleChange}
          />
          <a className="search-btn">
            <i className="fas fa-search"></i>
          </a>
        </div>
        {this.state.datas && this.state.datas.error && (
          <div className="data-error">
            <span>Error : {this.state.datas.message}</span>
          </div>
        )}
        <div
          className="content"
          style={{
            display: this.state.dataDisplay,
          }}
        >
          {this.state.datas &&
            !this.state.datas.error &&
            this.state.datas
              .filter((data) => {
                for (let i = 0; i < data.items.length; i++) {
                  if (
                    data.items[i].productName
                      .toLowerCase()
                      .indexOf(this.state.search.toLowerCase()) !== -1
                  ) {
                    return data;
                  }
                }
                return (
                  data.KeepSlip_receipt_id.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.Receipt_date.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.Firstname.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.Lastname.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.PhoneNumber.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.Email.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.NID.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.StoreName.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.BusinessName.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.Address.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1 ||
                  data.PostCode.toLowerCase().indexOf(
                    this.state.search.toLowerCase()
                  ) !== -1
                );
              })
              .map(
                (data) => {
                  if (this.props.role === "store") {
                    return (
                      <ReceiptMiniStore
                        key={data.KeepSlip_receipt_id}
                        receipt_id={data.KeepSlip_receipt_id}
                        store_id={data.Store_id}
                        customer_id={data.Customer_id}
                        receipt_date={data.Receipt_date}
                        customerFirstname={data.Firstname}
                        customerLastname={data.Lastname}
                        customerPhoneNumber={data.PhoneNumber}
                        customerEmail={data.Email}
                        storeNID={data.NID}
                        storeBranch_id={data.Branch_id}
                        storeStoreName={data.StoreName}
                        storeBusinessName={data.BusinessName}
                        storeAddress={data.Address}
                        storePostCode={data.PostCode}
                        items={data.items}
                        total={data.total}
                      />
                    );
                  }
                  if (this.props.role === "customer") {
                    return (
                      <ReceiptMini
                        key={data.KeepSlip_receipt_id}
                        receipt_id={data.KeepSlip_receipt_id}
                        store_id={data.Store_id}
                        customer_id={data.Customer_id}
                        receipt_date={data.Receipt_date}
                        customerFirstname={data.Firstname}
                        customerLastname={data.Lastname}
                        customerPhoneNumber={data.PhoneNumber}
                        customerEmail={data.Email}
                        storeNID={data.NID}
                        storeBranch_id={data.Branch_id}
                        storeStoreName={data.StoreName}
                        storeBusinessName={data.BusinessName}
                        storeAddress={data.Address}
                        storePostCode={data.PostCode}
                        items={data.items}
                        total={data.total}
                      />
                    );
                  }
                }
                // (
                //
                // )
              )}
        </div>
        <style jsx>{`
          .container {
            height: 100%;
          }
          .content-loader-overlay {
            align-items: center;
            justify-content: center;
            height: 100%;
          }
          .content {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 1em;
            justify-items: stretch;
            padding: 20px 20px;
          }
          .data-error {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            margin: auto;
            margin-top: 40px;
            font-size: 17px;
            padding: 10px;
            border: 2px solid #ff5757;
            border-radius: 3px;
            background: #ff9f9f;
            width: fit-content;
          }
          .search-box {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            // margin-bottom: 5px;
          }
          .search-txt {
            width: 50%;
            text-align: center;
            height: 30px;
            border-radius: 5px;
            border: 1px solid #1979e6;
            padding: 6px;
            font-size: 15px;
          }
          .search-btn {
            align-items: center;
            justify-content: center;
            margin: 0px 10px;
            color: #1564bf;
          }
          @media (max-width: 850px) {
            .content {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (max-width: 630px) {
            .content {
              width: 80%;
              margin: auto;
              grid-template-columns: repeat(2, 1fr);
              padding: 10px 0px;
            }
            .search-txt {
              width: 70%;
            }
            @media (max-width: 450px) {
              .content {
                grid-template-columns: 1fr;
              }
            }
          }
        `}</style>
      </div>
    );
  }
}
