import React, { useEffect, useState, useMemo, useCallback } from "react";
import "../index.css";
import ImageGrid from "./ImageGrid";
import VisitedCountries from "./VisitedCountries";
import LikeButtonCountries from "./LikeButtonCountries";
import { useNavigate } from "react-router-dom";
import { countryList } from "../../utils/countries";

const Countries = ({ setCountry }) => {
  const [countries, setCountries] = useState(countryList);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("A");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  //Get Countries from the API
  useEffect(() => {
    const grouped = countryList.reduce((acc, country) => {
      const letter = country.name[0].toUpperCase();
      acc[letter] = acc[letter] || [];
      acc[letter].push(country);
      return acc;
    }, {});
    setFilteredCountries(grouped["A"] || []);
  }, []);

  const handleFilter = useCallback(
    (letter) => {
      setSelectedLetter(letter);
      const grouped = countries.reduce((acc, country) => {
        const firstLetter = country.name[0].toUpperCase();
        acc[firstLetter] = acc[firstLetter] || [];
        acc[firstLetter].push(country);
        return acc;
      }, {});
      setFilteredCountries(grouped[letter] || []); // Filter countries based on the selected letter
    },
    [countries]
  );

  //Navigate to the desired country

  const handleClick = useCallback(
    (country) => {
      localStorage.setItem("country", JSON.stringify(country));
      console.log(country);
      navigate(`/${country.name}`);
    },
    [navigate]
  );

  return (
    // entire countries list container
    <div className="countries-homepage-container">
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
          filteredCountries.map((country) => (
            <div
              className="country_card"
              key={country.name}
              onClick={(e) => {
                // Prevent the card click from triggering when clicking buttons
                if (e.target.tagName === "BUTTON" || e.target.closest("button"))
                  return;
                setCountry(country);
              }}
            >
              {/* Country Name (Plain Text) */}
              <button
                className="country_card_link"
                onClick={() => handleClick(country)} // When the card is clicked, set the country
              >
                <h2 className="country_name">{country.name}</h2>
              </button>

              {/* Buttons */}
              <div className="country_buttons">
                <button className="like_button">
                  <LikeButtonCountries
                    className="like_button_icon"
                    country_name={country}
                  />
                </button>
                <button className="visited_country_button">
                  <VisitedCountries
                    country_name={country.name}
                    user_id={userId}
                  />
                </button>
              </div>

              {/* Country Flag */}
              <img
                src={country.flag}
                alt={`Flag of ${country.name}`}
                className="country_flag"
              />

              {/* Image Grid */}
              <ImageGrid country={country.name} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Countries;
