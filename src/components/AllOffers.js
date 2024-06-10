import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Offer from "./Offer";
import "./AllOffers.css";

const AllOffers = () => {
  const { auth } = useAuth();
  const [offers, setOffers] = useState([]);

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
          setOffers(data.offers);
        } else {
          console.error("Failed to fetch offers");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (auth) {
      fetchOffers();
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

  return (
    <div className="all-offers">
      <h2>All Offers</h2>
      {offers.length > 0 ? (
        offers.map((offer) => (
          <div key={offer.id} className="offer-container">
            <Offer offer={offer} />
            <button
              className="request-button"
              onClick={() => handleRequest(offer.id)}
            >
              Request
            </button>
          </div>
        ))
      ) : (
        <p>No offers found.</p>
      )}
    </div>
  );
};

export default AllOffers;
