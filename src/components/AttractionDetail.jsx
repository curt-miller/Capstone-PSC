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
        <div id="att-detail-page-TITLE-BLOCK">
          <h1>{post.title}</h1>
          <h2>
            Pin dropped on {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })} by {post.user}
          </h2>
          <h3>
            {post.description}
          </h3>
          <h4>
            {post.location}
          </h4>
        </div>


        <div id="att-detail-page-REVIEW-BLOCK">
          <h2>Here's what Pals have to say:</h2>

          {reviews.length > 0 ? (
            <div>
              {reviews.map((review, index) => (
                <div id="att-detail-page-REVIEW-CARD" key={index}>
                  <p>{review}</p>
                </div>
              ))}
            </div>
          ) : (
            <p id="att-detail-page-NO-REVIEWS-MESSAGE">Be the first to review {post.title}</p>
          )}


          <div id="att-detail-page-SUBMIT-COMMENT">
            <textarea
              placeholder="Add a review!"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <br />
            <button onClick={handleSubmitReview}>Submit Review</button>
          </div>
        </div>


        <div id="att-detail-page-IMAGE-BLOCK">
          <img
            src={post.img_url}
            alt={post.title}
          />
        </div>


      </div>
    </div>
  );
}
