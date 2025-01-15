import React, { useState, useEffect } from "react";
import supabase from "../supaBaseClient";
import { RiMapPin2Line } from "react-icons/ri";
import { RiMapPin2Fill } from "react-icons/ri";

const VisitedCountries = ({ country_name, user_id }) => {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    const fetchVisited = async () => {
      try {
        const { data, error: dataError } = await supabase
          .from("VisitedCountries")
          .select("*")
          .eq("country_name", country_name)
          .eq("user_id", user_id);

        if (dataError) {
          console.log("country_name:", country_name, "user_id:", user_id);
          return;
        }
      } catch (error) {
        console.error("Unexpected error fetching Visited:", error);
      }
    };

    fetchVisited();
  }, [country_name, user_id]);

  const handleVisited = async (e) => {
    if (visited) {
      await supabase
        .from("VisitedCountries")
        .delete()
        .eq("country_name", country_name)
        .eq("user_id", user_id);
      setVisited(false);
    } else {
      await supabase
        .from("VisitedCountries")
        .insert([{ country_name: country_name, user_id: user_id }]);
      setVisited(true);
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
