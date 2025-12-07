import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./ReviewDetail.css";

export default function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    commenterName: "",
    commentBody: "",
  });
  const [commentErrors, setCommentErrors] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3001/reviews/${id}?_expand=movie&_expand=user`)
      .then((res) => res.json())
      .then((data) => {
        setReview(data);
        document.title = `${data.title} - Review Details`;
      });

    fetchComments();
  }, [id]);

  const fetchComments = () => {
    fetch(`http://localhost:3001/comments?reviewId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedComments = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setComments(sortedComments);
      });
  };

  const handleMarkHelpful = () => {
    const updatedReview = { ...review, helpful: review.helpful + 1 };
    fetch(`http://localhost:3001/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helpful: updatedReview.helpful }),
    })
      .then((res) => res.json())
      .then((data) => {
        setReview({ ...review, helpful: data.helpful });
        toast.success("Marked as helpful!");
      });
  };

  const validateComment = () => {
    const errors = {};
    if (!newComment.commenterName.trim()) {
      errors.commenterName = "Name is required";
    }
    if (!newComment.commentBody.trim()) {
      errors.commentBody = "Comment is required";
    } else if (newComment.commentBody.length < 5) {
      errors.commentBody = "Comment must be at least 5 characters";
    }
    return errors;
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const errors = validateComment();
    setCommentErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all errors");
      return;
    }

    const commentData = {
      reviewId: parseInt(id),
      commenterName: newComment.commenterName,
      commentBody: newComment.commentBody,
      timestamp: new Date().toISOString(),
    };

    fetch("http://localhost:3001/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Comment added!");
        setNewComment({ commenterName: "", commentBody: "" });
        setCommentErrors({});
        fetchComments();
      });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      fetch(`http://localhost:3001/comments/${commentId}`, {
        method: "DELETE",
      }).then(() => {
        toast.success("Comment deleted!");
        fetchComments();
      });
    }
  };

  if (!review) return <div>Loading...</div>;

  return (
    <div className="review-detail">
      <div className="review-content">
        <Link to={`/movies/${review.movie?.id}`} className="back-link">
          ← Back to {review.movie?.title}
        </Link>

        <div className="review-header">
          <h1>{review.title}</h1>
          <div className="review-rating-large">{review.rating}/5 ⭐</div>
        </div>

        <div className="review-meta">
          <span>By {review.user?.username || "Anonymous"}</span>
          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="review-body">
          <p>{review.content}</p>
        </div>

        <div className="review-actions">
          <button onClick={handleMarkHelpful} className="btn btn-secondary">
            👍 Helpful ({review.helpful})
          </button>
        </div>
      </div>

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <h3>Add a Comment</h3>
          <div className="form-group">
            <label htmlFor="commenterName">Your Name</label>
            <input
              type="text"
              id="commenterName"
              value={newComment.commenterName}
              onChange={(e) =>
                setNewComment({ ...newComment, commenterName: e.target.value })
              }
              className={commentErrors.commenterName ? "error" : ""}
            />
            {commentErrors.commenterName && (
              <span className="error-message">
                {commentErrors.commenterName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="commentBody">Your Comment</label>
            <textarea
              id="commentBody"
              value={newComment.commentBody}
              onChange={(e) =>
                setNewComment({ ...newComment, commentBody: e.target.value })
              }
              rows="4"
              className={commentErrors.commentBody ? "error" : ""}
            />
            {commentErrors.commentBody && (
              <span className="error-message">{commentErrors.commentBody}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.commenterName}</strong>
                  <span className="comment-time">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="comment-body">{comment.commentBody}</p>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="btn-delete-comment"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}