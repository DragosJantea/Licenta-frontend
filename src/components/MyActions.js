import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MyActions.css";

const MyActions = () => {
  const { auth } = useAuth();
  const [offerRequests, setOfferRequests] = useState([]);

  useEffect(() => {
    const fetchOfferRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/clients/me/offerRequest",
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
          setOfferRequests(data.offerRequests);
        } else {
          console.error("Failed to fetch offer requests");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (auth) {
      fetchOfferRequests();
    }
  }, [auth]);

  return (
    <div className="my-actions">
      <h2>My Offer Requests</h2>
      {offerRequests.length > 0 ? (
        <ul>
          {offerRequests.map((request) => (
            <li key={request.offerRequestId}>
              <div>Offer Request ID: {request.offerRequestId}</div>
              <div>Date: {request.offerRequestDate}</div>
              <div>Status: {request.offerRequestStatus}</div>
              <div>Offer ID: {request.offerId}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No offer requests found.</p>
      )}
    </div>
  );
};

export default MyActions;
