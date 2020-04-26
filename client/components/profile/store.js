import React from "react";

const StoreProfile = (props) => {
  let {
    Address,
    Branch_id,
    BusinessName,
    NID,
    PostCode,
    StoreName,
  } = props.user;
  return (
    <div>
      <b>NID : </b>
      {NID}
      <br />
      <b>Business name : </b>
      {BusinessName}
      <br />
      <b>Branch id : </b>
      {Branch_id}
      <br />
      <b>Store name : </b>
      {StoreName}
      <br />
      <b>Address : </b>
      {Address}
      <br />
      <b>PostCode : </b>
      {PostCode}
      <br />
    </div>
  );
};
export default StoreProfile;
