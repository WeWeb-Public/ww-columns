import wwObject from './wwObjectRow.vue'

const name = "ww-columns";

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
                                en_GB: 'Before',
                                fr_FR: 'Avant'
                            },
                            icon: 'wwi wwi-add',
                            action: 'wwLayout:addBefore'
                        },
                        {
                            if: 'wwLayout',
                            name: 'ADD_AFTER',
                            text: {
                                en_GB: 'After',
                                fr_FR: 'Après'
                            },
                            icon: 'wwi wwi-add',
                            action: 'wwLayout:addAfter'
                        },

                        {
                            name: 'LAYOUT',
                            text: {
                                en_GB: 'Columns',
                                fr_FR: 'Colonnes'
                            },
                            icon: 'wwi wwi-edit-margin',
                            action: 'editColumns'
                        },

                        {
                            name: 'OPTIONS',
                            text: {
                                en_GB: 'Options...',
                                fr_FR: 'Options...'
                            },
                            icon: 'wwi wwi-edit-other',
                            action: 'edit'
                        },


                    ]
                }
            }
            /* wwManager:end */
        });

        window.vm.addComponent(name, wwObject);

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