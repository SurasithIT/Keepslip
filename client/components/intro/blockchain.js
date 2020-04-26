import React, { Component } from "react";
import Link from "next/link";

export default class Blockchain extends Component {
  render() {
    return (
      <div className="container">
        <div className="blockchain">
          <div className="blockchain-pic"></div>
          <div className="blockchain-form">
            <b>Security with Blockchain</b>
            <p>
              Cillum proident tempor enim duis dolor elit ullamco dolor aute.
              Amet nostrud incididunt voluptate irure nostrud. Sint commodo duis
              cillum consectetur pariatur. Elit reprehenderit ullamco eiusmod
              pariatur ea id consectetur Lorem sint fugiat enim. Ut duis officia
              est commodo Lorem. Commodo est officia est pariatur ea duis duis
              in ipsum. Est irure quis nulla veniam velit in consectetur labore
              sunt et pariatur Lorem aliquip quis. Anim eiusmod enim nulla aute
              esse ipsum amet est ex. Deserunt dolore veniam dolore in et amet.
            </p>
          </div>
        </div>
        <style jsx>{`
          .blockchain {
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
          .blockchain-pic {
            width: 50%;
            min-height: 100%;
            background-image: url("/src/slider-vinturas1-block-chain_3420x1330_2a0.jpg");
            background-position: 60% 50%;
            background-size: cover;
            bacground-repeat: no-repeat;
            bacground-attachment: fixed;
            position: relative;
          }
          .blockchain-form {
            width: 50%;
            padding: 30px;
            // height: 400px;
            // background: #ddd;
            // color: white;
          }
          @media (max-width: 690px) {
            .blockchain-form {
              width: 90%;
              border-radius: 10px;
              padding: 15px;
              position: absolute;
              background: rgba(0, 0, 0, 0.75);
              color: #fff;
            }
            .blockchain-pic {
              width: 100%;
              z-index: -1;
            }
          }
        `}</style>
      </div>
    );
  }
}
