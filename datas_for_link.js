

document.querySelectorAll('a').forEach(el => {
    if (el.getAttribute('title') == null || el.getAttribute('title') == '' || el.getAttribute('title') == 'undefined') {
        let source = null;
        let title = null;
        if (el.getAttribute('href')) source = el.getAttribute('href');
        if (source != null) {
            //dans le cas ou le texte n'est pas trop long
            if (el.textContent.length < 100)
                title = el.textContent.trim();
            else
                title = el.textContent.substring(0, 100).trim() + '...'
            el.setAttribute('title', title);
        }
    }
});