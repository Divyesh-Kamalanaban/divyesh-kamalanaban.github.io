
import { renderChunk } from './src/sections/rag-files/chunkParser.js';

const mockAllChunks = [
    {
        id: "cert_0007",
        text: "[CERTIFICATION] Title: Frontend Developer (React) Certificate Issuer: HackerRank Issued: December 2024 Credential ID: 9de990d8b066 Skills: React.js, JavaScript, CSS, Component Architecture",
        score: 0.92
    }
];

const chunk = mockAllChunks[0];

console.log("--- Testing Certification Parser ---");
const result = renderChunk(chunk, mockAllChunks);
console.log(JSON.stringify(result, null, 2));

if (result.certifications && result.certifications[0].title.includes("Frontend Developer")) {
    console.log("PASS: Cert title extracted.");
} else {
    console.log("FAIL: Cert title not found.");
}

if (result.certifications[0].skills.length === 4) {
    console.log("PASS: Skills extracted.");
} else {
    console.log("FAIL: Skills not extracted.");
}
