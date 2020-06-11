import Layout from "../components/pages/layout";
import ReceiptsPage from "../components/pages/receiptsPage";
import Router from "next/router";
import React, { Component } from "react";
import auth from "../components/functions/auth";
import nextCookie from "next-cookies";
import Head from "next/head";

export default class Receipts extends Component {
  static async getInitialProps(ctx) {
    const { KSa } = nextCookie(ctx);
    // console.log(KSa);
    let user;

    if (KSa) {
      let userVerify = await fetch(`${process.env.AUTH_SERVER}/verify`, {
        headers: { Authorization: `${KSa}` },
      });
      user = await userVerify.json();
      // console.log(user);
      if (!user.error && user.user_id !== "") {
        return {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
        };
      } else {
        if (ctx.req) {
          ctx.res.writeHead(302, { Location: "/unauthorization" });
          ctx.res.end();
        } else {
          Router.push("/unauthorization");
        }
      }
    } else {
      if (ctx.req) {
        ctx.res.writeHead(302, { Location: "/unauthorization" });
        ctx.res.end();
      } else {
        Router.push("/unauthorization");
      }
    }
  }

  componentDidMount = () => {
    if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  render() {
    return (
      <Layout>
        <Head>
          <title>KeepSlip : {this.props.username}</title>
        </Head>
        <ReceiptsPage user_id={this.props.user_id} role={this.props.role} />

        <style jsx>{`
          .content {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-gap: 1em;
            justify-items: stretch;
            padding: 20px 20px;
          }
          @media (max-width: 850px) {
            .content {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (max-width: 630px) {
            .content {
              width: 80%;
              margin: auto;
              grid-template-columns: repeat(2, 1fr);
              padding: 10px 0px;
            }
            @media (max-width: 450px) {
              .content {
                grid-template-columns: 1fr;
              }
            }
          }
        `}</style>
      </Layout>
    );
  }
}
