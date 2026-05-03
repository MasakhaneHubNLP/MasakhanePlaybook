import React from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import Link from "@docusaurus/Link";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { EditButton } from "@site/src/components/EditModal";

function sourceToFilePath(source) {
  if (!source) return null;
  return source.replace(/^@site\//, "");
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostItemWrapper(props) {
  const { metadata, frontMatter, isBlogPostPage } = useBlogPost();
  const { withBaseUrl } = useBaseUrlUtils();

  // Full post page: render the original BlogPostItem + add a "Suggest Edit"
  // button at the bottom (mirrors the doc-page pattern).
  if (isBlogPostPage) {
    const filePath = sourceToFilePath(metadata.source);
    return (
      <>
        <BlogPostItem {...props} />
        {filePath && (
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--ifm-color-emphasis-200)",
            }}
          >
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

  // Blog INDEX card — fully custom (Label Studio pattern):
  //   Thumbnail
  //   Tag
  //   Title
  //   Description (from frontmatter — short, controlled tagline)
  //   Author avatar + name + date
  const resolveSrc = (src) => {
    if (!src) return null;
    return /^https?:\/\//.test(src) ? src : withBaseUrl(src);
  };

  const imageSrc = resolveSrc(frontMatter.image);
  const tag = metadata.tags?.[0]?.label;
  const description = metadata.description;
  const author = metadata.authors?.[0];
  const authorImg = author && resolveSrc(author.imageURL);
  const dateStr = formatDate(metadata.date);

  return (
    <article className="blog-card">
      {imageSrc && (
        <Link to={metadata.permalink} className="blog-card-thumbnail">
          <img
            src={imageSrc}
            alt={metadata.title}
            loading="lazy"
            decoding="async"
          />
        </Link>
      )}
      <div className="blog-card-body">
        {tag && <span className="blog-card-tag">{tag}</span>}
        <h2 className="blog-card-title">
          <Link to={metadata.permalink}>{metadata.title}</Link>
        </h2>
        {description && (
          <p className="blog-card-description">{description}</p>
        )}
        <footer className="blog-card-author">
          {authorImg && (
            <img
              src={authorImg}
              alt=""
              className="blog-card-avatar"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="blog-card-author-meta">
            {author?.name && (
              <span className="blog-card-author-name">{author.name}</span>
            )}
            <span className="blog-card-date">{dateStr}</span>
          </div>
        </footer>
      </div>
    </article>
  );
}
