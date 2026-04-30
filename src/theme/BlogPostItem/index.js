import React from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function BlogPostItemWrapper(props) {
  const { metadata, frontMatter, isBlogPostPage } = useBlogPost();
  const rawImage = frontMatter.image;
  const resolvedImage = useBaseUrl(rawImage || "");

  if (isBlogPostPage) {
    return <BlogPostItem {...props} />;
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
