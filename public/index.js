import * as firebase from './firebase.js';
import { translateText, translateTexts } from './translation-utils.js';
const { auth, analytics, db, signInAnonymously, logEvent, collection, query, where, getDocs, startAfter, limit } = firebase;


const BOOKS_COLLECTION = 'books';
const BOOKS_LIMIT = 5;
const loadingSpinnerElement = document.getElementById('loadingSpinner');
const contentListElement = document.getElementById('contentList');
let lastDocument = null;
let selectedContentType = '';
let contentTypeList = null;



loadContentTypes();

authanticate();

setupFloatingFab();




function setupFloatingFab() {
    const mainFab = document.getElementById('mainFab');
    mainFab.addEventListener('click', () => {
        openPopUpWindow('editor');
    });
}




// AUTH 

function authanticate() {
    auth.onAuthStateChanged(user => {
        if (user) {
            localStorage.setItem('uid', user.uid);
        } else {
            signInAnonymously(auth).then(cred => {
                localStorage.setItem('uid', cred.user.uid);
            });
        }
    });
}




// Content type list

async function loadContentTypes() {
    try {
        const response = await fetch('contentTypeList.json');
        if (!response.ok) {
            throw new Error('Failed to load content types.');
        }
        const data = await response.json();
        contentTypeList = data.content_type_list.map(contentType => ({
            originalName: contentType,
            translatedName: '' // Placeholder for translated name
        }));

        if (contentTypeList && contentTypeList.length > 0) {
            // Translate all content types at once
            await translateContentTypes(contentTypeList);
        }

        displayContentTypes();

    } catch (error) {
        console.error('Error loading content types:', error);
    }
}


async function translateContentTypes(contentTypes) {
    try {
        const texts = contentTypes.map(ct => ct.originalName);
        const translations = await translateTexts(texts);

        contentTypes.forEach((ct, i) => {
            ct.translatedName = translations[i];
        });
    } catch (error) {
        console.error('Error translating content types:', error);
    }
}



function displayContentTypes() {
    const fragment = document.createDocumentFragment();
    // Shuffle the content type list
    contentTypeList.sort(() => Math.random() - 0.5);
    contentTypeList.forEach((contentType) => {
        const card = createContentTypeCard(
            contentType.translatedName || contentType.originalName  // Display translated or original content type
        );
        card.addEventListener('click', () => fetchBooksForContentType(contentType.originalName));
        fragment.appendChild(card);
    });

    contentListElement.innerHTML = '';
    contentListElement.appendChild(fragment);
    hideLoading();
}



// Content type's data
function fetchBooksForContentType(contentType) {

    selectedContentType = contentType;
    const contentTypeQuery = query(
        collection(db, BOOKS_COLLECTION),
        where('content_type', '==', contentType),
        limit(BOOKS_LIMIT)
    );

    fetchBooks(contentTypeQuery);
}

function getNextQuery() {
    return query(
        collection(db, BOOKS_COLLECTION),
        where('content_type', '==', selectedContentType),
        startAfter(lastDocument),
        limit(BOOKS_LIMIT)
    );
}


async function translateBook(book) {
    try {
        book.title = await translateText(book.title);
    } catch (error) {
        console.error('Error translating book title:', error);
    }
    return book;
}


async function fetchBooks(q) {
    try {
        showLoading();
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            hideLoading();
            console.log('No more books to display.');
            return;
        }

        const fragment = document.createDocumentFragment();
        let isFirst = true;

        const translatedBooks = await Promise.all(
            snapshot.docs.map(async (doc) => {
                let data = doc.data();
                if (isFirst) {
                    data = await translateBook(data);
                    isFirst = false;
                }
                return { data, id: doc.id };
            })
        );

        translatedBooks.forEach(({ data, id }) => {
            const card = createCard(data);
            card.addEventListener('click', () => showDetail(data, id));
            fragment.appendChild(card);
        });

        // Book list container (grid layout)
        const bookListContainer = document.createElement('div');
        bookListContainer.className = 'book-list';
        bookListContainer.style.display = 'grid';
        bookListContainer.style.gap = '1rem';
        bookListContainer.appendChild(fragment);

        // Next button wrapper to align right
        const nextBtnWrapper = document.createElement('div');
        nextBtnWrapper.style.display = 'flex';
        nextBtnWrapper.style.justifyContent = 'flex-end';
        nextBtnWrapper.style.marginTop = '1rem';
        nextBtnWrapper.style.marginBottom = '1.5rem';

        const nextBtn = document.createElement('button');
        nextBtn.innerText = 'Next';
        nextBtn.style.padding = '0.5rem 1rem';
        nextBtn.style.fontSize = '1rem';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.border = '1px solid #ccc';
        nextBtn.style.borderRadius = '4px';
        nextBtn.style.backgroundColor = '#f5f5f5';

        nextBtn.addEventListener('click', nextBtnClick);
        nextBtnWrapper.appendChild(nextBtn);

        // Outer wrapper (no max height or scroll)
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '1rem';

        wrapper.appendChild(bookListContainer);
        wrapper.appendChild(nextBtnWrapper);

        openPopUpWindowWithElement(wrapper);

        hideLoading();
        updateLastDocument(snapshot);
    } catch (error) {
        console.error('Error fetching books:', error);
        hideLoading();
    }
}









