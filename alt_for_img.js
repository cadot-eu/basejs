
/* This is a JavaScript function that is being called on each image in the document. It is checking to
see if the alt attribute is undefined. If it is, it sets the alt attribute to the filename of the
image. */
document.querySelectorAll('img').forEach(el => {
    if (el.getAttribute('alt') == null) {
        let source = null;
        if (el.getAttribute('src')) source = el.getAttribute('src');
        if (el.getAttribute('data-bp')) source = el.getAttribute('data-bp');
        if (source != null)
            el.setAttribute('alt', source.split('/').reverse()[0].split('.')[0].replace('-', ' ').replace('_', ' '))
    }
});
