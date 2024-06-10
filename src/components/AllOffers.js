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

  return (
    <div className="all-offers">
      <h2>All Offers</h2>
      {offers.length > 0 ? (
        offers.map((offer) => <Offer key={offer.id} offer={offer} />)
      ) : (
        <p>No offers found.</p>
      )}
    </div>
  );
};

export default AllOffers;
