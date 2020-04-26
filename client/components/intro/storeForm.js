import React, { Component } from "react";
import Link from "next/link";

export default class StoreForm extends Component {
  render() {
    return (
      <div className="container">
        <div className="store">
          <div className="store-form">
            <h1>Store</h1>
            <p>Record receipt into blockchain</p>
            <Link href="/store-register">
              <button className="register-btn">Register</button>
            </Link>
            <Link href="/store-login">
              <button className="login-btn">Log in</button>
            </Link>
          </div>
          <div className="store-pic"></div>
        </div>
        <style jsx>{`
          .store {
            display: flex;
            // grid-template-columns: repeat(2, 1fr);
            // justify-items: stretch;
            flex-direction: row;
            text-align: center;
            justify-content: center;
            align-items: center;
            height: 400px;
            position: relative;
          }
          .store-pic {
            width: 50%;
            min-height: 100%;
            background-image: url("/src/Cashier.jpg");
            background-position: center bottom;
            background-size: cover;
            bacground-repeat: no-repeat;
            bacground-attachment: fixed;
            position: relative;
          }
          .store-form {
            width: 50%;
            // height: 400px;
            // background: #ddd;
            // color: white;
          }
          @media (max-width: 690px) {
            .store-form {
              width: fit-content;
              border-radius: 10px;
              padding: 15px;
              position: absolute;
              background: rgba(0, 0, 0, 0.8);
              color: #fff;
            }
            .store-pic {
              width: 100%;
              z-index: -1;
            }
          }
        `}</style>
      </div>
    );
  }
}
