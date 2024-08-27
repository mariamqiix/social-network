export const colors = [
    "#B5C0D0",
    "#CCD3CA",
    "#F5E8DD",
    "#EED3D9",
    "#91DDCF",
    "#D8EFD3",
    "#F6F7C4",
    "#E0AED0",
    "#FAF3F0",
    "#C4DFDF",
    "#F5F0BB",
    "#C4DFAA",
    "#F7DBF0",
];

export function randomColor(): string {
    return colors[Math.floor(Math.random() * colors.length)];
}