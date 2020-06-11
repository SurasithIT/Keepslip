import React, { useState, useEffect } from "react";
import Layout from "../components/pages/layout";
import Trash from "../components/intro/trash";
import SaveNature from "../components/intro/saveNature";
import Blockchain from "../components/intro/blockchain";

const About = () => {
  return (
    <Layout>
      <div className="container">
        <Trash />
        <SaveNature />
        <Blockchain />
      </div>
    </Layout>
  );
};

export default About;
