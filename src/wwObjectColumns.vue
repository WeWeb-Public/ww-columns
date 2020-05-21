<template>
    <div class="ww-columns" v-style="wrap">
        <!-- wwManager:start -->
        <div class="ww-column-tab">
            <span class="wwi wwi-align-right"></span>
        </div>
        <!-- wwManager:end -->
        <div class="ww-column" v-for="columnIndex in wwObject.content.data.config.count" :key="columnIndex" v-style="getWidthAndOffset(columnIndex - 1)">
            <!-- wwManager:start -->
            <div class="ww-column-preview">
                <div class="offset" v-style="getOffsetStyle(columnIndex - 1)"></div>
            </div>
            <!-- wwManager:end -->
            <wwObject class="ww-column-bg" :ww-object="getColData(columnIndex - 1).background" ww-category="background" ww-inside-ww-object="ww-columns" v-style="getBordersStyle(columnIndex - 1)"></wwObject>
            <wwLayoutColumn
                tag="div"
                ww-default="ww-image"
                :ww-list="getColData(columnIndex - 1).wwObjects"
                class="ww-column-container"
                @ww-add="wwAdd(getColData(columnIndex - 1).wwObjects, $event)"
                @ww-remove="wwRemove(getColData(columnIndex - 1).wwObjects, $event)"
            >
                <wwObject v-for="wwObj in getColData(columnIndex - 1).wwObjects" :key="wwObj.uniqueId" :ww-object="wwObj" ww-inside-ww-object="ww-columns"></wwObject>
            </wwLayoutColumn>
        </div>
    </div>
</template>

<script>
/* wwManager:start */
import wwColumnsPopupLayout from './wwColumnsPopupLayout.vue';
wwLib.wwPopups.addPopup('wwColumnsPopupLayout', wwColumnsPopupLayout);
wwLib.wwPopups.addStory('WW_COLUMNS_POPUP_LAYOUT', {
    title: {
        en: 'Columns',
        fr: 'Colonnes'
    },
    type: 'wwColumnsPopupLayout',
    buttons: {
        FINISH: {
            text: {
                en: 'Finish',
                fr: 'Terminer'
            },
            next: false
        }
    }
});
/* wwManager:end */

