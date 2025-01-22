import Nav from "./Nav";
import React, { useState, useEffect } from "react";
import supabase from "../supaBaseClient";
import { Link } from "react-router-dom";
import NewPostForm from "./NewPostForm";

//making changes

const CountriesPage = ({ setCountry, country, refreshPosts }) => {
  const [posts, setPosts] = useState([]);

  const storedCountry = JSON.parse(localStorage.getItem("country"));

  if (storedCountry !== undefined) {
    country = storedCountry;
  }

  useEffect(() => {
    if (country && country.name !== undefined) {
      localStorage.setItem("country", JSON.stringify(country));
      console.log("Saved country to localStorage:", country.name);
    } else {
      setCountry = { storedCountry };
      localStorage.setItem("country", JSON.stringify(storedCountry));
      console.log("No country, stored country:", country);
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error: fetchError } = await supabase
          .from("Posts")
          .select("*")
          .eq("location", country.name || storedCountry.name)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching posts:", fetchError);
        }
        if (!posts) {
          console.log("no posts");
        } else {
          setPosts(posts);
        }
      } catch (error) {
        console.error("Error during fetching posts", error);
      }
    };
    fetchPosts();
  }, [refreshPosts]);

  if (!country) {
    return <p>Country not found or invalid link.</p>;
  }

  console.log("Country", country);
  console.log("Stored Country:", storedCountry);

  const storedCapital = storedCountry.capital

  return (
    <div>
      <div className="country_page_container">
        <Nav />
        <div className="country_page_content">
          <div className="country_page_header">
            <img
              src={
                country?.href?.flag ||
                storedCountry?.flag ||
                storedCountry?.href?.flag
              }
              alt="country_flag"
            />
            <h1 className="countries_page_name">
              {country.name || storedCountry.name}
            </h1>
          </div>
          <div className="new-post-form-container">
            <NewPostForm />
          </div>
          <div className="country_posts_grid">
            {posts.map((post) => (
              <Link
                to={`/attraction/${post.id}`}
                key={post.id}
                className="country_post_card_link"
              >
                <div key={post.id} className="country_post_card">
                  <h3 className="country_post_title">{post.title}</h3>
                  <img
                    className="country_post_image"
                    src={post.img_url}
                    alt={post.title}
                  />
                  <p className="country_post_description">{post.description}</p>
                  <p className="country_post_location">
                    <strong>Location:</strong> {post.location}
                  </p>
                  <button className="country_post_delete_button">Delete</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountriesPage;
