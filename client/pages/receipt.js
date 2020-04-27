import Layout from "../components/pages/layout";
import ReceiptFull from "../components/receipt/receiptFull";
import cookie from "js-cookie";
import nextCookie from "next-cookies";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import Head from "next/head";

const Receipt = (props) => (
  <Layout>
    <Head>
      <title>
        KeepSlip :{" "}
        {!props.receipt.error ? props.receipt[0].KeepSlip_receipt_id : "Error"}
      </title>
    </Head>
    <div className="container">
      <div className="content">
        {!props.receipt.error ? (
          <ReceiptFull
            key={props.receipt[0].KeepSlip_receipt_id}
            receipt_id={props.receipt[0].KeepSlip_receipt_id}
            store_id={props.receipt[0].Store_id}
            customer_id={props.receipt[0].Customer_id}
            rceipt_date={props.receipt[0].Receipt_date}
            customerFirstname={props.receipt[0].Firstname}
            customerLastname={props.receipt[0].Lastname}
            customerPhoneNumber={props.receipt[0].PhoneNumber}
            customerEmail={props.receipt[0].Email}
            storeNID={props.receipt[0].NID}
            storeBranch_id={props.receipt[0].Branch_id}
            storeStoreName={props.receipt[0].StoreName}
            storeBusinessName={props.receipt[0].BusinessName}
            storeAddress={props.receipt[0].Address}
            storePostCode={props.receipt[0].PostCode}
          />
        ) : (
          <div className="errorbox">Error : {props.receipt.message}</div>
        )}
      </div>
      <style jsx>{`
        .container {
          margin: auto;
          width: fit-content;
        }
        .content {
          padding: 10px;
          margin: 10px auto;
          text-align: center;
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
      `}</style>
    </div>
  </Layout>
);

Receipt.getInitialProps = async (ctx) => {
  let user;
  const { KSa } = nextCookie(ctx);
  console.log(KSa);
  if (KSa) {
    let userVerify = await fetch(`http://35.247.154.183:3007/api/auth/verify`, {
      headers: { Authorization: `${KSa}` },
    });
    user = await userVerify.json();
    console.log("user handle err", user);
    // return user;
    let receipt_id = ctx.query.receipt_id;
    const uri = `http://35.247.154.183:3003/api/receipt/receipt/${receipt_id}`;
    const res = await fetch(uri);
    const data = await res.json();
    console.log(data);
    // console.log(data);
    // console.log(user.user_id, user.role, data[0].Customer_id, data[0].Store_id);
    if (user) {
      console.log(user);
      return { receipt: data };
    } else {
      if (ctx.req) {
        ctx.res.writeHead(302, { Location: "/Unauthorization" });
        ctx.res.end();
      } else {
        Router.push("/Unauthorization");
      }
    }
    // return { receipt: data };
  } else {
    if (ctx.req) {
      ctx.res.writeHead(302, { Location: "/Unauthorization" });
      ctx.res.end();
    } else {
      Router.push("/Unauthorization");
    }
  }
};

export default Receipt;
