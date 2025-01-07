import React, { useEffect, useState } from "react";
import { fetchCountries } from "../API/countries";
import "../index.css"; // Import the CSS file

const Countries = () => {
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
        <p>No countries available or an error occurred.</p>
      ) : (
        <div className="countries_container">
          {countries.map((country, index) => (
            <div className="country_card" key={index}>
              <h2 className="country_name">{country.name}</h2>
              <p>Capital: {country.capital}</p>
              <img
                src={country.href.flag}
                alt={`Flag of ${country.name}`}
                className="country_flag"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Countries;
