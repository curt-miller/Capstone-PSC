import React from "react";
import MapShaded from "./MapShaded";
import Nav from "./Nav";
import Countries from "./Countries";

const Home = () => {
  return (
    <div>
      <Nav />
      <MapShaded />
      <h1>Homepage</h1>
      <Countries />
    </div>
  );
};

export default Home;
