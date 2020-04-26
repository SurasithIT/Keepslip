import React, { Component } from "react";
import Link from "next/link";
import CustomerForm from "../intro/cutomerForm";
import StoreForm from "../intro/storeForm";
import Trash from "../intro/trash";
import SaveNature from "../intro/saveNature";
import Blockchain from "../intro/blockchain";

export default class Intro extends Component {
  render() {
    return (
      <div>
        <div className="container"></div>

        <CustomerForm />
        <StoreForm />
        <Trash />
        <SaveNature />
        <Blockchain />
        <style jsx global>
          {`
            button {
              font-size: 15px;
              width: 80px;
              height: 30px;
              border-radius: 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              margin: 0.4em;
            }
            button:hover {
              background: #003b8e;
              color: white;
              cursor: pointer;
            }
            .register-btn {
              background: #1564bf;
              color: white;
            }
            .register-btn:hover {
              background: #1979e6;
            }
          `}
        </style>
      </div>
    );
  }
}
