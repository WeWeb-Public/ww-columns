import wwColumnsPopupLayout from './wwColumnsPopupLayout.vue';
wwLib.wwPopups.addPopup('wwColumnsPopupLayout', wwColumnsPopupLayout);
import './stories';

export default async function openPopup(content) {
    try {
        const result = await wwLib.wwPopups.open({ firstPage: 'WW_COLUMNS_POPUP_LAYOUT', data: { ...content } });
        if (!result || !result.wwColumnsConfig) return;
        console.log(result);
        return result.wwColumnsConfig;
    } catch {
        return null;
    }
}
