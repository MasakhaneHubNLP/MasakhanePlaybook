import React from "react";
import Layout from "@theme-original/DocItem/Layout";
import Comments from "@site/src/components/Comments";

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props} />
      <Comments />
    </>
  );
}
