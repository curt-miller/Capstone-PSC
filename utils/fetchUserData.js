import supabase from "../src/supaBaseClient";

export const fetchVisited = async (user_id) => {
  let storedVisited = localStorage.getItem("visitedCountries");

  if (storedVisited) {
    const visitedList = JSON.parse(storedVisited);
    return visitedList;
  } else {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("visitedCountries")
        .eq("id", user_id)
        .single();

      if (error) {
        console.error("Error fetching visited status:", error);
        return;
      }

      let visitedList = data.visitedCountries || [];
      localStorage.setItem("visitedCountries", JSON.stringify(visitedList));
      return visitedList;
    } catch (error) {
      console.error("Unexpected error fetching Visited:", error);
    }
  }
};

export const fetchLikedCountries = async (user_id) => {
  let storedLiked = localStorage.getItem("likedCountries");

  if (storedLiked) {
    const likedList = JSON.parse(storedLiked);
    return likedList;
  } else {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("likedCountries")
        .eq("id", user_id)
        .single();

      if (error) {
        console.error("Error fetching liked status:", error);
        return;
      }

      let likedList = data.likedCountries || [];
      localStorage.setItem("likedCountries", JSON.stringify(likedList));
      return likedList;
    } catch (error) {
      console.error("Unexpected error fetching liked:", error);
    }
  }
  console.log("fetchLiked");
};
