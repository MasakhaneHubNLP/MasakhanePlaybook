import React, { useEffect, useState } from "react";
import Footer from "@theme-original/DocItem/Footer";
import Link from "@docusaurus/Link";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { EditButton } from "@site/src/components/EditModal";

const WORDS_PER_MINUTE = 220;

function useReadingTime() {
  const [minutes, setMinutes] = useState(null);
  useEffect(() => {
    const article = document.querySelector("article .markdown");
    if (!article) return;
    const text = article.innerText || "";
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 0) {
      setMinutes(Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)));
    }
  }, []);
  return minutes;
}

function sourceToFilePath(source) {
  // source is like "@site/docs/intro.md" → "docs/intro.md"
  if (!source) return null;
  return source.replace(/^@site\//, '');
}

export default function FooterWrapper(props) {
  const minutes = useReadingTime();
  const { metadata } = useDoc();
  const filePath = sourceToFilePath(metadata.source);

  return (
    <>
      <div className="theme-doc-meta-row">
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
        {minutes !== null && (
          <span
            className="theme-doc-reading-time"
            aria-label={`Estimated reading time: ${minutes} minute${minutes === 1 ? "" : "s"}`}
          >
            <svg
              fill="currentColor"
              height="14"
              width="14"
              viewBox="0 0 16 16"
              aria-hidden="true"
              style={{ marginRight: "0.35em", verticalAlign: "-2px" }}
            >
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
            </svg>
            {minutes} min read
          </span>
        )}
        {filePath && (
          <EditButton
            mode="markdown"
            filePath={filePath}
            pageTitle={metadata.title}
            label="Suggest Edit"
          />
        )}
      </div>
      <Footer {...props} />
    </>
  );
}
