import { Routes, Route } from "react-router-dom";
import { MovieList, MovieDetail, Search, PageNotFound } from "../pages"
import Recommend from "../pages/Recommend";

export const AllRoutes = () => {
    return (
        <div className="dark:bg-slate-800">
            <Routes>
                <Route path="/" element={<MovieList apiPath="movie/now_playing" title="Home" />} />
                <Route path="movie/:id" element={<MovieDetail />} />
                <Route path="movies/popular" element={<MovieList apiPath="movie/popular" title="Popular" />} />
                <Route path="movies/top" element={<MovieList apiPath="movie/top_rated" title="Top Rated" />} />
                <Route path="movies/upcoming" element={<MovieList apiPath="movie/upcoming" title="Up Coming" />} />
                <Route path="movies/recommend" element={<Recommend />} />
                <Route path="search" element={<Search apiPath="search/movie" />} />
                <Route path="*" element={<PageNotFound apiPath="/" />} />
            </Routes>
        </div>
    )
}