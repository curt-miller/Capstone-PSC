const Country_APIURL = "https://restfulcountries.com/api/v1/countries";
const Country_Token = "1907|WGn0LXH1fCX3wevFOwPt3ctQGFrIYY2K7mFEFKCN";

export const fetchCountries = async () => {
  console.log("AT FETCH COUNTRIES");

  try {
    const response = await fetch(Country_APIURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Country_Token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("Server error details:", errorResponse);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Fetched data:", responseData);

    return responseData.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};
