import {
    analytics,
    db,
    logEvent,
    collection,
    doc,
    getDoc,
    setDoc,
    Timestamp,
    increment
} from './firebase.js';

import { translateText, translateTexts } from './translation-utils.js';



const BOOKS_COLLECTION = 'books'

class ArticleDetail {


    constructor() {
        this.id = decodeURIComponent(new URLSearchParams(window.location.search).get('id'));
        this.action = decodeURIComponent(new URLSearchParams(window.location.search).get('action'));
        this.data = JSON.parse(sessionStorage.getItem('data'));
        this.detailContainer = document.getElementById('detail-container');
        this.shareButton = document.querySelector('.share-button');
        this.bellButton = document.querySelector('.bell-button');
        window.addEventListener('DOMContentLoaded', () => this.loadContent());
    }


    async loadContent() {
        if (this.data) {
            // Translate content before showing
            this.data = await this.translateContent(this.data);
            this.showContent();
        } else {
            this.detailContainer.innerHTML = '<h4>Loading...</h4>';
            await this.fetchBookDetail();
        }
        this.updateActionButton();
    }




    async translateContent(data) {
        try {
            const [translatedTitle, translatedText] = await translateTexts([
                data.title,
                data.text
            ]);
            data.title = translatedTitle;
            data.text = translatedText;
        } catch (error) {
            console.error('Error translating content:', error);
        }

        return data;
    }



    updateActionButton() {
        if (this.action == 'preview') {
            this.shareButton.textContent = 'Save';
            this.shareButton.addEventListener('click', () => {
                this.publishArticle();
            });
        } else {
            this.shareButton.textContent = 'Share';
            this.shareButton.addEventListener('click', () => {
                this.shareArticle();
            });

            this.bellButton.style.display = 'block';
            this.bellButton.textContent = '🔔'
            this.bellButton.addEventListener('click', () => {
                this.updateBells(this.data.bells)
            });
        }
    }


    async updateBells(bells) {
        const bookRef = doc(db, BOOKS_COLLECTION, this.id);
        setDoc(bookRef, {
            bells: increment(1)
        }, { merge: true }).then(() => {
            if (document) {
                document.querySelector('h5.bells').textContent = `🔔 ${parseInt(bells || '0') + 1}`;
            }

        }).catch((error) => {
            console.error("Error incrementing bells: ", error);
        });
        const bellSound = new Audio('assets/bell-ring.mp3');
        bellSound.play().catch(error => console.error("Error playing the sound:", error));
        this.bellButton.style.display = 'none';

        logEvent(analytics, 'article_bells', {
            title: this.data.title,
            content_type: this.data.content_type
        });
    }


    async fetchBookDetail() {
        const bookRef = doc(db, BOOKS_COLLECTION, this.id);
        try {

            const bookSnap = await getDoc(bookRef);
            if (!bookSnap.exists()) throw new Error("Document not found");
            this.data = bookSnap.data();
            this.showContent();

        } catch (error) {
            console.error("Error fetching data:", error);
            this.detailContainer.innerHTML = `
            <h4>Error loading content. <a href="index">Go to Home Page</a></h4>`;
        }
    }



    createCard(data) {

        const image = this.createElementWithClass('img', 'book-image', {
            src: data.icon,
            alt: data.title,
            width: '125',
            height: '150'
        });

        const imageContainer = this.createElementWithClass('div', 'image-container', {}, [image]);
        const title = this.createElementWithClass('h1', 'title');
        const category = this.createElementWithClass('p', 'category');
        const bells = this.createElementWithClass('h5', 'bells');
        const textContainer = this.createElementWithClass('div', 'text-container', {}, [title, category, bells]);
        const card = this.createElementWithClass('div', 'card', {}, [imageContainer, textContainer]);
        this.addCharacterLoadingEffect(title, data.title || 'Title');
        this.addCharacterLoadingEffect(category, data.content_type || 'New');
        this.addCharacterLoadingEffect(bells, `🔔 ${data.bells || '0'}`);

        return card;
    }

    showContent() {
        document.title = this.data.title;
        this.detailContainer.innerHTML = '';
        var card = this.createCard(this.data);
        this.detailContainer.appendChild(card);
        var textContent = document.createElement('div');
        textContent.innerHTML = this.data.text;
        this.detailContainer.appendChild(textContent);
        this.shareButton.style.display = 'block';
    }



    addCharacterLoadingEffect(element, text) {
        const delay = 250;
        let index = 0;
        const intervalId = setInterval(() => {
            if (index <= text.length) {
                element.textContent = text.slice(0, index);
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, delay);
    }

    createElementWithClass(elementType, className, attributes = {}, children = []) {
        const element = document.createElement(elementType);
        element.classList.add(className);
        Object.entries(attributes).forEach(([key, value]) => element[key] = value);
        children.forEach(child => element.appendChild(child));
        return element;
    }


    async shareArticle() {
        const title = this.data.title;
        const currentUrl = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: 'Hey ! Check Out This Article - ',
                    url: currentUrl
                });
                console.log('Shared Successfully');
            } else {
                await navigator.clipboard.writeText(currentUrl);
                alert('Link copied to clipboard');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }

        logEvent(analytics, 'article_share', {
            title: this.data.title,
            content_type: this.data.content_type
        });
    }




    publishArticle() {
        this.shareButton.textContent = 'Saving...';
        this.shareButton.disabled = true;
        this.addDocumentToBooksCollection();
    }


    async addDocumentToBooksCollection() {
        try {
            const newBookRef = doc(collection(db, BOOKS_COLLECTION));
            await setDoc(newBookRef, {
                name: "User - " + localStorage.getItem('uid'),
                userId: localStorage.getItem('uid'),
                title: this.data.title,
                icon: this.data.icon,
                text: this.data.text,
                content_type: this.data.content_type,
                created_at: Timestamp.now(),
                in_review: true,
            });

            // Close the reader window and reload the editor page
            if (window.opener) {
                window.opener.location.reload();
                window.close();
            } else {
                window.location.replace('editor');
            }

        } catch (e) {
            this.shareButton.textContent = 'Try again';
            this.shareButton.disabled = false;
            console.error("Error adding document: ", e);
            alert('Something went wrong ! please try again later')
        }
    }


}

new ArticleDetail();
