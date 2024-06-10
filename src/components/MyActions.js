import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MyActions.css";

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
            item.offerRequestId === data.offerRequestId ? data : item
          )
        );
      } else {
        console.error(`Failed to ${status.toLowerCase()} offer request`);
      }
    } catch (error) {
      console.error("Error:", error);
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
