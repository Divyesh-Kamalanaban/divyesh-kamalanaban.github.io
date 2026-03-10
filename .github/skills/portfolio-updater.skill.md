# Portfolio Updater Skill

This skill tracks the data fetching, parsing, and integration processes for the `portfolio-updater` agent. It logs successful updates, data sources used, and any issues encountered during portfolio synchronization.

## Purpose

- Maintain a record of external data pulls (GitHub repos, LinkedIn certs) and how they were processed.
- Document the format and location of generated files (about-data.txt, about-text.txt).
- Capture lessons from data parsing challenges or API changes.

## Guidelines

- Always generate both `about-data.txt` (for about-editor) and `documentation/about-text.txt` (for docs).
- Format about-text.txt as readable text with sections for projects and certifications.
- Log the number of items fetched and any filtering applied.
- Update this skill after each run with a summary of data sources, items processed, and files generated.

## Example Prompts

- "portfolio-updater: Pull latest GitHub projects and LinkedIn certifications."
- "Use portfolio-updater to refresh about-data.txt with current data."
- "Check if new projects are available and update the portfolio accordingly."

## Critical Issues Found in Documentation

### Agent Workflow Sequence (CRITICAL)
**Issue**: portfolio-update-process.md documents INCORRECT agent sequence.

**Documented**: portfolio-updater → about-editor → seo-validator → design-validator → lead-developer  
**Actual**: portfolio-updater → design-validator (→ seo-validator) → [about-editor independent]

**Root Cause**: portfolio-updater.agent.md step 7 says "invoke the design-validator. (Design-validator will in turn call the seo-validator...)" but documentation shows these in wrong order.

**Impact**: 
- Gives false impression that about-editor comes before design-validator
- Lead-developer is general-purpose, not part of update pipeline
- SEO validation appears sequential when it's actually nested in design-validator

**Fix Required**: Update portfolio-update-process.md architecture diagram (lines 41-58) and workflow descriptions (lines 150-362) to match actual agent call graph.

### Missing Optional Output: about-text.txt
**Issue**: Agent step 6 documents "Generate a formatted about-text.txt file in the documentation folder" but this is never actually generated.

**Status**: about-text.txt does NOT exist in documentation/ folder; agent and skill do not log its generation.

**Decision**: Either implement generation of about-text.txt or remove from documented steps. Currently creates confusion about what outputs to expect.

### Missing Skill File: design-validator.skill.md
**Issue**: design-validator agent exists and is invoked by portfolio-updater, but has NO skill file to track lessons learned or best practices.

**All other agents have skills**:
- ✅ portfolio-updater.skill.md
- ✅ seo-validator.skill.md
- ✅ lead-developer.skill.md
- ❌ design-validator.skill.md (MISSING)

**Action**: Need to create design-validator.skill.md following same structure as other skill files.

## Change Log

- *2026-03-10*: Skill created. Added requirement to generate about-text.txt in documentation folder alongside about-data.txt.
- *2026-03-10*: Updated agent to include step for generating documentation/about-text.txt and modified output format accordingly.
- *2026-03-10*: **DOCUMENTATION VERIFICATION COMPLETE**
  - ❌ Agent workflow sequence documented INCORRECTLY in portfolio-update-process.md (shows wrong order; design-validator and seo-validator swapped with about-editor)
  - ⚠️ about-text.txt output documented but never actually generated; decision needed on implementation
  - ❌ design-validator.skill.md MISSING (no complementary skill file for design-validator agent)
  - ✅ Data sources (GitHub/LinkedIn) documentation verified accurate
  - ✅ File formats and corpus sync documentation verified accurate
  - ✅ Troubleshooting section verified realistic and complete
  - See VERIFICATION_REPORT.md for detailed findings

---

This skill evolves with each data update to ensure accurate tracking of portfolio content sources and to maintain alignment with actual agent workflows.