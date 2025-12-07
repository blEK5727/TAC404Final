import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MovieForm.css";

export default function AddMovie() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    year: "",
    genre: "",
    posterUrl: "",
    synopsis: "",
    duration: "",
    rating: "G",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    document.title = "Add Movie - Movie Reviews";
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (value.length < 2) return "Title must be at least 2 characters";
        return "";

      case "director":
        if (!value.trim()) return "Director is required";
        return "";

      case "year":
        const yearNum = parseInt(value);
        if (!value) return "Year is required";
        if (yearNum < 1888 || yearNum > new Date().getFullYear() + 2)
          return "Please enter a valid year";
        return "";

      case "genre":
        if (!value) return "Genre is required";
        return "";

      case "posterUrl":
        if (!value.trim()) return "Poster URL is required";
        try {
          new URL(value);
          return "";
        } catch {
          return "Please enter a valid URL";
        }

      case "synopsis":
        if (!value.trim()) return "Synopsis is required";
        if (value.length < 20)
          return "Synopsis must be at least 20 characters";
        if (value.length > 500) return "Synopsis must be less than 500 characters";
        return "";

      case "duration":
        const durationNum = parseInt(value);
        if (!value) return "Duration is required";
        if (durationNum < 1 || durationNum > 500)
          return "Duration must be between 1 and 500 minutes";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix all errors before submitting");
      return;
    }

    const movieData = {
      ...formData,
      year: parseInt(formData.year),
      duration: parseInt(formData.duration),
    };

    fetch("http://localhost:3001/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movieData),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Movie added successfully!");
        navigate(`/movies/${data.id}`);
      })
      .catch(() => {
        toast.error("Failed to add movie");
      });
  };

  const isFormValid =
    Object.keys(formData).every(
      (key) => !validateField(key, formData[key])
    ) && agreedToTerms;

  return (
    <div className="movie-form-page">
      <h1>Add New Movie</h1>
      <form onSubmit={handleSubmit} className="movie-form" noValidate>
        <div className="form-group">
          <label htmlFor="title">
            Movie Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.title && touched.title ? "error" : ""}
          />
          {errors.title && touched.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="director">
            Director <span className="required">*</span>
          </label>
          <input
            type="text"
            id="director"
            name="director"
            value={formData.director}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.director && touched.director ? "error" : ""}
          />
          {errors.director && touched.director && (
            <span className="error-message">{errors.director}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">
              Year <span className="required">*</span>
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.year && touched.year ? "error" : ""}
            />
            {errors.year && touched.year && (
              <span className="error-message">{errors.year}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="duration">
              Duration (minutes) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.duration && touched.duration ? "error" : ""}
            />
            {errors.duration && touched.duration && (
              <span className="error-message">{errors.duration}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="genre">
            Genre <span className="required">*</span>
          </label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.genre && touched.genre ? "error" : ""}
          >
            <option value="">Select a genre</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Romance">Romance</option>
            <option value="Thriller">Thriller</option>
            <option value="Crime">Crime</option>
            <option value="Animation">Animation</option>
          </select>
          {errors.genre && touched.genre && (
            <span className="error-message">{errors.genre}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            Rating <span className="required">*</span>
          </label>
          <div className="radio-group">
            {["G", "PG", "PG-13", "R", "NC-17"].map((ratingOption) => (
              <label key={ratingOption} className="radio-label">
                <input
                  type="radio"
                  name="rating"
                  value={ratingOption}
                  checked={formData.rating === ratingOption}
                  onChange={handleChange}
                />
                {ratingOption}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="posterUrl">
            Poster URL <span className="required">*</span>
          </label>
          <input
            type="url"
            id="posterUrl"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://example.com/poster.jpg"
            className={errors.posterUrl && touched.posterUrl ? "error" : ""}
          />
          {errors.posterUrl && touched.posterUrl && (
            <span className="error-message">{errors.posterUrl}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="synopsis">
            Synopsis <span className="required">*</span>
          </label>
          <textarea
            id="synopsis"
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="5"
            className={errors.synopsis && touched.synopsis ? "error" : ""}
          />
          <div className="character-count">
            {formData.synopsis.length}/500 characters
          </div>
          {errors.synopsis && touched.synopsis && (
            <span className="error-message">{errors.synopsis}</span>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            I agree that the information provided is accurate and I have the
            right to add this content
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/movies")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isFormValid}
          >
            Add Movie
          </button>
        </div>
      </form>
    </div>
  );
}