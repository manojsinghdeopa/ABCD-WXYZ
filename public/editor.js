// editor.js
import { translateText, translateTexts } from './translation-utils.js';

let firstTextEntered = false;

async function translateAndRevealTexts() {
    const texts = ["Title", "Logo", "Text: 👉 Click here to write with AI", "Select Category"];
    const translatedTexts = await translateTexts(texts);

    revealText("label-title", translatedTexts[0], 50);
    revealText("label-icon", translatedTexts[1], 50);
    revealText("label-text", translatedTexts[2], 50);
    revealText("label-content-type", translatedTexts[3], 50);
}

async function revealText(elementId, text, delay) {
    const element = document.getElementById(elementId);
    let index = 0;

    function addCharacter() {
        element.textContent += text[index++];
        if (index < text.length) {
            setTimeout(addCharacter, delay);
        } else {
            element.style.width = "auto";
        }
    }

    addCharacter();
}

function execCommand(command) {
    document.execCommand(command);
}

function insertLink() {
    const url = prompt("Enter the URL:");
    if (url) document.execCommand("createLink", false, url);
}

function insertImage() {
    const url = prompt("Enter the image URL:");
    if (url) document.execCommand('insertImage', false, url);
}

function insertHorizontalRule() {
    document.execCommand('insertHorizontalRule', false, null);
}

function undo() {
    document.execCommand('undo');
}

function redo() {
    document.execCommand('redo');
}

function changeFont(font) {
    document.execCommand('fontName', false, font);
}

function changeHeading(heading) {
    document.execCommand('formatBlock', false, heading);
}

function changeTextColor(color) {
    document.execCommand('foreColor', false, color);
}

function changeTextSize(size) {
    document.execCommand('fontSize', false, size);
}

function checkFirstText() {
    if (!firstTextEntered) {
        const editor = document.getElementById('editor');
        const firstChild = editor.firstChild;
        if (firstChild && firstChild.nodeType === Node.TEXT_NODE && firstChild.textContent.trim() !== "") {
            document.execCommand('formatBlock', false, 'h1');
            firstTextEntered = true;
        }
    }
}

function handleCoverPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const imageUrl = e.target.result;
        document.getElementById('cover-preview').innerHTML = `<img src="${imageUrl}" alt="Cover Photo">`;
        document.getElementById('book-cover').setAttribute('data-url', imageUrl);
    };
    reader.readAsDataURL(file);
}

function showCustomAlert(message, onClose) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
        z-index: 9999;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white; padding: 20px; border-radius: 10px; width: 280px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); text-align: center;
    `;

    const msg = document.createElement('p');
    msg.textContent = message;
    msg.style.marginBottom = '20px';

    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.cssText = `
        padding: 8px 16px; border: none; border-radius: 6px;
        background: #445F87; color: white; cursor: pointer;
    `;

    okBtn.onclick = () => {
        overlay.remove();
        if (onClose) onClose();
    };

    dialog.appendChild(msg);
    dialog.appendChild(okBtn);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

async function preview() {
    const title = document.getElementById('book-title').textContent;
    const text = document.getElementById('editor').innerHTML;
    const icon = document.getElementById('book-cover').getAttribute('data-url');
    const contentTypeSelector = document.querySelector('#book-content-type');

    const translatedTitleAlert = await translateText("Please Add Title !");
    const translatedTextAlert = await translateText("Please Add Text !");
    const translatedIconAlert = await translateText("Please Add Logo !");

    if (!title.trim()) {
        showCustomAlert(translatedTitleAlert);
        return;
    }
    if (!text.trim()) {
        showCustomAlert(translatedTextAlert);
        return;
    }
    if (!icon) {
        showCustomAlert(translatedIconAlert);
        return;
    }

    const data = {
        title: title.trim(),
        text: text.trim(),
        icon: icon,
        name: window.userName,
        content_type: contentTypeSelector.value
    };

    sessionStorage.setItem('data', JSON.stringify(data));
    const previewPageUrl = `reader?action=preview`;
    window.open(previewPageUrl);
}

// Expose functions globally
window.execCommand = execCommand;
window.insertLink = insertLink;
window.insertImage = insertImage;
window.insertHorizontalRule = insertHorizontalRule;
window.undo = undo;
window.redo = redo;
window.changeFont = changeFont;
window.changeHeading = changeHeading;
window.changeTextColor = changeTextColor;
window.changeTextSize = changeTextSize;
window.handleCoverPhoto = handleCoverPhoto;
window.checkFirstText = checkFirstText;
window.preview = preview;

// Start translations
translateAndRevealTexts();
