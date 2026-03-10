# Lead Developer Skill

This skill contains ongoing notes, patterns, and instructions to guide the `lead-developer` agent when performing tasks in the repository. It is updated after each task or when issues are encountered to keep the agent’s behaviour consistent and to document lessons learned.

## Purpose

- Provide a reference for best practices, coding standards, and documentation links.
- Capture project-specific conventions and previously solved problems.
- Ensure the agent remains focused on reliability, type safety, and documentation.

## Key Guidelines

- **Official documentation**: Always use and cite links from
  - React: https://react.dev/reference/react (React API reference)
  - Tailwind CSS: https://tailwindcss.com/docs/installation/framework-guides (installation guides), https://tailwindcss.com/docs/styling-with-utility-classes (styling utilities)
  - Express.js: https://expressjs.com/en/5x/api.html (Express 5.x API)
  - Next.js: https://nextjs.org/docs (general docs), https://nextjs.org/docs/app/api-reference (App Router API)
  - React Router: https://reactrouter.com/home (home and guides)
  - Vite: https://vitejs.dev/ (since the project uses Vite)

- **Type safety and linting**
  - Prefer TypeScript or PropTypes. The repo currently uses JSX with PropTypes? (check) — adopt whichever is in use.
  - Run `npm run lint` to surface issues. Address ESLint warnings/errors proactively.

- **Defensive programming**
  - Wrap async/await calls in try/catch.
  - Validate external data (props, API responses) before use.
  - Provide default values for deconstructed objects.

- **Testing**
  - Add unit tests for new logic (e.g., `cosineTopK`, chunk parsing) via Jest or preferred framework.
  - Use existing test files (`test_cert_parser.mjs`, `test_contact_parser.mjs`) as examples.

- **Updating the skill**
  - After completing a task or fixing a bug, append a short note describing the change and why it was necessary.
  - Document any workspace-specific quirks (e.g., Vite aliasing, embedding strategy, etc.).

## Example Prompts for Agent Use

- "lead-developer: Add a loading spinner component with Tailwind classes and export it."
- "As lead-developer, review the `cosineTopK` function for performance and suggest improvements."
- "Use the lead-developer agent to configure an Express API route for uploading data."
- "Explain how to convert the project to TypeScript and what needs to change."

## Change Log

- *2026-03-10*: Skill created. Includes documentation links and general guidelines.
- *2026-03-10*: Fixed ESLint errors: removed unused imports (useEffect, useState in projects.jsx; defineConfig in vite.config.js), moved useState hook to top level in cards.jsx, removed unused parameters in chunkParser.js. Updated ESLint config to ignore built files. All linting now passes.
- *2026-03-10*: **Documentation Verification Complete**
  - ✅ **technology-stack.md**: All versions, code examples, and RAG pipeline descriptions verified as accurate (95%). No corrections needed.
  - ⚠️ **development-workflow.md**: CRITICAL ERROR FOUND — Package counts were incorrect (documented as 34 production/7 dev, actual: 15/9). Corrected line ~42 to show accurate dependency counts. All other sections (npm scripts, project structure, ESLint config, build process) verified accurate.
  - ✅ **design-documentation.md**: All CSS variables, colors, fonts, responsive breakpoints, and animation keyframes verified against actual source code. No corrections needed.
  - **Testing details verified**: RAG code examples in technology-stack.md match rag.jsx L11-98 exactly. Design components verified in src/index.css. All font imports present in src/App.jsx.

---

This skill grows over time; ensure to keep it updated when new libraries are added or patterns change.