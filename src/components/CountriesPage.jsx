import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Nav from "./Nav";

const CountriesPage = ({ country }) => {
  //   const country = useParams();
  console.log("country page", country);

  // If no country is found, display a fallback message
  if (!country) {
    return <p>Country not found or invalid link.</p>;
  }

  return (
    <div className="country-page">
      <Nav/>
      <div className="country-details-card">
        <div className="country-info">
          <h1>{country.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default CountriesPage;
