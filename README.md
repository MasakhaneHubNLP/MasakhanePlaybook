# Masakhane Playbook

A community-driven, open guide for building, evaluating, and deploying NLP systems for African languages. The Playbook collects practical, reproducible, and culturally grounded guidance for everything from dataset design and annotation through model training, evaluation, deployment, and ethics.

**Live site:** <https://masakhanehubnlp.github.io/MasakhanePlaybook/>

This is a living resource maintained by the [Masakhane](https://www.masakhane.io/) community. We welcome contributions from researchers, practitioners, students, language experts, and translators.

---

## Table of contents

- [What's in the playbook](#whats-in-the-playbook)
- [Ways to contribute](#ways-to-contribute)
- [How to contribute a chapter](#how-to-contribute-a-chapter)
- [How to translate](#how-to-translate)
- [How to write a blog post](#how-to-write-a-blog-post)
- [Local setup](#local-setup)
- [Reporting issues](#reporting-issues)
- [Code of conduct](#code-of-conduct)
- [License](#license)

---

## What's in the playbook

The chapters are organized by phase of the dataset/model lifecycle:

1. **Introduction** — `docs/intro.md`
2. **Data Collection, Curation, and Governance** — `docs/data-collection/`
3. **Annotation Design and Workforce Management** — `docs/annotation-design/`
4. **Data Quality Assurance and Validation** — `docs/data-quality/`
5. **Modality-Specific Task Design** — `docs/modality-specific-task/`
6. **Documentation, Data Release, and Governance** — `docs/documentation/`
7. **LLM-Assisted and Synthetic Data Generation** — `docs/llm-assisted-task/`
8. **Evaluation, Benchmarking, and Data Integrity** — `docs/model-building/`
9. **Dataset Lifecycle Management and Release Checklist** — `docs/dataset-lifecycle/`
10. **Community and Collaboration** — `docs/community-collaboration/`

The site is also available in **6 languages**: English, Hausa, Amharic, Swahili, French, and Portuguese (UI translated; chapter content awaits native-speaker translation).

---

## Ways to contribute

There's no one way to help. Pick whichever matches what you do best:

- **Write a chapter or section** — fill a gap in the playbook (see below)
- **Translate** — adapt an existing chapter into Hausa, Amharic, Swahili, French, or Portuguese
- **Review** — open issues or PRs against existing chapters; correct technical errors, clarify language, suggest references
- **Add a case study** — a short post in the blog about a real-world Masakhane project
- **Open a discussion** — got questions or want to debate an approach? Use [GitHub Discussions](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/discussions)
- **Report bugs / suggest features** — see [Reporting issues](#reporting-issues)

---

## How to contribute a chapter

Step-by-step guide for first-time contributors. Even if you're new to git/GitHub, you can follow this.

### Step 1 — Open an issue first (recommended)

Before you write, **open an issue** describing the chapter you want to add. This avoids two people writing the same thing and lets us help you scope it.

1. Go to <https://github.com/MasakhaneHubNLP/MasakhanePlaybook/issues/new>
2. Title: `Chapter proposal: <your topic>`
3. In the body, briefly describe:
   - What topic the chapter covers
   - Which section it fits into (e.g., "Data Quality")
   - 3–5 bullet outline of subsections
   - Languages you'll write in (English required; others welcome)

We'll respond with feedback or a 👍 to start.

### Step 2 — Fork and clone the repo

If you don't have write access to `MasakhaneHubNLP/MasakhanePlaybook`, fork it first:

1. Open <https://github.com/MasakhaneHubNLP/MasakhanePlaybook> and click **Fork** (top right).
2. Clone your fork to your computer:

   ```bash
   git clone https://github.com/<your-github-username>/MasakhanePlaybook.git
   cd MasakhanePlaybook
   ```

If you're already a maintainer with write access:

```bash
git clone https://github.com/MasakhaneHubNLP/MasakhanePlaybook.git
cd MasakhanePlaybook
```

### Step 3 — Set up the project locally

Requirements:

- Node.js ≥ 20 ([download](https://nodejs.org))
- Yarn 1.x — install with `npm install -g yarn` if you don't have it (do **not** use npm for this project)

Install dependencies and start the dev server:

```bash
yarn install --frozen-lockfile
yarn start
```

Open <http://localhost:3000/MasakhanePlaybook/> — the site reloads automatically as you edit files.

### Step 4 — Create a branch

Don't commit to `main`. Make a branch named after your chapter:

```bash
git checkout -b chapter/your-topic-slug
```

### Step 5 — Add your chapter file

1. Find the section folder under `docs/` that fits your chapter (e.g., `docs/annotation-design/`).
2. Create a new markdown file. Filename should be lowercase with hyphens, e.g., `inter-annotator-agreement.md`.
3. At the top, add **frontmatter** to control the title and ordering in the sidebar:

   ```markdown
   ---
   sidebar_position: 5
   title: Inter-Annotator Agreement
   ---

   # Inter-Annotator Agreement

   Your introduction paragraph...
   ```

4. Write the chapter using regular Markdown. You can also use:
   - **Math**: `$P(y \mid x)$` inline, or `$$ ... $$` for block equations
   - **Code blocks**: triple backticks with language (e.g., ```` ```python ````)
   - **Admonitions**:

     ```markdown
     :::tip
     Native speakers should review the annotation guidelines.
     :::
     ```

     Available types: `note`, `tip`, `info`, `warning`, `danger`, `caution`.
   - **Images**: place files in a sibling `assets/` folder and reference with `![alt](./assets/image.png)`.
   - **Links to other chapters**: `[see Data Quality chapter](../data-quality/inter-annotator-agreement)`.

### Step 6 — Update the sidebar (only if needed)

Most of the time you don't need to touch this. The sidebar is auto-generated from the folder structure.

If your chapter is in a brand-new folder, also add a `_category_.json` in that folder:

```json
{
  "label": "Your Section Name",
  "position": 7,
  "link": {
    "type": "generated-index",
    "description": "Short description of what this section covers."
  }
}
```

### Step 7 — Preview locally

While `yarn start` is running, your changes appear instantly in the browser. Click through to make sure:

- Your chapter shows up in the left sidebar
- Headings render correctly
- Images load
- Links work
- Math/code/admonitions render properly

### Step 8 — Run the build (catch errors early)

Before pushing, run a full build to catch broken links or other issues that don't show in dev mode:

```bash
yarn build
```

If it fails (especially `onBrokenLinks: "throw"`), fix the reported issues and re-run.

### Step 9 — Commit and push

```bash
git add docs/<your-section>/<your-chapter>.md
git commit -m "docs: add chapter on <your topic>"
git push origin chapter/your-topic-slug
```

### Step 10 — Open a Pull Request

1. Go to your fork on GitHub.
2. Click **Compare & pull request** (it appears after pushing a new branch).
3. Set:
   - **Base repository**: `MasakhaneHubNLP/MasakhanePlaybook`, branch `main`
   - **Head**: your fork, branch `chapter/your-topic-slug`
4. Title: `docs: add chapter on <your topic>`
5. Body — answer briefly:
   - What the chapter adds
   - Any open questions you have for reviewers
   - Reference the issue from Step 1 (e.g., `Closes #42`)
6. Click **Create pull request**.

A maintainer will review, suggest edits, and merge once it's ready.

### What happens after merge

Your chapter is live at <https://masakhanehubnlp.github.io/MasakhanePlaybook/playbook/...> within ~5 minutes (CI rebuilds and deploys all 6 locales).

---

## How to translate

The site has UI translated into 6 languages. Chapter **content** is currently English placeholder text in each locale folder. To translate a chapter:

1. Set up locally (Steps 2–4 above).
2. Find the matching markdown file under `i18n/<locale>/docusaurus-plugin-content-docs/current/`. For example, to translate `docs/annotation-design/training_guidlines.md` into Hausa, edit:
   `i18n/ha/docusaurus-plugin-content-docs/current/annotation-design/training_guidlines.md`
3. **Edit the file in place** — same filename, translated content. Do not rename or move it.
4. Preview your translation: `yarn start --locale ha` (or your locale).
5. Commit, push, open a PR (Steps 9–10 above), title it `i18n(ha): translate Annotation Training Guidelines` etc.

Locale codes: `ha` (Hausa), `am` (Amharic), `sw` (Swahili), `fr` (French), `pt` (Portuguese).

---

## How to write a blog post

Blog posts go in `blog/` (separate from chapters). Use them for announcements, calls for contribution, project milestones, and case studies.

1. Create `blog/YYYY-MM-DD-your-slug/index.md`.
2. Frontmatter:

   ```yaml
   ---
   slug: your-post-slug
   title: "Your post title"
   authors: [shamsuddeen]
   tags: [announcement]
   image: /img/blog/your-thumbnail.png
   ---

   Intro paragraph (this is what shows on the blog index card).

   <!-- truncate -->

   Rest of the post...
   ```

3. To add yourself as an author, edit `blog/authors.yml` and add an entry with your name, GitHub URL, and image (the simplest is `https://github.com/<your-username>.png`).
4. Drop a thumbnail at `static/img/blog/your-thumbnail.png` (recommended size: 1200×675).
5. Preview, commit, push, PR (same flow as chapters).

---

## Local setup

If you just want a copy of the steps for working locally:

```bash
git clone https://github.com/MasakhaneHubNLP/MasakhanePlaybook.git
cd MasakhanePlaybook
yarn install --frozen-lockfile
yarn start                   # http://localhost:3000/MasakhanePlaybook/
yarn start --locale fr       # preview a specific locale
yarn build                   # full production build (all locales)
yarn pdf                     # generate the downloadable PDF
```

For deeper details (every plugin, gotchas, repo layout), see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Reporting issues

- **Bug in a chapter** (typo, broken link, wrong information): open a [new issue](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/issues/new) with the URL of the page and what's wrong.
- **Feature request**: open an issue describing what you'd like and why.
- **Question**: prefer [GitHub Discussions](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/discussions) for open-ended questions.

---

## Code of conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Be respectful, especially across language and cultural boundaries — that's the whole point of the Playbook.

---

## License

The Playbook content is shared under the same terms as the Masakhane community. Code is licensed per the project's `LICENSE` file (if present) or follows Docusaurus' MIT license by default. If you contribute, you agree your contribution is shared on the same terms.

---

## Acknowledgements

Built by the Masakhane NLP community. Powered by [Docusaurus](https://docusaurus.io/). Search by [Algolia DocSearch](https://docsearch.algolia.com/). Comments by [giscus](https://giscus.app/).
