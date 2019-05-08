import wwObject from './wwObjectColumns.vue'

const name = "__NAME__";
const version = '__VERSION__';

const addComponent = function () {
    if (window.vm) {

        const background = {
            uniqueId: null,
            link: {
                data: {},
                type: 'none'
            },
            content: {
                data: {
                    style: {
                        boxShadow: {
                            b: 0,
                            c: "",
                            s: 0,
                            x: 0,
                            y: 0
                        },
                        borderColor: null,
                        borderStyle: null,
                        borderWidth: 0,
                        borderRadius: 0
                    },
                    backgroundColor: 'transparent'
                },
                type: 'ww-color'
            },
            paddings: {
                xs: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            },
        }

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
                            background: JSON.parse(JSON.stringify(background)),
                            wwObjects: []
                        },
                        {
                            background: JSON.parse(JSON.stringify(background)),
                            wwObjects: []
                        },
                        {
                            background: JSON.parse(JSON.stringify(background)),
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
                            main: true,
                            text: {
                                en: 'Options',
                                fr: 'Options'
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