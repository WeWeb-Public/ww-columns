import wwObject from './wwObjectColumns.vue'

const name = "__NAME__";
const version = '__VERSION__';

const addComponent = function () {
    if (window.vm) {

        wwLib.wwObject.register({
            content: {
                type: name,
                data: {
                    config: {
                        count: 3,
                        xs: {
                            height: null,
                            ignore: false,
                            cols: [{
                                offset: 0,
                                width: 33.33,
                                borders: []
                            }, {
                                offset: 0,
                                width: 33.33,
                                borders: []
                            }, {
                                offset: 0,
                                width: 33.33,
                                borders: []
                            }
                            ]
                        },
                        sm: null,
                        md: null,
                        lg: null
                    },
                    columns: [
                        {
                            background: null,
                            wwObjects: []
                        },
                        {
                            background: null,
                            wwObjects: []
                        },
                        {
                            background: null,
                            wwObjects: []
                        }
                    ]
                }
            },
            upsales: {
                wwAnalytics: {
                    click: false
                }
            },
            /* wwManager:start */
            cmsOptions: {
                wwObjectHover: {
                    pluses: false,
                    hoverClass: 'ww-columns-hover',
                },
                wwObjectMenu: {
                    items: [
                        {
                            if: 'wwLayout',
                            name: 'ADD_BEFORE',
                            text: {
                                en: 'Before',
                                fr: 'Avant'
                            },
                            icon: 'wwi wwi-add',
                            action: 'wwLayout:addBefore'
                        },
                        {
                            if: 'wwLayout',
                            name: 'ADD_AFTER',
                            text: {
                                en: 'After',
                                fr: 'Après'
                            },
                            icon: 'wwi wwi-add',
                            action: 'wwLayout:addAfter'
                        },

                        {
                            name: 'LAYOUT',
                            text: {
                                en: 'Columns',
                                fr: 'Colonnes'
                            },
                            icon: 'wwi wwi-edit-margin',
                            action: 'editColumns'
                        },

                        {
                            name: 'OPTIONS',
                            text: {
                                en: 'Options...',
                                fr: 'Options...'
                            },
                            icon: 'wwi wwi-edit-other',
                            action: 'edit'
                        },


                    ]
                }
            }
            /* wwManager:end */
        });

        window.vm.addComponent({
            name: name,
            version: version,
            content: wwObject
        });

        return true;
    }
    return false;
}

if (!addComponent()) {
    const iniInterval = setInterval(function () {
        if (addComponent()) {
            clearInterval(iniInterval);
        }
    }, 10);
}