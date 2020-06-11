import React from "react";
import Layout from "../components/pages/layout";
import nextCookie from "next-cookies";
import CustomerProfile from "../components/profile/customer";
import StoreProfile from "../components/profile/store";
import Router from "next/router";
import Head from "next/head";

const Profile = (props) => {
  // console.log("props", props);
  return (
    <Layout>
      <Head>
        <title>KeepSlip : {props.user.username}</title>
      </Head>
      <div className="container">
        <div className="content">
          <b style={{ fontSize: "20px" }}>{props.user.username}</b>
          {props.user.role == "customer" && (
            <CustomerProfile user={props.customer} />
          )}
          {props.user.role == "store" && <StoreProfile user={props.store} />}
        </div>
      </div>
      <style jsx>
        {`
          .container {
            margin: auto;
            width: fit-content;
          }
          .content {
            padding: 10px;
            margin: 10px auto;
            text-align: center;
            border-radius: 7px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
              0 6px 20px 0 rgba(0, 0, 0, 0.19);
            text-align: center;
            padding: 20px;
          }
          .errorbox {
            text-align: center;
            border: 2px solid #ff5757;
            border-radius: 5px;
            background: #ff9f9f;
            width: fit-content;
            margin: 10px auto;
            padding: 7px;
          }
          @media (min-width: 600px) {
            .container {
              width: 40%;
              margin: auto;
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 1080px) {
            .container {
              width: 55%;
            }
          }
          @media (max-width: 975px) {
            .container {
              width: 70%;
            }
          }
          @media (max-width: 600px) {
            .container {
              width: 90%;
              margin: auto;
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </Layout>
  );
};

Profile.getInitialProps = async (ctx) => {
  let user;
  const { KSa } = nextCookie(ctx);
  // // console.log(KSa);
  if (KSa) {
    let userVerify = await fetch(`${process.env.AUTH_SERVER}/verify`, {
      headers: { Authorization: `${KSa}` },
    });
    user = await userVerify.json();

    if (!user.error) {
      if (user.role == "customer") {
        let customerFetch = await fetch(
          `${process.env.CUSTOMER_SERVER}/customerById/${user.user_id}`,
          {
            headers: { Authorization: `${KSa}` },
          }
        );
        let customer = await customerFetch.json();
        // // console.log(customer[0]);
        return { user: user, customer: customer[0] };
      }
      if (user.role == "store") {
        let storeFetch = await fetch(
          `${process.env.STORE_SERVER}/store/${user.user_id}`,
          {
            headers: { Authorization: `${KSa}` },
          }
        );
        let store = await storeFetch.json();
        // // console.log(store[0]);
        return { user: user, store: store[0] };
      }
      // return { user: user };
    } else {
      if (ctx.req) {
        ctx.res.writeHead(302, { Location: "/unauthorization" });
        ctx.res.end();
      } else {
        Router.push("/unauthorization");
      }
    }
    return { user: user };
  } else {
    if (ctx.req) {
      ctx.res.writeHead(302, { Location: "/unauthorization" });
      ctx.res.end();
    } else {
      Router.push("/unauthorization");
    }
  }
  //   return { user: user };
};

export default Profile;
