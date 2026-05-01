---
sidebar_position: 99
title: Glossary
description: Definitions of key terms used throughout the Masakhane Playbook.
---

A reference of terms used throughout the Playbook. Cross-references point back to the chapters where each concept is introduced in depth.

This is a starting point — additions and corrections welcome via the "Edit this page" link at the bottom.

## A

**Adjudication.** The process of resolving disagreements between annotators, typically by a senior annotator or a designated adjudicator. Common when multiple annotators label the same item and a final "gold" label is needed. See the *Annotation Design and Workforce Management* chapter.

**Annotation.** Attaching structured information — labels, spans, categories, ratings — to raw data so it can be used to train or evaluate language models.

**Annotation guidelines.** The written specification that tells annotators exactly how to label each kind of input. Includes definitions, decision rules, worked examples, and edge cases. The single most important artifact for high inter-annotator agreement.

**Annotation schema.** The structural definition of what can be labeled — e.g., the set of allowed entity types in NER, or the rating scale in sentiment analysis. The schema constrains what guidelines can describe.

## B

**Backtranslation.** Translating from the target language back to the source language to generate additional training pairs. Often used to augment low-resource translation datasets. Quality varies — verify with native speakers before training on backtranslated data.

**Benchmark.** A standardised dataset and evaluation protocol used to compare models. Examples relevant to African NLP: AfriSenti, NaijaSenti, AfriHate, BRIGHTER, AmhEn.

## C

**Cohen's kappa (κ).** An inter-annotator-agreement metric for two annotators on categorical labels, corrected for chance agreement. Range: −1 to 1; conventionally κ > 0.6 is "substantial," κ > 0.8 is "almost perfect."

**Consent.** Documented permission from the people contributing speech, text, or images, usually including provisions on use, retention, and the right to revoke. Required for ethical and legal data work — see the *Data Collection, Curation, and Governance* chapter.

**Corpus** *(pl. corpora)*. A structured collection of texts, speech, or other linguistic data used for analysis or model training.

**Crowdsourcing.** Recruiting many distributed annotators — often online — to label data. Trade-off: scale vs. quality. Quality control techniques (gold-standard items, agreement metrics, qualification tests) become more important as crowd size grows.

## D

**Dataset.** A curated collection of items with labels and documentation, ready to be used for training or evaluation. A dataset is a *corpus + schema + labels + documentation + license*.

**Data sovereignty.** The principle that data about a community belongs to that community, with associated control over storage, access, and use. Especially important for language data from indigenous and minoritised speakers.

## F

**Fleiss' kappa.** Inter-annotator-agreement metric for more than two annotators on categorical labels — a generalisation of Cohen's kappa.

## G

**Gold standard.** A reference labeling considered correct after adjudication or expert review. Used to evaluate annotators, evaluate models, and as the ground truth in test sets.

## I

**Inter-annotator agreement (IAA).** A quantitative measure of how consistently different annotators produce the same labels. Low IAA suggests guidelines are unclear, the task is ambiguous, or annotators need more training.

## K

**Krippendorff's alpha (α).** A flexible inter-annotator-agreement metric that handles missing data, multiple annotators, and different label scales (nominal, ordinal, interval, ratio).

## L

**License.** The legal terms under which a dataset or piece of code can be used, modified, and redistributed. Common open licenses: Apache 2.0, MIT, CC-BY-SA, CC-BY-NC. Consent and license are different things — covered in the *Documentation, Data Release, and Governance* chapter.

**Low-resource language.** A language for which little digital data and few NLP resources exist. Most African languages fall in this category. Building useful systems requires deliberate data collection and often careful transfer from related higher-resource languages.

## M

**Modality.** The type of input data — text, speech, image, video, or some combination. Modality-specific annotation is covered in the *Modality-Specific Task Design* chapter.

**Multilingual.** Covering or working across multiple languages, often with shared model parameters.

## N

**Named Entity Recognition (NER).** Identifying spans of text that refer to named things — people, places, organisations, etc. — and labeling them with their type.

## P

**Parallel corpus.** A corpus with the same content in two or more languages, sentence-aligned. The basis for machine-translation training.

**Part-of-speech (POS) tagging.** Labeling each token with its grammatical role (noun, verb, adjective, etc.).

## R

**Reproducibility.** The property that another researcher, given the dataset, code, and reported configuration, can re-run the experiment and obtain the same results. The Playbook treats reproducibility as a first-class design goal.

## S

**Synthetic data.** Data generated by a model rather than collected from human sources. Useful for augmentation; risky without verification because errors compound. Covered in the *LLM-Assisted and Synthetic Data Generation* chapter.

## T

**Tokenisation.** Splitting text into the basic units a model operates on. Choices around tokenisation (subword, BPE, SentencePiece, character) materially affect downstream performance — especially in morphologically rich languages.

## See also

- [How to cite the Playbook](/cite)
- [How to contribute a chapter](https://github.com/MasakhaneHubNLP/MasakhanePlaybook/blob/main/README.md#how-to-contribute-a-chapter)
- [Discord community](https://discord.gg/ChNPHV2PPS)
