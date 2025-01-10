import React, { useEffect, useState } from "react";
import { fetchCountries } from "../API/countries";
import "../index.css";
import { Link } from "react-router-dom";
import ImageGrid from "./ImageGrid";
import likeButton from "../assets/LikeButton.png";
import visitedButton from "../assets/VisitedButton.png";

const Countries = ({ setCountry, refreshPosts }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("A");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error: fetchError } = await supabase
          .from("Posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching posts:", fetchError);
        } else {
          setPosts(posts);
        }
      } catch (error) {
        console.error("Error during fetching posts", error);
        setError("Something went wrong. Please try again.");
      }
    };
    fetchPosts();
  }, [refreshPosts]);

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
    <div>
      <h1 className="countries_header">Countries</h1>

      {/* Alphabet Filter */}
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

      {/* Country Cards */}
      {filteredCountries.length === 0 ? (
        <p>No countries found</p>
      ) : (
        <div className="countries_container">
          {filteredCountries.map((country, index) => (
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
              <button className="like_country_button">
                <img
                  src={likeButton}
                  alt="Like button Icon"
                  className="like_button_icon"
                  onClick={() => console.log("like button clicked")}
                />{" "}
              </button>
              <button className="visited_country_button">
                <img
                  src={visitedButton}
                  alt="Visited button Icon"
                  className="visited_button_icon"
                  onClick={() => console.log("visited button clicked")}
                />{" "}
              </button>
              <p>Capital: {country.capital}</p>
              <img
                src={country.href.flag}
                alt={`Flag of ${country.name}`}
                className="country_flag"
              />
              <ImageGrid country={country.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Countries;
