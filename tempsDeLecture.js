export function tempsDeLecture(html, wordsPerMinute = 200) {
    // Créer un élément HTML temporaire pour analyser le HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    // Extraire le texte du contenu HTML
    const text = tempElement.textContent || tempElement.innerText || '';

    // Compter le nombre de mots dans le texte
    const wordCount = text.split(/\s+/).length;

    // Calculer le temps approximatif de lecture en minutes
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

    return readingTimeMinutes;
}


