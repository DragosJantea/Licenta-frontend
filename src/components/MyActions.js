import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import "./MyActions.css";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51PQ5nkRq2yhibxgbjakjuwi9PXHiIturHNtSrRn1EM0D014KBB62MmanQagvhzCeRqMt8iH3qR7DIFxqM5s9KCGq008KnvnFAa"
);

const MyActions = () => {
  const { auth, role } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (role === "client") {
          response = await fetch(
            "http://localhost:8080/clients/me/offerRequest",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`,
              },
            }
          );
        } else if (role === "vendor") {
          response = await fetch("http://localhost:8080/vendors/me/offers", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
          });
        }

        if (response.ok) {
          const data = await response.json();
          setData(data.offerRequests || data.offers);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (auth) {
      fetchData();
    }
  }, [auth, role]);

  const fetchOfferRequests = async (offerId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/offers/${offerId}/offerRequests`,
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
        return data.offerRequest;
      } else {
        console.error("Failed to fetch offer requests");
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  const handleRequestAction = async (offerRequestId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/vendors/me/offerRequests/${offerRequestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`Offer request ${status.toLowerCase()} successfully`, data);

        setData((prevData) =>
          prevData.map((item) =>
            item.offerRequestId === data.offerRequestId
              ? { ...item, offerRequestStatus: status }
              : item
          )
        );
      } else {
        console.error(`Failed to ${status.toLowerCase()} offer request`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMakePayment = async (offerRequestId) => {
    // Simulate a request to create a payment session (replace with your backend call if needed)
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: "price_1PQ6KxRq2yhibxgbx2vJKVag",
          quantity: 1,
        },
      ],
      mode: "payment",
      successUrl: window.location.origin,
      cancelUrl: window.location.origin,
    });

    if (error) {
      console.error("Stripe error:", error);
    }
  };

  return (
    <div className="my-actions">
      <h2>My Actions</h2>
      {role === "client" ? (
        data.length > 0 ? (
          <ul>
            {data.map((request) => (
              <li key={request.offerRequestId}>
                <div>Offer Request ID: {request.offerRequestId}</div>
                <div>Date: {request.offerRequestDate}</div>
                <div>Status: {request.offerRequestStatus}</div>
                <div>Offer ID: {request.offerId}</div>
                {request.offerRequestStatus === "ACCEPTED" && (
                  <button
                    className="make-payment-button"
                    onClick={() => handleMakePayment(request.offerRequestId)}
                  >
                    Make Payment
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No offer requests found.</p>
        )
      ) : data.length > 0 ? (
        data.map((offer) => (
          <div key={offer.id} className="offer-container">
            <h3>{offer.name}</h3>
            <p>{offer.description}</p>
            <h4>Schedules:</h4>
            <ul>
              {offer.schedules.map((schedule, index) => (
                <li key={index}>
                  <strong>{schedule.name}:</strong> {schedule.startDate} to{" "}
                  {schedule.endDate}, {schedule.weekDay}, {schedule.startTime}{" "}
                  to {schedule.endTime}
                </li>
              ))}
            </ul>
            <h4>Offer Requests:</h4>
            <OfferRequests
              offerId={offer.id}
              fetchOfferRequests={fetchOfferRequests}
              handleRequestAction={handleRequestAction}
            />
          </div>
        ))
      ) : (
        <p>No offers found.</p>
      )}
    </div>
  );
};

const OfferRequests = ({
  offerId,
  fetchOfferRequests,
  handleRequestAction,
}) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const getOfferRequests = async () => {
      const fetchedRequests = await fetchOfferRequests(offerId);
      setRequests(fetchedRequests);
    };

    getOfferRequests();
  }, [offerId, fetchOfferRequests]);

  return (
    <ul>
      {requests.map((request) => (
        <li key={request.offerRequestId}>
          <div>Offer Request ID: {request.offerRequestId}</div>
          <div>Date: {request.offerRequestDate}</div>
          <div>Status: {request.offerRequestStatus}</div>
          <div>Client ID: {request.clientId}</div>
          <button
            className="approve-button"
            onClick={() =>
              handleRequestAction(request.offerRequestId, "ACCEPTED")
            }
          >
            Approve
          </button>
          <button
            className="deny-button"
            onClick={() =>
              handleRequestAction(request.offerRequestId, "REJECTED")
            }
          >
            Deny
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MyActions;
