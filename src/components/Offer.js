import React from "react";
import "./Offer.css";

const Offer = ({ offer, link }) => {
  return (
    <div className="offer">
      {link && <a href={link}>{offer.name}</a>}
      <p>{offer.description}</p>
      {offer.imageUrl && (
        <img src={offer.imageUrl} alt={offer.name} className="offer-image" />
      )}
    </div>
  );
};

export default Offer;
