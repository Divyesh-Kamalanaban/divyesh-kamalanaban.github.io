
import { renderChunk } from './src/sections/rag-files/chunkParser.js';

const mockAllChunks = [
    {
        id: "contact_0001",
        text: "[CONTACT] Email: divyeshkamalanaban@gmail.com GitHub: https://github.com/Divyesh-Kamalanaban LinkedIn: https://www.linkedin.com/in/divyesh-kamalanaban Portfolio: https://divyesh.is-a.dev Blog: https://divyesh.is-cool.dev",
        score: 0.95
    }
];

const chunk = mockAllChunks[0];

console.log("--- Testing Contact Parser ---");
const result = renderChunk(chunk, mockAllChunks);
console.log(JSON.stringify(result, null, 2));

if (result.contact && result.contact.length === 5) {
    console.log("PASS: Extracted 5 contact items.");
} else {
    console.log("FAIL: Incorrect contact extraction.");
}
