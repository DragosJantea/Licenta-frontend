import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [proximitySortOrder, setProximitySortOrder] = useState(""); // State for proximity sorting order
  const [location, setLocation] = useState(""); // State for location input
  const [userCoordinates, setUserCoordinates] = useState(null); // State for user coordinates

  const locationHook = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    setSelectedVendorType(params.get("vendorType") || "");
    setPriceSortOrder(params.get("priceSortOrder") || "");
    setReviewSortOrder(params.get("reviewSortOrder") || "");
    setRatingSortOrder(params.get("ratingSortOrder") || "");
    setAttendeesSortOrder(params.get("attendeesSortOrder") || "");
    setProximitySortOrder(params.get("proximitySortOrder") || "");
    setLocation(params.get("location") || "");
  }, [locationHook.search]);

  const updateQueryParams = (params) => {
    const queryParams = new URLSearchParams(locationHook.search);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        queryParams.set(key, params[key]);
      } else {
        queryParams.delete(key);
      }
    });
    navigate({ search: queryParams.toString() });
  };

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
    updateQueryParams({ vendorType: e.target.value });
  };

  const handlePriceSortChange = (e) => {
    setPriceSortOrder(e.target.value);
    updateQueryParams({ priceSortOrder: e.target.value });
  };

  const handleReviewSortChange = (e) => {
    setReviewSortOrder(e.target.value);
    updateQueryParams({ reviewSortOrder: e.target.value });
  };

  const handleRatingSortChange = (e) => {
    setRatingSortOrder(e.target.value);
    updateQueryParams({ ratingSortOrder: e.target.value });
  };

  const handleAttendeesSortChange = (e) => {
    setAttendeesSortOrder(e.target.value);
    updateQueryParams({ attendeesSortOrder: e.target.value });
  };

  const handleProximitySortChange = (e) => {
    setProximitySortOrder(e.target.value);
    updateQueryParams({ proximitySortOrder: e.target.value });
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleLocationSubmit = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=AIzaSyC4mEb02DszcVnKttfu5YfBijoNxBmH4Zk`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setUserCoordinates({ lat, lng });
        updateQueryParams({ location });
      } else {
        throw new Error("Location not found");
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
    }
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

  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;

    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

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
    })
    .sort((a, b) => {
      if (proximitySortOrder && userCoordinates) {
        const distanceA = haversineDistance(userCoordinates, {
          lat: a.lat,
          lng: a.lng,
        });
        const distanceB = haversineDistance(userCoordinates, {
          lat: b.lat,
          lng: b.lng,
        });
        if (proximitySortOrder === "proximity-asc") {
          return distanceA - distanceB;
        } else if (proximitySortOrder === "proximity-desc") {
          return distanceB - distanceA;
        }
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
        <label htmlFor="location">Enter Location: </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter address"
        />
        <button onClick={handleLocationSubmit}>Geocode Location</button>
        <label htmlFor="proximitySortOrder">Sort by Proximity: </label>
        <select
          id="proximitySortOrder"
          value={proximitySortOrder}
          onChange={handleProximitySortChange}
        >
          <option value="">None</option>
          <option value="proximity-asc">Ascending</option>
          <option value="proximity-desc">Descending</option>
        </select>
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
