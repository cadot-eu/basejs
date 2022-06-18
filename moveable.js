import Moveable from "moveable";
import CONFIG from './three.js'

const frame = {
    translate: [0, 0],
};
// $('.custom-file-label').each(function (index, target) {
//     // create an observer instance
//     var observer = new MutationObserver(function (mutations) {
//         mutations.forEach(function (mutation) {
//             if ($(target).hasClass('bg-success')) {
//                 if ($(target).prev().data('tmp')) {
//                     var imgnew = $("<div class='target' id='poser_" + $(target).prev().attr('id') + "'><img class='img-fluid' src='" + $(target).next().attr('src') + "'></div>")
//                     $('#container').append(imgnew);
//                     moveableUpdate(imgnew, objet);
//                 }
//             }
//         });
//     });

//     observer.observe(target, { attributes: true, childList: false, characterData: false });
//     console.log(objet)
var label = []
setInterval(() => {
    $('.custom-file-label').each(function (index, target) {
        if ($(target).prev().data('tmp') !== undefined) {
            var idblock = $(target).prev().attr('id')
            if (label.indexOf($(target).prev().attr('data-tmp')) == -1) {
                label.push($(target).prev().attr('data-tmp'))
                var imgnew = $("<div class='target' id='poser_" + idblock + "'><img class='img-fluid' src='" + $(target).prev().attr('base64') + "'></div>")
                $('#container').append(imgnew);
                moveableUpdate(imgnew);
                var center = $(imgnew).next().find('.moveable-origin')[0]
                $(center).append('<i class="fas fa-trash-alt"></i>')
                $(center).removeClass('moveable-control')
                $(center).css('color', 'red').css('background-color', 'white').css('width', 'fit-content').css('padding', '5px')
                $(center).on('click', function () { delete_poser(imgnew) });
                $(center).attr('data-tmp', $(target).prev().attr('data-tmp'))
            }
        }
    })
}, 200);

function delete_poser(element) {
    if (confirm('Cet modele va être supprimé définitivement, êtes-vous sûr?')) {
        label = removeItemOnce(label, $(element).attr('data-tmp'))
        $(element).next().remove()
        $(element).remove()
    }


    //$(element).destroy()
}

// $(element).on("DOMSubtreeModified", function (e) {


// });
function moveableUpdate(element) {

    var objet = new Moveable(document.querySelector("#container"), {
        target: element,
        // If the container is null, the position is fixed. (default: parentElement(document.body))
        container: document.querySelector("#container"),
        draggable: true,
        resizable: true,
        scalable: true,
        rotatable: true,
        warpable: false,
        pinchable: false, // ["resizable", "scalable", "rotatable"]
        origin: true,
        keepRatio: true,
        // Resize, Scale Events at edges.
        edge: false,
        throttleDrag: 0,
        throttleResize: 0,
        throttleScale: 0,
        throttleRotate: 0,
        renderDirections: ["nw", "ne", "sw", "se"]
    })
        .on("drag", ({ target, transform }) => {
            target.style.transform = transform;
            console.log(`FOO: ${CONFIG.FOO}`)
        })
        .on("scroll", ({ scrollContainer, direction }) => {
            scrollContainer.scrollLeft += direction[0] * 10;
            scrollContainer.scrollTop += direction[1] * 10;
        })
        .on("rotate", ({ target, transform, dist }) => {
            target.style.transform = transform;
        })
        .on("resizeStart", ({ target, set, setOrigin, dragStart }) => {
            // Set origin if transform-origin use %.
            setOrigin(["%", "%"]);

            // If cssSize and offsetSize are different, set cssSize. (no box-sizing)
            const style = window.getComputedStyle(target);
            const cssWidth = parseFloat(style.width);
            const cssHeight = parseFloat(style.height);
            set([cssWidth, cssHeight]);

            // If a drag event has already occurred, there is no dragStart.
            dragStart && dragStart.set(frame.translate);
        }).on("resize", ({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            // get drag event
            frame.translate = drag.beforeTranslate;
            target.style.transform
                = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
        });
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}