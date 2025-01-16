import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supaBaseClient";

export default function ImageGrid({ country }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch
        const { data: posts, error } = await supabase
          .from("Posts")
          .select("id, img_url, location");

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        // Filter by country
        const filteredPosts = posts.filter((post) => post.location === country);
        setPosts(filteredPosts);
      } catch (err) {
        console.error("Unexpected error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [country]);

  return (
    <div id="image_grid">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="image-grid-item"
            onClick={() => navigate(`/attraction/${post.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={post.img_url} alt={`Post ${post.id}`} />
          </div>
        ))
      ) : (
        <Link className="image_grid_BETHEFIRST" to={"/userpage"}>
          Be the first to post!
        </Link>
      )}
    </div>
  );
}
