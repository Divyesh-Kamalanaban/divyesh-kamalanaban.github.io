// src/components/chunkParser.js
// Robust, final chunk parser + renderers with header filtering and reliable proximity matching.

const TECH_KEYWORDS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "Express", "Tailwind", "MongoDB",
  "TensorFlow", "PyTorch", "scikit-learn", "TinyML", "TFLite", "Pandas", "NumPy", "GSAP",
  "Three.js", "Git", "Docker", "ESP-IDF", "C++", "C", "Verilog", "Matlab", "Simulink",
  "Arduino", "ESP32", "PQC", "Cryptography", "HTML", "CSS", "SQL", "Linux"
];

export const chunkRenderers = {
  // --- STATIC SUMMARIES (kept as before) ---
  summary_0001: () => ({
    title: "AI Engineer & Systems Developer",
    description:
      "Engineer focused on solving engineering problems with artificial intelligence and embedded systems.",
    details: [
      "Built AI pipelines for power systems, bioinformatics, and edge devices.",
      "Capable of full-stack web and backend integration for ML workflows.",
      "Interested in scalable, lightweight inference and embedded AI.",
    ],
  }),

  summary_0006: () => ({
    title: "Academic Background",
    description:
      "Bachelor of Engineering (ECE) at SRM Institute of Science and Technology.",
    details: [
      "Focus on AI, embedded systems, and computational intelligence.",
      "Combines theoretical rigor with applied machine learning practice.",
    ],
  }),

  // --- GROUP RENDERERS ---

  "[SUMMARY]": (chunks = []) => ({
    title: "Summary",
    items: chunks
      .filter((c) => c.id && c.id.startsWith("summary_"))
      .map((c) => c.text.replace(/^\[SUMMARY\]\s*/i, "").trim()),
  }),

  // --- FIXED PROJECTS RENDERER ---
  "[PROJECTS]": (chunks = [], focusChunk = null) => {
    const isHeader = (t) => /^\[.*\]$/.test(String(t || "").trim());
    const normalize = (s) =>
      String(s || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    const grouped = [];
    let current = null;

    for (const chunk of chunks) {
      const txt = String(chunk.text || "").trim();
      if (!txt || isHeader(txt)) continue;

      // --- PROJECT START ---
      if (/^Project:/i.test(txt)) {
        if (current) grouped.push(current);

        const raw = txt.replace(/^Project:\s*/i, "").trim();

        // Split smartly before the first "Developed", "Designed", or "Contributed" keyword
        const match = raw.match(
          /^(.*?(?:\s[–—-]\s.*?|))(?=\s+(Developed|Designed|Contributed)\b|$)/i
        );

        const mainTitle = match && match[1] ? match[1].trim() : raw;
        const descPart = raw.slice(mainTitle.length).trim();

        const desc =
          descPart && /^[A-Z]/.test(descPart)
            ? descPart
            : descPart
              ? descPart.charAt(0).toUpperCase() + descPart.slice(1)
              : "";

        current = {
          title: mainTitle.replace(/\s+—$/, "").trim(),
          details: desc ? [desc] : [],
          categories: {},
          link: null,
          sourceIds: [chunk.id],
        };
        continue;
      }

      if (!current) continue;

      // Capture ID for current group
      if (chunk.id) current.sourceIds.push(chunk.id);

      // --- LINK HANDLING ---
      if (/Link:/i.test(txt) || /(https?:\/\/\S+)/i.test(txt)) {
        const m = txt.match(/https?:\/\/\S+/i);
        if (m) current.link = m[0];
        continue;
      }

      // --- CATEGORY EXTRACTION (Tech Stack) ---
      // 1. Explicit Lines
      const stackMatch = txt.match(/^(?:Stack|Tech Stack|Technologies|Tools):\s*(.*)/i);
      if (stackMatch) {
        // Split by comma or other common delimiters
        const items = stackMatch[1].split(/,\s*|\s+\|\s+/).filter(Boolean);
        current.categories["Tech Stack"] = items;
        continue;
      }

      // 2. Keyword Scanning
      TECH_KEYWORDS.forEach(tech => {
        const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(
          tech === "C++" ? "C\\+\\+" :
            tech === ".NET" ? "\\.NET" :
              `\\b${escaped}\\b`, 'i'
        );

        if (regex.test(txt)) {
          if (!current.categories["Tech Stack"]) current.categories["Tech Stack"] = [];
          if (!current.categories["Tech Stack"].includes(tech)) {
            current.categories["Tech Stack"].push(tech);
          }
        }
      });

      // --- ADD DETAIL ---
      let cleanTxt = txt;
      if (current.title) {
        // "Project: SleeQC" -> match "SleeQC: "
        const shortTitle = current.title.replace(/^Project:\s*/i, "").split(/[—–-]/)[0].trim();
        if (shortTitle.length > 2) {
          const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Strip "SleeQC: " from start of detail
          const regex = new RegExp(`^${escapeRegExp(shortTitle)}:\\s*`, 'i');
          cleanTxt = txt.replace(regex, "");
        }
      }
      current.details.push(cleanTxt);
    }

    if (current) grouped.push(current);

    // --- FUZZY FOCUS ---
    if (focusChunk && focusChunk.text) {
      // Priority 1: Exact ID Match
      const exactMatch = grouped.find(p => p.sourceIds && p.sourceIds.includes(focusChunk.id));
      if (exactMatch) {
        return {
          title: exactMatch.title,
          details: exactMatch.details,
          categories: exactMatch.categories,
          link: exactMatch.link || null,
        };
      }

      const hit = normalize(focusChunk.text);

      const findBestMatch = (hitText, candidates) => {
        let best = null;
        let bestScore = 0;

        for (const p of candidates) {
          const parts = [
            p.title,
            ...(p.details || []),
            ...Object.values(p.categories).flat()
          ].map(normalize).join(" ");

          if (!parts) continue;

          if (parts.includes(hitText)) return p;

          const hitTokens = new Set(hitText.split(" "));
          const partTokens = new Set(parts.split(" "));
          let overlap = 0;
          for (const t of hitTokens) if (partTokens.has(t)) overlap++;
          const ratio = overlap / Math.max(1, hitTokens.size);

          if (ratio > bestScore) {
            bestScore = ratio;
            best = p;
          }
        }

        return bestScore >= 0.3 ? best : null;
      };

      const match = findBestMatch(hit, grouped);
      if (match)
        return {
          title: match.title,
          details: match.details,
          categories: match.categories,
          link: match.link || null,
        };
    }

    // --- FLATTENED VIEW ---
    const allProjects = grouped.map((p) => ({
      title: p.title,
      details: p.details,
      categories: p.categories,
      link: p.link,
    }));

    return allProjects.length ? allProjects : { title: "Projects", details: [] };
  },

  "[EXPERIENCE]": (chunks = [], focusChunk = null) => {
    const isHeader = (t) => /^\[.*\]$/.test(String(t || "").trim());
    const normalize = (s) =>
      String(s || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    const grouped = [];
    let current = null;

    for (const chunk of chunks) {
      const txt = String(chunk.text || "").trim();
      if (!txt || isHeader(txt)) continue;

      // --- START OF NEW EXPERIENCE ENTRY ---
      if (/—/.test(txt)) {
        if (current) grouped.push(current);

        // Split into Org and Role
        const match = txt.match(/^(.*?)\s*[–—-]\s*(.*)$/);
        const orgPart = match?.[1]?.trim() ?? txt;
        const rolePart = match?.[2]?.trim() ?? "";

        // Split role from its trailing description
        const descMatch = rolePart.match(
          /^(.*?\b(?:Engineer|Intern|Developer|Lead|Researcher|Associate|Fellow)\b)(?:\s+(?:at|for|building|working|developing|focused|contributing)\b\s*(.*))?/i
        );

        const roleTitle = descMatch?.[1]?.trim() ?? rolePart;
        const desc =
          descMatch?.[2]?.trim() ??
          (rolePart !== roleTitle ? rolePart : "");

        current = {
          org: orgPart,
          role: roleTitle,
          details: desc ? [desc] : [],
          categories: {},
          link: null,
          sourceIds: [chunk.id],
        };
        continue;
      }

      if (!current) continue;

      // Capture ID for current group
      if (chunk.id) current.sourceIds.push(chunk.id);

      // --- LINK HANDLING ---
      if (/Link:/i.test(txt) || /(https?:\/\/\S+)/i.test(txt)) {
        const m = txt.match(/https?:\/\/\S+/i);
        if (m) current.link = m[0];
        continue;
      }

      // --- CATEGORY EXTRACTION (Skills/Tools) ---
      // 1. Explicit Lines
      const skillsMatch = txt.match(/^(?:Skills|Tools|Environment|Tech):\s*(.*)/i);
      if (skillsMatch) {
        const items = skillsMatch[1].split(/,\s*|\s+\|\s+/).filter(Boolean);
        current.categories["Skills"] = items;
        continue;
      }

      // 2. Keyword Scanning
      TECH_KEYWORDS.forEach(tech => {
        const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(
          tech === "C++" ? "C\\+\\+" :
            tech === ".NET" ? "\\.NET" :
              `\\b${escaped}\\b`, 'i'
        );
        if (regex.test(txt)) {
          if (!current.categories["Skills"]) current.categories["Skills"] = [];
          if (!current.categories["Skills"].includes(tech)) {
            current.categories["Skills"].push(tech);
          }
        }
      });

      // --- ADD DETAIL LINE ---
      let cleanTxt = txt;
      if (current.org) {
        // "NIT Trichy — Research Intern" -> match "NIT Trichy: "
        const shortOrg = current.org.split(/[—–-]/)[0].trim();
        if (shortOrg.length > 2) {
          const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`^${escapeRegExp(shortOrg)}:\\s*`, 'i');
          cleanTxt = txt.replace(regex, "");
        }
      }
      current.details.push(cleanTxt);
    }

    if (current) grouped.push(current);

    // --- FUZZY FOCUS MATCH ---
    if (focusChunk && focusChunk.text) {
      // Priority 1: Exact ID Match
      const exactMatch = grouped.find(p => p.sourceIds && p.sourceIds.includes(focusChunk.id));
      if (exactMatch) {
        return {
          title: `${exactMatch.org} — ${exactMatch.role}`,
          details: exactMatch.details,
          categories: exactMatch.categories,
          link: exactMatch.link || null,
        };
      }

      const hit = normalize(focusChunk.text);

      const findBestMatch = (hitText, candidates) => {
        let best = null;
        let bestScore = 0;

        for (const e of candidates) {
          const parts = [
            e.org,
            e.role,
            ...(e.details || []),
            ...Object.values(e.categories).flat()
          ]
            .map(normalize)
            .join(" ");
          if (!parts) continue;

          if (parts.includes(hitText)) return e;

          const hitTokens = new Set(hitText.split(" "));
          const partTokens = new Set(parts.split(" "));
          let overlap = 0;
          for (const t of hitTokens) if (partTokens.has(t)) overlap++;
          const ratio = overlap / Math.max(1, hitTokens.size);

          if (ratio > bestScore) {
            bestScore = ratio;
            best = e;
          }
        }

        return bestScore >= 0.3 ? best : null;
      };

      const match = findBestMatch(hit, grouped);
      if (match)
        return {
          title: `${match.org} — ${match.role}`,
          details: match.details,
          categories: match.categories,
          link: match.link || null,
        };
    }

    // --- FLATTENED MULTI-ENTRY LIST ---
    const allExperiences = grouped.map((e) => ({
      title: `${e.org} — ${e.role}`,
      details: e.details,
      categories: e.categories,
      link: e.link,
    }));

    return allExperiences.length
      ? allExperiences
      : { title: "Experience", details: [] };
  },
  "[SKILLS]": () => ({
    title: "Technical Skill Stack",
    items: [
      "Languages: Python, JavaScript",
      "Frameworks: React.js, Node.js, Express.js, Tailwind CSS",
      "Backend: REST APIs, MongoDB, Express",
      "AI/ML: TensorFlow, PyTorch, scikit-learn, TinyML, TFLite Micro",
      "Visualization: NumPy, Pandas, GSAP, Three.js",
      "Deployment: Git, GitHub, ESP-IDF, Docker",
      "Specializations: Edge AI, Post-Quantum Cryptography",
    ],
  }),

  "[CERTIFICATIONS]": (chunks = []) => {
    const certs = chunks
      .filter((c) => c.id && c.id.startsWith("cert_"))
      .map((c) => {
        const raw = String(c.text || "").replace(/^\[CERTIFICATION\]\s*/i, "").trim();

        // Extract fields using generic "Key: Value" regex
        const extract = (key) => {
          const match = raw.match(new RegExp(`${key}:\\s*(.*?)(?=\\s+(?:Title|Issuer|Issued|Credential ID|Skills):|$)`, 'i'));
          return match ? match[1].trim() : null;
        };

        return {
          title: extract("Title") || "Certification",
          issuer: extract("Issuer"),
          date: extract("Issued"),
          credentialId: extract("Credential ID"),
          skills: extract("Skills") ? extract("Skills").split(",").map(s => s.trim()) : []
        };
      });

    return {
      title: "Certifications & Awards",
      certifications: certs
    };
  },

  "[EDUCATION]": (eduChunks = [], focusChunk = null, allChunksForContext = []) => {
    // If data fed is the whole corpus, fallback to filter by prefix
    const chunks = (Array.isArray(eduChunks) && eduChunks.length > 0 && eduChunks.every(c => c && typeof c.text === "string"))
      ? eduChunks
      : (allChunksForContext || []);

    // locate the index of the [EDUCATION] header within provided chunks (prefer chunks param)
    let headerIndex = -1;
    for (let i = 0; i < chunks.length; i++) {
      if (/\[EDUCATION\]/i.test(String(chunks[i].text || ""))) { headerIndex = i; break; }
    }
    // if not found, try searching full context (allChunksForContext)
    if (headerIndex === -1 && Array.isArray(allChunksForContext)) {
      for (let i = 0; i < allChunksForContext.length; i++) {
        if (/\[EDUCATION\]/i.test(String(allChunksForContext[i].text || ""))) { headerIndex = i; break; }
      }
      // set chunks to slice from allChunksForContext if we found header there
      if (headerIndex !== -1) {
        const entries = allChunksForContext.slice(headerIndex).filter(c => c.id && c.id.startsWith("edu_"));
        // first line is degree+institute, rest are details
        const first = entries[0]?.text?.replace(/^\[EDUCATION\]\s*/i, "").trim() || "";
        const rest = entries.slice(1).map(c => String(c.text || "").trim());
        const parts = first.split("—").map(s => s.trim());
        const degree = parts[0] || first;
        const institute = parts[1] || "";
        const link = rest.find(t => /(https?:\/\/\S+)/i.test(t))?.match(/https?:\/\/\S+/i)?.[0] || null;
        const details = rest.filter(t => !/(https?:\/\/\S+)/i.test(t));
        if (focusChunk && String(focusChunk.id || "").startsWith("edu_")) {
          return { title: `${degree}${institute ? " — " + institute : ""}`, details, link };
        }
        return [{ title: `${degree}${institute ? " — " + institute : ""}`, details, link }];
      }
    }

    // If header found inside chunks param
    if (headerIndex !== -1) {
      const entries = chunks.slice(headerIndex).filter(c => c.id && c.id.startsWith("edu_"));
      const first = entries[0]?.text?.replace(/^\[EDUCATION\]\s*/i, "").trim() || "";
      const rest = entries.slice(1).map(c => String(c.text || "").trim());
      const parts = first.split("—").map(s => s.trim());
      const degree = parts[0] || first;
      const institute = parts[1] || "";
      const link = rest.find(t => /(https?:\/\/\S+)/i.test(t))?.match(/https?:\/\/\S+/i)?.[0] || null;
      const details = rest.filter(t => !/(https?:\/\/\S+)/i.test(t));
      if (focusChunk && String(focusChunk.id || "").startsWith("edu_")) {
        return { title: `${degree}${institute ? " — " + institute : ""}`, details, link };
      }
      return [{ title: `${degree}${institute ? " — " + institute : ""}`, details, link }];
    }

    // fallback: try to aggregate any edu_ prefixed chunks grouped by proximity
    const allEdu = (allChunksForContext || []).filter(c => c.id && c.id.startsWith("edu_"));
    if (allEdu.length) {
      // try same logic on allEdu
      const first = allEdu[0].text.replace(/^\[EDUCATION\]\s*/i, "").trim();
      const rest = allEdu.slice(1).map(c => String(c.text || "").trim());
      const parts = first.split("—").map(s => s.trim());
      const degree = parts[0] || first;
      const institute = parts[1] || "";
      const link = rest.find(t => /(https?:\/\/\S+)/i.test(t))?.match(/https?:\/\/\S+/i)?.[0] || null;
      const details = rest.filter(t => !/(https?:\/\/\S+)/i.test(t));
      if (focusChunk && String(focusChunk.id || "").startsWith("edu_")) {
        return { title: `${degree}${institute ? " — " + institute : ""}`, details, link };
      }
      return [{ title: `${degree}${institute ? " — " + institute : ""}`, details, link }];
    }

    return { title: "Education", details: [] };
  },



  "[CONTACT]": (chunks = []) => {
    const raw = chunks
      .filter((c) => c.id && c.id.startsWith("contact_"))
      .map((c) => String(c.text || "").replace(/^\[CONTACT\]\s*/i, "").trim())
      .join(" ");

    // Parse specific fields
    const contact = [];

    // Helper to extract value by key
    const extract = (key) => {
      const match = raw.match(new RegExp(`${key}:\\s*(\\S+)`, 'i'));
      return match ? match[1] : null;
    };

    const email = extract("Email");
    if (email) contact.push({ label: "Email", value: email, link: `mailto:${email}` });

    const github = extract("GitHub");
    if (github) contact.push({ label: "GitHub", value: "Divyesh-Kamalanaban", link: github });

    const linkedin = extract("LinkedIn");
    if (linkedin) contact.push({ label: "LinkedIn", value: "in/divyesh-kamalanaban", link: linkedin });

    const portfolio = extract("Portfolio");
    if (portfolio) contact.push({ label: "Portfolio", value: "divyesh.is-a.dev", link: portfolio });

    const blog = extract("Blog");
    if (blog) contact.push({ label: "Blog", value: "divyesh.is-cool.dev", link: blog });

    return {
      title: "Contact Information",
      contact: contact
    };
  },
};

// --- MAIN ENTRY: renderChunk ---
// chunk: object returned by retrieval { id, text, score? }
// allChunks: full corpus array of chunk objects (ordered)
export function renderChunk(chunk, allChunks = []) {
  if (!chunk || !allChunks || !Array.isArray(allChunks)) {
    return { title: null, description: chunk?.text ?? "" };
  }

  // If there's an exact renderer keyed by id (static single-chunk renderers), use it.
  if (chunkRenderers[chunk.id]) {
    try {
      return chunkRenderers[chunk.id](allChunks, chunk);
    } catch {
      // fallback to raw chunk text
      return { title: null, description: chunk.text };
    }
  }

  // If the chunk itself is a section tag like "[PROJECTS]" or "[EXPERIENCE]", call that renderer with full section chunks
  const sectionTagMatch = String(chunk.text || "").match(
    /\[(SUMMARY|PROJECTS|EXPERIENCE|SKILLS|CERTIFICATIONS|EDUCATION|CONTACT)\]/
  );
  if (sectionTagMatch) {
    const tag = sectionTagMatch[0];
    // collect all chunks for that section by prefix
    let sectionChunks = [];
    if (tag.toUpperCase().includes("PROJECT")) {
      sectionChunks = allChunks.filter((c) => c.id && c.id.startsWith("proj_"));
      return chunkRenderers["[PROJECTS]"](sectionChunks, null);
    }
    if (tag.toUpperCase().includes("EXPERIENCE")) {
      sectionChunks = allChunks.filter((c) => c.id && c.id.startsWith("exp_"));
      return chunkRenderers["[EXPERIENCE]"](sectionChunks, null);
    }
    if (tag.toUpperCase().includes("CONTACT")) {
      sectionChunks = allChunks.filter((c) => c.id && c.id.startsWith("contact_"));
      return chunkRenderers["[CONTACT]"](sectionChunks);
    }
    if (tag.toUpperCase().includes("CERTIFICATION")) {
      sectionChunks = allChunks.filter((c) => c.id && c.id.startsWith("cert_"));
      return chunkRenderers["[CERTIFICATIONS]"](sectionChunks);
    }
    // generic handlers
    if (chunkRenderers[tag]) {
      // feed entire corpus so these group renderers can filter by prefix internally
      return chunkRenderers[tag](allChunks);
    }
  }

  // If a project fragment was retrieved, give the projects renderer full project corpus + focusChunk
  if (String(chunk.id || "").startsWith("proj_")) {
    const projChunks = allChunks.filter((c) => c.id && c.id.startsWith("proj_"));
    const res = chunkRenderers["[PROJECTS]"](projChunks, chunk);
    if (Array.isArray(res)) return { title: res, score: chunk.score };
    return { ...res, score: chunk.score };
  }

  // If an experience fragment was retrieved, same approach
  if (String(chunk.id || "").startsWith("exp_")) {
    const expChunks = allChunks.filter((c) => c.id && c.id.startsWith("exp_"));
    const res = chunkRenderers["[EXPERIENCE]"](expChunks, chunk);
    if (Array.isArray(res)) return { title: res, score: chunk.score };
    return { ...res, score: chunk.score };
  }

  // If a contact fragment was retrieved
  if (String(chunk.id || "").startsWith("contact_")) {
    const contactChunks = allChunks.filter((c) => c.id && c.id.startsWith("contact_"));
    const res = chunkRenderers["[CONTACT]"](contactChunks);
    return { ...res, score: chunk.score };
  }

  // If a certification fragment was retrieved
  if (String(chunk.id || "").startsWith("cert_")) {
    const certChunks = allChunks.filter((c) => c.id && c.id.startsWith("cert_"));
    const res = chunkRenderers["[CERTIFICATIONS]"](certChunks);
    return { ...res, score: chunk.score };
  }

  // fallback: no grouping applicable
  return { title: null, description: chunk.text, score: chunk.score };
}
