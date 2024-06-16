import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Offer from "./Offer";
import "./MyOffers.css";

const MyOffers = () => {
  const { auth } = useAuth();
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchMyOffers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/vendors/me/offers",
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
          setOffers(data.offers);
          console.log("My offers fetched successfully", data.offers);
        } else {
          console.error("Failed to fetch my offers");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (auth) {
      fetchMyOffers();
    }
  }, [auth]);

  return (
    <div className="my-offers">
      <h2>My Offers</h2>
      {offers.length > 0 ? (
        offers.map((offer) => (
          <div key={offer.id} className="offer-container">
            <Offer offer={offer} link={`/offers/${offer.id}`} />
          </div>
        ))
      ) : (
        <p>No offers found.</p>
      )}
    </div>
  );
};

export default MyOffers;
