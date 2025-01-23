import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supaBaseClient";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

export default function AttractionDetail(displayname) {
  const userId = localStorage.getItem("userId") || "Guest";
  const { id } = useParams(); // Get the post ID from the route
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState(""); // variable for the new review
  const [reviews, setReviews] = useState([]); // vraible for the full list of reviews
  const [rating, setRating] = useState(0); // Store the selected rating
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: post, error: fetchError } = await supabase
          .from("Posts")
          .select("*, Users(display_name, profilePicture, id)")
          .eq("id", id)
          .single();

        if (fetchError) {
          console.error("Error fetching post:", fetchError);
          setError("Could not fetch post details. Please try again.");
        } else {
          setPost(post);
          localStorage.setItem("profileId", post.Users.id);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    if (id) fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("Reviews")
          .select(
            `
            *,
            Users(display_name, profilePicture)
            `
          )
          .eq("post_id", id);

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
          setError("Count not fetch reviews. Please try again.");
        } else {
          setReviews(reviewsData || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching reviews:", err);
      }
    };
    console.log("REVIEWS:", reviews.review);
    if (id) fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("Reviews")
          .select("rating")
          .eq("post_id", id);

        if (ratingsError) {
          console.error("Error fetching ratings:", ratingsError);
          return;
        }

        if (ratingsData && ratingsData.length > 0) {
          const total = ratingsData.reduce(
            (sum, review) => sum + (review.rating || 0),
            0
          );
          const averageRating = total / ratingsData.length;

          setAverageRating(`Average Rating: ${averageRating.toFixed(1)}`);
        } else {
          setAverageRating(null);
        }
      } catch (error) {
        console.error("Unexpected error fetching ratings:", err);
      }
    };
    if (id) fetchRatings();
  }, [id]);

  /*COMMENT BOX FUNCTIONALITY */
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }

      if (!user) {
        console.error("No user logged in.");
        return;
      }

      const { data: userData, error: userQueryError } = await supabase
        .from("Users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userQueryError || !userData) {
        console.error("Error fetching user data:", userQueryError);
        return;
      }

      const { data: insertedReview, error: insertError } = await supabase
        .from("Reviews")
        .insert([
          {
            review: newReview,
            post_id: id,
            user_id: userData.id,
            rating: rating
          }
        ])
        .select();
      console.log("INSERTED REVIEW:", insertedReview);

      if (insertError) {
        console.error("Error inserting review:", insertError);
      } else {
        console.log("Post added successfully:", insertedReview);
        setReviews((prevReviews) => [...prevReviews, ...insertedReview]);
        setNewReview("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (reviewId) => {
    try {
      const { error } = await supabase
        .from("Reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        console.error("Error deleting post:", error);
      } else {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        );
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  console.log("UserId", userId);

  return (
    <div id="att-detail-page-container">
      <Nav />
      <div id="att-detail-page-GRID">
        <div id="att-detail-page-TITLE-BLOCK">
          <h1>{post.title}</h1>

          <h2>
            Pin dropped on{" "}
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}{" "}
            by{" "}
            <Link
              to={{
                pathname: `/${post.Users.id}/profile`
              }}
            >
              {post.Users.display_name}
              <img src={post.Users?.profilePicture} alt="profile photo" />
            </Link>
          </h2>
          <h4>Located in {post.location}</h4>
          <h3>{post.description}</h3>
        </div>

        <div id="att-detail-page-REVIEW-BLOCK">
          {reviews.length > 0 ? (
            <h2>Here's what Pals have to say:</h2>
          ) : (
            <p id="att-detail-page-NO-REVIEWS-MESSAGE">
              Be the first to review {post.title}
            </p>
          )}

          {/* RATING FEATURE */}

          <div id="att-detail-page-RATING-BLOCK">
            <h2>Rate this attraction:</h2>
            <ReactStars
              count={5}
              onChange={(newRating) => setRating(newRating)}
              size={30}
              activeColor="#daa520"
              value={rating}
              isHalf={true}
            />
            <p>Rating: {rating}/5</p>
            <br />
            {averageRating !== null ? (
              <p>{averageRating}/5</p>
            ) : (
              <p>No ratings yet.</p>
            )}
          </div>
          <div>
            {reviews.map((review, index) => (
              <div id="att-detail-page-REVIEW-CARD" key={index}>
                <h4>{review.Users?.display_name || "Anonymous"}</h4>
                <img
                  src={review.Users?.profilePicture}
                  alt={review.Users?.display_name}
                  style={{ width: "40px", height: "40px" }}
                />
                <h5>{review.rating}/5</h5>
                <p>{review.review}</p>
                {userId == review.user_id && (
                  <button
                    onClick={(e) => {
                      handleDelete(review.id);
                    }}
                  >
                    delete
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* REVIEWS */}
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
          <img src={post.img_url} alt={post.title} />
        </div>
      </div>
    </div>
  );
}
