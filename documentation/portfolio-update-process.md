# Portfolio Update Process Documentation

## Overview
This document explains the complete workflow for updating the portfolio, including how data flows from external sources (GitHub, LinkedIn) through a series of agents that process, validate, and deploy the changes. This is a critical process for keeping the portfolio and RAG corpus synchronized.

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Data Sources](#data-sources)
3. [Agent Workflow](#agent-workflow)
4. [File Formats & Standards](#file-formats--standards)
5. [Data Flow Examples](#data-flow-examples)
6. [Troubleshooting & Maintenance](#troubleshooting--maintenance)

---

## System Architecture

### Component Overview
```
┌─────────────────────────────────────────────────────────┐
│                   Data Sources                          │
├──────────────────┬──────────────────┬──────────────────┤
│   GitHub repos   │  LinkedIn profile │   Personal data  │
└────────┬─────────┴────────┬─────────┴────────┬─────────┘
         │                  │                   │
         ▼                  ▼                   ▼
    ┌──────────────────────────────────────────┐
    │     portfolio-updater Agent              │
    │  (Collects & Aggregates Data)            │
    └────────────────┬─────────────────────────┘
                     ▼
    ┌──────────────────────────────────────────┐
    │   about-data.txt (Generated)             │
    │   portfolio.txt (Updated)                │
    │   corpus structure (Markdown)            │
    └────────────────┬─────────────────────────┘
                     ▼
    ┌──────────────────────────────────────────┐
    │     about-editor Agent                   │
    │  (Reviews & Enhances Content)            │
    └────────────────┬─────────────────────────┘
                     ▼
    ┌──────────────────────────────────────────┐
    │  seo-validator Agent                     │
    │  (Validates SEO Metadata)                │
    └────────────────┬─────────────────────────┘
                     ▼
    ┌──────────────────────────────────────────┐
    │   design-validator Agent                 │
    │  (Visual & UX Review)                    │
    └────────────────┬─────────────────────────┘
                     ▼
    ┌──────────────────────────────────────────┐
    │   lead-developer Agent                   │
    │  (Final Integration & Deployment)        │
    └────────────────┬─────────────────────────┘
                     ▼
    ┌──────────────────────────────────────────┐
    │   public/data/texts.json (Corpus)        │
    │   public/about-data.txt (Generated meta) │
    │   Deployed to GitHub Pages               │
    └──────────────────────────────────────────┘
```

---

## Data Sources

### 1. GitHub Repositories

#### Discovery
Portfolio-updater agent queries GitHub API for:
- **User**: `Divyesh-Kamalanaban`
- **Filters**: Repositories with descriptions, recent commits

#### Data Extracted Per Repository
```yaml
Repository: gridifix
  - Name: Gridifix - Smart Grid Analysis
  - Description: Real-time power distribution monitoring system
  - URL: https://github.com/Divyesh-Kamalanaban/gridifix
  - Topics: [smart-grid, python, react, machine-learning]
  - Stars: 42
  - Last Updated: 2024-12-15
  - Languages: [Python, JavaScript, C++]
  - README snippet: First 500 chars describing functionality
```

#### Corpus Entry Format
```
[PROJECTS]
Project: Gridifix – Smart Grid Analysis
Developed a real-time power distribution monitoring system using Python and React.
Features: Real-time data visualization, anomaly detection using ML algorithms.
Stack: Python, React, PostgreSQL, TensorFlow

Link: https://github.com/Divyesh-Kamalanaban/gridifix
```

### 2. LinkedIn Profile

#### Discovery
Portfolio-updater queries LinkedIn via OAuth or manual input for:
- **Experience**: Current and past roles
- **Certifications**: Professional certificates with issuer, date
- **Skills Endorsements**: Top endorsed skills
- **Education**: Degrees, institutions, graduation dates

#### Data Extracted Per Certification
```yaml
Certification:
  Name: GitHub Foundations Certification
  Issuer: GitHub
  Issued Date: 2024-03-10
  Credential ID: abc123
  Credential URL: https://www.credly.com/badges/...
```

#### Corpus Entry Format
```
[CERTIFICATIONS]
GitHub Foundations Certification – GitHub, March 2024
Comprehensive training on GitHub workflows, version control, and collaboration.

Professional Programming with JavaScript – Codecademy
Completed intermediate JavaScript programming certification.
```

### 3. Manual Portfolio Data

#### Personal Additions
- Professional summary/bio
- Additional projects not on GitHub
- Achievements and awards
- Contact information
- Geographic/professional location

#### Example
```
[SUMMARY]
AI Engineer & Systems Developer
Focused on solving engineering problems with artificial intelligence and embedded systems.
Built AI pipelines for power systems, bioinformatics, and edge devices.
```

---

## Agent Workflow

### 1. Portfolio-Updater Agent

**Purpose**: Collect and aggregate data from all sources

**Responsibilities**:
- Query GitHub API for public repositories
- Extract LinkedIn certifications and experience
- Parse personal input/additions
- Generate corpus structure

**Output Files**:
- `public/data/texts.json` - Complete corpus (array of {id, text} objects)
- `public/about-data.txt` - Metadata about portfolio content
- `README.md` - Updated project documentation

**Execution Trigger**:
- Manual: `npm run update-portfolio` (if script exists)
- Scheduled: Cron job (daily/weekly)
- Event-driven: GitHub webhook on repo update

**Key Logic**:
```javascript
// Pseudo-code
async function updatePortfolio() {
  const repos = await fetchGitHubRepos('Divyesh-Kamalanaban');
  const certs = await fetchLinkedInCertifications();
  const personal = await loadPersonalData();
  
  const corpus = [
    ...generateSummaryChunks(personal),
    ...repos.map(repo => generateProjectChunk(repo)),
    ...certs.map(cert => generateCertChunk(cert)),
    ...generateExperienceChunks(personal),
    ...generateEducationChunks(personal),
  ];
  
  await saveCorpus('public/data/texts.json', corpus);
  await generateAboutData('public/about-data.txt', corpus);
}
```

### 2. About-Editor Agent

**Purpose**: Review and enhance generated content

**Responsibilities**:
- Fix grammar and spelling in corpus
- Improve descriptions (clarity, keywords)
- Ensure consistent tone and format
- Add missing context or details
- Verify accuracy of claims

**Input**: `public/data/texts.json` (from portfolio-updater)

**Output**: 
- Enhanced `public/data/texts.json`
- `about-text.txt` - Human-readable documentation of changes
- Feedback/suggestions for manual review

**Quality Checks**:
```
✓ Grammar & Spelling: All chunks reviewed
✓ Formatting Consistency: [CATEGORY] tags, structure
✓ Keyword Density: SEO-friendly, not overstuffed
✓ Clarity: Technical jargon explained
✓ Completeness: No missing section headers
✓ Fact Accuracy: Claims verifiable
```

**Example Enhancement**:
```
BEFORE:
"Build AI pipelines for systems"

AFTER:
"Engineered AI pipelines for smart grid power systems, 
bioinformatics analysis, and edge device model deployment, 
achieving 95% inference accuracy with 50ms latency"
```

### 3. SEO-Validator Agent

**Purpose**: Ensure SEO and GEO compliance

**Responsibilities**:
- Validate meta descriptions in `index.html`
- Check schema.org structured data completeness
- Verify keyword coverage in corpus
- Audit Open Graph and Twitter cards
- Ensure mobile-friendly meta tags

**Input**: 
- Corpus content (`texts.json`)
- HTML metadata (`index.html`)
- URLs and sitemaps

**Output**:
- SEO validation report
- `about-data.txt` updates with SEO metrics
- Recommendations for improvements

**SEO Checks Performed**:
```yaml
Title Tags:
  - Length: 50-60 chars ✓
  - Keywords: Presence and relevance ✓
  
Meta Descriptions:
  - Length: 155-160 chars ✓
  - Call-to-action: Present ✓
  - Keywords: Natural inclusion ✓

Schema.org:
  - Person schema: Complete ✓
  - workExperience: Structured ✓
  - education: Structured ✓
  - awards: Listed ✓

OG Tags:
  - Title, description, image ✓
  - URL canonical ✓

Sitemap:
  - URLs reachable ✓
  - Priority assignment ✓
  - Lastmod dates current ✓
```

### 4. Design-Validator Agent

**Purpose**: Ensure visual consistency and UX quality

**Responsibilities**:
- Review portfolio visual appearance
- Check component responsiveness
- Validate color contrast (accessibility)
- Audit animation performance
- Ensure design system compliance

**Input**:
- Live portfolio URL
- Component library
- Figma/design mockups (if available)

**Output**:
- Visual review report
- Performance audit (Lighthouse)
- Accessibility audit (WCAG)
- Design system compliance check

**Validations**:
```yaml
Responsive Design:
  - Mobile (320px): ✓
  - Tablet (768px): ✓
  - Desktop (1024px+): ✓

Accessibility:
  - WCAG 2.1 AA: ✓
  - Color contrast: ✓
  - Keyboard navigation: ✓

Performance:
  - Core Web Vitals: ✓
  - Lighthouse score > 90: ✓
  - Load time < 3s: ✓

Visual Consistency:
  - Color palettes: ✓
  - Typography: ✓
  - Spacing/alignment: ✓
  - Dark mode support: ✓
```

### 5. Lead-Developer Agent

**Purpose**: Final integration and deployment

**Responsibilities**:
- Merge all agent outputs into production
- Run final build process
- Deploy to live environment
- Monitor for issues post-deployment

**Input**:
- Validated corpus and content
- SEO metadata
- Design approvals
- Technical fixes

**Output**:
- Live portfolio update
- Updated `public/data/texts.json` in distribution
- Deployed to GitHub Pages
- Build artifacts archived
- Deployment log recorded

**Deployment Steps**:
```bash
1. Verify all inputs from other agents
2. Run npm run lint          # Code quality
3. Run npm run build         # Optimized bundle
4. Copy to public/data/      # Update corpus
5. Update index.html meta    # SEO metadata
6. Test locally: npm run preview
7. Deploy to GitHub Pages
8. Verify live deployment
9. Test RAG with new corpus
10. Archive version info
```

---

## File Formats & Standards

### texts.json (Corpus Format)

**Location**: `public/data/texts.json`

**Structure**:
```json
[
  {
    "id": "summary_0001",
    "text": "[SUMMARY]\nAI Engineer & Systems Developer\n..."
  },
  {
    "id": "[PROJECTS]_gridifix",
    "text": "[PROJECTS]\nProject: Gridifix – Smart Grid Analysis\n..."
  },
  {
    "id": "[EXPERIENCE]_nit_trichy",
    "text": "[EXPERIENCE]\nNIT Trichy – Research Intern\n..."
  },
  {
    "id": "[CERTIFICATIONS]_github",
    "text": "[CERTIFICATIONS]\nGitHub Foundations – GitHub, March 2024\n..."
  },
  {
    "id": "[EDUCATION]_srmist",
    "text": "[EDUCATION]\nBachelors of Engineering (ECE)\nSRM Institute of Science and Technology\n..."
  }
]
```

**ID Naming Convention**:
| Category | Format | Example |
|----------|--------|---------|
| Summary | `summary_XXXX` | `summary_0001` |
| Projects | `[PROJECTS]_slug` | `[PROJECTS]_gridifix` |
| Experience | `[EXPERIENCE]_org_slug` | `[EXPERIENCE]_nit_trichy` |
| Certifications | `[CERTIFICATIONS]_issuer` | `[CERTIFICATIONS]_github` |
| Education | `[EDUCATION]_institution` | `[EDUCATION]_srmist` |

### about-data.txt (Metadata Format)

**Location**: `public/about-data.txt`

**Purpose**: Human-readable metadata about portfolio content

**Structure**:
```
PORTFOLIO METADATA
Generated: 2026-03-10T14:30:00Z
Last Updated: 2026-03-10

CORPUS STATISTICS
Total Chunks: 450
Categories Breakdown:
  - Summary: 5 chunks
  - Projects: 145 chunks (15 projects × ~10 chunks each)
  - Experience: 120 chunks (8 roles × ~15 chunks each)
  - Certifications: 45 chunks (15 certifications)
  - Education: 30 chunks (3 institutions)
  - Other: 105 chunks

SEO METRICS
Keywords Covered: 85+
Primary Keywords: [Intelligence Engineer, AI, Embedded Systems, Post-Quantum Cryptography]
Meta Description Length: 159 chars ✓
Schema.org Completeness: 92%
Readability Score: 8.5/10

LATEST UPDATES
- GitHub Repo: seaquenced (added 2026-02-28)
- Certification: AWS Solutions Architect (added 2026-02-20)
- Experience: Updated role responsibilities (modified 2026-02-15)

EMBEDDING METADATA
Embedding Model: Xenova/all-MiniLM-L6-v2
Dimension: 384
Chunks Embedable: 450/450 (100%)
Average Chunk Length: 156 tokens
Max Chunk Length: 512 tokens

VALIDATION STATUS
✓ Grammar & Spelling: Passed
✓ Format Consistency: Passed
✓ SEO Compliance: Passed
✓ Design System: Passed
✓ Accessibility: Passed
✓ Build Success: Passed
```

### about-text.txt (Documentation Format)

**Optional file for tracking changes**

**Structure**:
```
ABOUT TEXT DOCUMENTATION
Generated by: about-editor agent
Date: 2026-03-10

ENHANCEMENTS MADE THIS CYCLE:
1. Improved project descriptions with measurable outcomes
   - "Build AI pipelines" → "Engineered AI pipelines with 95% accuracy"
   - 24 project chunks enhanced with specific metrics

2. Standardized certification format
   - Removed redundant fields
   - Added credential URLs and dates consistently
   - 15 certifications standardized

3. Enhanced keyword coverage
   - Added 12 SEO-relevant keywords to experience section
   - Improved technical terminology consistency
   - Better keyword natural density (2.3-3.1%)

4. Format consistency fixes
   - Standardized capitalization in project titles
   - Fixed irregular spacing in 8 chunks
   - Ensured [CATEGORY] tags present in all sections

5. Grammar & readability improvements
   - Fixed 3 grammatical errors
   - Improved 7 unclear descriptions
   - Increased readability score from 7.1 to 8.5

ISSUES FLAGGED FOR REVIEW:
- Project "SleeQC" description mentions non-existent repo link (verify current status)
- Experience dates for "Company X" role missing end date (check LinkedIn)
- Two duplicate certifications detected (Git Basics vs. GitHub Foundations) - recommend merge

RECOMMENDATIONS FOR NEXT CYCLE:
1. Add project visualization metrics (stars, forks) from GitHub
2. Include specific technologies used in experience descriptions
3. Add achievement metrics and KPIs where applicable
4. Consider adding testimonials or recommendations from LinkedIn

PERFORMANCE METRICS:
- Processing time: 2.3 seconds
- Chunks processed: 450
- Enhancement rate: 85%
- Quality score: 9.1/10
```

---

## Data Flow Examples

### Example 1: New Project Added to GitHub

**Scenario**: Developer pushes new project to GitHub

**Flow**:
```
1. Developer creates GitHub repo: "bioinformatics-suite"
   - Adds description: "AI-powered bioinformatics data analysis platform"
   - Adds topics: [bioinformatics, python, ml, react]
   
2. Portfolio-updater Agent (triggered by schedule or webhook)
   - Fetches GitHub API: "/users/Divyesh-Kamalanaban/repos"
   - Detects new repo: "bioinformatics-suite"
   - Generates chunk:
     id: "[PROJECTS]_bioinformatics_suite"
     text: "[PROJECTS]
       Project: Bioinformatics Suite – AI-Powered Analysis Platform
       Developed full-stack bioinformatics data analysis platform..."
   
3. Appends to texts.json and saves
   - New corpus size: 451 chunks
   
4. About-editor Agent
   - Reviews new project entry
   - Enhances with metrics/outcomes
   - Verifies spelling, grammar
   - Output: Updated chunk with improved description
   
5. SEO-validator Agent
   - Checks keyword coverage in project description
   - Verifies technical terms naturally integrated
   - Approves or suggests rewording
   
6. Design-validator Agent
   - Checks portfolio displays new project
   - Verifies responsive design
   - Ensures visual consistency
   
7. Lead-developer Agent
   - Rebuilds RAG embeddings for new corpus
   - Tests RAG search with queries like "bioinformatics"
   - Deploys updated texts.json to public/data/
   - Pushes changes to repository
   
8. Live Portfolio Updated
   - New project appears in portfolio UI
   - RAG can now find and retrieve project information
```

### Example 2: Certification Added on LinkedIn

**Scenario**: User earns new certification from AWS

**Flow**:
```
1. User adds AWS Solutions Architect certification to LinkedIn profile
   - Issued: 2026-03-05
   - Expires: 2028-03-05
   
2. Portfolio-updater Agent (manual trigger)
   - Fetches LinkedIn certifications
   - Detects new: "AWS Certified Solutions Architect – Associate"
   - Generates chunks (group if possible):
     id: "[CERTIFICATIONS]_aws"
     text: "[CERTIFICATIONS]
       AWS Certified Solutions Architect – Associate – Amazon Web Services
       Certification earned March 5, 2026. Validates expertise in designing
       scalable, secure, and reliable applications on AWS infrastructure..."
   
3. Previous flow continues (editors, validators, deployment)
   
4. Results
   - about-data.txt updated with new certification count (16 total)
   - texts.json regenerated with new certification chunk
   - Portfolio displays new AWS certification
   - RAG can retrieve when user queries "AWS architect" or "cloud solutions"
```

### Example 3: Portfolio Content Refresh Cycle

**Scenario**: Scheduled weekly update to keep content fresh

**Process**:
```
Week 1: Monday 10:00 AM
├─ Portfolio-updater runs scheduled task
│  ├─ Fetches latest GitHub repos (no changes)
│  ├─ Checks LinkedIn certifications (no changes)
│  └─ Outputs same corpus (451 chunks)
│
├─ About-editor reviews corpus quality
│  ├─ Detects outdated project description in "SleeQC"
│  ├─ Enhances with latest metrics from GitHub
│  └─ Updates "Downloaded 500+ times" → "Downloaded 1200+ times"
│
├─ SEO-validator checks metadata
│  ├─ Verifies all keywords present in corpus
│  ├─ Checks index.html meta tags still valid
│  └─ Confirms sitemap matches content
│
├─ Design-validator audits visual appearance
│  ├─ Runs Lighthouse audit (score: 94)
│  ├─ Checks responsive design (pass)
│  └─ Verifies dark mode (pass)
│
└─ Lead-developer deploys updates
   ├─ Updates texts.json with enhanced content
   ├─ Rebuilds RAG embeddings
   ├─ Runs: npm run build
   ├─ Pushes to main branch
   └─ Deploys to GitHub Pages

Result: Portfolio stays fresh, RAG corpus synchronized
```

---

## Integration with RAG System

### Embedding Pipeline

When `texts.json` updates, RAG embeddings must be recomputed:

**Automated Flow**:
```javascript
1. New texts.json deployed to public/data/

2. User visits portfolio, loads RAG section → rag.jsx runs

3. On RAG mount:
   - Fetch /data/texts.json (latest)
   - Load all-MiniLM-L6-v2 model
   - Compute embeddings: mdl.embed(corpusTexts)
   - Store in memory: embeddings, dim, count

4. User performs search:
   - Query text embedded
   - cosineTopK() search against corpus embeddings
   - Return top 5 unique results

5. Results rendered via CustomCard component with chunkParser logic
```

**Manual Precomputation** (Optional):
```bash
# Use Python backend to precompute embeddings offline
cd src/python-backend
python embeddings.py
# Generates: embeddings.f32, dim.json (copy to public/data/)
```

---

## Troubleshooting & Maintenance

### Common Issues

#### Issue 1: Corpus Not Updating
**Symptoms**: New projects don't appear in portfolio after push

**Debug Steps**:
```bash
1. Check if portfolio-updater ran
   - Look for recent commits to texts.json
   - Check portfolio-updater agent logs
   
2. Verify public/data/texts.json exists
   - ls public/data/texts.json
   - Check file size (should be > 100KB)
   
3. Verify JSON validity
   - npx json-lint public/data/texts.json
   
4. Manual update
   - npm run update-portfolio (if script available)
   - npm run build
   - npm run preview (test locally)
   
5. Check deployment
   - Verify changes in GitHub Pages repository
   - Clear browser cache (Ctrl+Shift+Delete)
```

#### Issue 2: RAG Returns No Results
**Symptoms**: Searches return empty results

**Debug Steps**:
```bash
1. Verify corpus loaded
   - Check browser console: console.log(texts)
   - Should show array of 450+ objects
   
2. Check embeddings computed
   - console.log(count, dim)  // Should be "450 384"
   - console.log(embeddings.length) // Should be ~173000
   
3. Test with simple query
   - Try: "Python" (should find projects)
   - Try: "machine learning" (should find multiple matches)
   
4. Check cosineTopK scores
   - Modify search to log scores
   - Scores should be 0.0-1.0, with max > 0.5
   
5. Increase top-K limit
   - Change: cosineTopK(qv, 10) → cosineTopK(qv, 20)
   - See if deduplication is filtering results
```

#### Issue 3: SEO Metadata Mismatches
**Symptoms**: Social media shares show old preview

**Solution**:
```bash
1. Update index.html meta tags
   - Edit og:title, og:description
   - Edit twitter:title, twitter:description
   
2. Clear social platform caches
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: Manual refresh needed
   
3. Provide updated OG image
   - Create 1200x630px image
   - Update og:image URL in index.html
```

### Validation Checklist Before Deployment

```yaml
Portfolio-Updater Output:
  ✓ texts.json valid JSON
  ✓ All chunks have id & text fields
  ✓ No missing [CATEGORY] headers
  ✓ All URLs are valid (GitHub, LinkedIn)
  ✓ Character encoding UTF-8

About-Editor Review:
  ✓ Grammar & spelling correct
  ✓ Consistent tone & formatting
  ✓ Technical terms explained
  ✓ Word count balanced (not too short/long)
  ✓ Facts verified and accurate

SEO-Validator Checks:
  ✓ Meta description 155-160 chars
  ✓ Schema.org data complete
  ✓ Keywords naturally distributed
  ✓ OG tags present and correct
  ✓ Sitemap up to date

Design-Validator Review:
  ✓ Responsive on mobile/tablet/desktop
  ✓ Color contrast WCAG AA+
  ✓ Lighthouse score > 90
  ✓ Animations perform smoothly
  ✓ Dark/light mode working

Lead-Developer Verification:
  ✓ npm run lint passes
  ✓ npm run build succeeds
  ✓ npm run preview loads without errors
  ✓ RAG search works with sample queries
  ✓ All links functional
  ✓ Deployment successful
  ✓ Live site verified
```

### Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Portfolio-updater run | Weekly | Automated |
| SEO audit (PageSpeed) | Monthly | seo-validator |
| Broken link check | Quarterly | lead-developer |
| Certification refresh | As-needed | portfolio-updater |
| Content freshness review | Monthly | about-editor |
| Performance audit | Monthly | design-validator |
| Archive/backup corpus | Monthly | lead-developer |

---

## Future Improvements

1. **Automated Testing**: Add unit tests for parser functions
2. **Version Control**: Track corpus versions with git tags
3. **Content Staging**: Separate staging and production corpus files
4. **Rollback Plan**: Maintain previous versions for quick rollback
5. **Metrics Dashboard**: Track corpus growth, RAG performance
6. **Notifications**: Alert when corpus significantly updated
7. **API Integration**: Expose corpus via REST API for other projects

---

## References

- [portfolio-updater Agent Documentation](../src/)
- [about-editor Agent Documentation](../src/)
- [seo-validator Agent Documentation](../src/)
- [design-validator Agent Documentation](../src/)
- [lead-developer Agent Documentation](../src/)
- [RAG Section Guide](./rag-section-guide.md)
- [corpus texts.json Structure](../public/data/texts.json)

