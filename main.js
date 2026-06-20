import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

const GAME_WIDTH = 300;
const GAME_HEIGHT = 200;

// 1. Calculate the max scale for both width and height
const scaleX = window.innerWidth / GAME_WIDTH;
const scaleY = window.innerHeight / GAME_HEIGHT;

// 2. Pick the smaller scale so the game completely fits on screen without cropping
// (Optional: Wrap this in Math.floor(Math.min(scaleX, scaleY)) if you want whole numbers for crisp pixel art)
const dynamicScale = Math.min(scaleX, scaleY);

kaplay({ 
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    background: "#6695ff",
    scale: dynamicScale, // Use the calculated scale here!
    canvas: document.getElementById("canvas")
});