export default {
    name: '__COMPONENT_NAME__',
    props: {
        wwObjectCtrl: Object,
        wwAttrs: Object
    },
    data() {
        return {
            screens: ['xs', 'sm', 'md', 'lg'],

            defaultBorders: [
                {
                    color: '#000000',
                    style: 'solid',
                    width: 0
                },
                {
                    color: '#000000',
                    style: 'solid',
                    width: 0
                },
                {
                    color: '#000000',
                    style: 'solid',
                    width: 0
                },
                {
                    color: '#000000',
                    style: 'solid',
                    width: 0
                }
            ],

            defaultRadius: [0, 0, 0, 0],

            defaultShadow: {
                x: 0,
                y: 0,
                blur: 0,
                spread: 0,
                color: '#000000'
            },

            aligns: ['center', 'flex-start', 'center', 'flex-end']
        };
    },
    computed: {
        wwObject() {
            return this.wwObjectCtrl.get();
        },
        wrap() {
            const wrap = {};

            if (!this.wwObject.content.data.config) {
                return wrap;
            }

            if (this.wwObject.content.data.config.xs) {
                wrap.xs = {
                    flexWrap: this.wwObject.content.data.config.xs.nowrap ? 'nowrap' : 'wrap'
                };
            }

            if (this.wwObject.content.data.config.sm) {
                wrap.sm = {
                    flexWrap: this.wwObject.content.data.config.xs.nowrap ? 'nowrap' : 'wrap'
                };
            }

            if (this.wwObject.content.data.config.md) {
                wrap.md = {
                    flexWrap: this.wwObject.content.data.config.xs.nowrap ? 'nowrap' : 'wrap'
                };
            }

            if (this.wwObject.content.data.config.lg) {
                wrap.lg = {
                    flexWrap: this.wwObject.content.data.config.xs.nowrap ? 'nowrap' : 'wrap'
                };
            }
            return wrap;
        }
    },
    watch: {},
    methods: {
        init() {},

        onResize() {
            this.setScreenSize();
        },

        correctConfigs() {
            let needUpdate = false;

            if (!this.wwObject.content.data.config || !this.wwObject.content.data.config.count) {
                let config = this.wwObject.content.data.config || {};
                config.count = config.count || 1;
                config.height = config.height || null;

                for (let screen of this.screens) {
                    if (!config[screen]) {
                        config[screen] = {
                            ignore: screen != 'xs',
                            cols: []
                        };
                    }

                    if (config[screen][0]) {
                        config[screen] = {
                            cols: config[screen]
                        };
                    }

                    if (!config[screen].ignore) {
                        let cols = [];
                        for (let i = 0; i < config.count; i++) {
                            let confCols = config[screen].cols;

                            if (confCols.length > i) {
                                confCols[i].align = confCols[i].align || '1';
                                confCols[i].width = confCols[i].width || 100 / config.count;
                                confCols[i].offset = confCols[i].offset || 0;
                                confCols[i].borders = confCols[i].borders || JSON.parse(JSON.stringify(this.defaultBorders));
                                // confCols[i].radius = confCols[i].radius || JSON.parse(JSON.stringify(this.defaultRadius));
                                // confCols[i].shadow = confCols[i].shadow || JSON.parse(JSON.stringify(this.defaultShadow));

                                cols.push(confCols[i]);
                            } else {
                                cols.push({
                                    align: '1',
                                    width: 100 / config.count,
                                    offset: 0,
                                    borders: JSON.parse(JSON.stringify(this.defaultBorders))
                                    // radius: JSON.parse(JSON.stringify(this.defaultRadius)),
                                    // shadow: JSON.parse(JSON.stringify(this.defaultShadow))
                                });
                            }
                        }

                        config[screen].cols = cols;
                    }
                }

                this.wwObject.content.data.config = config || {};

                needUpdate = true;
            }

            if (!this.wwObject.content.data.columns || this.wwObject.content.data.columns.length != this.wwObject.content.data.config.count) {
                let colData = [];
                let config = this.wwObject.content.data.config;
                this.wwObject.content.data.columns = this.wwObject.content.data.columns || [];
                for (let i = 0; i < config.count; i++) {
                    if (this.wwObject.content.data.columns[i]) {
                        colData[i] = this.wwObject.content.data.columns[i];
                        if (!colData[i].background) {
                            colData[i].background = wwLib.wwObject.getDefault({
                                type: 'ww-color'
                            });
                        }
                    } else {
                        colData[i] = {
                            wwObjects: [],
                            background: wwLib.wwObject.getDefault({ type: 'ww-color' })
                        };
                    }
                }
                this.wwObject.content.data.columns = colData;

                needUpdate = true;
            }

            needUpdate && this.wwObjectCtrl.update(this.wwObject);
        },

        getColData(index) {
            return this.wwObject.content.data.columns[index] || {};
        },

        /*=============================================m_ÔÔ_m=============================================\
          STYLE FUNCTIONS
        \================================================================================================*/
        getWidthAndOffset(columnIndex) {
            const getHeight = config => {
                let size = {
                    height: 60,
                    unit: 'px'
                };

                if (this.wwAttrs && this.wwAttrs.wwColumnsDefaultHeight) {
                    if (typeof this.wwAttrs.wwColumnsDefaultHeight == 'string') {
                        try {
                            size = JSON.parse(this.wwAttrs.wwColumnsDefaultHeight);
                        } catch (error) {}
                    } else if (typeof this.wwAttrs.wwColumnsDefaultHeight.height !== 'undefined' && typeof this.wwAttrs.wwColumnsDefaultHeight.unit !== 'undefined') {
                        size = JSON.parse(this.wwAttrs.wwColumnsDefaultHeight);
                    }
                }

                if (config.height) {
                    if (typeof config.height == 'string' && config.height != 'auto') {
                        try {
                            size.height = parseFloat(config.height);
                            size.unit = config.unit || '%';
                        } catch (error) {}
                    } else if (typeof config.height !== 'undefined') {
                        size.height = config.height;
                        size.unit = config.unit || '%';
                    }
                }

                if (size.height == 0) {
                    size = {
                        height: 60,
                        unit: 'px'
                    };
                }

                if (size.unit == '%') {
                    // if (window.CSS && window.CSS.supports && window.CSS.supports("--fake-var", 0)) {
                    //     return "calc(var(--vh, 1vh) * " + size.height + size.unit + ")";
                    // } else {

                    return 'calc(var(--vh, 1vh) * ' + size.height + ')';
                    // return size.height + "vh";
                    // }
                } else {
                    return size.height + size.unit;
                }
            };

            const getStyle = screenSize => {
                const col = this.wwObject.content.data.config[screenSize] && this.wwObject.content.data.config[screenSize].cols ? this.wwObject.content.data.config[screenSize].cols[columnIndex] : null;

                return col
                    ? {
                          marginLeft: (col.offset || 0) + '%',
                          flexBasis: (col.width || 0) + '%',
                          alignItems: this.aligns[col.align || 0],
                          display: col.hide ? 'none' : 'flex',
                          minHeight: getHeight(this.wwObject.content.data.config[screenSize]),
                          order: col.order || '0'
                      }
                    : null;
            };

            return {
                xs: getStyle('xs'),
                sm: getStyle('sm'),
                md: getStyle('md'),
                lg: getStyle('lg')
            };
        },

        getBordersStyle(columnIndex) {
            const getStyle = screenSize => {
                const col = this.wwObject.content.data.config[screenSize] && this.wwObject.content.data.config[screenSize].cols ? this.wwObject.content.data.config[screenSize].cols[columnIndex] : null;
                return col && col.borders && col.borders.length == 4
                    ? {
                          borderTopWidth: col.borders[0].width + 'px',
                          borderTopStyle: col.borders[0].style,
                          borderTopColor: col.borders[0].color,

                          borderRightWidth: col.borders[1].width + 'px',
                          borderRightStyle: col.borders[1].style,
                          borderRightColor: col.borders[1].color,

                          borderBottomWidth: col.borders[2].width + 'px',
                          borderBottomStyle: col.borders[2].style,
                          borderBottomColor: col.borders[2].color,

                          borderLeftWidth: col.borders[3].width + 'px',
                          borderLeftStyle: col.borders[3].style,
                          borderLeftColor: col.borders[3].color
                      }
                    : {};
            };

            return {
                xs: getStyle('xs'),
                sm: getStyle('sm'),
                md: getStyle('md'),
                lg: getStyle('lg')
            };
        },

        /* wwManager:start */
        wwAdd(list, options) {
            list.splice(options.index, 0, options.wwObject);
            this.wwObjectCtrl.update(this.wwObject);
        },
        wwRemove(list, options) {
            list.splice(options.index, 1);
            this.wwObjectCtrl.update(this.wwObject);
        },
        getOffsetStyle(columnIndex) {
            // let width = (column.offset / column.width) * 100;
            // return {
            //     width: width + "%",
            //     backgroundColor: width ? "#03a9f410" : "transparent"
            // };

            const getStyle = screenSize => {
                const col = this.wwObject.content.data.config[screenSize] && this.wwObject.content.data.config[screenSize].cols ? this.wwObject.content.data.config[screenSize].cols[columnIndex] : null;
                return col
                    ? {
                          width: Math.round((parseFloat(col.offset) / parseFloat(col.width)) * 100000) / 1000 + '%',
                          backgroundColor: (parseFloat(col.offset) / parseFloat(col.width)) * 100 ? '#03a9f410' : 'transparent'
                      }
                    : {};
            };

            const style = {
                xs: getStyle('xs'),
                sm: getStyle('sm'),
                md: getStyle('md'),
                lg: getStyle('lg')
            };

            return style;
        },
        /* wwManager:end */

        /*=============================================m_ÔÔ_m=============================================\
          UTILS
        \================================================================================================*/
        getScreenFromIndex(index) {
            index = Math.min(3, Math.max(0, index));
            return this.screens[index];
        },

        getIndexFromScreen(screen) {
            return Math.max(this.screens.indexOf(screen), 0);
        },

        /* wwManager:start */
        async editColumns() {
            const options = {
                firstPage: 'WW_COLUMNS_POPUP_LAYOUT',
                data: {
                    wwObject: this.wwObject
                }
            };

            try {
                const result = await wwLib.wwPopups.open(options);

                if (result.wwColumnsConfig) {
                    this.correctConfigs(result.wwColumnsConfig);
                    this.wwObjectCtrl.update(this.wwObject);
                }
            } catch (error) {
                console.log('ERROR', result);
            }
        },

        async edit() {
            wwLib.wwObjectHover.setLock(this);

            let editList = {
                LAYOUT: {
                    separator: {
                        en: 'Configuration',
                        fr: 'Configuration'
                    },
                    title: {
                        en: 'Layout',
                        fr: 'Disposition'
                    },
                    desc: {
                        en: 'Set columns count, sizes, ...',
                        fr: 'Changer le nombre de colonnes, leurs tailles, ...'
                    },
                    icon: 'wwi wwi-config',
                    shortcut: 'c',
                    next: 'WW_COLUMNS_POPUP_LAYOUT'
                }
            };

            wwLib.wwPopups.addStory('WWCOLUMNS_EDIT', {
                title: {
                    en: 'Edit Columns',
                    fr: 'Editer les colonnes'
                },
                type: 'wwPopupEditWwObject',
                buttons: null,
                storyData: {
                    list: editList
                }
            });

            let options = {
                firstPage: 'WWCOLUMNS_EDIT',
                data: {
                    wwObject: this.wwObject
                }
            };

            try {
                const result = await wwLib.wwPopups.open(options);

                /*=============================================m_ÔÔ_m=============================================\
                  STYLE
                \================================================================================================*/
                if (typeof result.wwColumnsConfig != 'undefined') {
                    this.correctConfigs(result.wwColumnsConfig);
                }

                this.wwObjectCtrl.update(this.wwObject);

                this.wwObjectCtrl.globalEdit(result);
            } catch (error) {
                console.log(error);
            }

            wwLib.wwObjectHover.removeLock();
        }
        /* wwManager:end */
    },
    created() {
        this.correctConfigs();
    },
    mounted() {
        this.init();
        this.$emit('ww-loaded', this);
    },
    beforeDestroyed() {
        window.removeEventListener('resize', this.onResize);
    }
};
</script>

