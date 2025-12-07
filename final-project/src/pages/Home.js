import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import "./Home.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    document.title = "Home - Movie Reviews";

    fetch("http://localhost:3001/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.slice(0, 3)));

    fetch("http://localhost:3001/reviews?_expand=movie&_expand=user")
      .then((res) => res.json())
      .then((data) => setReviews(data.slice(0, 3)));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Movie Reviews</h1>
        <p>
          Discover, review, and discuss your favorite movies with fellow cinema
          enthusiasts
        </p>
        <Link to="/movies/add" className="btn btn-primary">
          Add a Movie
        </Link>
      </section>

      <section className="featured-section">
        <h2>Featured Movies</h2>
        <div className="movie-grid">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/movies/${movie.id}`}>
              <Card
                title={movie.title}
                subtitle={`${movie.year} • ${movie.genre}`}
                image={movie.posterUrl}
              />
            </Link>
          ))}
        </div>
        <Link to="/movies" className="view-all-link">
          View All Movies →
        </Link>
      </section>

      <section className="recent-reviews">
        <h2>Recent Reviews</h2>
        <div className="reviews-list">
          {reviews.map((review) => (
            <Link
              key={review.id}
              to={`/reviews/${review.id}`}
              className="review-preview"
            >
              <h3>{review.title}</h3>
              <p className="review-meta">
                {review.movie?.title} • {review.rating}/5 stars
              </p>
              <p className="review-excerpt">
                {review.content.substring(0, 150)}...
              </p>
            </Link>
          ))}
        </div>
        <Link to="/reviews" className="view-all-link">
          View All Reviews →
        </Link>
      </section>
    </div>
  );
}