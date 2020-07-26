import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";

function PageFooter() {
  return (
    <div className="contact-message mt-5">
      <p>
        The information on this website is updated as soon as new data is
        published by NSW Health which is usually once a day. The last update was
        at {lastUpdate}. For feedback on the website or to suggest a feature
        please contact{" "}
        <a href="mailto:covid19nsw.stat@gmail.com">covid19nsw.stat@gmail.com</a>
      </p>
    </div>
  );
}

export { PageFooter };
