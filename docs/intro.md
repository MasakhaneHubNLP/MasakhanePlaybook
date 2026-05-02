---
sidebar_position: 1
slug: /
---

# 1. Introduction

A comprehensive guide to dataset design, annotation, and task formulation for building reliable and responsible language AI systems.

:::info[📚 Citing this Playbook]
Using this resource in research, teaching, or a project? **[Jump to the citation block](#how-to-cite-this-playbook)** at the bottom of this page for BibTeX, APA, and other formats. The full citation page lives at [`/cite`](/cite).
:::

:::tip[🤝 Help build the Playbook]
This is a **community-driven** resource. If you spot a gap, want to write a chapter, translate a page, or suggest an improvement — contributions from researchers, practitioners, students, and language experts are very welcome. See the [**contribution guide**](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md#ways-to-contribute) to get started, or join the conversation on [Discord](https://discord.gg/ChNPHV2PPS).
:::

## Welcome to the dataset design and annotation playbook!

This playbook will help you plan and develop **training and evaluation datasets**, define **annotation schemas**, and design **AI tasks** across different languages, domains, and modalities. It provides guidance on dataset structuring, labeling strategies, and ethical considerations for language technologies.

## How to read this playbook

The playbook is organised end-to-end through the dataset lifecycle, but you don't have to read it linearly. Pick the path that fits where you are:

- **New to dataset design.** Start here, then read **chapters 2–4** in order — Data Collection → Annotation Design → Data Quality. They build on each other and cover the foundations everyone needs.
- **You already have raw data, want guidance on annotation.** Jump to **chapter 3 (Annotation Design and Workforce Management)**, then **chapter 4 (Data Quality Assurance and Validation)**.
- **You're working with a specific modality** (speech, multimodal, low-resource scripts). Skip to **chapter 5 (Modality-Specific Task Design)**.
- **You're using LLMs to generate or augment data.** Read **chapter 7 (LLM-Assisted and Synthetic Data Generation)** for the trade-offs and safeguards.
- **You're preparing a dataset for release or publication.** Read **chapter 6 (Documentation, Data Release, and Governance)** and **chapter 9 (Dataset Lifecycle Management and Release Checklist)**.
- **You're reading offline or on a slow connection.** Use **Download PDF** in the navbar — the entire playbook bundles into a single file, regenerated automatically on every release.
- **You'd rather read in Hausa, Amharic, Swahili, French, or Portuguese.** Use the language switcher in the top-right of the navbar. Translations are community-maintained and grow over time.

Throughout the playbook, you'll find practical templates (consent forms, annotation guidelines, governance checklists), worked examples from real African-language projects, and links to source datasets and tools you can reuse.

## Who is this playbook for?

This playbook is designed for:

- **Researchers** working on NLP dataset creation and evaluation  
- **Annotation teams** developing labeled datasets  
- **Project managers** overseeing data collection and annotation workflows  
- **AI practitioners** designing and evaluating language models  
- **Students and academics** studying dataset design and annotation  
- **Multilingual communities** contributing to language resources  

## What will you learn?

By the end of this playbook, you will understand:

- How to define the **purpose and scope** of a dataset  
- Differences between **training and evaluation datasets**  
- Trade-offs between **scale and quality**  
- How to design **label schemas and ontologies**  
- Approaches for **multi-label, single-label, and structured outputs**  
- How to handle **ambiguity, edge cases, and annotation boundaries**  
- Best practices for **multilingual and cross-lingual dataset design**  
- Ethical considerations, risks, and limitations in dataset creation  

## How to use this playbook

Each section of this playbook contains:

- **Clear explanations** of dataset design principles  
- **Structured guidance** for task and schema definition  
- **Examples and edge cases** to support annotation decisions  
- **Practical recommendations** for dataset creation workflows  
- **Ethical considerations** to guide responsible use  

## Getting Started

Ready to begin? Start with our foundational sections:

1. **Purpose of this Playbook** – Understand target users, scope, and intended use  
2. **How to Use This Playbook** – Learn how to navigate chapters and contribute  
3. **Dataset Types and Design Goals** – Explore dataset categories and trade-offs  
4. **Task and Schema Definition** – Define tasks, labels, and annotation structures  
5. **Glossary and Terminology** – Learn key concepts and definitions  

## Purpose of this playbook

- Target users and communities  
- Languages, domains, and modalities covered  
- Intended use and risks   

## Dataset Types and Design Goals

- Training vs evaluation datasets  
- General-purpose vs domain-specific datasets  
- Scale vs quality trade-offs  
- Monolingual, multilingual, cross-lingual setups  

## Task and Schema Definition

- Task formulation (classification, generation, alignment, retrieval)  
- Label schema and ontology design  
- Multi-label vs single-label vs structured outputs  
- Ambiguity, edge cases, and annotation boundaries  

## Glossary and Terminology

A reference section providing clear definitions of the key terms used throughout the playbook — see the **[Glossary](/playbook/glossary)** for definitions of *annotation, inter-annotator agreement, Cohen's kappa, low-resource language, modality,* and other terms.

---

## How to cite this playbook

If the Masakhane Playbook informs your research, teaching, or project, please cite it.

**BibTeX:**

```bibtex
@misc{masakhane2026playbook,
  author       = {{Masakhane Community}},
  title        = {Masakhane Playbook: A Practical Guide for Building NLP Systems for African Languages},
  year         = {2026},
  publisher    = {Masakhane},
  url          = {https://masakhanehubnlp.github.io/MasakhanePlaybook/},
  note         = {Open-source community resource}
}
```

**Plain text (APA-style):**

> Masakhane Community. (2026). *Masakhane Playbook: A Practical Guide for Building NLP Systems for African Languages*. [https://masakhanehubnlp.github.io/MasakhanePlaybook/](https://masakhanehubnlp.github.io/MasakhanePlaybook/)

For other formats (MLA, Chicago, etc.) and a machine-readable [`CITATION.cff`](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/CITATION.cff), see the [/cite](/cite) page.

If you reference a specific chapter, please include the chapter title and its URL.
