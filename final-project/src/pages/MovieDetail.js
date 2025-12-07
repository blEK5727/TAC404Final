import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const CURRENT_USER_ID = 1;

  useEffect(() => {
    fetch(`http://localhost:3001/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        document.title = `${data.title} - Movie Reviews`;
      });

    fetch(`http://localhost:3001/reviews?movieId=${id}&_expand=user`)
      .then((res) => res.json())
      .then((data) => setReviews(data));

    fetch(
      `http://localhost:3001/favorites?userId=${CURRENT_USER_ID}&movieId=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setIsFavorite(true);
          setFavoriteId(data[0].id);
        }
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      fetch(`http://localhost:3001/movies/${id}`, {
        method: "DELETE",
      }).then(() => {
        toast.success("Movie deleted successfully!");
        navigate("/movies");
      });
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      fetch(`http://localhost:3001/favorites/${favoriteId}`, {
        method: "DELETE",
      }).then(() => {
        setIsFavorite(false);
        setFavoriteId(null);
        toast.info("Removed from favorites");
      });
    } else {
      fetch("http://localhost:3001/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: CURRENT_USER_ID,
          movieId: parseInt(id),
          favoritedAt: new Date().toISOString(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsFavorite(true);
          setFavoriteId(data.id);
          toast.success("Added to favorites!");
        });
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-detail">
      <div className="movie-header">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="movie-meta">
            {movie.year} • {movie.genre} • {movie.duration} min • {movie.rating}
          </p>
          <p className="movie-director">Directed by {movie.director}</p>
          <p className="movie-synopsis">{movie.synopsis}</p>

          <div className="movie-actions">
            <button
              onClick={toggleFavorite}
              className={`btn ${isFavorite ? "btn-favorite-active" : "btn-favorite"}`}
            >
              {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
            </button>
            <Link to={`/movies/${id}/edit`} className="btn btn-secondary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this movie!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <Link key={review.id} to={`/reviews/${review.id}`} className="review-card">
                <div className="review-header">
                  <h3>{review.title}</h3>
                  <span className="review-rating">{review.rating}/5 ⭐</span>
                </div>
                <p className="review-author">
                  By {review.user?.username || "Anonymous"}
                </p>
                <p className="review-content">
                  {review.content.substring(0, 200)}...
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}