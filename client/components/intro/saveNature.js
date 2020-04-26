import React, { Component } from "react";
import Link from "next/link";

export default class SaveNature extends Component {
  render() {
    return (
      <div className="container">
        <div className="nature">
          <div className="nature-form">
            <b>SAVE THE</b>
            <br />
            <b>NATURE | WORLD</b>
            <p>
              Amet mollit quis do ullamco aliqua sit dolor irure ea quis officia
              enim elit. Eiusmod sunt aute elit proident minim in occaecat culpa
              Lorem nisi velit commodo ut. Nisi velit cupidatat cillum et magna
              reprehenderit qui excepteur ipsum exercitation occaecat. Minim
              quis reprehenderit fugiat adipisicing eu proident esse aute
              pariatur Lorem cillum culpa dolor magna. Consequat ex anim dolor
              minim. Aliqua fugiat sint eiusmod dolor id adipisicing
              reprehenderit eu. Esse deserunt velit proident aute officia ex non
              est in commodo. Enim est est mollit irure enim commodo ad.
            </p>
          </div>
          <div className="nature-pic"></div>
        </div>
        <style jsx>{`
          .nature {
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
          .nature-pic {
            width: 50%;
            min-height: 100%;
            background-image: url("/src/scenic-view-of-mountain-1666021.jpg");
            background-position: center;
            background-size: cover;
            bacground-repeat: no-repeat;
            bacground-attachment: fixed;
            position: relative;
          }
          .nature-form {
            width: 50%;
            padding: 30px;
            // height: 400px;
            // background: #ddd;
            // color: white;
          }
          @media (max-width: 690px) {
            .nature-form {
              width: 90%;
              border-radius: 10px;
              padding: 15px;
              position: absolute;
              background: rgba(0, 0, 0, 0.75);
              color: #fff;
            }
            .nature-pic {
              width: 100%;
              z-index: -1;
            }
          }
        `}</style>
      </div>
    );
  }
}
