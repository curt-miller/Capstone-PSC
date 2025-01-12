import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supaBaseClient";
import Nav from "./Nav";

export default function AttractionDetail() {
  const { id } = useParams(); // Get the post ID from the route
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState(""); // variable for the new review
  const [reviews, setReviews] = useState([]); // vraible for the full list of reviews

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: post, error: fetchError } = await supabase
          .from("Posts")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) {
          console.error("Error fetching post:", fetchError);
          setError("Could not fetch post details. Please try again.");
        } else {
          setPost(post);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  console.log("a post object looks like:", post);

  /*COMMENT BOX FUNCTIONALITY */

  const handleSubmitReview = () => {
    if (newReview.trim()) {
      // Add the new review to the list of reviews
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setNewReview(""); // Reset the review input field
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div id="att-detail-page-container">
      <Nav />
      <div id="att-detail-page-GRID">
        <div id="att-detail-page-TITLE">
          <h1>{post.title}</h1>
          <h3>
            Pin dropped on {post.created_at} by {post.user}
            {post.description}
            {post.location}
          </h3>
        </div>
        <div id="att-detail-page-REVIEWS">
          <h2>User Reviews</h2>
          {/* Example placeholder for reviews */}
          <p>Review 1: Amazing place!</p>
          <p>Review 2: Would visit again!</p>
          <p>ADD A COMMENT BOX HERE, CURTIS!!</p>
          {/*COMMENT BOX ADDITION */}
          {/* Placeholder for showing existing reviews */}
          {reviews.length > 0 ? (
            reviews.map((review, index) => <p key={index}>{review}</p>)
          ) : (
            <p>No reviews yet!</p>
          )}
          {/* Adding comment box */}
          <textarea
            placeholder="Add a review!"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <br />
          <button onClick={handleSubmitReview}>Submit Review</button>
        </div>
        <div id="att-detail-page-IMAGE">
          <img
            src={post.img_url}
            alt={post.title}
            // style={{
            //     width: "100%",
            //     height: "auto",
            //     borderRadius: "8px",
            //     objectFit: "cover",
            // }}
          />
        </div>
      </div>
    </div>
  );
}
