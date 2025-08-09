// public/translation-utils.js

const API_KEY = 'AIzaSyBkuxn-RDRAwrRKWbyl4Ef4m05aklyhSpA';
const API_URL = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

const translationCache = new Map();

/**
 * Translate a single string.
 * @param {string} text
 * @returns {Promise<string>}
 */
export async function translateText(text) {


    return text;
     // will do it when get rich
    const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
    const cacheKey = `${text}-${selectedLanguage}`;

    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: text, target: selectedLanguage }),
        });

        if (!response.ok) throw new Error('Translation failed');
        const data = await response.json();
        const translated = data.data.translations[0].translatedText;

        translationCache.set(cacheKey, translated);
        return translated;
    } catch (err) {
        console.error("Translation error:", err);
        return text; // fallback
    }
}

/**
 * Translate multiple strings in batch.
 * @param {string[]} texts
 * @returns {Promise<string[]>}
 */
export async function translateTexts(texts) {

    return texts; 

    // will do it when get rich
    const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
    const uncached = [];
    const indexes = [];

    const results = texts.map((text, index) => {
        const key = `${text}-${selectedLanguage}`;
        if (translationCache.has(key)) {
            return translationCache.get(key);
        } else {
            uncached.push(text);
            indexes.push(index);
            return null; // placeholder
        }
    });

    if (uncached.length > 0) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ q: uncached, target: selectedLanguage }),
            });

            if (!response.ok) throw new Error('Batch translation failed');
            const data = await response.json();
            const translatedTexts = data.data.translations.map(t => t.translatedText);

            translatedTexts.forEach((translated, i) => {
                const originalIndex = indexes[i];
                const originalText = uncached[i];
                const cacheKey = `${originalText}-${selectedLanguage}`;
                translationCache.set(cacheKey, translated);
                results[originalIndex] = translated;
            });
        } catch (err) {
            console.error("Batch translation error:", err);
            // fallback to original for failed translations
            indexes.forEach((index, i) => {
                results[index] = uncached[i];
            });
        }
    }

    return results;
}
