import { useState, useEffect } from "react";
import movies_ids from "./data";
export const useFetch = (apiPath, queryTerm = "") => {
  const [data, setData] = useState([]);
  const url = `https://api.themoviedb.org/3/${apiPath}?api_key=${process.env.REACT_APP_API_KEY}&query=${queryTerm}`
  useEffect(() => {
    async function fetchMovies() {
      const response = await fetch(url);
      const json = await response.json();
      // const filteredData = json?.results?.filter((item) => movies_ids.includes(item.id));
      const filteredData = json?.results;
      setData(filteredData);
    }
    fetchMovies();
  }, [url])
  return { data }
}
