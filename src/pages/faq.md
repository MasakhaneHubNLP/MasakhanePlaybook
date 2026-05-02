---
title: Frequently Asked Questions
description: Answers to the questions we hear most about the Masakhane Playbook and Masakhane Tool — license, contribution, citation, deployment, and more.
hide_table_of_contents: true
---

<!-- markdownlint-disable MD033 -->

Click any question to read the answer. If yours isn't covered here, ask on [Discord](https://discord.gg/ChNPHV2PPS) or open a [GitHub Discussion](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/discussions).

<div className="faq-list">

<details className="faq-item">
<summary>Is the Playbook free to use?</summary>

Yes — entirely. The Playbook content is community-maintained and openly licensed, and the Masakhane Tool annotation platform is **Apache 2.0**. There is no closed version, no paid tier, and no commercial fork. Use it for research, teaching, internal projects, or commercial work — attribution and the original license terms are all that's asked.

</details>

<details className="faq-item">
<summary>Can I contribute a chapter?</summary>

Yes — contributions are very welcome. The recommended flow:

1. **Open an issue** with a brief outline of the chapter you'd like to write (so two people don't write the same thing).
2. **Fork the repo**, write your chapter as a Markdown file under the relevant section folder in `docs/`.
3. **Open a pull request** referencing your issue.

The full step-by-step guide — including frontmatter conventions, sidebar configuration, math/admonition syntax, and image handling — is in the [contribution guide in the README](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md#how-to-contribute-a-chapter).

</details>

<details className="faq-item">
<summary>How do I cite the Playbook?</summary>

Every chapter page has a **"Cite this page"** link in the footer that gives you the BibTeX for that specific chapter. The dedicated [citation page](/cite) provides BibTeX, APA, MLA, Chicago, and a machine-readable [`CITATION.cff`](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/CITATION.cff) (which GitHub renders as a "Cite this repository" button on the repo page).

If you cite a specific chapter, please include the chapter title and the URL of the chapter page.

</details>

<details className="faq-item">
<summary>Is the Masakhane Tool deployable on-prem?</summary>

Yes. The Tool is **Apache 2.0** licensed and ships as a **Progressive Web App**, so you can:

- Self-host it on any machine that serves static files and a backend.
- Install it on a phone or tablet for offline-first annotation work (sync when connectivity returns).
- Deploy it inside an institutional network with no external dependencies.

Pilot deployments are currently running at **Bayero University, Kano** and **Bahir Dar University ICT4D Research Center**. The codebase is community-maintained and you can contribute back to the upstream.

</details>

<details className="faq-item">
<summary>Which African languages are supported?</summary>

The site UI is translated into **6 languages** — English, Hausa, Amharic, Swahili, French, and Portuguese — with chapter content gradually following as native-speaker reviewers translate each chapter.

The Tool itself supports any African language and script through Unicode, with **virtual keyboards** for non-Latin scripts (Ethiopic, Tifinagh, etc.) and **right-to-left** text handling where applicable. New language localisations can be added by contributing a translation file.

</details>

<details className="faq-item">
<summary>How can I get involved?</summary>

There are several ways, depending on how much time you have:

- **5 minutes** — [Star the repo on GitHub](https://github.com/MasakhaneHubNLP/MasakhanePlaybook) or [join Discord](https://discord.gg/ChNPHV2PPS).
- **30 minutes** — Translate one paragraph, fix a typo, or add a missing reference (the "Edit this page" link at the bottom of every chapter takes you straight to GitHub).
- **A few hours** — Write a [blog post case study](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md#how-to-write-a-blog-post) about a real-world dataset project.
- **A few weeks** — Lead a chapter. See the open [Call for Chapter Development Proposals](/blog/call-for-chapters-masakhane-playbook) (USD $1,000 honorarium per accepted chapter, open through 30 June 2026).

</details>

<details className="faq-item">
<summary>What's the difference between the Playbook and the Masakhane Tool?</summary>

They're complementary public goods, not competing products:

- **The Playbook** — this site. An end-to-end **guide** covering data collection, annotation design, quality assurance, modality-specific tasks, documentation, governance, evaluation, lifecycle management, and community collaboration. It's a *manual* you read.
- **The Masakhane Tool** — a **mobile-first, offline-capable annotation platform** built for African contexts. It's a *piece of software* you run.

You can use either independently. They were designed together so the practices in the Playbook are directly supported by the workflows in the Tool.

</details>

<details className="faq-item">
<summary>I found an error or want to report a bug — where do I go?</summary>

- **Bug in a chapter** (typo, broken link, wrong information): open a [new issue](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/issues/new) with the URL of the page and what's wrong, or click the "Edit this page" link at the bottom of the chapter and submit a fix directly.
- **Bug in the Tool**: open an issue on the Tool's repository (linked from the [Tool page](/tool)).
- **Feature request**: open an issue describing what you'd like and why.
- **Open-ended question or discussion**: prefer [GitHub Discussions](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/discussions) over an issue.

</details>

<details className="faq-item">
<summary>Where can I see what's planned?</summary>

The [Roadmap page](/roadmap) lists shipped milestones, work in flight, and what's planned for upcoming quarters. It's updated as work moves between columns.

</details>

<details className="faq-item">
<summary>Who is behind the project?</summary>

The project is anchored at **Bayero University, Kano (Nigeria)** and **Bahir Dar University ICT4D Research Center (Ethiopia)**, in collaboration with the broader [Masakhane](https://www.masakhane.io/) NLP community. See the [About page](/about) for the full mission, anchor institutions, and partner communities.

</details>

</div>

---

Still have a question? [Ask on Discord](https://discord.gg/ChNPHV2PPS) or [open a discussion](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/discussions).
