import { db, collection, query, where, getDocs, deleteDoc, doc, getDoc } from './firebase.js';
import { translateText, translateTexts } from './translation-utils.js';
import { streamGenerateText, setTypingSpeed} from "./assistant-helper.js";


const booksCollectionRef = collection(db, 'books');
const booksGridContainer = document.querySelector('.grid-container');
const labelTextEl = document.getElementById("label-text");
const editorEl = document.getElementById("editor");
const titleEl = document.getElementById("book-title");
const editorTextContainerEl = document.querySelector('.editor-text-container');
let speedControlEl = null;

// Prepare Speed Control UI (hidden by default)
function ensureSpeedControl() {
    if (speedControlEl) return speedControlEl;
    if (!editorTextContainerEl) return null;

    const wrapper = document.createElement('div');
    wrapper.className = 'speed-control';
    wrapper.setAttribute('contenteditable', 'false');
    wrapper.style.display = 'none';

    const label = document.createElement('span');
    label.textContent = '⚡';
    label.style.marginRight = '6px';

    const select = document.createElement('select');
    select.innerHTML = `
        <option value="70" selected>Expert</option>
        <option value="30">Senior</option>
        <option value="1">Master</option>
    `;
    select.addEventListener('change', (e) => {
        setTypingSpeed(Number(e.target.value));
    });

    // default speed
    setTypingSpeed(Number(select.value));

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    editorTextContainerEl.appendChild(wrapper);

    speedControlEl = wrapper;
    return speedControlEl;
}

function showSpeedControl() {
    const el = ensureSpeedControl();
    if (el) el.style.display = 'flex';
}

function hideSpeedControl() {
    if (speedControlEl) speedControlEl.style.display = 'none';
}


async function fetchImageByTitle(title) {
    // https://pixabay.com/api/docs/ - get your own key, do not use it please.
    const url = `https://pixabay.com/api/?key=49657160-a152b5ae10e5ac6c6af772a3f&q=${encodeURIComponent(title)}&image_type=photo&orientation=vertical`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.hits && data.hits.length > 0) {
        // return data.hits[0].webformatURL; // Or largeImageURL for higher res
        return data.hits[0].previewURL; // ~150px thumbnail (closest to 100x100)
    } else {
        throw new Error("No image found for this title.");
    }
}




labelTextEl.addEventListener("click", async () => {
    const title = titleEl.innerText.trim();
    if (!title) {
        const translatedTextAlert = await translateText("Please enter a title first.");
        showCustomAlert(translatedTextAlert);
        return;
    }

    const prompt = `Write an article about: ${title}`;

    // const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    // const prompt = `Write an article about: "${title}" in this language code "${selectedLanguage}". Use the tone of a professional writer.`;

    editorEl.innerHTML = "";
    editorEl.classList.add("loading");
    editorEl.style.paddingBottom = "25px";
    
    // Disable the label to prevent multiple clicks
    labelTextEl.style.pointerEvents = "none";
    labelTextEl.style.opacity = "0.6";
    labelTextEl.style.cursor = "not-allowed";

    // Hide the format buttons toolbar
    const formatButtonsInline = document.querySelector('.format-buttons-inline');
    if (formatButtonsInline) formatButtonsInline.style.display = "none";
    // Show speed control only during generation
    showSpeedControl();

    try {
        await streamGenerateText(prompt, (html) => {
            editorEl.innerHTML = html;
            editorEl.scrollTop = editorEl.scrollHeight;
        });

        // Fetch and apply image
        try {
            const imageUrl = await fetchImageByTitle(title);
            document.getElementById('cover-preview').innerHTML = `<img src="${imageUrl}" alt="Cover Photo">`;
            document.getElementById('book-cover').setAttribute('data-url', imageUrl);
        } catch (error) {
            console.error("Could not fetch cover image:", error);
        }
    } finally {
        editorEl.classList.remove("loading");

        // Re-enable the label after generation is complete
        labelTextEl.style.pointerEvents = "auto";
        labelTextEl.style.opacity = "1";
        labelTextEl.style.cursor = "pointer";

        // Show the format buttons toolbar again
        if (formatButtonsInline) formatButtonsInline.style.display = "";
        // Hide speed control after generation is done
        hideSpeedControl();
    }


});


