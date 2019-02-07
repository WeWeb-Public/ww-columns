<template>
    <div class="ww-columns-popup-layout ww-scroll-bar">
        <div class="columns-count-container">
            <wwManagerInput class="columns-count" :label="wwLang.getText('columnsCount')" outline="true" v-model="columnsCount"></wwManagerInput>
            <wwManagerButton class="button" color="blue" @click="applyColumnCount()">{{wwLang.getText('apply')}}</wwManagerButton>
        </div>
        <div class="screen-selector-container" :class="screen">
            <div class="screen xs" :class="{'active': screen == 'xs'}" @click="screen = 'xs'">
                <div class="wwi wwi-mobile"></div>
            </div>
            <div class="screen sm" :class="{'active': screen == 'sm'}" @click="screen = 'sm'">
                <div class="wwi wwi-tablet"></div>
            </div>
            <div class="screen md" :class="{'active': screen == 'md'}" @click="screen = 'md'">
                <div class="wwi wwi-laptop"></div>
            </div>
            <div class="screen lg" :class="{'active': screen == 'lg'}" @click="screen = 'lg'">
                <div class="wwi wwi-screen"></div>
            </div>
        </div>
        <div class="preview-container">
            <div class="preview">
                <div class="column" v-for="(column, index) in screenCols" :key="index" :style="getStyle(column)" :class="getColor(index)" v-show="!column.hide">
                    <div class="info">
                        <div class="index">{{ index + 1 }}</div>
                        <div class="percent" v-if="parseInt(column.width)">{{ column.width + '%'}}</div>
                    </div>
                    <div class="background"></div>
                    <!-- <div class="background" :style="getBackgroundStyle(column)"></div> -->
                    <!-- <div class="borders" :style="getBorderStyle(column)"></div> -->
                    <div class="offset" :style="{'width': getOffsetWidth(column) + 'px'}">
                        <div class="percent" v-if="parseInt(column.offset)">{{ column.offset + '%'}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ignore-config">
            <div class="ignore">{{wwLang.getText('ignore')}}</div>
            <wwManagerRadio v-model="config[screen].ignore" :disabled="screen == 'xs'"></wwManagerRadio>
        </div>
        <div class="active-screen" v-if="config[screen].ignore">
            {{wwLang.getText('currentConfig')}}&nbsp;
            <b>{{wwLang.getText(screenNames[activeScreen])}}</b>
        </div>
        <!--
        <div class="config-tabs" v-if="!config[screen].ignore">
            <div class="tab" :class="{'active': mode == 'size'}" @click="mode = 'size'">{{wwLang.getText('sizes')}}</div>
            <div class="tab" :class="{'active': mode == 'border'}" @click="mode = 'border'">{{wwLang.getText('borders')}}</div>
            <div class="tab" :class="{'active': mode == 'shadow'}" @click="mode = 'shadow'">{{wwLang.getText('shadows')}}</div>
        </div>
        -->
        <div class="config-container" v-if="!config[screen].ignore">
            <!-- SIZE -->
            <div class="config" v-if="mode == 'size'">
                <div class="columns-count-container">
                    <wwManagerButton class="button" color="blue" @click="resizeColumns(false)">{{wwLang.getText('distribute')}}</wwManagerButton>
                    <wwManagerButton class="button" color="blue" @click="resizeColumns(true)">{{wwLang.getText('distributeWithSpaces')}}</wwManagerButton>
                </div>
                <div class="columns-count-container">
                    <wwManagerInput color="green" :label="wwLang.getText('height') +' - %'" v-model="config[screen].height"></wwManagerInput>
                </div>
                <div class="columns">
                    <div class="column" v-for="(column, index) in screenCols" :key="index" :class="getColor(index)">
                        <div class="copy-paste-container">
                            <div class="copy-paste" v-if="copiedColumnConfig.style" @click="pasteConfig('size', index)">
                                <div class="wwi wwi-paste"></div>
                            </div>
                            <div class="copy-paste" @click="copyConfig('size', index)">
                                <div class="wwi wwi-copy"></div>
                            </div>
                        </div>
                        <div class="header">
                            <div class="index">{{wwLang.getText('column')}} {{index + 1}}</div>
                            <div class="hide">&nbsp;- {{wwLang.getText('hide')}} :</div>
                            <wwManagerRadio class="hide-radio" v-model="column.hide"></wwManagerRadio>
                        </div>
                        <div class="content-size">
                            <wwManagerInput :color="getColor(index)" :label="wwLang.getText('offset') +' - %'" v-model="column.offset"></wwManagerInput>
                            <wwManagerInput :color="getColor(index)" :label="wwLang.getText('width') +' - %'" v-model="column.width"></wwManagerInput>
                            <wwManagerSelect class="select" v-model="column.align" :options="alignOptions"></wwManagerSelect>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BORDER -->
            <!--
            <div class="config" v-if="mode == 'border'">
                <div class="columns">
                    <div class="column" v-for="(column, index) in screenCols" :key="index" :class="getColor(index)">
                        <div class="copy-paste-container">
                            <div class="copy-paste" v-if="copiedColumnConfig.border" @click="pasteConfig('border', index)">
                                <div class="wwi wwi-paste"></div>
                            </div>
                            <div class="copy-paste" @click="copyConfig('border', index)">
                                <div class="wwi wwi-copy"></div>
                            </div>
                        </div>
                        <div class="header">
                            <div class="index">{{wwLang.getText('column')}} {{index + 1}}</div>
                        </div>
                        <div class="content-border">
                            <div class="border" v-for="i in 4" :key="i">
                                <wwManagerInput :color="getColor(index)" outline="true" :label="wwLang.getText(borderNames[i-1])" v-model="column.borders[i - 1].width" @change="setBorderStyle(column, i - 1, $event)"></wwManagerInput>
                                <wwManagerSelect class="select" v-model="column.borders[i - 1].style" :options="borderStyleOptions" @change="setBorderWidth(column, i - 1, $event)"></wwManagerSelect>
                                <wwManagerColorSelect v-model="column.borders[i - 1].color"></wwManagerColorSelect>
                            </div>
                            <div class="radius">
                                <wwManagerInput v-for="i in 4" :key="i" :color="getColor(index)" :label="wwLang.getText(radiusNames[i-1])" v-model="column.radius[i - 1]" @change="$forceUpdate()"></wwManagerInput>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            -->
            <!-- SHADOW -->
            <!--
            <div class="config" v-if="mode == 'shadow'">
                <div class="columns">
                    <div class="column" v-for="(column, index) in screenCols" :key="index" :class="getColor(index)">
                        <div class="copy-paste-container">
                            <div class="copy-paste" v-if="copiedColumnConfig.shadow" @click="pasteConfig('shadow', index)">
                                <div class="wwi wwi-paste"></div>
                            </div>
                            <div class="copy-paste" @click="copyConfig('shadow', index)">
                                <div class="wwi wwi-copy"></div>
                            </div>
                        </div>
                        <div class="header">
                            <div class="index">{{wwLang.getText('column')}} {{index + 1}}</div>
                        </div>
                        <div class="content-shadow">
                            <wwManagerInput class="input small" :color="getColor(index)" outline="true" label="X - px" v-model="column.shadow.x" @change="$forceUpdate()"></wwManagerInput>
                            <wwManagerInput class="input small" :color="getColor(index)" outline="true" label="Y - px" v-model="column.shadow.y" @change="$forceUpdate()"></wwManagerInput>
                            <wwManagerInput class="input" :color="getColor(index)" :label="wwLang.getText('blur') +' - px'" v-model="column.shadow.blur" @change="$forceUpdate()"></wwManagerInput>
                            <wwManagerInput class="input" :color="getColor(index)" :label="wwLang.getText('spread') +' - px'" v-model="column.shadow.spread" @change="$forceUpdate()"></wwManagerInput>
                            <wwManagerColorSelect v-model="column.shadow.color" @change="$forceUpdate()"></wwManagerColorSelect>
                        </div>
                    </div>
                </div>
            </div>
            -->
        </div>
    </div>
</template>


<script>
import langPopupLayout from './langPopupLayout.json';

export default {
    name: "wwRowPopupLayout",
    props: {
        options: Object,
    },
    data() {
        return {
            wwLang: wwLib.wwManagerLang.use(langPopupLayout),

            screens: ['xs', 'sm', 'md', 'lg'],
            screenNames: {
                xs: 'mobile',
                sm: 'tablet',
                md: 'laptop',
                lg: 'desktop'
            },
            screen: 'xs',

            columnsCount: 0,

            mode: 'size',

            colors: [
                'blue',
                'yellow',
                'pink',
                'orange',
                'green',
                'red'
            ],

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

            config: {
                lg: null,
                md: null,
                sm: null,
                xs: null,
                count: 3,
                height: null
            },

            copiedColumnConfig: {},

            activeScreen: 'xs',

            /*=============================================m_ÔÔ_m=============================================\
              OPTIONS
            \================================================================================================*/
            alignOptions: {
                type: 'text',
                values: [
                    {
                        value: "0",
                        default: true,
                        text: {
                            en_GB: 'Default',
                            fr_FR: 'Défaut'
                        }
                    },
                    {
                        value: "1",
                        text: {
                            en_GB: 'Top',
                            fr_FR: 'Haut'
                        }
                    },
                    {
                        value: "2",
                        text: {
                            en_GB: 'Center',
                            fr_FR: 'Milieu'
                        }
                    },
                    {
                        value: "3",
                        text: {
                            en_GB: 'Bottom',
                            fr_FR: 'Bas'
                        }
                    },
                ]
            },

            borderStyleOptions: {
                type: 'text',
                values: [
                    {
                        value: 'none',
                        default: true,
                        text: {
                            en_GB: 'None',
                            fr_FR: 'Aucune'
                        }
                    },
                    {
                        value: 'solid',
                        text: {
                            en_GB: 'Solid',
                            fr_FR: 'Continue'
                        }
                    },
                    {
                        value: 'dotted',
                        text: {
                            en_GB: 'Dotted',
                            fr_FR: 'Pointillés'
                        }
                    },
                    {
                        value: 'dashed',
                        text: {
                            en_GB: 'Dashed',
                            fr_FR: 'Tirets'
                        }
                    },
                    {
                        value: 'double',
                        text: {
                            en_GB: 'Double',
                            fr_FR: 'Double'
                        }
                    },
                ]
            },

            borderNames: [
                'borderTop',
                'borderLeft',
                'borderBottom',
                'borderRight'
            ],

            radiusNames: [
                'radiusTopLeft',
                'radiusTopRight',
                'radiusBottomRight',
                'radiusBottomLeft'
            ],
        };
    },
    computed: {
        screenCols() {
            let screen = this.screen;

            while (this.config[screen].ignore && this.getIndexFromScreen(screen) > 0) {
                screen = this.getScreenFromIndex(this.getIndexFromScreen(screen) - 1);
            }

            this.activeScreen = screen;

            return this.config[screen].cols;
        }
    },
    watch: {
    },
    methods: {
        init: function () {
            this.config = this.options.data.wwObject && this.options.data.wwObject.content && this.options.data.wwObject.content.data
                && this.options.data.wwObject.content.data.config ? this.options.data.wwObject.content.data.config : this.config;

            this.correctConfigs();

            this.columnsCount = this.config.count;
        },

        /*=============================================m_ÔÔ_m=============================================\
          ROW STYLE
        \================================================================================================*/
        getStyle(column) {
            let align;
            switch (column.align) {
                case "1":
                    align = 'flex-start';
                    break;
                case "2":
                    align = 'center';
                    break;
                case "3":
                    align = 'flex-end';
                    break;
                default:
                    align = 'center';

            }
            let style = {
                marginLeft: (column.offset || 0) + '%',
                flexBasis: (column.width || 0) + '%',
                height: (90 - 5 * Math.floor(this.config.count / 10)) + 'px',
                alignItems: align
            }

            return style;
        },

        /*
        getBorderStyle(column) {
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

            if (column.radius && column.radius.length == 4) {
                style.borderTopLeftRadius = column.radius[0] + 'px';
                style.borderTopRightRadius = column.radius[1] + 'px';
                style.borderBottomRightRadius = column.radius[2] + 'px';
                style.borderBottomLeftRadius = column.radius[3] + 'px';
            }

            return style;
        },

        getBackgroundStyle(column) {
            let style = {}

            if (column.radius && column.radius.length == 4) {
                style.borderTopLeftRadius = column.radius[0] + 'px';
                style.borderTopRightRadius = column.radius[1] + 'px';
                style.borderBottomRightRadius = column.radius[2] + 'px';
                style.borderBottomLeftRadius = column.radius[3] + 'px';
            }

            if (column.shadow.x || column.shadow.y || column.shadow.blur || column.shadow.spread) {
                style.boxShadow = (column.shadow.x || 0) + 'px ' + (column.shadow.y || 0) + 'px ' +
                    (column.shadow.blur || 0) + 'px ' + (column.shadow.spread || 0) + 'px ' + (column.shadow.color || '#000000');
            }

            return style;
        },
        */

        /*=============================================m_ÔÔ_m=============================================\
          CONFIG
        \================================================================================================*/
        correctConfigs() {
            this.config.count = this.config.count || 1;
            this.config.height = this.config.height || null;

            for (let screen of this.screens) {
                if (!this.config[screen]) {
                    this.config[screen] = {
                        cols: []
                    };
                }

                if (this.config[screen][0]) {
                    this.config[screen] = {
                        cols: this.config[screen]
                    }
                }

                this.config[screen].height = Math.max(this.config[screen].height || 0, 0);

                let cols = [];
                for (let i = 0; i < this.config.count; i++) {
                    let confCols = this.config[screen].cols || [];

                    if (confCols.length > i) {
                        confCols[i].align = confCols[i].align || "1";
                        confCols[i].width = confCols[i].width || 100 / this.config.count;
                        confCols[i].offset = confCols[i].offset || 0;
                        // confCols[i].borders = confCols[i].borders || JSON.parse(JSON.stringify(this.defaultBorders));
                        // confCols[i].radius = confCols[i].radius || JSON.parse(JSON.stringify(this.defaultRadius));
                        // confCols[i].shadow = confCols[i].shadow || JSON.parse(JSON.stringify(this.defaultShadow));

                        cols.push(confCols[i]);
                    }
                    else {
                        cols.push({
                            align: "1",
                            width: 100 / this.config.count,
                            offset: 0,
                            // borders: JSON.parse(JSON.stringify(this.defaultBorders)),
                            // radius: JSON.parse(JSON.stringify(this.defaultRadius)),
                            // shadow: JSON.parse(JSON.stringify(this.defaultShadow))
                        })
                    }
                }

                this.config[screen].cols = cols;
            }
            console.log(this.config)
        },

        copyConfig(type, index) {
            switch (type) {
                case 'size':
                    this.copiedColumnConfig.style = {};
                    Vue.set(this.copiedColumnConfig.style, 'width', this.config[this.screen].cols[index].width);
                    Vue.set(this.copiedColumnConfig.style, 'offset', this.config[this.screen].cols[index].offset);
                    Vue.set(this.copiedColumnConfig.style, 'align', this.config[this.screen].cols[index].align);
                    Vue.set(this.copiedColumnConfig.style, 'hide', this.config[this.screen].cols[index].hide);
                    break;
                case 'border':
                    this.copiedColumnConfig.border = JSON.parse(JSON.stringify(this.config[this.screen].cols[index].borders));
                    this.copiedColumnConfig.radius = JSON.parse(JSON.stringify(this.config[this.screen].cols[index].radius));
                    break;
                case 'shadow':
                    this.copiedColumnConfig.shadow = JSON.parse(JSON.stringify(this.config[this.screen].cols[index].shadow));
                    break;
                default:
                    break;
            }

            this.$forceUpdate();
        },

        pasteConfig(type, index) {
            switch (type) {
                case 'size':
                    Vue.set(this.config[this.screen].cols[index], 'width', this.copiedColumnConfig.style.width);
                    Vue.set(this.config[this.screen].cols[index], 'offset', this.copiedColumnConfig.style.offset);
                    Vue.set(this.config[this.screen].cols[index], 'align', this.copiedColumnConfig.style.align);
                    Vue.set(this.config[this.screen].cols[index], 'hide', this.copiedColumnConfig.style.hide);
                    break;
                case 'border':
                    Vue.set(this.config[this.screen].cols[index], 'borders', JSON.parse(JSON.stringify(this.copiedColumnConfig.border)));
                    Vue.set(this.config[this.screen].cols[index], 'radius', JSON.parse(JSON.stringify(this.copiedColumnConfig.radius)));
                    break;
                case 'shadow':
                    Vue.set(this.config[this.screen].cols[index], 'shadow', JSON.parse(JSON.stringify(this.copiedColumnConfig.shadow)));
                    break;
                default:
                    break;
            }

            this.$forceUpdate();
        },

        /*=============================================m_ÔÔ_m=============================================\
          EDITION
        \================================================================================================*/
        applyColumnCount() {
            try {
                this.columnsCount = Math.min(Math.max(parseInt(this.columnsCount || 1) || 1, 1), 100);
            } catch (error) {
                this.columnsCount = 0;
            }

            this.config.count = this.columnsCount;

            this.correctConfigs();
        },

        resizeColumns(offsets) {
            let config = [];

            let offset = offsets ? 2 : 0;

            const offsetPerLine = offset * (Math.min(this.config.count, 10) + 1);

            let width = Math.max(10 - offsetPerLine / 10, ((100 - offsetPerLine) / this.config.count));

            for (let i = 0; i < this.config.count; i++) {
                this.screenCols[i].width = width;
                this.screenCols[i].offset = offset;
                config.push(this.screenCols[i]);
            }

            this.config[this.screen].cols = config;
        },

        setBorderStyle(column, index, width) {
            if (width != 0 && column.borders[index].style == 'none') {
                column.borders[index].style = 'solid';
            }
            else if (width == 0) {
                column.borders[index].style = 'none';
            }
        },

        setBorderWidth(column, index, style) {
            if (style != 'none' && column.borders[index].width == 0) {
                column.borders[index].width = 1;
            }
            else if (style == 'none') {
                column.borders[index].width = 0;
            }
        },

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

        getColor(index) {
            return this.colors[index % this.colors.length];
        },

        getOffsetWidth(column) {
            if (!this.$el) {
                return 0;
            }

            return this.$el.querySelector('.preview').getBoundingClientRect().width * column.offset / 100;
        },

        beforeNext() {

            let config = JSON.parse(JSON.stringify(this.config));
            config.sm.cols = config.sm.ignore ? null : config.sm.cols;
            config.md.cols = config.md.ignore ? null : config.md.cols;
            config.lg.cols = config.lg.ignore ? null : config.lg.cols;

            this.options.result.wwRowConfig = config;
        }
    },
    created() {
        this.init();
    },
    mounted() {
    },
    beforeDestroyed() {

    }
};
</script>

<style scoped lang="scss">
$ww-blue: #2e84c2;
$ww-pink: #ea588d;
$ww-yellow: #fdc806;
$ww-orange: #ef811a;
$ww-green: #49b9b3;
$ww-red: #e02a4d;
$ww-font: "Monserrat", sans-serif;

.ww-columns-popup-layout {
    overflow-x: hidden;

    .columns-count-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;

        .columns-count {
            width: 250px;
        }

        .button {
            margin-left: 20px;
        }
    }

    .screen-selector-container {
        display: flex;
        justify-content: center;
        position: relative;
        height: 65px;
        align-items: flex-end;

        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            height: 2px;
            width: 450px;
            transition: background-color 0.5s ease;
            background: linear-gradient(
                to right,
                #efefef 0%,
                transparent 30%,
                transparent 70%,
                #efefef 100%
            );
        }
        &.xs {
            &::after {
                background-color: $ww-blue;
            }
        }
        &.sm {
            &::after {
                background-color: $ww-pink;
            }
        }
        &.md {
            &::after {
                background-color: $ww-green;
            }
        }
        &.lg {
            &::after {
                background-color: $ww-orange;
            }
        }
        & > div {
            font-size: 3rem;
            margin: 0 5px;
            border: 2px solid #7d7d7d;
            color: #7d7d7d;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            border-bottom: none;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60px;
            width: 70px;
            cursor: pointer;
            transition: all 0.5s ease, height 0.2s ease;
            &:hover {
                height: 65px;
            }
            &.active {
                height: 65px;
                z-index: 1;
                background-color: white;
                &.xs {
                    border-color: $ww-blue;
                    color: $ww-blue;
                }
                &.sm {
                    border-color: $ww-pink;
                    color: $ww-pink;
                }
                &.md {
                    border-color: $ww-green;
                    color: $ww-green;
                }
                &.lg {
                    border-color: $ww-orange;
                    color: $ww-orange;
                }
            }
        }
    }
    .preview-container {
        padding: 0 30px;
        .preview {
            display: flex;
            flex-wrap: wrap;
            min-height: 30px;
            background-image: linear-gradient(
                135deg,
                #000000 6.25%,
                #ffffff00 6.25%,
                #ffffff00 50%,
                #000000 50%,
                #000000 56.25%,
                #ffffff00 56.25%,
                #ffffff00 100%
            );
            background-size: 11.31px 11.31px;
            .column {
                position: relative;
                height: 90px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: $ww-font;
                background-color: white;
                &.blue {
                    color: $ww-blue;
                    .background {
                        background-color: $ww-blue;
                    }
                    .offset {
                        background-image: linear-gradient(
                            135deg,
                            $ww-blue 6.25%,
                            #ffffff00 6.25%,
                            #ffffff00 50%,
                            $ww-blue 50%,
                            $ww-blue 56.25%,
                            #ffffff00 56.25%,
                            #ffffff00 100%
                        );
                    }
                }
                &.pink {
                    color: $ww-pink;
                    .background {
                        background-color: $ww-pink;
                    }
                    .offset {
                        background-image: linear-gradient(
                            135deg,
                            $ww-pink 6.25%,
                            #ffffff00 6.25%,
                            #ffffff00 50%,
                            $ww-pink 50%,
                            $ww-pink 56.25%,
                            #ffffff00 56.25%,
                            #ffffff00 100%
                        );
                    }
                }
                &.yellow {
                    color: $ww-yellow;
                    .background {
                        background-color: $ww-yellow;
                    }
                    .offset {
                        background-image: linear-gradient(
                            135deg,
                            $ww-yellow 6.25%,
                            #ffffff00 6.25%,
                            #ffffff00 50%,
                            $ww-yellow 50%,
                            $ww-yellow 56.25%,
                            #ffffff00 56.25%,
                            #ffffff00 100%
                        );
                    }
                }
                &.orange {
                    color: $ww-orange;
                    .background {
                        background-color: $ww-orange;
                    }
                    .offset {
                        background-image: linear-gradient(
                            135deg,
                            $ww-orange 6.25%,
                            #ffffff00 6.25%,
                            #ffffff00 50%,
                            $ww-orange 50%,
                            $ww-orange 56.25%,
                            #ffffff00 56.25%,
                            #ffffff00 100%
                        );
                    }
                }
                &.green {
                    color: $ww-green;
                    .background {
                        background-color: $ww-green;
                    }
                    .offset {
                        background-image: linear-gradient(
                            135deg,
                            $ww-green 6.25%,
                            #ffffff00 6.25%,
                            #ffffff00 50%,
                            $ww-green 50%,
                            $ww-green 56.25%,
                            #ffffff00 56.25%,
                            #ffffff00 100%
                        );
                    }
                }
                &.red {
                    color: $ww-red;
                    .background {
                        background-color: $ww-red;
                    }
                    .offset {
                        background-image: linear-gradient(
                            135deg,
                            $ww-red 6.25%,
                            #ffffff00 6.25%,
                            #ffffff00 50%,
                            $ww-red 50%,
                            $ww-red 56.25%,
                            #ffffff00 56.25%,
                            #ffffff00 100%
                        );
                    }
                }
                .info {
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    padding: 5px 0;
                    .index {
                        font-size: 1.1rem;
                    }
                    .percent {
                        font-size: 1rem;
                    }
                }
                .borders,
                .background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
                }
                .background {
                    opacity: 0.4;
                }
                .offset {
                    position: absolute;
                    top: 0;
                    right: 100%;
                    bottom: 0;
                    background-size: 11.31px 11.31px;
                    background-color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .percent {
                        background-color: #ffffffa4;
                    }
                }
            }
        }
    }
    .ignore-config {
        padding: 30px 0 20px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .ignore {
            font-family: $ww-font;
            font-size: 1rem;
            color: grey;
            margin-right: 10px;
        }
    }
    .active-screen {
        display: flex;
        justify-content: center;
        color: $ww-red;
        font-family: $ww-font;
        font-size: 1.5rem;
    }
    .config-tabs {
        display: flex;
        justify-content: center;
        padding: 0 0 30px 0;
        .tab {
            width: 130px;
            cursor: pointer;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            font-family: $ww-font;
            font-size: 1rem;
            color: $ww-red;
            text-transform: uppercase;
            font-weight: bold;
            &:hover {
                background-color: #efefef;
            }
            &.active {
                color: white;
                background-color: $ww-red;
            }
        }
    }
    .config-container {
        padding: 0 30px;
        .config {
            .columns {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                .column {
                    margin: 10px;
                    flex-basis: 500px;
                    max-width: 100%;
                    border: 1px solid;
                    border-radius: 7px;
                    padding: 10px;
                    position: relative;
                    &.blue {
                        border-color: $ww-blue;
                        .header,
                        .copy-paste {
                            color: $ww-blue;
                        }
                        .copy-paste:hover {
                            background-color: $ww-blue;
                        }
                    }
                    &.pink {
                        border-color: $ww-pink;
                        .header,
                        .copy-paste {
                            color: $ww-pink;
                        }
                        .copy-paste:hover {
                            background-color: $ww-pink;
                        }
                    }
                    &.yellow {
                        border-color: $ww-yellow;
                        .header,
                        .copy-paste {
                            color: $ww-yellow;
                        }
                        .copy-paste:hover {
                            background-color: $ww-yellow;
                        }
                    }
                    &.orange {
                        border-color: $ww-orange;
                        .header,
                        .copy-paste {
                            color: $ww-orange;
                        }
                        .copy-paste:hover {
                            background-color: $ww-orange;
                        }
                    }
                    &.green {
                        border-color: $ww-green;
                        .header,
                        .copy-paste {
                            color: $ww-green;
                        }
                        .copy-paste:hover {
                            background-color: $ww-green;
                        }
                    }
                    &.red {
                        border-color: $ww-red;
                        .header,
                        .copy-paste {
                            color: $ww-red;
                        }
                        .copy-paste:hover {
                            background-color: $ww-red;
                        }
                    }
                    .copy-paste-container {
                        position: absolute;
                        top: 5px;
                        right: 10px;
                        display: flex;
                        .copy-paste {
                            font-size: 2rem;
                            cursor: pointer;
                            width: 35px;
                            height: 35px;
                            transition: all 0.2s ease;
                            border-radius: 5px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            &:hover {
                                color: white;
                            }
                        }
                    }
                    .header {
                        font-family: $ww-font;
                        display: inline-flex;
                        align-items: center;
                        margin-bottom: 10px;
                        .index {
                            font-size: 1.2rem;
                        }
                        .hide {
                            font-size: 0.9rem;
                            margin-right: 5px;
                        }
                    }
                    .content-size {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .select {
                            flex-basis: 150px;
                        }
                    }
                    .content-border {
                        display: flex;
                        flex-direction: column;
                        .border {
                            display: flex;
                            width: 100%;
                            align-items: center;
                            margin-bottom: 5px;
                            &.all {
                                margin-bottom: 20px;
                            }
                            & > div {
                                margin: 0 5px;
                            }
                            .select {
                                flex-grow: 1;
                            }
                        }
                        .radius {
                            margin-top: 10px;
                            display: flex;
                            width: 100%;
                            justify-content: space-between;
                            & > div {
                                flex-basis: calc(25% - 15px);
                                width: calc(25% - 15px);
                            }
                        }
                    }
                    .content-shadow {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .input {
                            flex-basis: calc(20% - 5px);
                            width: calc(20% - 5px);
                        }
                    }
                }
            }
        }
    }
}
</style>