<style scoped lang="scss">
.ww-columns {
    display: flex;
    position: relative;
    min-height: 60px;
}

.ww-column {
    position: relative;
    pointer-events: none;
}

.ww-column .ww-column-container {
    width: 100%;
    position: relative;
    /*overflow: hidden;*/
    /*padding: 5px;*/
}

.ww-column .ww-column-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 60px;
}

.ww-column .ww-column-style {
    position: relative;
    display: flex;
    width: 100%;
}

/* wwManager:start */
.ww-column-tab {
    display: none;
    position: absolute;
    top: 10px;
    right: 0;
    border-radius: 20px 0 0 20px;
    background-color: #d02e7c;
    z-index: 51;
    color: white;
    height: 40px;
    width: 45px;
    justify-content: center;
    align-items: center;
    font-size: 22px;
}

.ww-editing .ww-column-tab {
    display: flex;
}

.ww-column-preview {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 50;
    pointer-events: none;
    border-right: 1px solid #03a9f457;

    .offset {
        position: absolute;
        right: 100%;
        height: 100%;
        top: 0;
        border-right: 1px solid #03a9f457;
    }
}
.ww-edit-mode-content .ww-column-preview {
    display: block;
}
/* 
.ww-columns-preview {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 50;
    pointer-events: none;
    flex-wrap: wrap;
}

.ww-column-preview + .ww-column-preview {
    border-left: 1px solid #03a9f457;
}
.ww-column-preview.margin {
    background-color: #03a9f410;
}
.ww-editing .ww-columns-preview {
    display: flex;
} */
/* wwManager:end */
</style>

<style>
/* wwManager:start */
.ww-columns-hover {
    background-color: #2ec6ba30;
    background: repeating-linear-gradient(-45deg, #2ec6ba30, #2ec6ba30 10px, #2ec6ba50 10px, #2ec6ba50 11px);
    border-width: 5px !important;
}
/* wwManager:end */
</style>
