# SEO Validator Skill

This skill captures the generative engine optimization (GEO) and SEO workflow used by the `SEO Validator` agent and related agents in the repository. When running the `SEO Validator` agent, the agent should explicitly refer to and apply this skill; the agent acts as a top SEO/GEO optimizer, leveraging the steps below to craft recommendations. It provides a reusable step-by-step process for auditing, optimizing, and maintaining site content to maximize visibility in AI search responses and traditional search engines.

## Purpose

- Help contributors and agents consistently apply best practices for SEO and AI citation optimization.
- Encode the checklist and decision logic for evaluating both technical and content factors that affect AI and traditional search visibility.
- Serve as a reference when creating new content, performing audits, or updating metadata.

## Workflow

1. **Verify AI crawler access**
   - Examine `robots.txt` for disallowed bots; ensure AI user‑agents are not blocked.
   - If using a CDN or firewall (e.g. Cloudflare), check configuration/AI crawl metrics for blocked requests.
   - Audit server logs for `ChatGPT-User` and other AI bots to confirm they can reach content.
   - Ensure important information is server-rendered; avoid hiding content behind JavaScript, logins, paywalls, or interactive controls.

2. **Audit Technical Foundations**
   - Confirm site speed, HTTPS, sitemap, and other standard SEO technical elements.
   - Generate or update metadata and structured data, referring to https://schema.org/docs/documents.html for attribute names and required types.
   - Consider adding an `llms.txt` file to describe sitemap or crawling hints.

3. **Structure content for extraction**
   - Use clear heading hierarchies (H1–H3) with each section focusing on a single topic or question.
   - Write in scannable formats: bullet points, numbered lists, tables, quotes, and statistics.
   - Lead sections with direct answers; place key information at the beginning.
   - Keep paragraphs short (2–3 sentences). Avoid long walls of text.

4. **Target fan‑out sub-queries**
   - Identify longer queries the page should answer and break them into smaller search fragments.
   - Incorporate terminology and questions matching what AI systems are likely to search for.
   - Add separate sections or Q&A blocks for each sub-query when possible.

5. **Include authority signals**
   - Add named expert quotes with titles/affiliations.
   - Cite statistics with explicit sources.
   - Share first‑hand experience, case studies, or examples demonstrating E‑E‑A‑T.
   - Provide clear author information and credentials.

6. **Maintain freshness**
   - Schedule quarterly reviews of high-value content.
   - Update dates, statistics, and examples to keep within a 3‑month window of publication.

7. **Build off-site authority**
   - Seek unlinked brand mentions and placements on pages already cited by AI engines.
   - Engage genuinely on platforms AI references (Reddit, YouTube, forums) rather than spamming.
   - Consider acquiring a Wikipedia entry if criteria are met.

8. **Tailor for different AI search engines**
   - ChatGPT: comprehensive, well-sourced content with expertise signals.
   - Google AI Overviews/AI Mode: combine traditional SEO with schema markup; local relevance matters.
   - Perplexity: focus on recency and citation transparency.
   - Gemini: align with Google SEO performance.
   - Claude: emphasize logical structure and synthesis-ready text.

9. **Measurement and monitoring**
   - Track share of voice, citation frequency, competitive rank, and brand mention accuracy.
   - Monitor server logs for AI bot user agents as a proxy for referral traffic.
   - Use third‑party tools if available, but manual periodic queries (ChatGPT, Perplexity, Gemini) are useful.

10. **Report and recommend**
    - When performing an audit, produce a structured report: current score/issues, prioritized tasks, GEO/SEO strategy, compliance checklist, timeline, and impact estimates.
    - Present recommendations for both metadata and content changes without applying them automatically.

## Quality Criteria

- Recommendations must cite the Schema.org documents link when discussing structured data.
- Audits should explicitly check for AI crawler accessibility and client‑side rendering pitfalls.
- Content guidance must emphasize extractable, scannable structure and authority signals.
- Updates should reference the 3‑month freshness rule and the checklist for common mistakes.

## Example Prompts

- "Run the SEO Validator on the `about` page and generate an audit report."  
- "What schema markup should I add to the projects section?"  
- "Check if any AI bots are blocked by our current Cloudflare configuration."  
- "Suggest additional sub-query topics for our pricing page to improve AI citations."  
- "Provide a quarterly review plan for the blog posts according to the GEO checklist."

## Known Gaps & Lessons (divyesh-portfolio audit, March 2026)

### Documentation vs. Implementation Mismatches
- **Meta description**: Documented as exceeding ideal length; recommendation provided but not yet applied.
- **Schema.org Person**: `hasCredential` field is enhanced beyond documentation, but `award` still uses simple strings instead of structured Award objects with dates.
- **Sitemap.xml**: Only 3 of ~6 major sections included; documentation recommends adding #experience, #certifications, #footer but they're missing from actual file.
- **OG/Twitter tags**: Missing `og:locale`, `twitter:creator`, `twitter:site` tags documented as recommended but not implemented.

### Critical Missing Elements
- **Canonical tag**: Recommended in documentation but absent from index.html head; essential for GitHub Pages sites.
- **Compliance gaps**: Documentation does not address GDPR consent/analytics, WCAG accessibility, or privacy policy integration.
- **Multi-AI engine guidance**: Recommendations focus on traditional SEO; lack specific depth for ChatGPT, Perplexity, Gemini, Claude optimization.
- **Authority building**: Off-site authority (step 7) underspecified; no guidance on building brand mentions or platform presence for GEO.

### Pattern to Watch
When auditing SEO documentation, always verify that:
1. Recommended schema properties are present in actual HTML; don't assume implementation.
2. All sitemap entries documented are reflected in actual sitemap.xml.
3. Compliance-adjacent topics (GDPR, accessibility) are included in documentation.
4. Each AI search engine (ChatGPT, Perplexity, Gemini, Claude) gets tailored guidance, not just generic SEO.

## Next Steps

- Link this skill from the repository README or internal documentation.
- Create automation or templates that use this checklist when generating new pages.
- Consider adding companion skills for "content structure validator" or "AI crawl checker" as the project grows.
- For divyesh-portfolio: Apply critical fixes (canonical tag, sitemap expansion, schema.org enhancements).

---

This SKILL.md captures the reusable workflow derived from earlier conversation and provides a clear reference for both humans and agents.