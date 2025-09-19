# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Sourceful documentation site built with Docusaurus 3, hosted at docs.sourceful.energy. It serves as the developer portal and public documentation for Sourceful's APIs and services.

## Key Commands

### Development
- `npm ci` — install exact dependencies (Node >= 16.14)
- `npm run start` — local dev server with hot reload at http://localhost:3000
- `npm run build` — production build (fails on broken links/markdown)
- `npm run serve` — serve the build output locally
- `npm run clear` — clear Docusaurus caches

### Deployment
- `npm run deploy` — deploy to gh-pages branch (requires proper Git permissions)
- Deployment is automated via GitHub Actions on push to main branch

## Architecture & Structure

### Core Directory Structure
- `docs/` — All documentation content in Markdown/MDX format
  - `docs/developer/` — Developer-focused API and technical documentation
  - `docs/archive/` — Archived content (excluded from build)
  - `docs/sourceful-terms/` — Legal documents
- `src/` — Custom React components, pages, and CSS
- `static/` — Static assets (images, favicons) served as-is
- `docusaurus.config.js` — Main site configuration
- `sidebars.js` — Navigation sidebar configuration

### Documentation Organization
- Uses frontmatter for metadata (`title`, `sidebar_position`, `slug`)
- Auto-generated sidebars from directory structure in developer section
- Route configuration: docs serve from root path (`/`)
- Math equations supported via KaTeX
- Mermaid diagrams supported
- Archive content excluded from build process

### Theme & Features
- Custom dark/light theme with Sourceful branding
- Algolia search integration (appId: 8SIKBTLLNP)
- Custom CSS variables and Inter font family
- Mermaid diagram support
- Math equation rendering with KaTeX

## Content Guidelines (from AGENTS.md)

### File Naming & Structure
- Use kebab-case for filenames (`energy-gateway-overview.md`)
- Place images in `static/img/`
- Use relative links between docs
- Include language hints for code blocks (```ts, ```bash)

### Markdown/MDX Standards
- Use `#` headings hierarchically
- Keep paragraphs short and scannable
- Prefer lists for complex information
- Always include `title` in frontmatter
- Set `sidebar_position` for ordering when needed
- Use `slug` for custom routes

### Content Types
- Developer documentation focuses on APIs, authentication, data models
- Hardware documentation covers energy management systems
- Legal content in separate terms section

## Testing & Quality Assurance

### Build Validation
- `npm run build` is the primary test — must pass without errors
- Docusaurus fails builds on broken markdown links
- Preview changes locally with `npm run start` before committing

### Link Checking
- Docusaurus automatically validates internal links during build
- External links should be verified manually
- Check sidebar placement and navigation flow

## Development Workflow

### Making Changes
1. Run `npm ci` to ensure dependencies are current
2. Use `npm run start` for local development with hot reload
3. Test build with `npm run build` before committing
4. Follow existing content patterns and frontmatter structure

### Deployment Process
- Automatic deployment via GitHub Actions on main branch push
- Manual deployment possible with `npm run deploy`
- Builds are served from `gh-pages` branch to docs.sourceful.energy

### Common Tasks
- Adding new API documentation: Create in `docs/developer/API/`
- Updating data models: Edit `docs/developer/data-models.md`
- Adding images: Place in `static/img/` and reference relatively
- Modifying navigation: Edit `sidebars.js` or use frontmatter `sidebar_position`