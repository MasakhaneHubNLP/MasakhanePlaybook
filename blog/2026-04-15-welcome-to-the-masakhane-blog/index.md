---
slug: welcome-to-the-masakhane-blog
title: "Welcome to the Masakhane Blog"
authors: [masakhane]
tags: [announcement, playbook]
image: /img/blog/sample-post.svg
---

This is the first post on the new Masakhane blog. We'll use this space to share community updates, calls for contribution, project milestones, and stories from teams building NLP for African languages.

<!-- truncate -->

## What you can expect here

- **Calls for contribution** — chapters, datasets, annotations, reviewers.
- **Release notes** — when new versions of the Playbook ship.
- **Community spotlights** — research, tools, and projects from across the Masakhane network.
- **Tutorials & how-tos** — short, practical pieces that complement the Playbook.

## Subscribe

The blog publishes an RSS feed at [`/blog/rss.xml`](/blog/rss.xml) and an Atom feed at [`/blog/atom.xml`](/blog/atom.xml). Drop either into your feed reader to follow along.

## How to write a post

Posts live in the `blog/` folder of the [MasakhanePlaybook repo](https://github.com/MasakhaneHubNLP/MasakhanePlaybook). Each post is a markdown file (or a folder containing `index.md` if you have images). The frontmatter looks like this:

```yaml
---
slug: your-post-slug
title: "Your post title"
authors: [masakhane]
tags: [announcement]
image: /img/blog/your-thumbnail.png
---
```

Add a `<!-- truncate -->` marker after the intro paragraph so the blog index shows only that intro on the card.

That's it — open a PR, and we'll publish it.
