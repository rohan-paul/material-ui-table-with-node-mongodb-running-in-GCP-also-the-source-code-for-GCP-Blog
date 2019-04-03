import React, { Component } from "react";
import Welcome from "react-welcome-page";

// A functional component only for the landing page
// The height & width has no effect though (I included for testing)
const LandingPage = () => ({
  render() {
    return (
      <div>
        <Welcome
          loopDuration={2100}
          data={[
            {
              backgroundColor: "rgb(73, 49, 91)",
              width: "400px",
              height: "400px",
              textColor: "#EE79EA",
              imageAnimation: "flipInX",
              image: require("../assets/images/LandingPage/code-4.jpeg")
            },
            {
              backgroundColor: "rgb(252, 187, 19)",
              width: "400px",
              height: "400px",
              textColor: "#754600",
              text: "My App",
              imageAnimation: "slideInUp",
              textAnimation: "slideInLeft",
              image: require("../assets/images/LandingPage/code-1.jpeg")
            },
            {
              backgroundColor: "rgb(156, 196, 76)",
              width: "400px",
              height: "400px",
              textColor: "#344115",
              text: "Keep Coding",
              image: require("../assets/images/LandingPage/code-2.jpeg")
            },
            {
              backgroundColor: "rgb(4, 116, 188)",
              width: "400px",
              height: "400px",
              textColor: "#FFFFFF",
              text: "Code all the way",
              textAnimation: "fadeInUp",
              image: require("../assets/images/LandingPage/code-3.jpeg")
            }
          ]}
        />
      </div>
    );
  }
});

export default LandingPage;
