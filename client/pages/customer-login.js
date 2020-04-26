import Layout from "../components/pages/layout";
import Link from "next/link";
import React, { Component } from "react";
import cookie from "js-cookie";
import Router from "next/router";
import nextCookie from "next-cookies";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
export default class CustomerLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      remember: false,
      loginError: "",
    };
  }

  static async getInitialProps(ctx) {
    const { KSa } = nextCookie(ctx);
    console.log(KSa);
    let user;
    if (KSa) {
      let userVerify = await fetch(`http://api.keepslip.com/auth/verify`, {
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
    if (e.target.name == "remember") {
      this.setState({ remember: !this.state.remember });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
    // console.log(e.target.name);
    // console.log(e.target.value);
  };

  login = async (e) => {
    e.preventDefault();
    let uri = `http://api.keepslip.com/auth/customer-login`;
    let option = {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        remember: this.state.remember,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    let sendData = await fetch(uri, option);
    let result = await sendData.json();
    console.log(result);
    if (!result.error) {
      cookie.set("KSa", result.token);
      this.setState({
        loginError: "",
      });
      Router.push("/receipts");
    } else {
      this.setState({
        loginError: result.message,
      });
    }
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>KeepSlip : Customer Login</title>
        </Head>
        <div className="container">
          <h1>Log in as a Customer</h1>
          <div
            className="errorbox receiptid"
            style={{
              display: `${this.state.loginError !== "" ? "block" : "none"}`,
            }}
          >
            Error : {this.state.loginError}
          </div>
          <form method="post" className="RegisterForm" onSubmit={this.login}>
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
            <br />
            <br />
            <div className="remember-check">
              <input
                type="checkbox"
                checked={this.state.remember}
                onChange={this.handleChange}
                name="remember"
                id="remember"
              ></input>
              <label htmlFor="remember">remember me</label>
            </div>

            <br />
            <button type="submit">Login</button>
          </form>
          <p>
            If you don't have an account{" "}
            <Link href="/customer-register">
              <a>Register here</a>
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
              .errorbox {
                border: 2px solid #ff5757;
                border-radius: 5px;
                background: #ff9f9f;
                width: fit-content;
                margin: 10px auto;
                padding: 7px;
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
              input {
                width: 95%;
                margin-left: 0px;
                height: 30px;
                border-radius: 5px;
                border: 1px solid #ddd;
                padding: 6px;
                font-size: 15px;
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
              .remember-check {
                margin: 0;
                text-align: left;
              }
              #remember {
                width: fit-content;
                height: fit-content;
                font-size: 12px;
                margin: 5px;
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
