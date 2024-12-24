import React, { useState } from "react";

const GetJwtToken = () => {

  const [jwtToken, setJwtToken] = useState("");
  const [error, setError] = useState(null);

  const fetchJwtToken = async () => {
    const apiUrl = process.env.REACT_APP_OPN_SERVICE_RENDER_URL;

    try {
        console.log(apiUrl);
      const response = await fetch( apiUrl + "usr/login");
      console.log(response.body);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text(); 
        setJwtToken(data);
        setError(null);
    } catch (err) {
        setError(err.message);
        setJwtToken("");
    }
  };
  
  

  return (
    <div>
      <h1>Get JWT Token</h1>
      <button onClick={fetchJwtToken}>Fetch Token</button>
      {jwtToken && (
        <div>
          <h2>JWT Token:</h2>
          <p>{jwtToken}</p>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default GetJwtToken;
