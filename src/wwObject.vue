<template>
    <div class="ww-columns" v-style="containerStyle">
        <!-- wwManager:start -->
        <div class="ww-column-tab">
            <span class="wwi wwi-align-right"></span>
        </div>
        <!-- wwManager:end -->
        <div class="ww-column" v-for="(column, index) in content.columns" :key="index" v-style="columnsStyle[index]">
            <!-- wwManager:start -->
            <div class="ww-column-preview">
                <div class="offset" v-style="offsetsStyle[index]"></div>
            </div>
            <!-- wwManager:end -->
            <wwObject
                class="ww-column-bg"
                v-bind="column.background"
                isBackground
                v-style="backgroundsStyle[index]"
            ></wwObject>
            <wwLayout :path="`columns[${index}].wwObjects`" class="ww-column-container" />
        </div>
    </div>
</template>

<script>
/* wwManager:start */
import openPopup from './popups';
/* wwManager:end */

const screens = ['xs', 'sm', 'md', 'lg'];
const aligns = ['center', 'flex-start', 'center', 'flex-end'];

export default {
    name: '__COMPONENT_NAME__',
    props: {
        content: Object,
    },
    wwDefaultContent: {
        count: 3,
        config: {
            xs: {
                height: null,
                ignore: false,
                cols: [
                    { order: 0, width: 33.33 },
                    { order: 1, width: 33.33 },
                    { order: 3, width: 33.33 },
                ],
            },
            sm: null,
            md: null,
            lg: null,
        },
        columns: [
            { background: { isWwObject: true, type: 'ww-color' }, wwObjects: [] },
            { background: { isWwObject: true, type: 'ww-color' }, wwObjects: [] },
            { background: { isWwObject: true, type: 'ww-color' }, wwObjects: [] },
        ],
    },
    computed: {
        containerStyle() {
            const style = {};
            screens.forEach(screen => {
                if (this.content.config[screen]) {
                    style[screen] = { flexWrap: this.content.config[screen].nowrap ? 'nowrap' : 'wrap' };
                }
            });
            return style;
        },
        columnsStyle() {
            return this.content.columns.map((col, i) => this.getColumnStyle(i));
        },
        backgroundsStyle() {
            return this.content.columns.map((col, i) => this.getBackgroundStyle(i));
        },
        /* wwManager:start */
        offsetsStyle() {
            return this.content.columns.map((col, i) => this.getOffsetStyle(i));
        },
        /* wwManager:end */
    },
    methods: {
        getColumnConfigByScreen(screen, index) {
            return (
                (this.content.config[screen] &&
                    this.content.config[screen].cols &&
                    this.content.config[screen].cols[index]) ||
                null
            );
        },
        getColumnMinHeightByScreen(screen) {
            if (!this.content.config[screen]) {
                return '60px';
            }
            let { height, unit = 'vh' } = this.content.config[screen];
            if (!height) {
                return '60px';
            }
            if (unit === '%') {
                unit = 'vh';
            }
            return `${height}${unit}`;
        },
        getColumnStyleByScreen(screen, index) {
            const config = this.getColumnConfigByScreen(screen, index);
            if (!config) return null;

            return {
                marginLeft: (config.offset || 0) + '%',
                flexBasis: (config.width || 0) + '%',
                alignItems: aligns[config.align || 0],
                display: config.hide ? 'none' : 'flex',
                minHeight: this.getColumnMinHeightByScreen(screen),
                order: config.order || '0',
            };
        },
        getColumnStyle(index) {
            const style = {};
            screens.forEach(screen => (style[screen] = this.getColumnStyleByScreen(screen, index)));
            return style;
        },
        getBackgroundStyleByScreen(screen, index) {
            const config = this.getColumnConfigByScreen(screen, index);
            if (!config) return {};
            if (!config.borders || !config.borders.length === 4) {
                return {};
            }
            const [top, right, bottom, left] = config.borders;
            return {
                borderTopWidth: top.width + 'px',
                borderTopStyle: top.style,
                borderTopColor: top.color,

                borderRightWidth: right.width + 'px',
                borderRightStyle: right.style,
                borderRightColor: right.color,

                borderBottomWidth: bottom.width + 'px',
                borderBottomStyle: bottom.style,
                borderBottomColor: bottom.color,

                borderLeftWidth: left.width + 'px',
                borderLeftStyle: left.style,
                borderLeftColor: left.color,
            };
        },
        getBackgroundStyle(index) {
            const style = {};
            screens.forEach(screen => (style[screen] = this.getBackgroundStyleByScreen(screen, index)));
            return style;
        },
        /* wwManager:start */
        getOffsetStyleByScreen(screen, index) {
            const config = this.getColumnConfigByScreen(screen, index);
            if (!config) return {};
            const { offset, width } = config;
            return {
                width: Math.round((parseFloat(offset) / parseFloat(width)) * 100000) / 1000 + '%',
                backgroundColor: (parseFloat(offset) / parseFloat(width)) * 100 ? '#03a9f410' : 'transparent',
            };
        },
        getOffsetStyle(index) {
            const style = {};
            screens.forEach(screen => (style[screen] = this.getOffsetStyleByScreen(screen, index)));
            return style;
        },
        async edit() {
            const update = await openPopup(this.content);
            if (update) {
                this.$emit('update', update);
            }
        },
        /* wwManager:end */
    },
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
    display: flex;
    flex-direction: column;
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
/* wwManager:end */
</style>
