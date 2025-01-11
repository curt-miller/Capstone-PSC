import React from "react";
import MapShaded from "./MapShaded";
import Nav from "./Nav";
import Countries from "./Countries";

const Home = ({ setCountry, country }) => {
  return (
    <div className="home-page-container">
      <Nav />
      <div className="home_page_content">
        <div className="home_page_map">
          <MapShaded />
        </div>
        <Countries setCountry={setCountry} country={country} />
      </div>
    </div>
  );
};

export default Home;
