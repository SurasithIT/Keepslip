// Example code
// ref
// https://stackoverflow.com/questions/58476658/how-to-redirect-to-login-page-for-restricted-pages-in-next-js
// https://stackoverflow.com/questions/56802195/how-to-set-cookies-in-nextjs
// https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/auth.js

import cookie from "js-cookie";
import Router from "next/router";
import nextCookie from "next-cookies";
import fetch from "isomorphic-unfetch";

Home.getInitialProps = async (ctx) => {
  const { KSa } = nextCookie("KSa");
  //   const KSa = cookie.get("KSa");
  console.log(KSa);
  let user;
  if (KSa) {
    let userVerify = await fetch(`http://172.28.1.9:8080/auth/verify`, {
      headers: { Authorization: `${KSa}` },
    });
    user = await userVerify.json();
    console.log(user);
    // return user;
  } else {
    if (ctx.req) {
      ctx.res.writeHead(302, { Location: "/Unauthorization" });
      ctx.res.end();
    } else {
      Router.push("/Unauthorization");
    }
  }
  return { user: user };
};
