import React, { Component } from "react";
import Link from "next/link";

export default class Trash extends Component {
  render() {
    return (
      <div className="container">
        <div className="trash">
          <div className="trash-pic"></div>
          <div className="trash-form">
            <b>REDUCE PAPER</b>
            <br />
            <b>USING | TRASH</b>
            <p>
              Ad ipsum culpa magna consequat cupidatat cillum adipisicing minim
              consequat quis. Aliquip veniam non voluptate pariatur ut nulla
              elit id non in do enim occaecat laboris. Elit adipisicing mollit
              eiusmod pariatur irure commodo officia. In consectetur duis minim
              magna ad in amet sunt ex officia aliquip cupidatat. Ad proident
              proident irure ut occaecat nostrud pariatur. Officia consectetur
              dolore occaecat do est sit exercitation sit. Minim proident
              aliquip ipsum sunt id amet excepteur aute. Officia pariatur
              commodo do aliqua eu tempor proident aliqua ut cupidatat deserunt
              ipsum sunt.
            </p>
          </div>
        </div>
        <style jsx>{`
          .trash {
            display: flex;
            // grid-template-columns: repeat(2, 1fr);
            // justify-items: stretch;
            flex-direction: row;
            text-align: center;
            justify-content: center;
            align-items: center;
            height: 600px;
            position: relative;
          }
          .trash-pic {
            width: 50%;
            min-height: 100%;
            background-image: url("/src/black-trash-bin-with-full-of-trash-3806764.jpg");
            background-position: 50% 70%;
            background-size: cover;
            bacground-repeat: no-repeat;
            bacground-attachment: fixed;
            position: relative;
          }
          .trash-form {
            padding: 30px;
            // display: grid;
            // grid-template-columns: repeat(2, 1fr);
            width: 50%;
            // font-size: 40px;
            // height: 400px;
            // background: #ddd;
            // color: white;
          }
          @media (max-width: 690px) {
            .trash-form {
              width: 90%;
              border-radius: 10px;
              padding: 15px;
              position: absolute;
              background: rgba(0, 0, 0, 0.75);
              color: #fff;
            }
            .trash-pic {
              width: 100%;
              z-index: -1;
            }
          }
        `}</style>
      </div>
    );
  }
}
