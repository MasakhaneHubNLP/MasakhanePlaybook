// Apply UI translations to i18n JSON scaffolds.
// Re-run safe: only updates "message" fields for keys present in the dictionary.
// Keys missing from a dictionary fall back to English at runtime.
//
// Usage: node scripts/translate-i18n.mjs

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const FILES = [
  "docusaurus-theme-classic/navbar.json",
  "docusaurus-theme-classic/footer.json",
  "docusaurus-plugin-content-docs/current.json",
  "code.json",
];

// ------- Translations -------
// Brand names (Masakhane, EthioNLP, HausaNLP, Lanfrica, Zindi Africa, GitHub)
// stay in English. Same for "MasakhaneHub" navbar title.

const T = {
  ha: {
    // navbar
    "item.label.Playbook": "Littafi",
    "item.label.Annotation Tool": "Kayan Lakabi",
    "item.label.Blog": "Bulogi",
    "item.label.Download PDF": "Sauke PDF",
    "logo.alt": "Tambarin Masakhane",

    // footer
    "link.title.Docs": "Takardu",
    "link.title.Community": "Al'umma",
    "link.title.More": "Ƙari",
    "link.item.label.Playbook": "Littafi",
    "link.item.label.Annotation Tool": "Kayan Lakabi",
    "link.item.label.Blog": "Bulogi",
    "link.item.label.GitHub Repository": "Ma'ajiyar GitHub",
    copyright: "Haƙƙin mallaka © 2026 Masakhane. An gina shi da Docusaurus.",

    // sidebar categories
    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance":
      "2. Tara Bayanai, Tsarawa, da Mulki",
    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance.link.generated-index.description":
      "Koyi yadda ake tarawa, tsarawa, da sarrafa bayanai cikin alhakanci, tare da tabbatar da inganci, bambanci, da bin doka da ɗabi'a.",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management":
      "3. Tsarin Lakabi da Sarrafa Ma'aikata",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management.link.generated-index.description":
      "Koyi game da Tsarin Lakabi da Sarrafa Ma'aikata",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation":
      "4. Tabbatar da Ingancin Bayanai",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation.link.generated-index.description":
      "Koyi game da Tabbatar da Ingancin Bayanai",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design":
      "5. Tsarin Aiki na Musamman",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design.link.generated-index.description":
      "Koyi game da Tsarin Aiki na Musamman",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance":
      "6. Takardu, Bayyana Bayanai, da Mulki",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance.link.generated-index.description":
      "Koyi game da Takardu, Bayyana Bayanai, da Mulki",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation":
      "6. Samar da Bayanai ta hanyar LLM da Roba",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation.link.generated-index.description":
      "Koyi game da Samar da Bayanai ta hanyar LLM da Roba",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity":
      "8. Tantancewa, Auna, da Amincin Bayanai",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity.link.generated-index.description":
      "Koyi game da Tantancewa, Auna, da Amincin Bayanai",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist":
      "9. Sarrafa Tsawon Rayuwar Bayanai da Jerin Sakewa",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist.link.generated-index.description":
      "Koyi game da Sarrafa Tsawon Rayuwar Bayanai da Jerin Sakewa",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration":
      "10. Al'umma da Haɗin Kai",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration.link.generated-index.description":
      "Koyi game da Al'umma da Haɗin Kai",

    // code.json — most visible UI strings
    "theme.NotFound.title": "Ba a Sami Shafin Ba",
    "theme.NotFound.p1": "Ba mu sami abin da kake nema ba.",
    "theme.NotFound.p2":
      "Da fatan a tuntubi mai shafin da ya haɗa ka da ainihin URL kuma a sanar da su cewa hanyar haɗin ya karye.",
    "theme.docs.paginator.previous": "Baya",
    "theme.docs.paginator.next": "Gaba",
    "theme.common.editThisPage": "Gyara wannan shafin",
    "theme.SearchBar.label": "Bincika",
    "theme.SearchModal.placeholder": "Bincika takardu",
    "theme.blog.post.readMore": "Ƙarin karatu",
    "theme.tags.tagsListLabel": "Alamomi:",
    "theme.tags.tagsPageTitle": "Alamomi",
    "theme.common.skipToMainContent": "Tsallake zuwa babban abun ciki",
    "theme.docs.breadcrumbs.home": "Shafin gida",
    "theme.CodeBlock.copy": "Kwafi",
    "theme.CodeBlock.copied": "An kwafi",
    "theme.admonition.note": "lura",
    "theme.admonition.tip": "shawara",
    "theme.admonition.warning": "gargaɗi",
    "theme.admonition.info": "bayani",
    "theme.admonition.danger": "haɗari",
    "theme.admonition.caution": "taka tsantsan",
    "theme.colorToggle.ariaLabel.mode.system": "yanayin tsarin",
    "theme.colorToggle.ariaLabel.mode.light": "yanayin haske",
    "theme.colorToggle.ariaLabel.mode.dark": "yanayin duhu",
    "theme.navbar.mobileLanguageDropdown.label": "Harsuna",
    "theme.lastUpdated.lastUpdatedAtBy":
      "An sabunta na ƙarshe{atDate}{byUser}",
    "theme.AnnouncementBar.closeButtonAriaLabel": "Rufe",
  },

  am: {
    "item.label.Playbook": "መመሪያ",
    "item.label.Annotation Tool": "የማብራሪያ መሣሪያ",
    "item.label.Blog": "ብሎግ",
    "item.label.Download PDF": "PDF አውርድ",
    "logo.alt": "የማሳካኔ ሎጎ",

    "link.title.Docs": "ሰነዶች",
    "link.title.Community": "ማህበረሰብ",
    "link.title.More": "ተጨማሪ",
    "link.item.label.Playbook": "መመሪያ",
    "link.item.label.Annotation Tool": "የማብራሪያ መሣሪያ",
    "link.item.label.Blog": "ብሎግ",
    "link.item.label.GitHub Repository": "GitHub ማከማቻ",
    copyright: "የቅጂ መብት © 2026 ማሳካኔ። በDocusaurus የተገነባ።",

    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance":
      "2. የውሂብ ስብስብ፣ ዝግጅት፣ እና አስተዳደር",
    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance.link.generated-index.description":
      "ጥራትን፣ ብዝሃነትን፣ እና ሕግና ሥነ ምግባርን በማረጋገጥ ውሂብን በኃላፊነት እንዴት መሰብሰብ፣ ማዘጋጀት፣ እና ማስተዳደር እንደሚቻል ይማሩ።",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management":
      "3. የማብራሪያ ንድፍ እና የሰው ኃይል አስተዳደር",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management.link.generated-index.description":
      "ስለ ማብራሪያ ንድፍ እና የሰው ኃይል አስተዳደር ይማሩ",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation":
      "4. የውሂብ ጥራት ማረጋገጫ እና ማረጋገጫ",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation.link.generated-index.description":
      "ስለ የውሂብ ጥራት ማረጋገጫ እና ማረጋገጫ ይማሩ",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design":
      "5. ሞዳሊቲ-ተኮር የተግባር ንድፍ",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design.link.generated-index.description":
      "ስለ ሞዳሊቲ-ተኮር የተግባር ንድፍ ይማሩ",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance":
      "6. ሰነዶች፣ የውሂብ ልቀት፣ እና አስተዳደር",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance.link.generated-index.description":
      "ስለ ሰነዶች፣ የውሂብ ልቀት፣ እና አስተዳደር ይማሩ",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation":
      "6. በLLM የሚረዳ እና ሰው ሰራሽ የውሂብ ማመንጨት",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation.link.generated-index.description":
      "ስለ በLLM የሚረዳ እና ሰው ሰራሽ የውሂብ ማመንጨት ይማሩ",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity":
      "8. ግምገማ፣ መለኪያ፣ እና የውሂብ ታማኝነት",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity.link.generated-index.description":
      "ስለ ግምገማ፣ መለኪያ፣ እና የውሂብ ታማኝነት ይማሩ",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist":
      "9. የውሂብ ስብስብ የሕይወት ዑደት አስተዳደር እና የልቀት ዝርዝር",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist.link.generated-index.description":
      "ስለ የውሂብ ስብስብ የሕይወት ዑደት አስተዳደር እና የልቀት ዝርዝር ይማሩ",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration":
      "10. ማህበረሰብ እና ትብብር",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration.link.generated-index.description":
      "ስለ ማህበረሰብ እና ትብብር ይማሩ",

    "theme.NotFound.title": "ገጽ አልተገኘም",
    "theme.NotFound.p1": "የሚፈልጉትን ማግኘት አልቻልንም።",
    "theme.NotFound.p2":
      "እባክዎ የመጀመሪያውን URL ካገናኝዎ ጣቢያ ባለቤት ጋር ይገናኙ እና አገናኙ እንደተበላሸ ይንገሯቸው።",
    "theme.docs.paginator.previous": "ቀዳሚ",
    "theme.docs.paginator.next": "ቀጣይ",
    "theme.common.editThisPage": "ይህን ገጽ አርትዕ",
    "theme.SearchBar.label": "ፈልግ",
    "theme.SearchModal.placeholder": "ሰነዶችን ፈልግ",
    "theme.blog.post.readMore": "ተጨማሪ አንብብ",
    "theme.tags.tagsListLabel": "መለያዎች፦",
    "theme.tags.tagsPageTitle": "መለያዎች",
    "theme.common.skipToMainContent": "ወደ ዋናው ይዘት ዝለል",
    "theme.docs.breadcrumbs.home": "መነሻ ገጽ",
    "theme.CodeBlock.copy": "ቅዳ",
    "theme.CodeBlock.copied": "ተቀድቷል",
    "theme.admonition.note": "ማስታወሻ",
    "theme.admonition.tip": "ጠቃሚ ምክር",
    "theme.admonition.warning": "ማስጠንቀቂያ",
    "theme.admonition.info": "መረጃ",
    "theme.admonition.danger": "አደጋ",
    "theme.admonition.caution": "ጥንቃቄ",
    "theme.colorToggle.ariaLabel.mode.system": "የስርዓት ሁነታ",
    "theme.colorToggle.ariaLabel.mode.light": "ብሩህ ሁነታ",
    "theme.colorToggle.ariaLabel.mode.dark": "ጨለማ ሁነታ",
    "theme.navbar.mobileLanguageDropdown.label": "ቋንቋዎች",
    "theme.lastUpdated.lastUpdatedAtBy":
      "በመጨረሻ የተዘመነ{atDate}{byUser}",
    "theme.AnnouncementBar.closeButtonAriaLabel": "ዝጋ",
  },

  sw: {
    "item.label.Playbook": "Kitabu cha Mwongozo",
    "item.label.Annotation Tool": "Chombo cha Ufafanuzi",
    "item.label.Blog": "Blogu",
    "item.label.Download PDF": "Pakua PDF",
    "logo.alt": "Nembo ya Masakhane",

    "link.title.Docs": "Hati",
    "link.title.Community": "Jumuiya",
    "link.title.More": "Zaidi",
    "link.item.label.Playbook": "Kitabu cha Mwongozo",
    "link.item.label.Annotation Tool": "Chombo cha Ufafanuzi",
    "link.item.label.Blog": "Blogu",
    "link.item.label.GitHub Repository": "Hifadhi ya GitHub",
    copyright: "Hakimiliki © 2026 Masakhane. Imejengwa kwa Docusaurus.",

    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance":
      "2. Ukusanyaji, Uangalizi, na Utawala wa Data",
    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance.link.generated-index.description":
      "Jifunze jinsi ya kukusanya, kutunza, na kusimamia hifadhidata kwa uwajibikaji, ukihakikisha ubora, utofauti, na utii wa sheria na maadili.",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management":
      "3. Muundo wa Ufafanuzi na Usimamizi wa Wafanyakazi",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management.link.generated-index.description":
      "Jifunze kuhusu Muundo wa Ufafanuzi na Usimamizi wa Wafanyakazi",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation":
      "4. Uhakikisho wa Ubora wa Data na Uthibitisho",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation.link.generated-index.description":
      "Jifunze kuhusu Uhakikisho wa Ubora wa Data na Uthibitisho",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design":
      "5. Muundo wa Kazi Maalum kwa Modaliti",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design.link.generated-index.description":
      "Jifunze kuhusu Muundo wa Kazi Maalum kwa Modaliti",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance":
      "6. Uwekaji Hati, Utoaji wa Data, na Utawala",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance.link.generated-index.description":
      "Jifunze kuhusu Uwekaji Hati, Utoaji wa Data, na Utawala",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation":
      "6. Uzalishaji wa Data kwa Msaada wa LLM na Bandia",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation.link.generated-index.description":
      "Jifunze kuhusu Uzalishaji wa Data kwa Msaada wa LLM na Bandia",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity":
      "8. Tathmini, Ulinganishaji, na Uadilifu wa Data",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity.link.generated-index.description":
      "Jifunze kuhusu Tathmini, Ulinganishaji, na Uadilifu wa Data",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist":
      "9. Usimamizi wa Mzunguko wa Maisha wa Hifadhidata na Orodha ya Utoaji",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist.link.generated-index.description":
      "Jifunze kuhusu Usimamizi wa Mzunguko wa Maisha wa Hifadhidata na Orodha ya Utoaji",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration":
      "10. Jumuiya na Ushirikiano",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration.link.generated-index.description":
      "Jifunze kuhusu Jumuiya na Ushirikiano",

    "theme.NotFound.title": "Ukurasa Haukupatikana",
    "theme.NotFound.p1": "Hatukuweza kupata kile ulichokuwa unakitafuta.",
    "theme.NotFound.p2":
      "Tafadhali wasiliana na mmiliki wa tovuti aliyekuunganisha kwenye URL asilia na uwajulishe kwamba kiungo chao kimevunjika.",
    "theme.docs.paginator.previous": "Iliyotangulia",
    "theme.docs.paginator.next": "Inayofuata",
    "theme.common.editThisPage": "Hariri ukurasa huu",
    "theme.SearchBar.label": "Tafuta",
    "theme.SearchModal.placeholder": "Tafuta hati",
    "theme.blog.post.readMore": "Soma zaidi",
    "theme.tags.tagsListLabel": "Alama:",
    "theme.tags.tagsPageTitle": "Alama",
    "theme.common.skipToMainContent": "Ruka hadi maudhui makuu",
    "theme.docs.breadcrumbs.home": "Ukurasa wa nyumbani",
    "theme.CodeBlock.copy": "Nakili",
    "theme.CodeBlock.copied": "Imenakiliwa",
    "theme.admonition.note": "kumbuka",
    "theme.admonition.tip": "dokezo",
    "theme.admonition.warning": "onyo",
    "theme.admonition.info": "maelezo",
    "theme.admonition.danger": "hatari",
    "theme.admonition.caution": "tahadhari",
    "theme.colorToggle.ariaLabel.mode.system": "hali ya mfumo",
    "theme.colorToggle.ariaLabel.mode.light": "hali ya nuru",
    "theme.colorToggle.ariaLabel.mode.dark": "hali ya giza",
    "theme.navbar.mobileLanguageDropdown.label": "Lugha",
    "theme.lastUpdated.lastUpdatedAtBy":
      "Imesasishwa mara ya mwisho{atDate}{byUser}",
    "theme.AnnouncementBar.closeButtonAriaLabel": "Funga",
  },

  fr: {
    "item.label.Playbook": "Manuel",
    "item.label.Annotation Tool": "Outil d'annotation",
    "item.label.Blog": "Blog",
    "item.label.Download PDF": "Télécharger le PDF",
    "logo.alt": "Logo Masakhane",

    "link.title.Docs": "Documentation",
    "link.title.Community": "Communauté",
    "link.title.More": "Plus",
    "link.item.label.Playbook": "Manuel",
    "link.item.label.Annotation Tool": "Outil d'annotation",
    "link.item.label.Blog": "Blog",
    "link.item.label.GitHub Repository": "Dépôt GitHub",
    copyright:
      "Copyright © 2026 Masakhane. Construit avec Docusaurus.",

    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance":
      "2. Collecte, curation et gouvernance des données",
    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance.link.generated-index.description":
      "Apprenez à collecter, organiser et gérer les jeux de données de manière responsable, en garantissant qualité, diversité et conformité aux normes légales et éthiques.",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management":
      "3. Conception de l'annotation et gestion des équipes",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management.link.generated-index.description":
      "Découvrez la conception de l'annotation et la gestion des équipes",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation":
      "4. Assurance qualité et validation des données",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation.link.generated-index.description":
      "Découvrez l'assurance qualité et la validation des données",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design":
      "5. Conception de tâches spécifiques à la modalité",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design.link.generated-index.description":
      "Découvrez la conception de tâches spécifiques à la modalité",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance":
      "6. Documentation, publication des données et gouvernance",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance.link.generated-index.description":
      "Découvrez la documentation, la publication des données et la gouvernance",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation":
      "6. Génération de données assistée par LLM et synthétique",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation.link.generated-index.description":
      "Découvrez la génération de données assistée par LLM et synthétique",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity":
      "8. Évaluation, benchmarking et intégrité des données",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity.link.generated-index.description":
      "Découvrez l'évaluation, le benchmarking et l'intégrité des données",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist":
      "9. Gestion du cycle de vie et liste de vérification de publication",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist.link.generated-index.description":
      "Découvrez la gestion du cycle de vie et la liste de vérification de publication",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration":
      "10. Communauté et collaboration",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration.link.generated-index.description":
      "Découvrez la communauté et la collaboration",

    "theme.NotFound.title": "Page introuvable",
    "theme.NotFound.p1": "Nous n'avons pas pu trouver ce que vous cherchiez.",
    "theme.NotFound.p2":
      "Veuillez contacter le propriétaire du site qui vous a redirigé vers l'URL d'origine et l'informer que son lien est cassé.",
    "theme.docs.paginator.previous": "Précédent",
    "theme.docs.paginator.next": "Suivant",
    "theme.common.editThisPage": "Modifier cette page",
    "theme.SearchBar.label": "Rechercher",
    "theme.SearchModal.placeholder": "Rechercher dans la documentation",
    "theme.blog.post.readMore": "Lire la suite",
    "theme.tags.tagsListLabel": "Étiquettes :",
    "theme.tags.tagsPageTitle": "Étiquettes",
    "theme.common.skipToMainContent": "Passer au contenu principal",
    "theme.docs.breadcrumbs.home": "Page d'accueil",
    "theme.CodeBlock.copy": "Copier",
    "theme.CodeBlock.copied": "Copié",
    "theme.admonition.note": "note",
    "theme.admonition.tip": "astuce",
    "theme.admonition.warning": "avertissement",
    "theme.admonition.info": "info",
    "theme.admonition.danger": "danger",
    "theme.admonition.caution": "attention",
    "theme.colorToggle.ariaLabel.mode.system": "mode système",
    "theme.colorToggle.ariaLabel.mode.light": "mode clair",
    "theme.colorToggle.ariaLabel.mode.dark": "mode sombre",
    "theme.navbar.mobileLanguageDropdown.label": "Langues",
    "theme.lastUpdated.lastUpdatedAtBy":
      "Dernière mise à jour{atDate}{byUser}",
    "theme.AnnouncementBar.closeButtonAriaLabel": "Fermer",
  },

  pt: {
    "item.label.Playbook": "Manual",
    "item.label.Annotation Tool": "Ferramenta de Anotação",
    "item.label.Blog": "Blog",
    "item.label.Download PDF": "Baixar PDF",
    "logo.alt": "Logótipo Masakhane",

    "link.title.Docs": "Documentação",
    "link.title.Community": "Comunidade",
    "link.title.More": "Mais",
    "link.item.label.Playbook": "Manual",
    "link.item.label.Annotation Tool": "Ferramenta de Anotação",
    "link.item.label.Blog": "Blog",
    "link.item.label.GitHub Repository": "Repositório do GitHub",
    copyright:
      "Direitos de autor © 2026 Masakhane. Construído com Docusaurus.",

    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance":
      "2. Recolha, Curadoria e Governação de Dados",
    "sidebar.tutorialSidebar.category.2. Data Collection, Curation, and Governance.link.generated-index.description":
      "Aprenda a recolher, organizar e gerir conjuntos de dados de forma responsável, garantindo qualidade, diversidade e conformidade com normas legais e éticas.",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management":
      "3. Conceção de Anotação e Gestão da Força de Trabalho",
    "sidebar.tutorialSidebar.category.3. Annotation Design and Workforce Management.link.generated-index.description":
      "Aprenda sobre Conceção de Anotação e Gestão da Força de Trabalho",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation":
      "4. Garantia da Qualidade e Validação de Dados",
    "sidebar.tutorialSidebar.category.4. Data Quality Assurance and Validation.link.generated-index.description":
      "Aprenda sobre Garantia da Qualidade e Validação de Dados",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design":
      "5. Conceção de Tarefas Específicas da Modalidade",
    "sidebar.tutorialSidebar.category.5. Modality-Specific Task Design.link.generated-index.description":
      "Aprenda sobre Conceção de Tarefas Específicas da Modalidade",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance":
      "6. Documentação, Publicação de Dados e Governação",
    "sidebar.tutorialSidebar.category.6. Documentation, Data Release, and Governance.link.generated-index.description":
      "Aprenda sobre Documentação, Publicação de Dados e Governação",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation":
      "6. Geração de Dados Assistida por LLM e Sintética",
    "sidebar.tutorialSidebar.category.6. LLM-Assisted and Synthetic Data Generation.link.generated-index.description":
      "Aprenda sobre Geração de Dados Assistida por LLM e Sintética",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity":
      "8. Avaliação, Benchmarking e Integridade dos Dados",
    "sidebar.tutorialSidebar.category.8. Evaluation, Benchmarking, and Data Integrity.link.generated-index.description":
      "Aprenda sobre Avaliação, Benchmarking e Integridade dos Dados",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist":
      "9. Gestão do Ciclo de Vida do Conjunto de Dados e Lista de Verificação",
    "sidebar.tutorialSidebar.category.9. Dataset Lifecycle Management and Release Checklist.link.generated-index.description":
      "Aprenda sobre Gestão do Ciclo de Vida do Conjunto de Dados e Lista de Verificação",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration":
      "10. Comunidade e Colaboração",
    "sidebar.tutorialSidebar.category.10. Community and Collaboration.link.generated-index.description":
      "Aprenda sobre Comunidade e Colaboração",

    "theme.NotFound.title": "Página Não Encontrada",
    "theme.NotFound.p1": "Não foi possível encontrar o que procurava.",
    "theme.NotFound.p2":
      "Por favor, contacte o proprietário do site que o ligou ao URL original e informe-o de que o link está quebrado.",
    "theme.docs.paginator.previous": "Anterior",
    "theme.docs.paginator.next": "Seguinte",
    "theme.common.editThisPage": "Editar esta página",
    "theme.SearchBar.label": "Pesquisar",
    "theme.SearchModal.placeholder": "Pesquisar documentação",
    "theme.blog.post.readMore": "Ler mais",
    "theme.tags.tagsListLabel": "Etiquetas:",
    "theme.tags.tagsPageTitle": "Etiquetas",
    "theme.common.skipToMainContent": "Saltar para o conteúdo principal",
    "theme.docs.breadcrumbs.home": "Página inicial",
    "theme.CodeBlock.copy": "Copiar",
    "theme.CodeBlock.copied": "Copiado",
    "theme.admonition.note": "nota",
    "theme.admonition.tip": "dica",
    "theme.admonition.warning": "aviso",
    "theme.admonition.info": "informação",
    "theme.admonition.danger": "perigo",
    "theme.admonition.caution": "cuidado",
    "theme.colorToggle.ariaLabel.mode.system": "modo do sistema",
    "theme.colorToggle.ariaLabel.mode.light": "modo claro",
    "theme.colorToggle.ariaLabel.mode.dark": "modo escuro",
    "theme.navbar.mobileLanguageDropdown.label": "Idiomas",
    "theme.lastUpdated.lastUpdatedAtBy":
      "Última atualização{atDate}{byUser}",
    "theme.AnnouncementBar.closeButtonAriaLabel": "Fechar",
  },
};

// ------- Apply -------

let total = 0;
for (const locale of Object.keys(T)) {
  const dict = T[locale];
  for (const file of FILES) {
    const filepath = path.join(root, "i18n", locale, file);
    if (!fs.existsSync(filepath)) continue;
    const json = JSON.parse(fs.readFileSync(filepath, "utf8"));
    let updated = 0;
    for (const key of Object.keys(json)) {
      if (dict[key]) {
        json[key].message = dict[key];
        updated++;
      }
    }
    fs.writeFileSync(filepath, JSON.stringify(json, null, 2) + "\n");
    if (updated) {
      console.log(`  [${locale}] ${file}: ${updated} keys translated`);
      total += updated;
    }
  }
}
console.log(`\nTotal translations applied: ${total}`);
