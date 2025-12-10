# Internationalization (i18n) Setup Guide

This documentation site now supports multiple languages using Docusaurus i18n with Crowdin integration.

## Supported Languages

- **English (en)** - Default language
- **Swedish (sv)** - Secondary language

## Directory Structure

```
srcful-documentation/
├── docs/                           # Original English content
├── i18n/
│   └── sv/                         # Swedish translations
│       ├── code.json               # UI translations
│       ├── docusaurus-theme-classic/
│       │   ├── navbar.json
│       │   └── footer.json
│       └── docusaurus-plugin-content-docs/
│           ├── current.json
│           └── current/            # Translated docs
│               └── sourceful-terms/
│                   ├── privacy.md
│                   └── terms.md
└── crowdin.yml                     # Crowdin configuration
```

## Development

### Preview a specific locale

To preview the site in Swedish:

```bash
npm run start -- --locale sv
```

To preview the default English version:

```bash
npm start
```

### Build for production

Build all locales:

```bash
npm run build
```

Build a specific locale:

```bash
npm run build -- --locale sv
```

## Translation Workflow

### Option 1: Manual Translation

1. **Generate translation files:**
   ```bash
   npm run write-translations -- --locale sv
   ```

2. **Edit the generated JSON files** in `i18n/sv/` to translate UI elements

3. **Translate Markdown files** in `i18n/sv/docusaurus-plugin-content-docs/current/`

### Option 2: Using Crowdin (Recommended)

Crowdin provides a user-friendly interface for managing translations with translation memory, collaboration features, and quality checks.

#### Initial Setup

1. **Create a Crowdin account** at https://crowdin.com/

2. **Create a new project** in Crowdin:
   - Set source language: English
   - Set target language: Swedish

3. **Get your Crowdin credentials:**
   - Project ID: Found in project settings
   - Personal Access Token: Generate in Account Settings → API

4. **Configure environment variables:**
   
   Create a `.env` file (already gitignored):
   ```bash
   CROWDIN_PROJECT_ID=your_project_id
   CROWDIN_PERSONAL_TOKEN=your_personal_token
   ```

5. **Install Crowdin CLI:**
   ```bash
   npm install -g @crowdin/cli
   ```

#### Using Crowdin

**Upload source files to Crowdin:**
```bash
npm run crowdin:upload
```

**Download translations from Crowdin:**
```bash
npm run crowdin:download
```

**Sync everything (generate translations + upload + download):**
```bash
npm run crowdin:sync
```

## Adding New Translations

### To translate a new documentation page:

1. **Create the English version** in `docs/`

2. **Generate Swedish translation file:**
   ```bash
   npm run write-translations -- --locale sv
   ```

3. **Copy the file to Swedish directory:**
   ```bash
   cp docs/your-file.md i18n/sv/docusaurus-plugin-content-docs/current/your-file.md
   ```

4. **Translate the content** in the Swedish file

5. **If using Crowdin:** Upload the new source file
   ```bash
   npm run crowdin:upload
   ```

## URL Structure

The site uses the following URL structure:

- English (default): `https://docs.sourceful.energy/`
- Swedish: `https://docs.sourceful.energy/sv/`

**Important:** Links are preserved across languages. For example:
- `/sourceful-terms/privacy` → `/sv/sourceful-terms/privacy`

## Deployment

When deploying, all locales are built into separate directories:

```
build/
├── index.html              # English homepage
├── sourceful-terms/
│   ├── privacy/
│   └── terms/
└── sv/                     # Swedish version
    ├── index.html
    └── sourceful-terms/
        ├── privacy/
        └── terms/
```

## Adding More Languages

To add another language (e.g., German):

1. **Update `docusaurus.config.js`:**
   ```javascript
   i18n: {
     defaultLocale: 'en',
     locales: ['en', 'sv', 'de'],
     localeConfigs: {
       de: {
         label: 'Deutsch',
         direction: 'ltr',
         htmlLang: 'de-DE',
       },
     },
   },
   ```

2. **Generate translation files:**
   ```bash
   npm run write-translations -- --locale de
   ```

3. **Add the target language in Crowdin project settings**

4. **Upload and translate**

## Resources

- [Docusaurus i18n Documentation](https://docusaurus.io/docs/i18n/tutorial)
- [Docusaurus Crowdin Integration](https://docusaurus.io/docs/i18n/crowdin)
- [Crowdin Documentation](https://support.crowdin.com/)

## Notes

- Translation files in `i18n/sv/` should **not** be edited directly if using Crowdin
- Always use explicit heading IDs in Markdown for better i18n support
- The locale dropdown appears in the top-right corner of the navbar
- Algolia search is configured for English only (update Algolia config for multi-language search)


