import React from "react";
import Nav from "./Nav";
import { useState, useEffect } from "react";
import supabase from "../supaBaseClient";
import { Link } from "react-router-dom";
import NewPostForm from "./NewPostForm";

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
      }
    };
    fetchPosts();
  }, [refreshPosts]);

  if (!country) {
    return <p>Country not found or invalid link.</p>;
  }

  return (
    <div>
      <div className="country_page_container">
        <Nav />
        <div className="country_page_content">
          <div className="country_page_header">
            <img src={country.href.flag} alt="country_flag" />
            <h1 className="countries_page_name">{country.name}</h1>
          </div>
          <div className="new-post-form-container">
            <NewPostForm
            // onPostSubmit={handleRefresh}
            />
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
