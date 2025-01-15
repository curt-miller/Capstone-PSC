import React, { useState, useEffect } from "react";
import supabase from "../supaBaseClient";
import { RiMapPin2Line } from "react-icons/ri";
import { RiMapPin2Fill } from "react-icons/ri";

const VisitedCountries = ({ country_name, user_id }) => {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    const fetchVisited = async () => {
      try {
        const { data, error } = await supabase
          .from("VisitedCountries")
          .select("*")
          .eq("country_name", country_name)
          .eq("user_id", user_id);

        if (error) {
          console.error("Error fetching visited status:", error);
          return;
        }

        // If data exists, set `visited` to true
        setVisited(data.length > 0);
      } catch (error) {
        console.error("Unexpected error fetching Visited:", error);
      }
    };

    fetchVisited();
  }, [country_name, user_id]);

  const handleVisited = async () => {
    try {
      if (visited) {
        // Delete the record if the country is already marked as visited
        const { error } = await supabase
          .from("VisitedCountries")
          .delete()
          .eq("country_name", country_name)
          .eq("user_id", user_id);

        if (error) {
          console.error("Error deleting visited record:", error);
          return;
        }
        setVisited(false);
      } else {
        // Insert a new record if the country is not visited
        const { error } = await supabase
          .from("VisitedCountries")
          .insert([{ country_name, user_id }]);

        if (error) {
          console.error("Error inserting visited record:", error);
          return;
        }
        setVisited(true);
      }
    } catch (error) {
      console.error("Unexpected error handling visited status:", error);
    }
  };

  return (
    <button className="like_button" onClick={handleVisited}>
      {visited ? (
        <RiMapPin2Fill className="liked" />
      ) : (
        <RiMapPin2Line className="notLiked" />
      )}{" "}
    </button>
  );
};

export default VisitedCountries;
