import a2lix_lib from '@a2lix/symfony-collection'


a2lix_lib.sfCollection.init({
    collectionsSelector: 'form div[data-prototype]',
    manageRemoveEntry: true,
    entry: {
        add: {
            prototype:
                '<button class="__class__" data-entry-action="add">__label__</button>',
            class: 'btn btn-primary btn-sm mt-2',
            label: 'ajouter',
            customFn: null,
            onBeforeFn: null,
            onAfterFn: null
        },
        remove: {
            prototype:
                '<button class="__class__" data-entry-action="remove">__label__</button>',
            class: 'btn btn-danger btn-sm',
            label: 'Surpprimer',
            customFn: null,
            onAfterFn: null
        }
    }
})