import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import "./Movies.css";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genreFilter, setGenreFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "All Movies - Movie Reviews";

    fetch("http://localhost:3001/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data);
      });
  }, []);

  useEffect(() => {
    let result = movies;

    if (genreFilter !== "all") {
      result = result.filter((movie) => movie.genre === genreFilter);
    }

    if (searchQuery) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(result);
  }, [genreFilter, searchQuery, movies]);

  const genres = ["all", ...new Set(movies.map((movie) => movie.genre))];

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>All Movies</h1>
        <Link to="/movies/add" className="btn btn-primary">
          Add Movie
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="genre-select"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "all" ? "All Genres" : genre}
            </option>
          ))}
        </select>
      </div>

      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}`}>
            <Card
              title={movie.title}
              subtitle={`${movie.year} • ${movie.genre}`}
              image={movie.posterUrl}
            />
          </Link>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <p className="no-results">No movies found matching your criteria.</p>
      )}
    </div>
  );
}