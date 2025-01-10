// import supabase from "../src/config/supabaseClient";

// const addCountriesToSupabase = async (countries) => {
//   try {
//     const formattedCountries = countries.map((name) => ({
//       name: name.replace(/\s+/g, " ").trim().toLowerCase()
//     }));
//     const { data, error } = await supabase
//       .from("Countries")
//       .insert(formattedCountries);

//     if (error) {
//       console.error("Error inserting countries:", error);
//     } else {
//       console.log("Countries added successfully:", data);
//     }
//   } catch (err) {
//     console.error("Unexpected error:", err);
//   }
// };

// export default addCountriesToSupabase;
