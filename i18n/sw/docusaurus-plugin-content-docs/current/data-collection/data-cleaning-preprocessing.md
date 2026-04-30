# Data Cleaning and Preprocessing

Learn how to prepare raw data for use in language AI systems by improving quality, consistency, and usability.

## Why Data Cleaning Matters

Raw data often contains noise, inconsistencies, and errors. Proper cleaning and preprocessing ensure that datasets are reliable, accurate, and suitable for downstream tasks such as training and evaluation.

## Key Steps in Data Cleaning

### Deduplication, Normalization, and Filtering

- **Deduplication** – Remove duplicate entries to avoid bias and overrepresentation  
- **Normalization** – Standardize text (e.g., casing, punctuation, encoding)  
- **Filtering** – Remove irrelevant, low-quality, or out-of-scope data  

### Language Detection and Formatting

- **Language detection** – Identify and verify the language of each data instance  
- **Formatting** – Ensure consistent structure (e.g., JSON, CSV, text fields)  
- **Encoding consistency** – Maintain uniform character encoding (e.g., UTF-8)  

### Noise and Toxicity Handling

- **Noise removal** – Clean unwanted artifacts such as HTML tags, emojis (if not needed), or corrupted text  
- **Toxicity handling** – Detect and manage harmful, offensive, or unsafe content depending on project goals  

### Missing and Corrupted Data Handling

- **Missing data** – Identify incomplete entries and decide whether to fill, ignore, or remove them  
- **Corrupted data** – Detect broken or unreadable content and clean or discard it  
- **Validation checks** – Ensure data integrity after preprocessing  