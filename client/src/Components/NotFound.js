import React from "react";
import { Link } from "react-router-dom";
import PageNotFound from "../assets/images/PageNotFound/PageNotFound.jpg";
const NotFound = () => (
  <div>
    <img
      src={PageNotFound}
      style={{
        width: 950,
        height: 600,
        display: "block",
        margin: "auto",
        position: "relative"
      }}
    />
    <center>
      <Link to="/employee">Return to Home Page</Link>
    </center>
  </div>
);
export default NotFound;
