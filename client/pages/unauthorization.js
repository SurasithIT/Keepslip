import React, { Component } from "react";
import Layout from "../components/pages/layout";
import Router from "next/router";
import Head from "next/head";

export default class unauthorization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 5,
    };
  }
  redirect;
  count;
  componentDidMount = async () => {
    this.redirect = setTimeout(() => {
      Router.push("/");
    }, 5000);
    this.count = setInterval(() => {
      this.setState({ time: this.state.time - 1 });
    }, 1000);
  };

  componentWillUnmount = () => {
    // console.log("componentWillUnmount");
    clearTimeout(this.redirect);
    clearInterval(this.count);
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>KeepSlip : unauthorization</title>
        </Head>
        <div className="container">
          <div className="content">
            <b>unauthorization!</b>
            <br />
            Please login!
            <br />
            <span style={{ fontSize: "15px" }}>
              this page will redirect to home page in {this.state.time} seconds
            </span>
          </div>
        </div>
        <style jsx>
          {`
            .container {
              // background: #ddd;
              // margin: 20px auto;
              text-align: center;
              font-size: 25px;
            }
            .content {
              width: fit-content;
              // border: 1px solid #555;
              border-radius: 5px;
              margin: 20px auto;
              padding: 10px;
            }
          `}
        </style>
      </Layout>
    );
  }
}
