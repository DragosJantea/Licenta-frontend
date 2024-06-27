import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Map from "./Map";
import "./OfferDetails.css";

const OfferDetails = () => {
  const { auth, role } = useAuth();
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [requestedDate, setRequestedDate] = useState(""); // Add state for requestedDate

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`http://localhost:8080/offers/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOffer(data);
          console.log("Offer fetched successfully", data);
        } else {
          console.error("Failed to fetch offer");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (auth && id) {
      fetchOffer();
    }
  }, [auth, id]);

  useEffect(() => {
    if (offer) {
      fetchReviews();
    }
  }, [offer]);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalRating / reviews.length;
      setOverallRating(avgRating.toFixed(2));
    } else {
      setOverallRating(null);
    }
  }, [reviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/clients/me/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: JSON.stringify({
          offerId: id,
          content: reviewContent,
          rating: reviewRating,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Review submitted successfully", data);
        setReviewContent("");
        setReviewRating(5);
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews after submitting a new review
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/offers/${id}/reviews`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        console.log("Reviews fetched successfully", data);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleReviews = () => {
    setShowReviews(!showReviews);
    if (!showReviews) {
      fetchReviews();
    }
  };

  const handleRequest = async () => {
    console.log(requestedDate);
    const [year, month, day] = requestedDate.split(",").map(Number);
    const formattedDate = new Date(year, month - 1, day)
      .toISOString()
      .split("T")[0]; // This will give you '2024-07-05'
    console.log(formattedDate);
    try {
      const response = await fetch(
        "http://localhost:8080/clients/me/offerRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({ offerId: id, requestedDate: formattedDate }), // Include requestedDate
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Offer request created successfully", data);
      } else {
        console.error("Failed to create offer request");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!offer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="offer-details">
      <h2>{offer.name}</h2>
      <p>{offer.description}</p>
      {offer.imageUrl && (
        <img src={offer.imageUrl} alt={offer.name} className="offer-image" />
      )}
      <h3>Location:</h3>
      <Map lat={offer.lat} lng={offer.lng} />
      <h3>Price: ${offer.price}</h3>
      {overallRating !== null && <h3>Overall Rating: {overallRating}</h3>}
      {offer.maxAttendees !== -1 && (
        <h3>Max Attendees: {offer.maxAttendees}</h3>
      )}
      <h3>Available Dates:</h3>
      <select
        value={requestedDate}
        onChange={(e) => setRequestedDate(e.target.value)}
      >
        <option value="">Select a date</option>
        {offer.availableDates.map((date) => (
          <option key={date} value={date}>
            {new Date(date).toISOString().split("T")[0]}
          </option>
        ))}
      </select>
      <div className="button-group">
        {role === "client" && (
          <button className="button" onClick={handleRequest}>
            Request
          </button>
        )}
        {role === "client" && (
          <button
            className="button"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel Review" : "Write a Review"}
          </button>
        )}
        <button className="button" onClick={toggleReviews}>
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </button>
      </div>
      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="review-form">
          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Write your review..."
            required
          ></textarea>
          <select
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
            required
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
          <button type="submit" className="button">
            Submit Review
          </button>
        </form>
      )}
      {showReviews && (
        <div className="reviews-section">
          <h3>Reviews:</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review">
                <p>
                  <strong>Rating:</strong> {review.rating}
                </p>
                <p>{review.content}</p>
                <p>
                  <em>
                    Reviewed on:{" "}
                    {new Date(review.reviewedAt.join("-")).toLocaleDateString()}
                  </em>
                </p>
              </div>
            ))
          ) : (
            <p>No reviews found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OfferDetails;