// UI FUNCTIONS

function nextBtnClick() {
    if (lastDocument) {
        const nextQuery = getNextQuery();
        fetchBooks(nextQuery);
    } else {
        hideLoading();
    }
}

function showDetail(data, id) {
    localStorage.setItem('title', data.title);
    sessionStorage.setItem('data', JSON.stringify(data));
    // const titleForUrl = data.title.replace(/[\W_]+/g, '-');
    const titleForUrl = (data.title || 'Untitled').trim().replace(/\s+/g, '-');
    const readerPageUrl = `reader?title=${titleForUrl}&id=${id}`;
    openPopUpWindow(readerPageUrl);
    // window.open(readerPageUrl);
    logEvent(analytics, 'article_read', { title: data.title, content_type: data.content_type });
}


function updateLastDocument(snapshot) {
    lastDocument = snapshot.docs[snapshot.docs.length - 1];
}


function createContentTypeCard(contentType) {
    const text = createElementWithClass('p', 'animated-text');
    animateText(text, contentType);
    const card = createElementWithClass('div', 'staggered-card', {}, [text]);
    return card;
}


function createCard(data) {
    const image = createElementWithClass('img', 'book-image', { src: data.icon, alt: data.title, width: '100', height: '115' });
    const imageContainer = createElementWithClass('div', 'image-container', {}, [image]);
    const title = createElementWithClass('h3', 'title');
    const textContainer = createElementWithClass('div', 'text-container', {}, [title]);
    const card = createElementWithClass('div', 'card', {}, [imageContainer, textContainer]);

    animateText(title, data.title || 'Title');
    return card;
}

function animateText(element, text, duration = 777) {
    const characters = text.split('');
    let index = 0;
    const interval = duration / text.length;

    const timer = setInterval(() => {
        if (index < characters.length) {
            element.textContent += characters[index];
            index++;
        } else {
            clearInterval(timer);
        }
    }, interval);
}


function createElementWithClass(elementType, className, attributes = {}, children = []) {
    const element = document.createElement(elementType);
    element.classList.add(className);
    Object.entries(attributes).forEach(([key, value]) => element[key] = value);
    children.forEach(child => element.appendChild(child));
    return element;
}




function showLoading() {
    loadingSpinnerElement.style.display = 'flex';
}

function hideLoading() {
    loadingSpinnerElement.style.display = 'none';
}

function openPopUpWindow(pageUrl) {
    // Create the modal container
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Create the modal content box for full-screen display
    const modalContent = document.createElement('div');
    modalContent.style.width = '100%';
    modalContent.style.height = '100%';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.overflow = 'hidden';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.style.position = 'relative';
    modalContent.style.paddingTop = '100px'; // Add 100px top padding

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '10px 15px';
    closeButton.style.backgroundColor = '#ff4d4d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1001'; // Ensure it appears above other elements

    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Create the iframe to load the page
    const iframe = document.createElement('iframe');
    iframe.src = pageUrl;
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100% - 50px)'; // Adjust height to accommodate padding
    iframe.style.border = 'none';

    // Ensure the close button stays in place regardless of padding
    modal.appendChild(closeButton); // Move the button outside modalContent
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

let currentPopUpElementModal = null;
function openPopUpWindowWithElement(contentElement) {
    // If there's an existing modal, remove it first
    if (currentPopUpElementModal) {
        document.body.removeChild(currentPopUpElementModal);
        currentPopUpElementModal = null;
    }

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.width = '90%';
    modalContent.style.height = '90%';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.overflow = 'auto';
    modalContent.style.position = 'relative';
    modalContent.style.padding = '100px 20px 20px 20px';
    modalContent.style.borderRadius = '12px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '10px 15px';
    closeButton.style.backgroundColor = '#ff4d4d';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1001';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        currentPopUpElementModal = null;
    });

    modalContent.appendChild(contentElement);
    modal.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Save reference
    currentPopUpElementModal = modal;
}



