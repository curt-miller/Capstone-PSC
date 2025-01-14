import React from "react";
import MapShaded from "./MapShaded";
import Nav from "./Nav";
import Countries from "./Countries";

const Home = ({ setCountry, country, setUserId }) => {
  return (
    <div className="home-page-container">
      <Nav setUserId={setUserId} />
      <div className="home_page_content">
        <div className="home_page_map">
          <MapShaded />
        </div>
        {/* <div className="home_page_photogrid"> */}
        <Countries setCountry={setCountry} country={country} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Home;
