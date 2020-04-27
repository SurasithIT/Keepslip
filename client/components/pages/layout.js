import React, { Component } from "react";
import Head from "next/head";
import Navbar from "../layout/navbar";
import Footer from "../layout/footer";

export default class Layout extends Component {
  render() {
    return (
      <div className="layout">
        <Head>
          <script
            src="https://kit.fontawesome.com/c3b199d931.js"
            crossOrigin="anonymous"
          ></script>
          <link
            href="https://fonts.googleapis.com/css?family=Athiti|Noto+Sans&display=swap"
            rel="stylesheet"
          />
          <title>KeepSlip</title>
          <link rel="icon" href="/src/KeelSlip_Icon.png"></link>
        </Head>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">{this.props.children}</div>
        <div className="footer">
          <Footer />
        </div>
        <style jsx>{`
          .layout {
            min-height: 100%;
            display: grid;
            grid-template-rows: min-content auto min-content;
          }
        `}</style>
        <style jsx global>{`
          html,
          body {
            height: 100%;
            padding: 0;
            margin: 0;
            font-family: "Noto Sans", sans-serif;
            font-family: "Athiti", sans-serif;
            // font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            //   Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            //   sans-serif;
            // background: #777;
          }
          * {
            box-sizing: border-box;
          }
          #__next {
            height: 100%;
          }
          button {
            font-family: "Noto Sans", sans-serif;
          }
        `}</style>
      </div>
    );
  }
}
