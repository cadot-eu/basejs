
/* This is a JavaScript function that is being called on each image in the document. It is checking to
see if the alt attribute is undefined. If it is, it sets the alt attribute to the filename of the
image. */
$("img").each(function () {
    if ($(this).attr('alt') == undefined) {
        let source = null;
        if ($(this).attr('src') != 'undefined') source = $(this).attr('src');
        if ($(this).attr('data-bp') != 'undefined') source = $(this).attr('data-bp');
        if (source != null)
            $(this).attr('alt', source.split('/').reverse()[0].split('.')[0].replace('-', ' ').replace('_', ' '))
    }
})