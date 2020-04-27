import Layout from "../components/pages/layout";
import Link from "next/link";
import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Router from "next/router";
import RegisterSuccess from "../components/pages/registerSuccess";
import nextCookie from "next-cookies";
import Head from "next/head";
export default class CustomerRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      rePassword: "",
      email: "",
      firstname: "",
      lastname: "",
      phoneNumber: "",
      registerError: "",
      success: false,
    };
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  static async getInitialProps(ctx) {
    const { KSa } = nextCookie(ctx);
    console.log(KSa);
    let user;
    if (KSa) {
      let userVerify = await fetch(
        `http://35.247.154.183:3007/api/auth/verify`,
        {
          headers: { authorization: `${KSa}` },
        }
      );
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

  register = async (e) => {
    e.preventDefault();
    if (this.state.password === this.state.rePassword) {
      let uri = `http://35.247.154.183:3001/api/customer/customer/`;
      let option = {
        method: "POST",
        body: JSON.stringify({
          Username: this.state.username,
          Password: this.state.password,
          Firstname: this.state.firstname,
          Lastname: this.state.lastname,
          PhoneNumber: this.state.phoneNumber,
          Email: this.state.email,
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
          Router.push("/customer-login");
        }, 2000);
      } else {
        console.log("Username or Email or Phone number has been registered!");
        console.log("errno :", result.errno);
        console.log("sqlMessage :", result.sqlMessage);
        this.setState({
          registerError:
            "Username or Email or Phone number has been registered!",
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
          <title>KeepSlip : Customer Register</title>
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
          <h1>Register as a Customer</h1>
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
            <p>Email</p>
            <input
              type="email"
              placeholder="email"
              name="email"
              value={this.state.email}
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
            <p>Firstname</p>
            <input
              type="text"
              placeholder="Firstname"
              name="firstname"
              value={this.state.firstname}
              onChange={this.handleChange}
              required
            ></input>
            <p>Lastname</p>
            <input
              type="text"
              placeholder="Lastname"
              name="lastname"
              value={this.state.lastname}
              onChange={this.handleChange}
              required
            ></input>
            <p>Phone number</p>
            <input
              type="tel"
              name="phoneNumber"
              pattern="[0]{1}[0-9]{9}"
              required
              placeholder="0123456789"
              name="phoneNumber"
              value={this.state.phoneNumber}
              onChange={this.handleChange}
            ></input>
            <br />
            <br />
            <button type="submit">Register</button>
          </form>
          <p>
            If you already have an account{" "}
            <Link href="/customer-login">
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
              .errorbox {
                border: 2px solid #ff5757;
                border-radius: 5px;
                background: #ff9f9f;
                width: fit-content;
                // height: 40px;
                margin: 10px auto;
                padding: 7px;
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
