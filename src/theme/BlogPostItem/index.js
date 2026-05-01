import React from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { EditButton } from "@site/src/components/EditModal";

function sourceToFilePath(source) {
  if (!source) return null;
  return source.replace(/^@site\//, '');
}

export default function BlogPostItemWrapper(props) {
  const { metadata, frontMatter, isBlogPostPage } = useBlogPost();
  const rawImage = frontMatter.image;
  const resolvedImage = useBaseUrl(rawImage || "");

  if (isBlogPostPage) {
    const filePath = sourceToFilePath(metadata.source);
    return (
      <>
        <BlogPostItem {...props} />
        {filePath && (
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--ifm-color-emphasis-200)" }}>
            <EditButton
              mode="markdown"
              filePath={filePath}
              pageTitle={metadata.title}
              label="Suggest Edit"
            />
          </div>
        )}
      </>
    );
  }

  const isAbsolute = rawImage && /^https?:\/\//.test(rawImage);
  const imageSrc = isAbsolute ? rawImage : resolvedImage;

  return (
    <div className="blog-card">
      {rawImage && (
        <Link to={metadata.permalink} className="blog-card-thumbnail">
          <img src={imageSrc} alt={metadata.title} loading="lazy" />
        </Link>
      )}
      <div className="blog-card-body">
        <BlogPostItem {...props} />
      </div>
    </div>
  );
}
