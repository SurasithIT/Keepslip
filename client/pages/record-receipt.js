import Layout from "../components/pages/layout";
import AddReceipt from "../components/receipt/addreceipt";
import fetch from "isomorphic-unfetch";
import cookie from "js-cookie";
import React, { Component } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import Head from "next/head";
const RecordReceipt = (props) => {
  console.log(props);
  return (
    <Layout>
      <Head>
        <title>KeepSlip : Record Receipt</title>
      </Head>
      <div className="container">
        <AddReceipt
          id={props.id}
          NID={props.NID}
          branch_id={props.Branch_id}
          businessName={props.BusinessName}
          storeName={props.StoreName}
          address={props.Address}
          postCode={props.PostCode}
          username={props.Username}
        />
      </div>
    </Layout>
  );
};

RecordReceipt.getInitialProps = async (ctx) => {
  const { KSa } = nextCookie(ctx);
  console.log(KSa);
  let user;
  if (KSa) {
    let userVerify = await fetch(
      `http://35.240.161.75:3007/api/auth/store-verify`,
      {
        headers: { Authorization: `${KSa}` },
      }
    );
    user = await userVerify.json();
    if (!user.error) {
      let storeFetch = await fetch(
        `http://172.28.1.2:3002/api/store/store/${user.user_id}`
      );
      let store = await storeFetch.json();
      console.log(store[0]);
      return {
        id: user.user_id,
        NID: store[0].NID,
        BusinessName: store[0].BusinessName,
        Branch_id: store[0].Branch_id,
        StoreName: store[0].StoreName,
        Address: store[0].Address,
        PostCode: store[0].PostCode,
        Username: store[0].Username,
      };
    } else {
      if (ctx.req) {
        ctx.res.writeHead(302, { Location: "/unauthorization" });
        ctx.res.end();
      } else {
        Router.push("/unauthorization");
      }
    }
    // return { receipt: data };
  } else {
    if (ctx.req) {
      ctx.res.writeHead(302, { Location: "/nauthorization" });
      ctx.res.end();
    } else {
      Router.push("/unauthorization");
    }
  }
};

export default RecordReceipt;
