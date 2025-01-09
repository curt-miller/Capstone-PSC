import React from "react";
import MapShaded from "./MapShaded";
import Nav from "./Nav";
import Countries from "./Countries";

const Home = ({ setCountry, country }) => {
  return (
    <div>
      <Nav />
      <MapShaded />
      <Countries setCountry={setCountry} country={country} />
    </div>
  );
};

export default Home;
