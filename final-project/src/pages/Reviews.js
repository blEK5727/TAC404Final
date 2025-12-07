import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Reviews.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    document.title = "All Reviews - Movie Reviews";

    fetch("http://localhost:3001/reviews?_expand=movie&_expand=user")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  return (
    <div className="reviews-page">
      <h1>All Reviews</h1>

      <div className="reviews-grid">
        {reviews.map((review) => (
          <Link
            key={review.id}
            to={`/reviews/${review.id}`}
            className="review-card"
          >
            <div className="review-header">
              <h3>{review.title}</h3>
              <span className="review-rating">{review.rating}/5 ⭐</span>
            </div>
            <p className="review-movie">{review.movie?.title}</p>
            <p className="review-author">
              By {review.user?.username || "Anonymous"}
            </p>
            <p className="review-content">
              {review.content.substring(0, 150)}...
            </p>
            <p className="review-meta">
              {new Date(review.createdAt).toLocaleDateString()} • {review.helpful}{" "}
              found helpful
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}