import cookie from "js-cookie";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
async function auth() {
  const KSa = cookie.get("KSa");
  console.log(KSa);
  let user;
  if (KSa) {
    let userVerify = await fetch(`http://${process.env.API_PATH}/auth/verify`, {
      headers: { Authorization: `${KSa}` },
    });
    user = await userVerify.json();
    console.log(user);
    return user;
  } else {
    // Router.push("/unauthorization");
    user = { error: true, message: "No KSa cookies" };
    return user;
  }
}

module.exports = auth;
