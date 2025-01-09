import React, { useEffect, useState } from "react";
import { fetchCountries } from "../API/countries";
import "../index.css";
import { Link } from "react-router-dom";

const Countries = ({ setCountry, country }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getCountries = async () => {
      const data = await fetchCountries();
      setCountries(data); // `data` is now the array of countries
    };

    getCountries();
  }, []);

  return (
    <div>
      <h1 className="countries_header">Countries</h1>
      {countries.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="countries_container">
          {countries.map((country, index) => (
            <div className="country_card" key={index}>
              <h2 className="country_name">{country.name}</h2>
              <p>Capital: {country.capital}</p>
              <Link
                to={{
                  pathname: `/${country.name.toLowerCase()}` // Path to country page
                  // state: { country }, // Passing the full country object
                }}
              >
                <img
                  src={country.href.flag}
                  alt={`Flag of ${country.name}`}
                  className="country_flag"
                  onClick={() => setCountry(country)}
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Countries;
