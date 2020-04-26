import React, { useState, useEffect } from "react";

const CustomerProfile = (props) => {
  console.log(props.user);
  let { Email, Firstname, Lastname, PhoneNumber } = props.user;
  return (
    <div>
      <b>Firstname : </b>
      {Firstname}
      <br />
      <b>Lastname : </b>
      {Lastname}
      <br />
      <b>PhoneNumber : </b>
      {PhoneNumber}
      <br />
      <b>Email : </b>
      {Email}
      <br />
    </div>
  );
};
export default CustomerProfile;
