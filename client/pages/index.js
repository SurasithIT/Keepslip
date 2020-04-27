import Layout from "../components/pages/layout";
import Intro from "../components/pages/intro";
import cookie from "js-cookie";
import Router from "next/router";
import nextCookie from "next-cookies";
import fetch from "isomorphic-unfetch";
import register from "../components/functions/registerSW";
import React, { useState, useEffect } from "react";

const Home = (props) => {
  useEffect(() => {
    console.log(props.user);
    if (props.user !== undefined) {
      if (props.user.error) {
        if (
          typeof window !== "undefined" &&
          typeof window.navigator !== "undefined"
        ) {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker
              .register("/service-worker.js", {
                scope: "/",
              })
              .then((register) => {
                register.active.postMessage(
                  JSON.stringify({ status: "clear" })
                );
              });
            deleteDB();
          }
        }
      }
    }
  }, [props.user]);

  return (
    <Layout>
      <div className="container">
        <Intro />
      </div>
    </Layout>
  );
};

const deleteDB = async () => {
  console.log("delete DB called");
  let indexedDB;
  if (typeof window !== "undefined") {
    indexedDB =
      window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
  } else {
    return;
  }
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

Home.getInitialProps = async (ctx) => {
  // const KSa = cookie.get("KSa");
  const { KSa } = nextCookie(ctx);
  console.log("process.env.AUTH_SERVER", process.env.AUTH_SERVER);
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
    } else {
      console.log("No user");
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
          register.active.postMessage(JSON.stringify({ status: "clear" }));
        }
      }

      deleteDB();
    }
  }
  return { user: user };
};

export default Home;