fetchContentTypeList();
async function fetchContentTypeList() {

    try {
        const response = await fetch('contentTypeList.json');
        if (!response.ok) {
            throw new Error('Failed to load content types.');
        }
        const data = await response.json();
        const contentTypes = data.content_type_list;
        contentTypes.sort((a, b) => a.localeCompare(b));
        const selectElement = document.querySelector('#book-content-type');
        contentTypes.forEach((contentType) => {
            const option = document.createElement('option');
            option.textContent = contentType;
            selectElement.appendChild(option);
        });


    } catch (error) {
        console.error('Error loading content types:', error);
    }

}


fetchBooks();
async function fetchBooks() {
    try {
        const q = query(booksCollectionRef, where("userId", "==", localStorage.getItem('uid')));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            console.log('No books found for this user.');
            return;
        }

        const sortedDocs = snapshot.docs
            .map(doc => ({ id: doc.id, data: doc.data() }))
            .sort((a, b) => b.data.created_at - a.data.created_at);

        sortedDocs.forEach(({ data, id }) => {
            const card = createCard(data, id);
            card.addEventListener('click', () => {
                showDetail(data, id);
            });
            booksGridContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching books for the user:', error);
    }
}

function createCard(data, id) {
    const image = createElementWithClass('img', 'book-image', {
        src: data.icon,
        alt: data.title,
        width: '100',
        height: '115'
    });

    let status = '';
    if (data.in_review) {
        status = ' ( In Review ) ';
    }

    const imageContainer = createElementWithClass('div', 'image-container', {}, [image]);

    const title = createElementWithClass('h2', 'title', {
        textContent: data.title || 'Title'
    });
    const category = createElementWithClass('h5', 'category', {
        textContent: (data.content_type || 'New') + status
    });
    const bells = createElementWithClass('h5', 'bells', {
        textContent: `🔔 ${data.bells || '0'}`
    });

    const deleteButton = createElementWithClass('button', 'delete-button', {
        textContent: 'Delete'
    });

    const cardElement = createElementWithClass('div', 'card', {}, [imageContainer]);

    const textContainer = createElementWithClass('div', 'text-container', {}, [title, category, bells, deleteButton]);
    cardElement.appendChild(textContainer);

    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showDeleteDialog({
            message: 'Are you sure, want to delete this Article ?',
            onDelete: async () => {
                try {
                    await deleteDoc(doc(booksCollectionRef, id));
                    cardElement.remove();
                } catch (error) {
                    console.error('Error deleting book:', error);
                }
            }
        });
    });

    return cardElement;
}


function createElementWithClass(elementType, className, attributes = {}, children = []) {
    const element = document.createElement(elementType);
    element.classList.add(className);
    Object.entries(attributes).forEach(([key, value]) => element[key] = value);
    children.forEach(child => element.appendChild(child));
    return element;
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
        background: #007bff; color: white; cursor: pointer;
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


function showDeleteDialog({ onDelete, onCancel }) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
        z-index: 9999;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white; padding: 20px; border-radius: 10px; width: 220px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); text-align: center;
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        display: flex; justify-content: space-between;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
        flex: 1; margin-right: 10px; padding: 8px 0;
        border: none; border-radius: 6px; background: #ccc; cursor: pointer;
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.cssText = `
        flex: 1; padding: 8px 0;
        border: none; border-radius: 6px; background: #ff5c5c; color: white; cursor: pointer;
    `;

    cancelBtn.onclick = () => {
        overlay.remove();
        onCancel && onCancel();
    };

    deleteBtn.onclick = () => {
        overlay.remove();
        onDelete && onDelete();
    };

    buttonsContainer.appendChild(cancelBtn);
    buttonsContainer.appendChild(deleteBtn);
    dialog.appendChild(buttonsContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}


function showDetail(data, docId) {
    sessionStorage.setItem('data', JSON.stringify(data));
    let titleForUrl = data.title.replace(/[\W_]+/g, '-');
    const readerPageUrl = `reader?title=${titleForUrl}&id=${docId}`;
    window.open(readerPageUrl);
}

