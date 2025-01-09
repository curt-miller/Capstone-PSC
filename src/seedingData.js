// import supabase from "../src/config/supabaseClient";

// const addCountriesToSupabase = async (countries) => {
//   try {
//     const { data, error } = await supabase
//       .from("Countries")
//       .insert(countries.map((name) => ({ name })));

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
