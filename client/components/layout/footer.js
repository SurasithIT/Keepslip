import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div className="container">
        <div className="project">
          <div className="projectname">
            <img
              src="/src/KeelSlip_Icon.png"
              style={{ height: "40px", margin: "5px" }}
            />{" "}
            <span style={{ fontSize: "30px", lineHeight: "10px" }}>
              {" "}
              KeepSlip{" "}
            </span>
          </div>
          <span>
            KeepSlip is a platform to record receipts into Ethereum Blockchain
            to reduce paper using and make your information to have security.
          </span>
        </div>
        <div className="contact">
          <b className="contact-head" style={{ fontSize: "18px" }}>
            Contact :
          </b>
          <br />
          <span className="contact-detail">
            Surasith Kaewvikkit <br />
            Faculty of Information Technology <br />
            King Mongkut's Institude of Technology Ladkrabang <br />
            Email: 59070181@it.kmitl.ac.th <br />
            Tel. : 083-368-2521
          </span>
        </div>
        <style jsx>
          {`
            .container {
              width: 100%;
              background: #222;
              color: #eee;
              padding: 15px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              font-size: 15px;
            }
            .projectname {
              display: flex;
              // justify-content: center;
              align-items: center;
              // height: 200px;
            }
            .project span .contact-detail {
              text-align: left;
            }
            .contact {
              text-align: left;
            }
            @media (max-width: 500px) {
              .container {
                grid-template-columns: 1fr;
                padding: 10px;
                font-size: 13px;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
