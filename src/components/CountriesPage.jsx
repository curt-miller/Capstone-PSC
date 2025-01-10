import React from "react";
import Nav from "./Nav";

const CountriesPage = ({ country }) => {
  console.log("country page", country);

  // If no country is found, display a fallback message
  if (!country) {
    return <p>Country not found or invalid link.</p>;
  }

  return (
    <div className="country_page_container">
      <Nav />
      <div className="country_page_header">
        <img src={country.href.flag} alt="country_flag" />
        <h1 className="countries_page_name">{country.name}</h1>
      </div>
      <div className="country_restaurants_container">
        <h2>Restaurants</h2>
        <p>List of restaurants in this country</p>
      </div>
      <div className="country_attractions_container">
        <h2>Attractions</h2>
        <p>List of attractions in this country</p>
      </div>
    </div>
  );
};

export default CountriesPage;
