import React, { Component } from "react";
import Link from "next/link";
import cookie from "js-cookie";
import Router from "next/router";
import nextCookie from "next-cookies";
import fetch from "isomorphic-unfetch";
import register from "../functions/registerSW";
export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      user: false,
      role: "",
      username: "",
      db: "",
    };
  }

  // static async getInitialProps(ctx) {
  componentDidMount = async () => {
    const KSa = cookie.get("KSa");
    console.log(KSa);
    let user;
    if (KSa) {
      let userVerify = await fetch(`http://api.keepslip.com/auth/verify`, {
        headers: { Authorization: `${KSa}` },
      });
      user = await userVerify.json();
      console.log(user);
      if (!user.error) {
        this.setState({
          user: true,
          role: user.role,
          username: user.username,
        });
      } else {
        this.setState({
          user: false,
          role: "",
          username: "",
        });
      }
    } else {
      this.setState({
        user: false,
        role: "",
        username: "",
      });
    }
  };

  handleChange = () => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  logout = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      if ("serviceWorker" in navigator) {
        var register = await navigator.serviceWorker.register(
          "/service-worker.js",
          {
            scope: "/",
          }
        );
      }
    }

    register.active.postMessage(JSON.stringify({ status: "clear" }));
    cookie.remove("KSa");
    let uri = `http://api.keepslip.com/auth/logout`;
    let option = { method: "DELETE" };
    let sendData = await fetch(uri, option);
    let result = await sendData.json();
    console.log(result);
    this.deleteDB();
    Router.push("/");
  };

  deleteDB = async () => {
    console.log("delete DB called");

    var DBDeleteRequest = indexedDB.deleteDatabase("NotiDB");

    // When i had the base open, the closure was blocked, so i left this here
    DBDeleteRequest.onblocked = function (event) {
      console.log("Blocked");
    };

    DBDeleteRequest.onerror = function (event) {
      console.log("Error deleting database.");
      console.log(event);
    };

    DBDeleteRequest.onsuccess = function (event) {
      console.log("Database deleted successfully");
    };
  };

  render(props) {
    const hiddenMenu = this.state.checked ? "func" : "func hidden";
    const navFix = this.state.checked ? "container fix" : "container";
    return (
      <div className={navFix}>
        <div className="home-link">
          <Link href="/">
            <button
              style={{
                border: 0,
                borderRadius: "5px",
                height: "100%",
                textAlign: "center",
                fontSize: "16px",
                padding: "5px",
              }}
            >
              <img src="/src/KeelSlip_Icon.png" style={{ height: "32px" }} />{" "}
            </button>
          </Link>
        </div>
        <div className="user">
          {this.state.username && (
            <Link href="/profile">
              <button
                style={{
                  border: 0,
                  borderRadius: "5px",
                  height: "100%",
                  textAlign: "center",
                  fontSize: "16px",
                  padding: "5px 20px",
                }}
              >
                <b>{this.state.username}</b>
              </button>
            </Link>
          )}
        </div>
        <div className={hiddenMenu}>
          <div className="button-func">
            <Link href="/record-receipt">
              <button
                style={{
                  display:
                    this.state.user && this.state.role == "store" ? "" : "none",
                }}
              >
                Record Receipt
              </button>
            </Link>
            <Link href="/customer-login">
              <button
                style={{
                  display: this.state.user ? "none" : "",
                }}
              >
                Customer Login
              </button>
            </Link>
            <Link href="/store-login">
              <button
                style={{
                  display: this.state.user ? "none" : "",
                }}
              >
                Store Login
              </button>
            </Link>
            <button
              onClick={this.logout}
              style={{
                display: this.state.user ? "" : "none",
              }}
            >
              Log out
            </button>
          </div>
        </div>
        <div className="hamburger-nav">
          <input
            type="checkbox"
            id="check"
            checked={this.state.checked}
            onChange={this.handleChange}
          />
          <label htmlFor="check" className="check-btn">
            <i className="fas fa-bars"></i>
          </label>
        </div>
        <style jsx>{`
          .container {
            color: white;
            font-size: 20px;
            background: #1564bf;
            padding: 10px;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            align-items: center;
            text-align: center;
            margin: auto;
            // display: flex;
            // flex-direction: row;
          }
          .home-link {
            margin-right: auto;
          }
          .user {
            margin: auto;
          }
          .func {
            display: flex;
            flex-direction: row;
            margin-left: auto;
            // margin-right: 0;
          }
          .hamburger-nav {
            display: none;
            color: white;
          }
          a {
            color: white;
            text-decoration: none;
            cursor: pointer;
          }

          button {
            font-size: 14px;
            width: fit-content;
            height: 30px;
            border-radius: 5px;
            border: 1px solid #ddd;
            cursor: pointer;
            background: #1564bf;
            color: white;
            margin: 0px 5px;
          }
          button:hover {
            background: #1979e6;
            color: white;
            cursor: pointer;
          }

          @media (max-width: 690px) {
            .hamburger-nav {
              display: block;
              margin-left: auto;
            }
            .check-btn {
              font-size: 25px;
            }
            .check-btn:hover {
              cursor: pointer;
            }
            #check {
              display: none;
            }
            .func {
              display: flex;
              position: fixed;
              top: 65px;
              right: 0%;
              text-align: center;
              flex-direction: column;
              transition: all 0.5s;
              background: #003b8e;
              width: 100%;
              min-height: 100%;
              align-items: center;
              z-index: 1;
            }

            .button-func {
              width: 100%;
            }
            button {
              margin: 0px;
              border: none;
              background: none;
              width: 100%;
              height: 50px;
              border-radius: 0;
              font-size: 20px;
            }
            .hidden {
              right: -101%;
            }
            .fix {
              position: fixed;
              top: 0;
              z-index: 1;
              transition: all 0.5s;
            }
          }
        `}</style>
      </div>
    );
  }
}
