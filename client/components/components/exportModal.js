import React, { Component } from "react";

export default class ExportModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props);
    return (
      <div className="modal">
        <div className="export-box">
          <button className="jpg-export-btn" onClick={this.props.downloadJPG}>
            Export to JPG
          </button>
          <br />
          <button className="jpg-export-btn" onClick={this.props.downloadSVG}>
            Export to SVG
          </button>
          <br />
          <button className="pdf-export-btn" onClick={this.props.downloadPDF}>
            Export to PDF
          </button>
          <br />
          <button id="btn-back" onClick={this.props.modalOpacity}>
            Back
          </button>
        </div>
        <style jsx>{`
          .modal {
            // opacity: 0;
            opacity: 1;
            transition: all 1s;
            // width: 70%;
            // background: rgba(0, 0, 0, 0.5);
            height: 100%;
          }
          .export-box {
            background: #fff;
            width: 250px;
            margin: 100px auto;
            padding: 10px;
            border-radius: 30px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
              0 6px 20px 0 rgba(0, 0, 0, 0.19);
          }
          button {
            font-size: 12px;
            width: 100px;
            height: 40px;
            border-radius: 20px;
            border: 1px solid #ddd;
            cursor: pointer;
            margin: 7px 5px;
            background: #1564bf;
            color: white;
            // padding: 10px;
          }
          button:hover {
            background: #1979e6;
            color: white;
            cursor: pointer;
          }
          #btn-back {
            width: 70px;
            height: 30px;
            margin: 10px;
            background: #fff;
            color: #000;
          }
          #btn-back:hover {
            background: #1979e6;
            color: white;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
}
