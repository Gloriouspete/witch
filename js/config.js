export const POTIONS = [
    { color: 0xff0000, name: 'Health', price: '50g' },
    { color: 0x00ff00, name: 'Mana', price: '75g' },
    { color: 0x0000ff, name: 'Strength', price: '100g' },
    { color: 0xff00ff, name: 'Invisibility', price: '150g' },
    { color: 0xffff00, name: 'Flying', price: '200g' },
    { color: 0x00ffff, name: 'Wisdom', price: '125g' },
    { color: 0xff8800, name: 'Love', price: '250g' },
    { color: 0x8800ff, name: 'Luck', price: '175g' }
];

export const ROOM_CONFIG = {
    width: 12,
    height: 8,
    depth: 8,
    wallColor: 0x2a1810,
    floorColor: 0x3a2510,
    counterColor: 0x3a2510,
    shelfColor: 0x3a2510
};

export const LIGHT_CONFIG = {
    ambient: {
        color: 0x333333,
        intensity: 0.5
    },
    main: {
        color: 0xff9933,
        intensity: 1.5,
        distance: 20,
        position: { x: 0, y: 7, z: 0 }
    },
    sconces: {
        color: 0xff6633,
        intensity: 0.8,
        distance: 8,
        positions: [
            { x: -5, y: 4, z: -3 },
            { x: 5, y: 4, z: -3 },
            { x: -5, y: 4, z: 1 },
            { x: 5, y: 4, z: 1 }
        ]
    }
};

export const POTION_CONFIG = {
    spacing: 1.5,
    startX: -5.25,
    height: 2.4,
    rows: {
        front: -1.5,
        back: -3
    }
};
