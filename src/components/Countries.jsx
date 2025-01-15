import React, { useEffect, useState } from "react";
import { fetchCountries } from "../API/countries";
import "../index.css";
import { Link } from "react-router-dom";
import ImageGrid from "./ImageGrid";
import LikeButton from "./LikeButton";
import supabase from "../supaBaseClient";
import VisitedCountries from "./VisitedCountries";

const Countries = ({ setCountry, refreshPosts }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const getCountries = async () => {
      const data = await fetchCountries();
      setCountries(data);

      const defaultFiltered = data.filter((country) =>
        country.name.toLowerCase().startsWith("a")
      );
      setFilteredCountries(defaultFiltered);
    };

    getCountries();
  }, []);

  const handleFilter = (letter) => {
    setSelectedLetter(letter);

    const filtered = countries.filter((country) =>
      country.name.toLowerCase().startsWith(letter.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  return (
    // entire countries list container
    <div className="countries-homepage-container">
      <h1 className="countries_header">See where our users have traveled</h1>

      {/* alphabet filter */}
      <div className="alphabet_filter">
        {[
          "A",
          ...Array.from({ length: 25 }, (_, i) => String.fromCharCode(66 + i))
        ].map((letter) => (
          <button
            key={letter}
            className={`alphabet_button ${
              selectedLetter === letter ? "active" : ""
            }`}
            onClick={() => handleFilter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* country cards */}
      <div className="countries_list_container">
        {filteredCountries.length === 0 ? (
          <p>No countries found</p>
        ) : (
          filteredCountries.map((country, index) => (
            <div className="country_card" key={index}>
              <Link
                to={{
                  pathname: `/${country.name.toLowerCase()}`
                }}
                onClick={() => setCountry(country)}
                className="country_name_link"
              >
                <h2 className="country_name">{country.name}</h2>
              </Link>
              <div className="country_buttons">
                <button className="like_button">{/* <LikeButton /> */}</button>
                <button className="visited_country_button">
                  <VisitedCountries
                    country_name={country.name}
                    user_id={userId}
                  />
                </button>
              </div>
              <p id="country_card_capital">Capital: {country.capital}</p>
              <img
                src={country.href.flag}
                alt={`Flag of ${country.name}`}
                className="country_flag"
              />
              <ImageGrid country={country.name} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Countries;
