import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Offer from "./Offer";
import "./AllOffers.css";

const vendorTypes = [
  "VENUES",
  "PHOTOGRAPHY",
  "DJS",
  "HAIR_AND_MAKEUP",
  "CATERING",
  "FLOWERS",
  "VIDEOGRAPHY",
];

const AllOffers = () => {
  const { auth } = useAuth();
  const [offers, setOffers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendorType, setSelectedVendorType] = useState("");
  const [priceSortOrder, setPriceSortOrder] = useState(""); // State for price sorting order
  const [reviewSortOrder, setReviewSortOrder] = useState(""); // State for review sorting order
  const [ratingSortOrder, setRatingSortOrder] = useState(""); // State for overall rating sorting order
  const [attendeesSortOrder, setAttendeesSortOrder] = useState(""); // State for max attendees sorting order

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("http://localhost:8080/offers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const offersWithReviews = await Promise.all(
            data.offers.map(async (offer) => {
              const reviewsResponse = await fetch(
                `http://localhost:8080/offers/${offer.id}/reviews`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth}`,
                  },
                }
              );
              if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                const reviewCount = reviewsData.length;
                const overallRating =
                  reviewCount > 0
                    ? reviewsData.reduce(
                        (sum, review) => sum + review.rating,
                        0
                      ) / reviewCount
                    : 0;
                return { ...offer, reviewCount, overallRating };
              }
              return { ...offer, reviewCount: 0, overallRating: 0 };
            })
          );
          setOffers(offersWithReviews);
          console.log("Offers fetched successfully", offersWithReviews);
        } else {
          console.error("Failed to fetch offers");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:8080/vendors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVendors(data.vendors);
          console.log("Vendors fetched successfully", data.vendors);
        } else {
          console.error("Failed to fetch vendors");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (auth) {
      fetchOffers();
      fetchVendors();
    }
  }, [auth]);

  const handleRequest = async (offerId) => {
    try {
      const response = await fetch(
        "http://localhost:8080/clients/me/offerRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({ offerId }),
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

  const handleFilterChange = (e) => {
    setSelectedVendorType(e.target.value);
  };

  const handlePriceSortChange = (e) => {
    setPriceSortOrder(e.target.value);
  };

  const handleReviewSortChange = (e) => {
    setReviewSortOrder(e.target.value);
  };

  const handleRatingSortChange = (e) => {
    setRatingSortOrder(e.target.value);
  };

  const handleAttendeesSortChange = (e) => {
    setAttendeesSortOrder(e.target.value);
  };

  const getVendorType = (vendorId) => {
    const vendor = vendors.find((vendor) => vendor.id === vendorId);
    return vendor ? vendor.vendorType : "";
  };

  const filteredOffers = selectedVendorType
    ? offers.filter(
        (offer) => getVendorType(offer.vendorId) === selectedVendorType
      )
    : offers;

  const sortedOffers = [...filteredOffers]
    .sort((a, b) => {
      if (priceSortOrder === "price-asc") {
        return a.price - b.price;
      } else if (priceSortOrder === "price-desc") {
        return b.price - a.price;
      }
      return 0; // Default case
    })
    .sort((a, b) => {
      if (reviewSortOrder === "reviews-asc") {
        return a.reviewCount - b.reviewCount;
      } else if (reviewSortOrder === "reviews-desc") {
        return b.reviewCount - a.reviewCount;
      }
      return 0; // Default case
    })
    .sort((a, b) => {
      if (ratingSortOrder === "rating-asc") {
        return a.overallRating - b.overallRating;
      } else if (ratingSortOrder === "rating-desc") {
        return b.overallRating - a.overallRating;
      }
      return 0; // Default case
    })
    .sort((a, b) => {
      if (attendeesSortOrder === "attendees-asc") {
        return a.maxAttendees - b.maxAttendees;
      } else if (attendeesSortOrder === "attendees-desc") {
        return b.maxAttendees - a.maxAttendees;
      }
      return 0; // Default case
    });

  return (
    <div className="all-offers">
      <h2>All Offers</h2>
      <div className="filter">
        <label htmlFor="vendorType">Filter by Vendor Type: </label>
        <select
          id="vendorType"
          value={selectedVendorType}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          {vendorTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <label htmlFor="priceSortOrder">Sort by Price: </label>
        <select
          id="priceSortOrder"
          value={priceSortOrder}
          onChange={handlePriceSortChange}
        >
          <option value="">None</option>
          <option value="price-asc">Ascending</option>
          <option value="price-desc">Descending</option>
        </select>
        <label htmlFor="reviewSortOrder">Sort by Number of Reviews: </label>
        <select
          id="reviewSortOrder"
          value={reviewSortOrder}
          onChange={handleReviewSortChange}
        >
          <option value="">None</option>
          <option value="reviews-asc">Ascending</option>
          <option value="reviews-desc">Descending</option>
        </select>
        <label htmlFor="ratingSortOrder">Sort by Overall Rating: </label>
        <select
          id="ratingSortOrder"
          value={ratingSortOrder}
          onChange={handleRatingSortChange}
        >
          <option value="">None</option>
          <option value="rating-asc">Ascending</option>
          <option value="rating-desc">Descending</option>
        </select>
        {selectedVendorType === "VENUES" && (
          <div>
            <label htmlFor="attendeesSortOrder">Sort by Max Attendees: </label>
            <select
              id="attendeesSortOrder"
              value={attendeesSortOrder}
              onChange={handleAttendeesSortChange}
            >
              <option value="">None</option>
              <option value="attendees-asc">Ascending</option>
              <option value="attendees-desc">Descending</option>
            </select>
          </div>
        )}
      </div>
      {sortedOffers.length > 0 ? (
        sortedOffers.map((offer) => (
          <div key={offer.id} className="offer-container">
            <Link to={`/offers/${offer.id}`} className="offer-link">
              {offer.name}
            </Link>
            <Offer offer={offer} />
          </div>
        ))
      ) : (
        <p>No offers found.</p>
      )}
    </div>
  );
};

export default AllOffers;
