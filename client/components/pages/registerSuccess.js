import React, { Component } from "react";

export default class RegisterSuccess extends Component {
  render() {
    return (
      <div className="register-success">
        <div className="text">
          <i className="fas fa-check-circle" /> Register Success
        </div>
        <style jsx>
          {`
            .register-success {
              text-align: center;
              font-size: 30px;
              padding: 20px 0;
            }
            .text {
              width: fit-content;
              border: 2px solid #5fc553;
              margin: auto;
              padding: 15px;
              border-radius: 10px;
              color: #5fc553;
            }
          `}
        </style>
      </div>
    );
  }
}
