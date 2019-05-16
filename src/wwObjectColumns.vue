<template>
    <div class="ww-columns" :style="wrap">
        <!-- wwManager:start -->
        <div class="ww-column-tab">
            <span class="wwi wwi-align-right"></span>
        </div>
        <!-- wwManager:end -->
        <div class="ww-column" v-for="(column, index) in screenCols" :key="index" :style="getWidthAndOffset(column)">
            <!-- wwManager:start -->
            <div class="ww-column-preview">
                <div class="offset" :style="getOffsetStyle(column)"></div>
            </div>
            <!-- wwManager:end -->
            <wwObject class="ww-column-bg" :ww-object="getColData(index).background" ww-category="background" ww-inside-ww-object="ww-columns" :style="getBordersStyle(column)"></wwObject>
            <wwLayoutColumn tag="div" ww-default="ww-image" :ww-list="getColData(index).wwObjects" class="ww-column-container" @ww-add="wwAdd(getColData(index).wwObjects, $event)" @ww-remove="wwRemove(getColData(index).wwObjects, $event)">
                <wwObject v-for="wwObj in getColData(index).wwObjects" :key="wwObj.uniqueId" :ww-object="wwObj" ww-inside-ww-object="ww-columns"></wwObject>
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
    name: "__COMPONENT_NAME__",
    props: {
        wwObjectCtrl: Object,
        wwAttrs: Object
    },
    data() {
        return {
            screens: ['xs', 'sm', 'md', 'lg'],

            defaultBorders: [
                {
                    color: "#000000",
                    style: "solid",
                    width: 0
                },
                {
                    color: "#000000",
                    style: "solid",
                    width: 0
                },
                {
                    color: "#000000",
                    style: "solid",
                    width: 0
                },
                {
                    color: "#000000",
                    style: "solid",
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

            aligns: ['center', 'flex-start', 'center', 'flex-end'],
        };
    },
    computed: {
        screen() {
            return wwLib.$store.getters['front/getScreenSize'];
        },
        wwObject() {
            return this.wwObjectCtrl.get();
        },
        screenCols() {
            return this.wwObject.content.data.config[this.getScreenSize()].cols;
        },
        columnHeight() {
            let height = '60px';

            let defaultHeight = '60px';

            if (this.wwAttrs && this.wwAttrs.wwColumnsDefaultHeight) {
                height = this.wwAttrs.wwColumnsDefaultHeight;
            }

            let wwObjectHeight;

            try {
                wwObjectHeight = parseFloat(this.wwObject.content.data.config[this.getScreenSize()].height);
            } catch (error) {
                wwObjectHeight = 0;
            }

            const wwObjectUnit = this.wwObject.content.data.config[this.getScreenSize()].unit || '%';

            height = wwObjectHeight || height;

            if (height == 'auto' || height == 0 || height == '0') {
                return defaultHeight;
            }

            if (wwObjectUnit == '%') {
                if (window.CSS && window.CSS.supports && window.CSS.supports('--fake-var', 0)) {
                    return 'calc(var(--vh, 1vh) * ' + height + ')'
                }
                else {
                    return height + 'vh'
                }
            }
            else {
                return height + wwObjectUnit;
            }
        },
        wrap() {
            return {
                flexWrap: this.wwObject.content.data.config[this.getScreenSize()].nowrap ? 'nowrap' : 'wrap'
            }
        }
    },
    watch: {
    },
    methods: {
        init() {
        },

        getScreenSize() {
            let screen = this.screen || 'lg';

            if (screen == 'lg' && (!this.wwObject.content.data.config['lg'] || this.wwObject.content.data.config['lg'].ignore)) {
                screen = 'md';
            }

            if (screen == 'md' && (!this.wwObject.content.data.config['md'] || this.wwObject.content.data.config['md'].ignore)) {
                screen = 'sm';
            }

            if (screen == 'sm' && (!this.wwObject.content.data.config['sm'] || this.wwObject.content.data.config['sm'].ignore)) {
                screen = 'xs';
            }

            return screen;
        },

        onResize() {
            this.setScreenSize();
        },

        correctConfigs(newConfig) {
            let config = newConfig || this.wwObject.content.data.config || {};
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
                    }
                }

                if (!config[screen].ignore) {
                    let cols = [];
                    for (let i = 0; i < config.count; i++) {
                        let confCols = config[screen].cols;

                        if (confCols.length > i) {
                            confCols[i].align = confCols[i].align || "1";
                            confCols[i].width = confCols[i].width || 100 / config.count;
                            confCols[i].offset = confCols[i].offset || 0;
                            confCols[i].borders = confCols[i].borders || JSON.parse(JSON.stringify(this.defaultBorders));
                            // confCols[i].radius = confCols[i].radius || JSON.parse(JSON.stringify(this.defaultRadius));
                            // confCols[i].shadow = confCols[i].shadow || JSON.parse(JSON.stringify(this.defaultShadow));

                            cols.push(confCols[i]);
                        }
                        else {
                            cols.push({
                                align: "1",
                                width: 100 / config.count,
                                offset: 0,
                                borders: JSON.parse(JSON.stringify(this.defaultBorders)),
                                // radius: JSON.parse(JSON.stringify(this.defaultRadius)),
                                // shadow: JSON.parse(JSON.stringify(this.defaultShadow))
                            })
                        }
                    }

                    config[screen].cols = cols;
                }
            }

            let colData = [];
            this.wwObject.content.data.columns = this.wwObject.content.data.columns || [];
            for (let i = 0; i < config.count; i++) {
                if (this.wwObject.content.data.columns[i]) {
                    colData[i] = this.wwObject.content.data.columns[i];
                    if (!colData[i].background) {
                        colData[i].background = wwLib.wwObject.getDefault({ type: 'ww-color' });
                    }
                }
                else {
                    colData[i] = {
                        wwObjects: [],
                        background: wwLib.wwObject.getDefault({ type: 'ww-color' })
                    }
                }
            }
            this.wwObject.content.data.columns = colData;

            this.wwObject.content.data.config = config || {};

            this.wwObjectCtrl.update(this.wwObject);
        },

        getColData(index) {
            return this.wwObject.content.data.columns[index] || {};
        },

        wwAdd(list, options) {
            list.splice(options.index, 0, options.wwObject);
            this.wwObjectCtrl.update(this.wwObject);
        },
        wwRemove(list, options) {
            list.splice(options.index, 1);
            this.wwObjectCtrl.update(this.wwObject);
        },
        /*=============================================m_ÔÔ_m=============================================\
          STYLE FUNCTIONS
        \================================================================================================*/
        getWidthAndOffset(column) {
            let style = {
                marginLeft: (column.offset || 0) + '%',
                flexBasis: (column.width || 0) + '%',
                alignItems: this.aligns[column.align || 0],
                display: column.hide ? 'none' : 'flex',
                minHeight: this.columnHeight,
            }



            return style;
        },

        getBordersStyle(column) {

            let style = {};
            if (column.borders && column.borders.length == 4) {
                style.borderTopWidth = column.borders[0].width + 'px';
                style.borderTopStyle = column.borders[0].style;
                style.borderTopColor = column.borders[0].color;

                style.borderRightWidth = column.borders[1].width + 'px';
                style.borderRightStyle = column.borders[1].style;
                style.borderRightColor = column.borders[1].color;

                style.borderBottomWidth = column.borders[2].width + 'px';
                style.borderBottomStyle = column.borders[2].style;
                style.borderBottomColor = column.borders[2].color;

                style.borderLeftWidth = column.borders[3].width + 'px';
                style.borderLeftStyle = column.borders[3].style;
                style.borderLeftColor = column.borders[3].color;
            }
            return style;
        },

        /* wwManager:start */
        getOffsetStyle(column) {
            let width = column.offset / column.width * 100;
            return {
                width: width + '%',
                backgroundColor: width ? '#03a9f410' : 'transparent'
            }
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
            }

            try {
                const result = await wwLib.wwPopups.open(options)

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
            }

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
            })

            let options = {
                firstPage: 'WWCOLUMNS_EDIT',
                data: {
                    wwObject: this.wwObject
                }
            }

            try {
                const result = await wwLib.wwPopups.open(options);

                /*=============================================m_ÔÔ_m=============================================\
                  STYLE
                \================================================================================================*/
                if (typeof (result.wwColumnsConfig) != 'undefined') {
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
    display: flex;
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
    background: repeating-linear-gradient(
        -45deg,
        #2ec6ba30,
        #2ec6ba30 10px,
        #2ec6ba50 10px,
        #2ec6ba50 11px
    );
    border-width: 5px !important;
}
/* wwManager:end */
</style>