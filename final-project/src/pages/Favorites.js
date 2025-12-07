import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../components/Card";
import "./Favorites.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const CURRENT_USER_ID = 1;

  useEffect(() => {
    document.title = "My Favorites - Movie Reviews";
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    fetch(
      `http://localhost:3001/favorites?userId=${CURRENT_USER_ID}&_expand=movie`
    )
      .then((res) => res.json())
      .then((data) => {
        const sortedFavorites = data.sort(
          (a, b) => new Date(b.favoritedAt) - new Date(a.favoritedAt)
        );
        setFavorites(sortedFavorites);
      });
  };

  const handleRemoveFavorite = (favoriteId) => {
    if (window.confirm("Remove this movie from favorites?")) {
      fetch(`http://localhost:3001/favorites/${favoriteId}`, {
        method: "DELETE",
      }).then(() => {
        toast.info("Removed from favorites");
        fetchFavorites();
      });
    }
  };

  return (
    <div className="favorites-page">
      <h1>My Favorite Movies</h1>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>You haven't added any favorites yet.</p>
          <Link to="/movies" className="btn btn-primary">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-item">
              <Link to={`/movies/${favorite.movie.id}`}>
                <Card
                  title={favorite.movie.title}
                  subtitle={`${favorite.movie.year} • ${favorite.movie.genre}`}
                  image={favorite.movie.posterUrl}
                />
              </Link>
              <div className="favorite-info">
                <p className="favorited-date">
                  Added: {new Date(favorite.favoritedAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="btn btn-remove"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}