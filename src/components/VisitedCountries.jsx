import React, { useState, useEffect } from "react";
import supabase from "../supaBaseClient";
import { fetchVisited } from "../../utils/fetchUserData";
import { RiMapPin2Line, RiMapPin2Fill } from "react-icons/ri";

const VisitedCountries = ({ country_name }) => {
  const user_id = localStorage.getItem("userId");
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    const loadVisitedCountries = async () => {
      let visitedList = await fetchVisited(user_id);
      setVisited(visitedList.includes(country_name));
    };
    loadVisitedCountries();
  }, [user_id]);

  const handleVisited = async () => {
    let updatedList = JSON.parse(
      localStorage.getItem("visitedCountries") || "[]"
    );

    if (updatedList.includes(country_name)) {
      updatedList = updatedList.filter((country) => country !== country_name);
      setVisited(false);
    } else {
      updatedList = [...updatedList, country_name];
      setVisited(true);
    }
    localStorage.setItem("visitedCountries", JSON.stringify(updatedList));
    console.log(updatedList);

    try {
      const { data, error: updateError } = await supabase
        .from("Users")
        .update({ visitedCountries: updatedList })
        .eq("id", user_id);

      if (updateError) {
        console.error("Error inserting visited record:", updateError);
        return;
      }

      localStorage.setItem("visitedCountries", JSON.stringify(updatedList));
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
      )}
    </button>
  );
};

export default VisitedCountries;
