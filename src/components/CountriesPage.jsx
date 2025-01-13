import React from "react";
import Nav from "./Nav";
import { useState, useEffect } from "react";
import supabase from "../supaBaseClient";

const CountriesPage = ({ country, refreshPosts }) => {
  const [posts, setPosts] = useState([]);
  console.log("country page", country.name);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: posts, error: fetchError } = await supabase
          .from("Posts")
          .select("*")
          .eq("location", country.name)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching posts:", fetchError);
        }
        if (!posts) {
          console.log("no posts");
        } else {
          console.log("Posts:", posts);
          setPosts(posts);
        }
      } catch (error) {
        console.error("Error during fetching posts", error);
        setError("Something went wrong. Please try again.");
      }
    };
    fetchPosts();
  }, [refreshPosts]);

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
        <h2>Attractions</h2>
        {posts.map((post) => (
          <div key={post.id} className="post">
            <p>
              <strong>Title:</strong> {post.title}
            </p>
            <p>
              <strong>Description:</strong> {post.description}
            </p>
            <img src={post.img_url} alt={post.title} />
            <p>Location {post.location}</p>
            <button>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesPage;
