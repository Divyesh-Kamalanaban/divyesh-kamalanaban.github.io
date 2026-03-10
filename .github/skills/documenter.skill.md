# Documenter Skill

This skill supports the `documenter` agent by providing a living log of documentation tasks, guidelines for structure and content, and notes about other agents' operations that inform the documentation.

## Purpose

- Track documentation efforts and maintain consistency across the `documentation/` folder.
- Record insights gathered while analyzing the codebase or agents, ensuring future documentation is accurate.
- Manage and update other agents' skill files with summaries of completed actions, lessons learned, and rectified mistakes.

## Guidelines

- Create or update markdown files under `documentation/` for each major area (design, SEO/GEO, workflows, tech stacks, RAG details).
- Use clear section headings and bullet lists; include code snippets or examples when helpful.
- When referencing agents, read their `*.agent.md` and `*.skill.md` files to extract their workflows and tips.
- After updating an agent's skill file, add a brief note in the documenter's skill log describing what was recorded.
- Revisit documentation quarterly or after major changes to ensure accuracy and freshness.

## Example Prompts

- "Documenter: Write a design documentation page describing the color palette, fonts, and Tailwind strategies used in this portfolio."
- "Use the documenter agent to summarize how the RAG pipeline loads and searches embeddings."
- "Update documentation with details on SEO/GEO best practices currently implemented."
- "Record in the documenter skill that the SEO Validator agent added a new constraint about schema.org references."

## Change Log

- *2026-03-10*: Skill created with basic guidelines and purpose.

---

This skill evolves as documentation is produced and as other agents generate new patterns or requirements.