import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Router from "next/router";

export default class AddReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptId: "",
      phoneNumber: "",
      customer: {
        id: "",
        Firstname: "",
        Lastname: "",
        PhoneNumber: "",
        Email: "",
        Username: "",
      },
      receipt: {
        id: "",
        ReceiptDate: "",
        Store_id: "",
        items: [],
        totalPrice: 0,
      },
      receiptInputErr: { error: false },
      customerInputErr: { error: false },
      addReceiptBtnDisabled: true,
      loading: false,
      resultRecordingDB: { error: false, message: "" },
      resultRecordingSM: { error: false, message: "" },
      resultBox: "none",
    };
  }

  handleChange = async (e) => {
    await this.setState({ [e.target.name]: e.target.value });
    await this.checkAddReceiptBtn();
  };

  expireDate = (receiptDate, warrantyTime) => {
    let one_day = 1000 * 60 * 60 * 24;
    let timeNow = new Date();
    timeNow = timeNow.getTime();
    if (warrantyTime == 0) {
      return 0;
    }
    let createTime = "";
    createTime = new Date(receiptDate);
    createTime = createTime.getTime();
    let remainingDay = Math.round(
      (createTime + one_day * warrantyTime - timeNow) / one_day
    );
    return remainingDay;
  };

  getReceipt = async (e) => {
    e.preventDefault();
    let receiptIdValid = receiptIdField.checkValidity();
    if (receiptIdValid) {
      let receiptFetch = await fetch(
        `http://${process.env.API_PATH}/receiptFromStore/fullReceipt/${this.props.id}/${this.state.receiptId}`
      );
      let receiptResult = await receiptFetch.json();

      if (!receiptResult.error) {
        this.setState({
          receiptInputErr: { error: false },
          receipt: {
            id: receiptResult.id,
            ReceiptDate: receiptResult.ReceiptDate.slice(0, 19).replace(
              "T",
              " "
            ),
            Store_id: receiptResult.Store_id,
            items: receiptResult.items,
          },
        });

        if (this.state.receipt.items) {
          for (let i = 0; i < this.state.receipt.items.length; i++) {
            let remainingDay = this.expireDate(
              this.state.receipt.ReceiptDate,
              this.state.receipt.items[i].WarrantyTime
            );
            if (remainingDay <= 0) {
              remainingDay = "Expired";
            } else {
              remainingDay = remainingDay;
            }
            let newState = Object.assign({}, this.state);
            newState.receipt.items[i].remainingDay = remainingDay;
            this.setState(newState);
          }
          // console.log(this.state.receipt.items);
        }

        this.getTotalPrice();
        this.checkAddReceiptBtn();
      } else {
        console.log(receiptResult);
        this.setState({
          receipt: {
            id: "",
            ReceiptDate: "",
            Store_id: "",
            items: [],
            totalPrice: 0,
          },
          receiptInputErr: receiptResult,
          addReceiptBtnDisabled: true,
        });
      }
    } else {
      // console.log("Receipt ID is invalid!");
      this.setState({
        receipt: {
          id: "",
          ReceiptDate: "",
          Store_id: "",
          items: [],
          totalPrice: 0,
        },
        receiptInputErr: {
          error: true,
          status: 400,
          message: "Please fill Receipt ID",
        },
        addReceiptBtnDisabled: true,
      });
    }
  };

  getTotalPrice = () => {
    let itemLength = this.state.receipt.items.length;
    let total = 0;
    for (let i = 0; i < itemLength; i++) {
      total +=
        this.state.receipt.items[i].Price *
        this.state.receipt.items[i].Quantity;
    }
    this.setState({
      receipt: {
        ...this.state.receipt,
        totalPrice: total,
      },
    });
  };

  getCustomer = async (e) => {
    e.preventDefault();
    let phoneNumberValid = phoneNumberField.checkValidity();
    if (phoneNumberValid) {
      let customerFetch = await fetch(
        `http://${process.env.API_PATH}/customer/customerByPhone/${this.state.phoneNumber}`
      );
      let customerResult = await customerFetch.json();
      if (!customerResult.error) {
        this.setState({
          customerInputErr: { error: false },
          customer: {
            id: customerResult[0].id,
            Firstname: customerResult[0].Firstname,
            Lastname: customerResult[0].Lastname,
            PhoneNumber: customerResult[0].PhoneNumber,
            Email: customerResult[0].Email,
            Username: customerResult[0].Username,
          },
        });
        this.checkAddReceiptBtn();
      } else {
        this.setState({
          customer: {
            id: "",
            Firstname: "",
            Lastname: "",
            PhoneNumber: "",
            Email: "",
            Username: "",
          },
          customerInputErr: customerResult,
          addReceiptBtnDisabled: true,
        });
      }
    } else {
      this.setState({
        customer: {
          id: "",
          Firstname: "",
          Lastname: "",
          PhoneNumber: "",
          Email: "",
          Username: "",
        },
        customerInputErr: {
          error: true,
          status: 400,
          message: "Customer phone number is invalid!",
        },
        addReceiptBtnDisabled: true,
      });
    }
  };

  checkAddReceiptBtn = () => {
    if (
      this.state.phoneNumber == this.state.customer.PhoneNumber &&
      this.state.customer.PhoneNumber !== "" &&
      this.state.receiptId == this.state.receipt.id &&
      this.state.receiptId !== "" &&
      !this.state.receiptInputErr.error &&
      !this.state.customerInputErr.error
    ) {
      this.setState({
        addReceiptBtnDisabled: false,
      });
    } else {
      this.setState({
        addReceiptBtnDisabled: true,
      });
    }
  };

  addInvoice = async (e) => {
    e.preventDefault();
    await this.setState({
      loading: true,
      addReceiptBtnDisabled: true,
    });
    await this.addInvoiceToDB();
    await this.addInvoiceToSM();
    await this.setState({
      loading: false,
      addReceiptBtnDisabled: false,
      resultBox: "block",
    });
    await setTimeout(() => {
      this.setState({
        resultBox: "none",
      });
    }, 10000);

    if (
      !this.state.resultRecordingDB.error &&
      !this.state.resultRecordingDB.error
    ) {
      setTimeout(() => {
        Router.push({
          pathname: "/receipt",
          query: { receipt_id: `S${this.props.id}I${this.state.receipt.id}` },
        });
      }, 10000);
    }
  };

  addInvoiceToDB = async () => {
    let DBurl = `http://${process.env.API_PATH}/receipt/receipt`;
    let option = {
      method: "POST",
      body: JSON.stringify({
        Customer_id: this.state.customer.id,
        Store_id: this.props.id,
        Receipt_id: this.state.receipt.id,
        Receipt_date: this.state.receipt.ReceiptDate.slice(0, 19).replace(
          "T",
          " "
        ),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    let sendData = await fetch(DBurl, option);
    let result = await sendData.json();
    // console.log(result);
    if (!result.errno) {
      this.setState({
        resultRecordingDB: {
          error: false,
          message: `Recording receipt into the Database successfully!`,
        },
      });
    } else {
      this.setState({
        resultRecordingDB: {
          error: true,
          message: `Database Error :  ${result.sqlMessage}`,
        },
      });
    }
  };

  addInvoiceToSM = async () => {
    let items = [];
    for (let i = 0; i < this.state.receipt.items.length; i++) {
      let item = {
        productName: this.state.receipt.items[i].ProductName,
        price: this.state.receipt.items[i].Price,
        amount: this.state.receipt.items[i].Quantity,
        warranty: this.state.receipt.items[i].Warranty,
        warrantyTime: this.state.receipt.items[i].WarrantyTime,
      };
      items.push(item);
    }

    let data = {
      receiptId: `S${this.props.id}I${this.state.receipt.id}`,
      receiptDate: this.state.receipt.ReceiptDate.slice(0, 19).replace(
        "T",
        " "
      ),
      items: items,
    };
    // console.log(data);
    let SMurl = `http://${process.env.API_PATH}/smartcontract/receipt/`;
    let option = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    let sendData = await fetch(SMurl, option);
    let result = await sendData.json();
    // console.log(result);
    if (!result.error) {
      this.setState({
        resultRecordingSM: {
          error: false,
          message: `Recording receipt into the Smart Contract successfully!`,
        },
      });
    } else {
      this.setState({
        resultRecordingSM: {
          error: true,
          message: `Smart Contract Error : ${result.message}`,
        },
      });
    }
  };
  render() {
    let {
      NID,
      branch_id,
      businessName,
      storeName,
      address,
      postCode,
      username,
    } = this.props;

    return (
      <div className="container">
        <div
          className="record-result database"
          style={{
            background: !this.state.resultRecordingDB.error
              ? "#5FC553"
              : "#ff5757",
            display: this.state.resultBox,
          }}
        >
          {this.state.resultRecordingDB.error && (
            <i className="fas fa-exclamation-circle" />
          )}
          {!this.state.resultRecordingDB.error && (
            <i className="fas fa-check-circle" />
          )}{" "}
          {this.state.resultRecordingDB.message}
        </div>

        <div
          className="record-result smartcontract"
          style={{
            background: !this.state.resultRecordingSM.error
              ? "#5FC553"
              : "#ff5757",
            display: this.state.resultBox,
          }}
        >
          {this.state.resultRecordingSM.error && (
            <i className="fas fa-exclamation-circle" />
          )}
          {!this.state.resultRecordingSM.error && (
            <i className="fas fa-check-circle" />
          )}{" "}
          {this.state.resultRecordingSM.message}
        </div>
        <div className="record-form">
          <form>
            <div className="store-data">
              <b className="store-name">
                {storeName ? storeName : `StoreName`}
              </b>
              <br />
              <span>{businessName ? businessName : `BusinessName`}</span>
              <br />
              <span>
                {address ? `${address} ${postCode}` : `Address`}
                <br />
                <b>NID : </b>
                {NID}
              </span>
            </div>
            <br />
            <div className="input-box">
              <label htmlFor="receiptId"> Add Receipt ID : </label>
              <input
                type="text"
                name="receiptId"
                id="receiptIdField"
                placeholder="Receipt ID"
                required
                value={this.state.receiptId}
                onChange={this.handleChange}
              />
              <button
                onClick={this.getReceipt}
                style={{ margin: "5px", width: "50px" }}
                disabled={!this.state.receiptId}
              >
                Get
              </button>

              <br />
              <div
                className="errorbox receiptid"
                style={{
                  display: `${
                    this.state.receiptInputErr.error ? "block" : "none"
                  }`,
                }}
              >
                {this.state.receiptInputErr.message}
              </div>
              <label htmlFor="phoneNumber">Add Phone Number of User : </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumberField"
                pattern="[0]{1}[0-9]{9}"
                placeholder="0123456789"
                required
                value={this.state.phoneNumber}
                onChange={this.handleChange}
              />
              <button
                onClick={this.getCustomer}
                style={{ margin: "5px", width: "50px" }}
                disabled={!this.state.phoneNumber}
              >
                Get
              </button>
              <div
                className="errorbox customer-phone-number"
                style={{
                  display: `${
                    this.state.customerInputErr.error ? "block" : "none"
                  }`,
                }}
              >
                {this.state.customerInputErr.message}
              </div>
            </div>
            <br />
            <div className="owner">
              <b>Owner</b>
              <br />
              <b>Customer Name : </b>
              {this.state.customer.Firstname
                ? `${this.state.customer.Firstname} ${this.state.customer.Lastname}`
                : "-"}
              <br />
              <b>Email : </b>
              {this.state.customer.Email ? this.state.customer.Email : "-"}
              <br />
              <b>Phone number : </b>
              {this.state.customer.PhoneNumber
                ? this.state.customer.PhoneNumber
                : "-"}
            </div>
            <br />
            <div className="receipt-data">
              <b>Receipt ID : </b>
              {this.state.receipt.id ? this.state.receipt.id : "-"}
              <br />
              <b>Created : </b>
              {this.state.receipt.ReceiptDate
                ? this.state.receipt.ReceiptDate
                : "-"}
              <br />

              <table>
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
                  {this.state.receipt.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.ProductName}</td>
                      <td>{new Intl.NumberFormat().format(item.Price)}</td>
                      <td>{new Intl.NumberFormat().format(item.Quantity)}</td>
                      <td>{item.Warranty ? item.WarrantyTime : "-"}</td>

                      <td>{item.Warranty ? item.remainingDay : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <b>Total : </b>
              {new Intl.NumberFormat().format(this.state.receipt.totalPrice)}
            </div>
            <button
              type="submit"
              onClick={this.addInvoice}
              id="addReceiptBtn"
              disabled={this.state.addReceiptBtnDisabled}
            >
              {this.state.loading && <i className="fa fa-refresh fa-spin" />}
              {"  Add Receipt  "}
            </button>
          </form>
        </div>
        <style jsx>
          {`
            .container {
              display: grid;
              grid-template-columns: 1fr;
              justify-items: stretch;
              text-align: center;
              margin: auto;
              margin-top: 0px;
              margin-bottom: 20px;
              width: 100%;
            }

            .store-name {
              font-size: 27px;
            }
            .record-result {
              color: white;
              padding: 10px;
              width: 100%;
              border-bottom: 1px solid #ddd;
              transition: all 1s;
            }
            .record-form {
              padding: 30px;
              border-radius: 20px;
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                0 6px 20px 0 rgba(0, 0, 0, 0.19);
              text-align: center;
              width: 60%;
              margin: 20px auto;
            }
            input {
              width: 30%;
              height: 30px;
              border-radius: 5px;
              border: 1px solid #ddd;
              padding: 6px;
              font-size: 15px;
            }
            button {
              font-size: 13px;
              width: 80px;
              height: 30px;
              border-radius: 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              margin: 1em;
            }
            button:hover {
              background: #003b8e;
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
            .errorbox {
              border: 2px solid #ff5757;
              border-radius: 5px;
              background: #ff9f9f;
              width: fit-content;
              // height: 40px;
              margin: auto;
              padding: 7px;
            }
            #addReceiptBtn {
              background: #1564bf;
              color: white;
              width: fit-content;
              // padding: 10px;
            }
            #addReceiptBtn:disabled {
              background: #5e91f2;
            }
            #addReceiptBtn:hover {
              background: #1979e6;
            }

            @media (max-width: 800px) {
              input {
                width: 30%;
              }
            }

            @media (min-width: 600px) {
              .record-form {
                width: 50%;
              }
            }
            @media (max-width: 925px) {
              .record-form {
                width: 70%;
              }
            }
            @media (max-width: 600px) {
              .record-form {
                width: 90%;
                padding: 10px;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
