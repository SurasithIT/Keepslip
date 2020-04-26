import React, { Component } from "react";
import Link from "next/link";

export default class CustomerForm extends Component {
  render() {
    return (
      <div className="container">
        <div className="customer">
          <div className="customer-pic"></div>
          <div className="customer-form">
            <h1>Customer</h1>
            <p>Keep your receipt into blockchain</p>
            <Link href="/customer-register">
              <button className="register-btn">Register</button>
            </Link>
            <Link href="/customer-login">
              <button className="login-btn">Log in</button>
            </Link>
          </div>
        </div>
        <style jsx>{`
          .customer {
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
          .customer-pic {
            width: 50%;
            min-height: 100%;
            background-image: url("/src/phone.jpg");
            transform: scaleX(-1);
            background-position: center bottom;
            background-size: cover;
            bacground-repeat: no-repeat;
            bacground-attachment: fixed;
            position: relative;
          }
          .customer-form {
            width: 50%;
          }

          @media (max-width: 690px) {
            .customer-form {
              width: fit-content;
              border-radius: 10px;
              padding: 15px;
              position: absolute;
              background: rgba(0, 0, 0, 0.8);
              color: #fff;
            }
            .customer-pic {
              width: 100%;
              z-index: -1;
            }
          }
        `}</style>
      </div>
    );
  }
}
