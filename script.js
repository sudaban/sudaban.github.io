// script.js
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let time = 0;

const colorSets = [
    ["#ff5f6d", "#ffc371"], // Kırmızı - Turuncu
    ["#0d3b66", "#1f7a8c"], // Koyu Mavi Tonları
    ["#3d5a80", "#98c1d9"], // Açık Mavi Tonları
    ["#8a2387", "#e94057", "#f27121"], // Mor - Pembe - Turuncu
    ["#833ab4", "#fd1d1d", "#fcb045"], // Instagram Gradient
];

let currentSetIndex = 0;
let colorInterpolation = 0;

function lerpColor(color1, color2, t) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r = ((c1 >> 16) & 0xff) + (((c2 >> 16) & 0xff) - ((c1 >> 16) & 0xff)) * t;
    const g = ((c1 >> 8) & 0xff) + (((c2 >> 8) & 0xff) - ((c1 >> 8) & 0xff)) * t;
    const b = (c1 & 0xff) + ((c2 & 0xff) - (c1 & 0xff)) * t;

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function drawInfinity() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const amplitude = 250;
    const frequency = 0.05;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    const currentColors = colorSets[currentSetIndex];
    const nextSetIndex = (currentSetIndex + 1) % colorSets.length;
    const nextColors = colorSets[nextSetIndex];

    colorInterpolation += 0.002; // Geçiş hızı

    if (colorInterpolation >= 1) {
        colorInterpolation = 0;
        currentSetIndex = nextSetIndex;
    }

    const interpolatedColors = currentColors.map((color, index) => {
        const nextColor = nextColors[index % nextColors.length];
        return lerpColor(color, nextColor, colorInterpolation);
    });

    interpolatedColors.forEach((color, index) => {
        gradient.addColorStop(index / (interpolatedColors.length - 1), color);
    });

    ctx.lineWidth = 5;
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const t = (time + i) * frequency;
        const x = centerX + Math.sin(t) * amplitude;
        const y = centerY + Math.sin(2 * t) * amplitude / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    time += 0.1;

    document.querySelector(".hero h1").style.color = interpolatedColors[0];
    if (interpolatedColors.length > 1) {
        document.querySelector(".hero span").style.color = interpolatedColors[1];
    }

    requestAnimationFrame(drawInfinity);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

drawInfinity();