import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useColorMode } from "@docusaurus/theme-common";
import Giscus from "@giscus/react";

// To activate Giscus:
// 1. Enable Discussions on the repo (Settings → General → Features → Discussions)
// 2. Install the giscus app: https://github.com/apps/giscus
// 3. Visit https://giscus.app and pick "MasakhaneHubNLP/MasakhanePlaybook"
// 4. Copy the data-repo-id and data-category-id from the generated snippet
// 5. Paste them below in REPO_ID and CATEGORY_ID
const REPO = "MasakhaneHubNLP/MasakhanePlaybook";
const REPO_ID = "REPLACE_WITH_REPO_ID";
const CATEGORY = "General";
const CATEGORY_ID = "REPLACE_WITH_CATEGORY_ID";

function CommentsImpl() {
  const { colorMode } = useColorMode();
  return (
    <Giscus
      repo={REPO}
      repoId={REPO_ID}
      category={CATEGORY}
      categoryId={CATEGORY_ID}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={colorMode === "dark" ? "dark" : "light"}
      lang="en"
      loading="lazy"
    />
  );
}

export default function Comments() {
  if (REPO_ID === "REPLACE_WITH_REPO_ID") {
    return null;
  }
  return (
    <div style={{ marginTop: "3rem", paddingTop: "2rem" }}>
      <BrowserOnly fallback={<div>Loading comments…</div>}>
        {() => <CommentsImpl />}
      </BrowserOnly>
    </div>
  );
}
