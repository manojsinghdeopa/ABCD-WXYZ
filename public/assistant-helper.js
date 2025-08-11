import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { marked } from "https://esm.run/marked";

// Fetch API key from server
// If you need a new API key, get it from https://makersuite.google.com/app/apikey please do not use this one. OKAY 
const API_KEY = /* await (await fetch("API_KEY")).text() */ 'AIzaSyBkuxn-RDRAwrRKWbyl4Ef4m05aklyhSpA';
const AI_MODEL = "gemini-2.5-flash-lite"

// Typing speed state (in milliseconds per character)
let baseTypingSpeedMs = 70; // default to Medium

/**
 * Updates the global typing speed used by stream generation.
 * @param {number} speedMs
 */
export function setTypingSpeed(speedMs) {
  baseTypingSpeedMs = Number(speedMs) || 70;
}

/**
 * Returns the current typing speed in ms per character.
 * @returns {number}
 */
export function getTypingSpeed() {
  return baseTypingSpeedMs;
}

/**
 * Returns a model instance.
 *
 * @param {GoogleGenerativeAI.ModelParams} params
 * @returns {GoogleGenerativeAI.GenerativeModel}
 */
export async function getGenerativeModel(params) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  // For text-only inputs, use the gemini-pro model
  return genAI.getGenerativeModel(params);
}



/**
 * Converts a File object to a GoogleGenerativeAI.Part object.
 *
 * @param {Blob} file
 * @returns {GoogleGenerativeAI.Part}
 */
export async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}



/**
 * Scrolls the document all the way to the bottom.
 */
export function scrollToDocumentBottom() {
  const scrollingElement = document.scrollingElement || document.body;
  scrollingElement.scrollTop = scrollingElement.scrollHeight;
}


export function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('Text copied to clipboard!');
}



/**
 * Updates the `resultEl` with parsed markdown text returned by a `getResult()` call.
 *
 * @param {HTMLElement}} resultEl
 * @param {() => Promise<GoogleGenerativeAI.GenerateContentResponse>} getResult
 * @param {boolean} streaming
 */
export async function updateUI(resultEl, getResult, streaming) {
  resultEl.className = "loading";
  let text = "";
  try {
    const result = await getResult();

    if (streaming) {
      resultEl.innerText = "";
      for await (const chunk of result.stream) {
        // Get first candidate's current text chunk
        const chunkText = chunk.text();
        text += chunkText;
        resultEl.innerHTML = marked.parse(text);
        scrollToDocumentBottom();
      }
    } else {
      const response = await result.response;
      text = response.text();
    }

    resultEl.className = ""; // Remove .loading class
  } catch (err) {
    // text += "\n\n> " + err;
    text += "\n\n> " + '';
    resultEl.className = "error";
  }
  resultEl.innerHTML = marked.parse(text);
  scrollToDocumentBottom();

  // Add copy icon dynamically when .loading class is removed
  if (!resultEl.classList.contains("loading")) {
    const copyIcon = document.createElement('span');
    copyIcon.classList.add('copy-icon');
    copyIcon.textContent = '📋';
    copyIcon.style.cursor = 'pointer';
    copyIcon.addEventListener('click', function () {
      copyToClipboard(resultEl.innerText);
    });

    // Append the copy icon to the resultEl
    resultEl.appendChild(copyIcon);
  }

}



export async function streamGenerateText(prompt, onChunk) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: AI_MODEL });

  const result = await model.generateContentStream(prompt);
  const stream = result.stream;

  let buffer = "";
  let renderBuffer = "";
  let wordBuffer = "";

  const minChunkSize = 2;
  const maxChunkSize = 5;

  // Dynamic chunk size based on speed
  function getChunkSize() {
    const currentSpeed = getTypingSpeed();
    return Math.max(
      minChunkSize,
      Math.min(maxChunkSize, Math.round(150 / currentSpeed))
    );
  }

  // Adds random human-like delay variation
  function randomDelay(base) {
    const jitter = Math.floor(Math.random() * 30) - 15; // ±15 ms variation
    return Math.max(20, base + jitter);
  }

  async function typeText(newText) {
    for (let char of newText) {
      wordBuffer += char;
      renderBuffer += char;

      const isRenderPoint = /\s|[.,!?;:()\n]/.test(char);
      const isMiniChunk = wordBuffer.length >= getChunkSize();

      // Base delay
      let delay = getTypingSpeed();

      // Extra pause rules
      if (char === "." || char === "!" || char === "?") delay += 200;
      else if (char === ",") delay += 100;
      else if (char === "\n") delay += 150;

      if (isRenderPoint || isMiniChunk) {
        const html = marked.parse(renderBuffer);
        onChunk(html);
        if (isRenderPoint) wordBuffer = "";
      }

      await new Promise(res => setTimeout(res, randomDelay(delay)));
    }
  }

  for await (const chunk of stream) {
    const text = chunk.text();
    buffer += text;
    await typeText(text);
  }
}

