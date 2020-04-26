import React, { Component } from "react";
import Link from "next/link";

class ReceiptMiniStore extends Component {
  render() {
    return (
      <div className="container">
        <div className="content">
          <div className="receipt-data">
            <b className="receipt-id">
              {this.props.receipt_id ? this.props.receipt_id : `Receipt id`}
            </b>
          </div>
          <div className="owner">
            <b>Owner : </b>
            {this.props.customerFirstname}
          </div>
          <div className="receipt-data">
            {/* <b>Receipt ID : </b>
            {this.props.receipt_id}
            <br /> */}
            <b>Created : </b>
            {this.props.receipt_date.slice(0, 19).replace("T", " ")}
            <br />
            <table style={{ margin: "auto", border: "5px" }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.props.items.map((val, index) => (
                  <tr key={index}>
                    <td>{val.productName}</td>
                    <td>{new Intl.NumberFormat().format(val.price)}</td>
                    <td>{val.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <b>Total </b>
            {new Intl.NumberFormat().format(this.props.total)}
          </div>
          <Link
            href={{
              pathname: "/receipt",
              query: { receipt_id: this.props.receipt_id },
            }}
          >
            <button>Read More</button>
          </Link>
        </div>
        <style jsx>
          {`
            .container {
              border-radius: 7px;
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                0 6px 20px 0 rgba(0, 0, 0, 0.19);
              text-align: center;
              padding: 10px;
            }
            .receipt-data {
              margin: 7px;
            }
            .receipt-id {
              font-size: 23px;
            }
            button {
              width: 80px;
              height: 30px;
              border-radius: 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              margin: 1em;
              background: #1564bf;
              color: white;
              // padding: 10px;
            }

            button:hover {
              background: #1979e6;
              color: white;
              cursor: pointer;
            }

            th,
            td,
            tr {
              border-bottom: 1px solid #ddd;
              padding: 5px 0px;
            }
            tr:hover {
              background-color: #f5f5f5;
            }
          `}
        </style>
      </div>
    );
  }
}

export default ReceiptMiniStore;
