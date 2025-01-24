import React from "react";
import MapHomePage from "./MapHomePage";
import Nav from "./Nav";
import Countries from "./Countries";

const Home = ({ setCountry, country, setUserId, userId }) => {
  return (
    <div className="home-page-container">
      <Nav setUserId={setUserId} />
      <div className="home_page_content">
        <div className="home_page_map">
          <MapHomePage />
        </div>
        {/* <div className="home_page_photogrid"> */}
        <Countries setCountry={setCountry} country={country} userId={userId} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Home;
