import React from "react";
import Nav from "./Nav";

const CountriesPage = ({ country }) => {
  console.log("country page", country);

  // If no country is found, display a fallback message
  if (!country) {
    return <p>Country not found or invalid link.</p>;
  }

  return (
    <div className="country-page-container">
      <Nav />
      <div
        className="country-page-pic"
        // style={{ backgroundImage: `url(${country.href.flag})` }} // Dynamic flag URL
      >
        <h1 className="country-name">{country.name}</h1>
      </div>
    </div>
  );
};

export default CountriesPage;
