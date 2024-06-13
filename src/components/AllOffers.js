import React, { useState, useEffect } from "react";
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
          console.log("Offers fetched successfully", data.offers);
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

  const getVendorType = (vendorId) => {
    const vendor = vendors.find((vendor) => vendor.id === vendorId);
    return vendor ? vendor.vendorType : "";
  };

  const filteredOffers = selectedVendorType
    ? offers.filter(
        (offer) => getVendorType(offer.vendorId) === selectedVendorType
      )
    : offers;

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
      </div>
      {filteredOffers.length > 0 ? (
        filteredOffers.map((offer) => (
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
