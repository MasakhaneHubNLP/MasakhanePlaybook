import React from "react";
import Footer from "@theme-original/DocItem/Footer";
import Link from "@docusaurus/Link";

export default function FooterWrapper(props) {
  return (
    <>
      <div className="theme-doc-cite-this-page">
        <Link to="/cite" className="theme-doc-cite-this-page__link">
          <svg
            fill="currentColor"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            style={{ marginRight: "0.4em", verticalAlign: "-2px" }}
          >
            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
          </svg>
          Cite this page
        </Link>
      </div>
      <Footer {...props} />
    </>
  );
}
