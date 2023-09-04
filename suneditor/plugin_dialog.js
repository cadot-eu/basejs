// Import "dialog" module
import dialog from '/node_modules/suneditor/src/plugins/modules/dialog.js';
import Swal from '/node_modules/sweetalert2/dist/sweetalert2.js';


// ex) ex) A link dialog plugin with multiple target options.
var plugin_dialog = {
    // @Required
    // plugin name
    name: 'pickerColor',

    // @Required
    // data display
    display: 'dialog',

    // @Required
    // add function - It is called only once when the plugin is first run.
    // This function generates HTML to append and register the event.
    // arguments - (core : core object, targetElement : clicked button element)
    add: function (core) {

        // If you are using a module, you must register the module using the "addModule" method.
        core.addModule(dialog);

        // @Required
        // Registering a namespace for caching as a plugin name in the context object
        const context = core.context;
        context.pickerColor = {
            focusElement: null, // @Override // This element has focus when the dialog is opened.
            // targetSelect: null,
            // linkAnchorText: null,
            // _linkAnchor: null
        };

        /** link dialog */
        let link_dialog = this.setDialog(core);
        context.pickerColor.modal = link_dialog;
        //context.pickerColor.focusElement = link_dialog.querySelector('._se_link_url');
        // context.pickerColor.linkAnchorText = link_dialog.querySelector('._se_link_text');
        // context.pickerColor.targetSelect = link_dialog.querySelector('.se-input-select');


        /** link controller */
        context.pickerColor._linkAnchor = null;

        /** add event listeners */
        link_dialog.querySelector('form').addEventListener('submit', this.submit.bind(core));

        /** append html */
        context.dialog.modal.appendChild(link_dialog);


        /** empty memory */
        link_dialog = null
    },

    /** dialog */
    setDialog: function (core) {
        const lang = core.lang;
        const dialog = core.util.createElement('DIV');
        // const targetList = [
        //     { target: '_blank', name: 'New window' },
        //     { target: '_parent', name: 'Parent frame' },
        //     { target: '_top', name: 'First frame', selected: true },
        //     { target: 'AnyFrame', name: 'Frame name' },
        //     { target: '_dialog', name: 'Self defined dialog' }
        // ];

        dialog.className = 'se-dialog-content';
        dialog.style.display = 'none';
        let html = '' +
            '<form class="editor_link">' +
            '<div class="se-dialog-header">' +
            '<button type="button" data-command="close" class="se-btn se-dialog-close" aria-label="Close" title="' + lang.dialogBox.close + '">' +
            core.icons.cancel +
            '</button>' +
            '<span class="se-modal-title">' + lang.dialogBox.linkBox.title + '</span>' +
            '</div>' +
            '<div class="se-dialog-body">' +
            // Ajout du color picker ici
            '<div class="se-dialog-form">' +
            '<label>Color</label><input class="se-input-form _se_link_color" type="color" />' +
            '</div>'
        // '<div class="se-dialog-form se-dialog-form-footer">' +
        // '<select class="se-input-select" title="links">';

        // for (let i = 0, len = targetList.length, t, selected; i < len; i++) {
        //     t = targetList[i];
        //     selected = t.selected ? ' selected' : '';
        //     html += '<option value="' + t.target + '"' + selected + '>' + t.name + '</option>';
        // }

        html += '</div>' +
            '<div class="se-dialog-footer">' +
            '<button type="submit" class="se-btn-primary" title="' + lang.dialogBox.submitButton + '"><span>' + lang.dialogBox.submitButton + '</span></button>' +
            '</div>' +
            '</form>';


        dialog.innerHTML = html;

        return dialog;
    },



    // @Required, @Override dialog
    // This method is called when the plugin button is clicked.
    // Open the modal window here.
    open: function () {
        if (this.plugins.pickerColor.active.call(this, this.getSelection().focusNode)) {
            // ouvrez le dialogue ici
            this.plugins.dialog.open.call(this, 'pickerColor', 'pickerColor' === this.currentControllerName);
        }
        else {
            //on affiche un message disant que l'on ai pas dans une cellule
            let timerInterval
            Swal.fire({
                title: 'Erreur',
                html: 'Vous devez être dans une cellule pour pouvoir changer la couleur de fond',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                        b.textContent = Swal.getTimerLeft()
                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            })

        }
    },

    submit: function (e) {
        this.showLoading();

        e.preventDefault();
        e.stopPropagation();

        const submitAction = function () {
            // Obtenez la valeur du color picker
            const selectedColor = this.context.pickerColor.modal.querySelector('._se_link_color').value;

            // Obtenez l'élément <td> actuellement sélectionné
            let tdElement = this.getSelection().focusNode;

            while (tdElement && tdElement.nodeName !== 'BODY') {
                if (tdElement.nodeName === 'TD') {
                    // Appliquez la couleur d'arrière-plan à l'élément <td>
                    tdElement.style.backgroundColor = selectedColor;
                    //on ajoute une classe et un attribut pour pouvoir retrouver la couleur
                    tdElement.classList.add('__se__color_picker');
                    tdElement.setAttribute('data-color', selectedColor);
                    break;
                }
                tdElement = tdElement.parentNode;
            }
        }.bind(this);

        try {
            submitAction();
        } finally {
            this.plugins.dialog.close.call(this);
            this.closeLoading();
            this.focus();
        }

        return false;
    },


    // @Override core
    // Plugins with active methods load immediately when the editor loads.
    // Called each time the selection is moved.
    //permet de dire si le plugins doit être actif ou pas en fonction de l'élément sélectionné
    active: function (element) {
        let parentNode = element;

        // Traversez les éléments parents jusqu'à ce que vous trouviez un <td> ou atteigniez le body
        while (parentNode && parentNode.nodeName !== 'BODY') {
            if (parentNode.nodeName === 'TD') {
                // Activez votre bouton de plugin ou faites autre chose pour activer le plugin
                return true;
            }
            parentNode = parentNode.parentNode;
        }

        return false;
    },

    // @Override dialog
    // This method is called just before the dialog opens.
    // If "update" argument is true, it is not a new call, but a call to modify an already created element.
    on: function (update) {
        if (!update) {

            this.plugins.pickerColor.init.call(this);
        } else if (this.context.pickerColor._linkAnchor) {
            // "update" and "this.context.dialog.updateModal" are always the same value.
            // This code is an exception to the "link" plugin.
            //this.context.dialog.updateModal = true;
            // this.context.pickerColor.focusElement.value = this.context.pickerColor._linkAnchor.href;
            // this.context.pickerColor.linkAnchorText.value = this.context.pickerColor._linkAnchor.textContent;
            // this.context.pickerColor.targetSelect.value = this.context.pickerColor._linkAnchor.target || '';
        }
    },

    call_controller: function (selectionATag) {

        this.editLink = this.context.pickerColor._linkAnchor = selectionATag;
        const linkBtn = this.context.pickerColor.linkController;
        const link = linkBtn.querySelector('a');

        link.href = selectionATag.href;
        link.title = selectionATag.textContent;
        link.textContent = selectionATag.textContent;

        const offset = this.util.getOffset(selectionATag, this.context.element.wysiwygFrame);
        linkBtn.style.top = (offset.top + selectionATag.offsetHeight + 10) + 'px';
        linkBtn.style.left = (offset.left - this.context.element.wysiwygFrame.scrollLeft) + 'px';

        linkBtn.style.display = 'block';

        const overLeft = this.context.element.wysiwygFrame.offsetWidth - (linkBtn.offsetLeft + linkBtn.offsetWidth);
        if (overLeft < 0) {
            linkBtn.style.left = (linkBtn.offsetLeft + overLeft) + 'px';
            linkBtn.firstElementChild.style.left = (20 - overLeft) + 'px';
        } else {
            linkBtn.firstElementChild.style.left = '20px';
        }

        // Show controller at editor area (controller elements, function, "controller target element(@Required)", "controller name(@Required)", etc..)
        this.controllersOn(linkBtn, selectionATag, 'pickerColor');
    },

    // onClick_linkController: function (e) {
    //     e.stopPropagation();

    //     const command = e.target.getAttribute('data-command');
    //     if (!command) return;

    //     e.preventDefault();

    //     if (/update/.test(command)) {
    //         const contextLink = this.context.pickerColor;
    //         contextLink.focusElement.value = contextLink._linkAnchor.href;
    //         contextLink.linkAnchorText.value = contextLink._linkAnchor.textContent;
    //         contextLink.targetSelect.value = contextLink.targetSelect.value;
    //         this.plugins.dialog.open.call(this, 'pickerColor', true);
    //     }
    //     else if (/unlink/.test(command)) {
    //         const sc = this.util.getChildElement(this.context.pickerColor._linkAnchor, function (current) { return current.childNodes.length === 0 || current.nodeType === 3; }, false);
    //         const ec = this.util.getChildElement(this.context.pickerColor._linkAnchor, function (current) { return current.childNodes.length === 0 || current.nodeType === 3; }, true);
    //         this.setRange(sc, 0, ec, ec.textContent.length);
    //         this.nodeChange(null, null, ['A'], false);
    //     }
    //     else {
    //         /** delete */
    //         this.util.removeItem(this.context.pickerColor._linkAnchor);
    //         this.context.pickerColor._linkAnchor = null;
    //         this.focus();

    //         // history stack
    //         this.history.push(false);
    //     }

    //     this.controllersOff();
    // },

    // @Required, @Override dialog
    // This method is called when the dialog window is closed.
    // Initialize the properties.
    init: function () {
        // const contextLink = this.context.pickerColor;
        // contextLink._linkAnchor = null;
        // contextLink.focusElement.value = '';
        // contextLink.linkAnchorText.value = '';
        // contextLink.targetSelect.selectedIndex = 0;
    }
};

export default plugin_dialog;
