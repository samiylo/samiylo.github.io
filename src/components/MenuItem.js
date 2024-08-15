import { Link } from 'react-router-dom';
import React from "react";

function MenuItem({ image, name, price }) {
  return (
    <Link to={`/product/${name}`}>
    <div className="menuItem">
      <div style={{ backgroundImage: `url(${image})` }}> </div>
      <h1> {name} </h1>
      <p> ${price} </p>
    </div>
    </Link>
  );
}

export default MenuItem;
