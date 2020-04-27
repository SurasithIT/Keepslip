import Layout from "../components/pages/layout";
import Link from "next/link";
import Router from "next/router";
import React, { Component } from "react";
import RegisterSuccess from "../components/pages/registerSuccess";
import nextCookie from "next-cookies";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
export default class StoreRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      rePassword: "",
      nid: "",
      branchId: 0,
      branchName: "",
      businessName: "",
      address: "",
      postCode: "",
      registerBtn: true,
      registerError: "",
      success: false,
    };
  }

  static async getInitialProps(ctx) {
    const { KSa } = nextCookie(ctx);
    console.log(KSa);
    let user;
    if (KSa) {
      let userVerify = await fetch(`http://${process.env.AUTH_SERVER}/verify`, {
        headers: { Authorization: `${KSa}` },
      });
      user = await userVerify.json();
      console.log(user);
      // return user;
      if (!user.error && user.user_id !== "") {
        if (ctx.req) {
          ctx.res.writeHead(302, { Location: "/receipts" });
          ctx.res.end();
        } else {
          Router.push("/receipts");
        }
      }
    }
    return { user: user };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if (this.state.businessName === "") {
      this.setState({
        registerBtn: true,
      });
    } else {
      this.setState({
        registerBtn: false,
      });
    }
  };

  getStoreData = async (e) => {
    e.preventDefault();
    let uri = `http://${process.env.TRD_SERVER}/storeFromTRD`;
    let option = {
      method: "POST",
      body: JSON.stringify({
        username: "anonymous",
        password: "anonymous",
        TIN: this.state.nid,
        Name: "",
        ProvinceCode: "0",
        BranchNumber: this.state.branchId.toString(),
        AmphurCode: "0",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    let sendData = await fetch(uri, option);
    let result = await sendData.json();
    console.log(result);
    if (result.NID) {
      this.setState({
        branchName: result.BranchName,
        businessName: result.BusinessName,
        address: result.Address,
        postCode: result.PostCode,
      });
    } else {
      this.setState({
        branchName: "",
        businessName: "",
        address: "",
        postCode: "",
      });
    }
    if (this.state.businessName === "") {
      this.setState({
        registerBtn: true,
      });
    } else {
      this.setState({
        registerBtn: false,
      });
    }
  };

  register = async (e) => {
    e.preventDefault();
    if (this.state.password === this.state.rePassword) {
      let uri = `http://${process.env.STORE_SERVER}/store/`;
      let option = {
        method: "POST",
        body: JSON.stringify({
          NID: this.state.nid,
          StoreName: this.state.username,
          BusinessName: this.state.businessName,
          Branch_id: this.state.branchId,
          BranchName: this.state.branchName,
          Address: this.state.address,
          PostCode: this.state.postCode,
          Username: this.state.username,
          Password: this.state.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      let sendData = await fetch(uri, option);
      let result = await sendData.json();
      console.log(result);
      if (result.insertId) {
        console.log("Success");
        this.setState({
          registerError: "",
          success: true,
        });
        setTimeout(() => {
          Router.push("/store-login");
        }, 2000);
      } else {
        console.log("Username has been registered!");
        console.log("errno :", result.errno);
        console.log("sqlMessage :", result.sqlMessage);
        this.setState({
          registerError: "Username has been registered!",
        });
      }
    } else {
      console.log("Password not match!");
      this.setState({
        registerError: "Password not match!",
      });
    }
  };
  render() {
    return (
      <Layout>
        <Head>
          <title>KeepSlip : Store Register</title>
        </Head>
        <div
          className="success"
          style={{ display: this.state.success ? "block" : "none" }}
        >
          <RegisterSuccess />
        </div>
        <div
          className="container"
          style={{ display: this.state.success ? "none" : "block" }}
        >
          <h1>Register as a Store</h1>
          <div
            className="errorbox receiptid"
            style={{
              display: `${this.state.registerError !== "" ? "block" : "none"}`,
            }}
          >
            Error : {this.state.registerError}
          </div>
          <form method="post" className="RegisterForm" onSubmit={this.register}>
            <p>Username</p>
            <input
              type="text"
              placeholder="username"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              required
            ></input>
            <p>Password</p>
            <input
              type="password"
              placeholder="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            ></input>
            <p>Re enter Password</p>
            <input
              type="password"
              placeholder="password"
              name="rePassword"
              value={this.state.rePassword}
              onChange={this.handleChange}
              required
            ></input>
            <p>NID</p>
            <input
              type="text"
              placeholder="NID"
              name="nid"
              value={this.state.nid}
              onChange={this.handleChange}
              required
            ></input>
            <p>Branch ID</p>
            <input
              type="number"
              placeholder="Branch ID"
              name="branchId"
              value={this.state.branchId}
              onChange={this.handleChange}
              required
            ></input>
            <br />
            <button
              style={{ width: "fit-content", fontSize: "13px" }}
              onClick={this.getStoreData}
            >
              Get Store Data
            </button>
            <div className="store-data">
              <p>BusinessName</p>
              <input
                type="text"
                placeholder="Business Name"
                name="businessName"
                value={this.state.businessName}
                onChange={this.handleChange}
                disabled
                required
              ></input>
              <p>BranchName</p>
              <input
                type="text"
                placeholder="Branch name"
                name="branchName"
                value={this.state.branchName}
                onChange={this.handleChange}
                disabled
                required
              ></input>
              <p>Address</p>
              <textarea
                cols="40"
                rows="5"
                placeholder="Address"
                name="address"
                value={this.state.address}
                onChange={this.handleChange}
                disabled
                required
              ></textarea>
              <p>PostCode</p>
              <input
                type="text"
                placeholder="PostCode"
                name="branchName"
                value={this.state.postCode}
                onChange={this.handleChange}
                disabled
                required
              ></input>
            </div>
            <br />
            <button type="submit" disabled={this.state.registerBtn}>
              Register
            </button>
          </form>
          <p>
            If you already have an account{" "}
            <Link href="/store-login">
              <a>Login here</a>
            </Link>
            .
          </p>
          <style jsx>
            {`
              .container {
                display: grid;
                grid-template-columns: 1fr;
                justify-items: stretch;
                text-align: center;
                margin: auto;
                margin-bottom: 20px;
              }
              .register-success {
                font-size: 50px;
                text-align: center;
                background: #eee;
              }
              form {
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                  0 6px 20px 0 rgba(0, 0, 0, 0.19);
                text-align: center;
                width: 40%;
                margin: auto;
              }
              form p {
                text-align: left;
              }
              p {
                text-align: center;
              }
              .errorbox {
                border: 2px solid #ff5757;
                border-radius: 5px;
                background: #ff9f9f;
                width: fit-content;
                // height: 40px;
                margin: 10px auto;
                padding: 7px;
              }
              input {
                width: 95%;
                margin-left: 0px;
                height: 30px;
                border-radius: 5px;
                border: 1px solid #ddd;
                padding: 6px;
                font-size: 15px;
              }
              textarea {
                width: 95%;
                margin-left: 0px;
                border-radius: 5px;
                border: 1px solid #ddd;
                padding: 6px;
                font-size: 15px;
                resize: none;
                heigth: 200px;
              }
              button {
                font-size: 15px;
                width: 80px;
                height: 35px;
                border-radius: 20px;
                border: 1px solid #ddd;
                cursor: pointer;
                margin: 1em;
                background: #1564bf;
                color: white;
              }
              button:hover {
                background: #1979e6;
                color: white;
                cursor: pointer;
              }
              button:disabled {
                background: #5e91f2;
              }
              button:hover {
                background: #1979e6;
              }

              @media (max-width: 750px) {
                .container {
                  width: 70%;
                  // display: flex;
                  // flex-direction: column;
                  grid-template-columns: 1fr;
                }
                form {
                  width: 85%;
                  padding: 20px;
                }
              }
              @media (max-width: 600px) {
                .container {
                  width: 90%;
                  // display: flex;
                  // flex-direction: column;
                  grid-template-columns: 1fr;
                }
                form {
                  width: 85%;
                  padding: 20px;
                }
              }
            `}
          </style>
        </div>
      </Layout>
    );
  }
}
