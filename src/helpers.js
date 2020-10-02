export function createBorder() {
    return { color: '#000000', style: 'solid', width: 0 };
}
export function createBorders() {
    return Array.from({ length: 4 }, () => createBorder());
}
export function createColumnConfig(count) {
    return {
        align: '1',
        width: 100 / count,
        offset: 0,
        borders: createBorders(),
    };
}
