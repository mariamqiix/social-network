export const colors = [
    "#B5C0D0",
    "rgba(204, 211, 202, 0.8)",
    "#F5E8DD",
    "rgba(238, 211, 217, 0.9)",
    "#D0ECEC",
    "#D8EFD3",
    "#F6F7D8",
    "#E0C1D0",
    "#FAF3F0",
    "#D5DFDF",
    "#F5F0CF",
    "#D2DFC8",
    "#F7E2F0",
];

export function randomColor(): string {
    return colors[Math.floor(Math.random() * colors.length)];
}