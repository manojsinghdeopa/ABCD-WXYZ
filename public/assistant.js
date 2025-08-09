import { getGenerativeModel, scrollToDocumentBottom, updateUI } from "./assistant-helper.js";

import { translateText, translateTexts } from './translation-utils.js';



let formContainer, promptInput, historyElement, btnWrite;


async function initializeUI() {
    const title = localStorage.getItem("title") || "something";
    const [headerText, placeholderText, buttonText] = await translateTexts([
        "Generative AI - Chat ⤵",
        "Enter your message here",
        "Write"
    ]);


    document.body.innerHTML = `
        <h2>${headerText}</h2>
        <div class="container">
            <div id="chat-history"></div>
        </div>
        <div id="form-container">
            <input id="prompt" value="Write about ${title}" placeholder="${placeholderText}">
            <button id="btn-write" type="submit">${buttonText}</button>
        </div>
    `;
}

// Chat initialization logic
let chat = null;
async function initializeChat() {
    if (!chat) {
        const model = await getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        chat = model.startChat({
            generationConfig: { maxOutputTokens: 5000 },
        });
    }
    return chat;
}

async function handleUserInput() {
    try {
        const chatInstance = await initializeChat();
        const userMessage = promptInput.value.trim();
        if (!userMessage) return;

        promptInput.value = "";
        formContainer.style.display = "none";

        // Append user and model history
        const userMessageElement = createHistoryItem("user-role", userMessage);
        const modelResponseElement = createHistoryItem("model-role");

        historyElement.appendChild(userMessageElement);
        historyElement.appendChild(modelResponseElement);

        scrollToDocumentBottom();

        await updateUI(
            modelResponseElement.querySelector("blockquote"),
            () => chatInstance.sendMessageStream(userMessage),
            true
        );
    } catch (error) {
        console.error("Error handling user input:", error);
    } finally {
        formContainer.style.display = "block";
    }
}

function createHistoryItem(role, content = "") {
    const item = document.createElement("div");
    item.className = `history-item ${role}`;
    const blockquote = document.createElement("blockquote");
    blockquote.textContent = content;
    item.appendChild(blockquote);
    return item;
}

// Set up event listeners
function setupEventListeners() {
    btnWrite.addEventListener("click", handleUserInput);
}

// Main initialization wrapped in DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
    
    await initializeUI();

    formContainer = document.getElementById("form-container");
    promptInput = document.querySelector("#prompt");
    historyElement = document.querySelector("#chat-history");
    btnWrite = document.querySelector("#btn-write");

    setupEventListeners();
});
