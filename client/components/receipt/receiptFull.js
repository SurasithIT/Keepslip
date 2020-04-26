import fetch from "isomorphic-unfetch";
import React, { Component } from "react";
import Loader from "../components/loader";
import ExportModal from "../components/exportModal";
import domtoimage from "dom-to-image";
import Link from "next/link";
class ReceiptFull extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receipt: {},
      receiptDate: "",
      items: [],
      total: 0,
      loaded: false,
      loadDisplay: "block",
      dataDisplay: "none",
      exportModalOpacity: 0,
      exportModalDisplay: "none",
    };
  }
  controller;

  componentDidMount = async (props) => {
    this.controller = new window.AbortController();
    const receiptFetch = await fetch(
      `http://${process.env.API_PATH}/smartcontract/fullReceipt/${this.props.receipt_id}`,
      { signal: this.controller.signal }
    );
    const receipt = await receiptFetch.json();

    let total = 0;
    console.log(receipt);
    for (let i = 0; i < receipt.items.length; i++) {
      total += receipt.items[i].price * receipt.items[i].amount;
    }

    this.setState({
      receipt: receipt,
      receiptDate: receipt.receiptDate.slice(0, 19).replace("T", " "),
      items: receipt.items,
      total: total,
      loaded: true,
      loadDisplay: "none",
      dataDisplay: "block",
    });
    if (this.state.items.length > 0) {
      for (let i = 0; i < receipt.items.length; i++) {
        let remainingDay = this.expireDate(
          this.state.receiptDate,
          this.state.items[i].warrantyTime
        );
        if (remainingDay <= 0) {
          remainingDay = "Expired";
        } else {
          remainingDay = remainingDay;
        }
        let newState = Object.assign({}, this.state);
        newState.items[i].remainingDay = remainingDay;
        this.setState(newState);
      }
      // console.log(this.state.items);
    }
  };

  componentWillUnmount = () => {
    console.log("componentWillUnmount");
    this.controller.abort();
  };
  expireDate = (receiptDate, warrantyTime) => {
    let one_day = 1000 * 60 * 60 * 24;
    let timeNow = Date.now();
    if (warrantyTime == 0) {
      return 0;
    }
    let createTime;
    createTime = new Date(receiptDate);
    createTime = createTime.getTime();
    let remainingDay = Math.ceil(
      (createTime + one_day * warrantyTime - timeNow) / one_day
    );

    console.log((createTime + one_day * warrantyTime - timeNow) / one_day);
    return remainingDay;
  };

  modalOpacity = () => {
    if (
      this.state.exportModalOpacity == 0 &&
      this.state.exportModalDisplay == "none"
    ) {
      this.setState({
        exportModalOpacity: 1,
        exportModalDisplay: "block",
      });
    }
    if (
      this.state.exportModalOpacity == 1 &&
      this.state.exportModalDisplay == "block"
    ) {
      this.setState({
        exportModalOpacity: 0,
        exportModalDisplay: "none",
      });
    }
  };

  downloadJPG = () => {
    domtoimage
      .toJpeg(this.refs.receipt, {
        quality: 1,
        bgcolor: "#fff",
      })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "receipt.jpg";
        link.href = dataUrl;
        link.click();
      });
  };
  downloadSVG = () => {
    domtoimage
      .toSvg(this.refs.receipt, { bgcolor: "#fff" })
      .then(function (dataUrl) {
        /* do something */
        var link = document.createElement("a");
        link.download = "receipt.svg";
        link.href = dataUrl;
        link.click();
      });
  };
  downloadPDF = () => {
    var options = {
      filename: "receipt.pdf",
    };
    import("dom-to-pdf").then((domToPdf) => {
      console.log(domToPdf);
      domToPdf.default(this.refs.receipt, options, function () {
        console.log("done");
      });
    });
  };

  render() {
    return (
      <div className="container">
        <div
          className="content-loader-overlay"
          style={{
            display: this.state.loadDisplay,
            margin: "70px",
          }}
        >
          <Loader />
        </div>
        <div
          className="export-modal"
          style={{
            opacity: this.state.exportModalOpacity,
            display: this.state.exportModalDisplay,
          }}
        >
          <ExportModal
            modalOpacity={this.modalOpacity}
            downloadPDF={this.downloadPDF}
            downloadJPG={this.downloadJPG}
            downloadSVG={this.downloadSVG}
          />
        </div>
        <div
          className="content"
          style={{
            display: this.state.dataDisplay,
          }}
        >
          <div
            className="receipt-data"
            ref="receipt"
            style={{ padding: "10px" }}
          >
            <div className="store-data">
              <b className="store-name">
                {this.props.storeStoreName
                  ? this.props.storeStoreName
                  : `StoreName`}
              </b>
              <br />
              <span>
                {this.props.storeBusinessName
                  ? this.props.storeBusinessName
                  : `BusinessName`}
              </span>
              <br />
              <span>
                {this.props.storeAddress
                  ? `${this.props.storeAddress} ${this.props.storePostCode}`
                  : `Address`}
                <br />
                <b>NID : </b>
                {this.props.storeNID}
              </span>
            </div>

            <div className="owner">
              <b>Owner : </b>
              {this.props.customerFirstname}
              <br />
              <b>PhoneNumber : </b>
              {this.props.customerPhoneNumber}
              <br />
              <b>Email : </b>
              {this.props.customerEmail}
            </div>
            <br />

            <div className="receipt-data">
              <b>Receipt ID : </b>
              {this.state.receipt.receiptId
                ? this.state.receipt.receiptId
                : "-"}
              <br />
              <b>Created : </b>
              {this.state.receiptDate ? this.state.receiptDate : "-"}
              <br />
              <br />
              <table style={{ textAlign: "center" }}>
                <thead>
                  <tr>
                    <th style={{ width: "35%" }}>Product </th>
                    <th>price</th>
                    <th>unit</th>

                    <th>Warranty (days)</th>
                    <th>remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{new Intl.NumberFormat().format(item.price)}</td>
                      <td>{new Intl.NumberFormat().format(item.amount)}</td>
                      <td>{item.warranty ? item.warrantyTime : "-"}</td>
                      <td>{item.warranty ? item.remainingDay : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <b>Total : </b>
              {new Intl.NumberFormat().format(this.state.total)}
            </div>
          </div>
          <div className="btn">
            <Link href="/receipts">
              <button id="btn-back">Back</button>
            </Link>
            <button id="btn-export" onClick={this.modalOpacity}>
              Export
            </button>
          </div>
        </div>
        <style jsx>
          {`
            .container {
              border-radius: 7px;
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                0 6px 20px 0 rgba(0, 0, 0, 0.19);
              text-align: center;
              padding: 20px;
            }
            .export-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              transition: all 1s;
            }
            .store-data {
              margin: 7px;
            }
            .store-name {
              font-size: 27px;
            }
            button {
              font-size: 13px;
              width: 80px;
              height: 30px;
              border-radius: 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              margin: 1em 5px;
              background: #1564bf;
              color: white;
              // padding: 10px;
            }
            button:hover {
              background: #1979e6;
              color: white;
              cursor: pointer;
            }
            #btn-back {
              background: #fff;
              color: #000;
            }
            #btn-back:hover {
              background: #1979e6;
              color: white;
              cursor: pointer;
            }
            table {
              margin: auto;
              width: 100%;
              //   font-size: 15px;
            }
            th,
            td,
            tr {
              justify-items: center;
              border-bottom: 1px solid #ddd;
              padding: 3px 0px;
            }
            tr:hover {
              background-color: #f5f5f5;
            }

            @media (max-width: 600px) {
              .container {
                padding: 20px;
              }
            }
          `}
        </style>
      </div>
    );
  }
}

export default ReceiptFull;
