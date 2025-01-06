import React, { useEffect, useState } from "react";
import { fetchCountries } from "../API";

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
      <h1>Countries</h1>
      {countries.length === 0 ? (
        <p>No countries available or an error occurred.</p>
      ) : (
        <ul>
          {countries.map((country, index) => (
            <li key={index}>{country.name}</li> // Assuming `country` objects have a `name` field
          ))}
        </ul>
      )}
    </div>
  );
};

export default Countries;
