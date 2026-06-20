import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

const GAME_WIDTH = 640;
const GAME_HEIGHT = 320;

// The dimensions of an individual screen quadrant
const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 160;

const scaleX = window.innerWidth / VIEW_WIDTH;
const scaleY = window.innerHeight / VIEW_HEIGHT;
const dynamicScale = Math.min(scaleX, scaleY);

kaplay({
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
    background: "#6695ff",
    scale: dynamicScale,
    canvas: document.getElementById("canvas")
});

// --- GAME LOGIC & CONSTANTS ---
const GRAVITY = 800;
const JUMP_FORCE = 300;
const SPEED = 120;

// Set Kaplay's global gravity
setGravity(GRAVITY);
loadRoot("/assets/");

// Define the exact order of bananas the player must eat
const PHASE_ORDER = ["blue", "green", "brown"];
const BANANAS_PER_PHASE = 5;


// Sprites
// Load the entire sheet and slice it into named sprites
loadSpriteAtlas("bananas.png", Object.fromEntries(
    Array.from({ length: 4 }, (_, i) => [
        `banana${i + 1}`, 
        {
            x: 0,
            y: i * 16,        // Dynamically calculates 0, 16, 32, 48
            width: 32,
            height: 16,
            sliceX: 2,
            anims: {
                idle: { from: 0, to: 1, loop: true, speed: 4 }
            }
        }
    ])
));

loadSpriteAtlas("fishes.png", Object.fromEntries(
    Array.from({ length: 4 }, (_, i) => [
        `banana${i + 1}`, 
        {
            y: 0,
            x: i * 16,        // Dynamically calculates 0, 16, 32, 48
            width: 16,
            height: 64,
            sliceX: 4,
            anims: {
                idle: { from: 0, to: 3, loop: true, speed: 4 }
            }
        }
    ])
));

// --- MAIN GAME SCENE ---
scene("game", () => {

    let currentPhaseIndex = 0;
    let bananasEaten = 0;

    /*
    = : Barrier
    1 : Blue Banana
    
    */

    // REMOVED THE '@' FROM THE MAP TO PREVENT PARSING ERRORS
    const levelMap = [
        "========================================",
        "=                  ||                  =",
        "= 1  2    3        ||                  =",
        "= =====       ==== ||   ===========    =",
        "=                  ||         3        =",
        "=    ===   2  1    ||    ====          =",
        "=  3               ||        ==        =",
        "=         ===      ||         2        =",
        "=                  ||                  =",
        "======================= ================", // Screen border mid-point (Row 10)
        "======================= ================",
        "=                  ||                  =",
        "=                  ||                  =",
        "=   ====           ||       ===        =",
        "=                  ||        1         =",
        "=         ====     ||                  =",
        "=                  ||             2    =",
        "=    3             ||    ======        =",
        "=                  ||                  =",
        "========================================"
    ];

    const levelConfig = {
        tileWidth: 16,
        tileHeight: 16,
        tiles: {
            "=": () => [
                rect(16, 16),
                color(50, 200, 50),
                area(),
                body({ isStatic: true }),
                "ground"
            ],
            "1": () => [
                sprite("banana-blue", { anim: "idle" }),
                area({ shape: new Rect(vec2(1,1), 14, 14) }),
                "banana",
                { type: "blue" }
            ],
            "2": () => [
                sprite("banana-green", { anim: "idle" }),
                area({ shape: new Rect(vec2(1,1), 14, 14) }),
                "banana",
                { type: "green" }
            ],
            "3": () => [
                sprite("banana-brown", { anim: "idle" }),
                area({ shape: new Rect(vec2(1,1), 14, 14) }),
                "banana",
                { type: "brown" }
            ]
        }
    };


    // 1. Generate the static tilemap layout
    addLevel(levelMap, levelConfig);

    // 2. Spawn the player manually right here. 
    // This guarantees 'player' is correctly defined in this scope!
    const player = add([
        sprite("fish"),
        pos(40, 140), // Spawns safely on the lower left floor
        area({ shape: new Rect(vec2(1,1), 14, 14) }),
        body(),
        "player"
    ]);

    function updateCamera() {
        const currentQuadX = Math.floor(player.pos.x / VIEW_WIDTH);
        const currentQuadY = Math.floor(player.pos.y / VIEW_HEIGHT);

        const camX = (currentQuadX * VIEW_WIDTH) + (VIEW_WIDTH / 2);
        const camY = (currentQuadY * VIEW_HEIGHT) + (VIEW_HEIGHT / 2);

        // Updated to use the modern API method
        setCamPos(camX, camY);
    }

    // Run the camera update check every single frame
    player.onUpdate(() => {
        updateCamera();

        // Keep your existing death barrier tracking, but adjust it for the new max height
        if (player.pos.y > GAME_HEIGHT) {
            go("lose", "Fell out of the world!");
        }
    });

    // --- UI ---
    const uiText = add([
        text("", { size: 10 }),
        pos(10, 10),
        color(255, 255, 255),
        fixed()
    ]);

    function updateUI() {
        const requiredColor = PHASE_ORDER[currentPhaseIndex];
        const remaining = BANANAS_PER_PHASE - bananasEaten;
        uiText.text = `Find: ${remaining} ${requiredColor}`;
    }
    updateUI();

    // --- CONTROLS ---
    onKeyDown("left", () => {
        player.move(-SPEED, 0);
        player.flipX = true;
    });

    onKeyDown("right", () => {
        player.move(SPEED, 0);
        player.flipX = false;
    });

    onKeyPress("up", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    });

    onKeyPress("p", () => {
        debug.inspect = !debug.inspect;
    })


    // --- COLLISION & GAME RULES ---
    player.onCollide("banana", (banana) => {
        const requiredColor = PHASE_ORDER[currentPhaseIndex];

        if (banana.type === requiredColor) {
            destroy(banana);
            bananasEaten++;

            if (bananasEaten >= BANANAS_PER_PHASE) {
                currentPhaseIndex++;
                bananasEaten = 0;

                if (currentPhaseIndex >= PHASE_ORDER.length) {
                    go("win");
                }
            }
            updateUI();
        } else {
            go("lose", "Ate the wrong sequence!");
        }
    });

    player.onUpdate(() => {
        if (player.pos.y > GAME_HEIGHT) {
            go("lose", "Fell out of the world!");
        }
    });
});

// --- LOSE SCENE ---
scene("lose", (reason) => {
    add([
        text("Game Over\n" + reason, { size: 14 }),
        pos(GAME_WIDTH / 2, GAME_HEIGHT / 2),
        anchor("center"),
        color(255, 0, 0)
    ]);

    onKeyPress("space", () => go("game"));

});

// --- WIN SCENE ---
scene("win", () => {
    add([
        text("You Evolved!\nFully Completed!", { size: 14 }),
        pos(GAME_WIDTH / 2, GAME_HEIGHT / 2),
        anchor("center"),
        color(0, 255, 0)
    ]);
});

go("game");