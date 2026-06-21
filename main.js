import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 160;

const scaleX = window.innerWidth / VIEW_WIDTH;
const scaleY = window.innerHeight / VIEW_HEIGHT;
const dynamicScale = Math.min(scaleX, scaleY);

kaplay({
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
    scale: dynamicScale,
    background: "#000000",
    canvas: document.getElementById("canvas")
});

loadRoot("/assets/");

// --- DICTIONARIES & DATA ---
const FORM_NAMES = {
    "fish1": "Goldfish", "fish2": "Bass Fish", "fish3": "Powder Blue Fish", "fish4": "Discus Fish",
    "shark1": "Thrasher", "shark2": "Blåhaj", "shark3": "Whale Shark", "shark4": "Hammerhead Shark",
    "lizard1": "Boa", "lizard2": "Chameleon", "lizard3": "Tortoise", "lizard4": "Alligator",
    "monkey1": "Lemur", "monkey2": "Macaque", "monkey3": "Chimp", "monkey4": "Gorilla",
    "dinosaur1": "Yoshi", "dinosaur2": "Dilophosaurus", "dinosaur3": "Chrome Dino", "dinosaur4": "Orpheus",
    "primates1": "Monkey", "primates2": "Gorilla", "primates3": "Caveman", "primates4": "HackClubber"
};

const ANIMAL_SIZES = {
    "fish": [1, 1],
    "shark": [2, 1],
    "lizard": [2, 1],
    "monkey": [1, 2],
    "dinosaur": [1.5, 1.5],
    "primates": [1, 1]
};

const BANANA_NAMES = {
    1: "Red Banana", 2: "Orange Banana", 3: "Green Banana", 4: "Blue Banana"
};

// --- SPRITE LOADING ---
loadSpriteAtlas("bananas.png", Object.fromEntries(
    Array.from({ length: 4 }, (_, i) => [
        `banana${i + 1}`,
        { y: 0, x: i * 16, width: 16, height: 64, sliceY: 4, anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } } }
    ])
));

Object.entries(ANIMAL_SIZES).forEach(([name, [wMult, hMult]]) => {
    const sliceWidth = wMult * 16;
    const sliceHeight = hMult * 16;

    loadSpriteAtlas(`${name}.png`, Object.fromEntries(
        Array.from({ length: 4 }, (_, i) => [
            `${name}${i + 1}`,
            { x: i * sliceWidth, y: 0, width: sliceWidth, height: sliceHeight * 4, sliceY: 4, anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } } }
        ])
    ));
});

loadSprite("green_coral", "green_coral.png", { sliceX: 2, sliceY: 2 });
loadSprite("pink_coral", "pink_coral.png", { sliceX: 2, sliceY: 2 });
loadSprite("dust", "dust.png", { sliceX: 2, sliceY: 2 });
loadSprite("bubble", "bubble.png", { sliceX: 2, sliceY: 2 });
loadSprite("grass_block", "minecraft_grass_block.png", { sliceX: 2, sliceY: 2 });
loadSprite("cave", "cave.png", { sliceX: 2, sliceY: 4 });
loadSprite("vine", "vines.png", { sliceX: 1, sliceY: 2 });

// --- LEVEL CONFIGURATIONS ---
const LEVELS = [
    // Level 0: Fish - Top-Down Puzzle
    {
        animal: "fish",
        bgColor: "#6695ff",
        barrierSprite: "green_coral",
        gravity: 0,
        speed: 120,
        jumpForce: 0,
        bananasRequired: [1, 1, 1, 1],
        map: [
            "========================================",
            "=                  ||                  =",
            "= P   1     ====   ||  3    =======    =",
            "=     =     =      ||       =          =",
            "=======     =      ||========    ==    =",
            "=           =               =          =",
            "=    ===           ||       =   4      =",
            "=     =    2       ||                  =",
            "=                  ||                  =",
            "========================================"
        ]
    },
    // Level 1: Shark - Top-Down Puzzle
    {
        animal: "shark",
        bgColor: "#002a66",
        barrierSprite: "pink_coral",
        gravity: 0,
        speed: 160,
        jumpForce: 0,
        bananasRequired: [1, 1, 1, 1],
        map: [
            "==================================================",
            "=                  ||                            =",
            "=  P               ||                            =",
            "= ======   =====   ||  =========   ===========   =",
            "=  =   1       =   ||          =           =     =",
            "=  =   =   =   =     =======   =========   =  4  =",
            "=  =   =   =   =           =           =   =     =",
            "=  =====   =====   ||===   =========   =   =     =",
            "=          2       ||  3               =         =",
            "=================================================="
        ]
    },
    // Level 2: Lizard - Platformer (Old Fish Puzzle)
    {
        animal: "lizard",
        bgColor: "#2d231e",
        barrierSprite: "cave",
        gravity: 600,
        speed: 120,
        jumpForce: 200,
        bananasRequired: [2, 3, 3, 4],
        map: [
            "========================================",
            "=                  ||                  =",
            "=  1P  2    2       4                  =",
            "=  ====            ||         =====    =",
            "=            =     ||           3      =",
            "=    ===   3    1  ||    ====          =",
            "=  3               ||                  =",
            "=         ===               == 2       =",
            "=                                      =",
            "=======================   ==============",
            "=======================   ==============",
            "=                  ||                  =",
            "=     4            ||                  =",
            "=   ====           ||       ===        =",
            "=                  ||       4 1        =",
            "=     2   ====     ||          1       =",
            "=                  ||             1    =",
            "=    1     4   =             1=        =",
            "=                                      =",
            "========================================"
        ]
    },
    // Level 3: dinosaur - Platformer 
    {
        animal: "dinosaur",
        bgColor: "#1c1410",
        barrierSprite: "cave",
        gravity: 600,
        speed: 160,
        jumpForce: 400,
        bananasRequired: [1, 1, 1, 2],
        map: [
            "==================================================",
            "= V V V                                    V V V =",
            "= v v v                                    v v v =",
            "= √ √ √                                    √ √ √ =",
            "=                                                =",
            "= P   1   2   3   4      4   3   2   1           =",
            "====== === === === ====== === === === === ^^======",
            "=      ^   ^   ^          ^   ^   ^   ^   aa     =",
            "       a   a   a          a   a   a   a   AA      ",
            "=================================================="
        ]
    },
    {
        // Level 4: Primates - Platformer Blank Space
        animal: "primates",
        bgColor: "#87ceeb",
        barrierSprite: "grass_block",
        gravity: 600,
        speed: 100,
        jumpForce: 255,
        bananasRequired: [1, 1, 1, 1],
        map: [
            "========================================",
            "=  K2            = ||           1      =",
            "=  K     k   K==            K ===      =",
            "=  K     K   K   ==||=      K       == =",
            "=        K   3K    ||   =         =    =",
            "=        K    K    ||    = k     =     =",
            "=      ====        ||      K =         =",
            "=                  ||      K ===       =",
            "= P                ||      =   4=      =",
            "========================================"
        ]
    }
];

// --- MAIN GAME SCENE ---
scene("game", (levelIndex = 0) => {

    const config = LEVELS[levelIndex];
    if (!config) { go("win"); return; }

    setBackground(Color.fromHex(config.bgColor));
    setGravity(config.gravity);

    const GAME_WIDTH = config.map[0].length * 16;
    const GAME_HEIGHT = config.map.length * 16;

    let currentForm = 1;
    let bananasEaten = 0;

    const levelConfig = {
        tileWidth: 16,
        tileHeight: 16,
        tiles: {
            "=": () => {
                const isCave = config.barrierSprite === "cave";
                const frames = isCave ? [1, 3, 5, 7] : [0, 1, 2, 3];
                return [
                    sprite(config.barrierSprite, { frame: frames[Math.floor(Math.random() * frames.length)] }),
                    area(),
                    body({ isStatic: true }),
                    offscreen({ hide: true, distance: 64 }),
                    "ground"
                ];
            },
            "|": () => {
                const isCave = config.barrierSprite === "cave";
                const frames = isCave ? [1, 3, 5, 7] : [0, 1, 2, 3];
                return [
                    sprite(config.barrierSprite, { frame: frames[Math.floor(Math.random() * frames.length)] }),
                    area(),
                    body({ isStatic: true }),
                    offscreen({ hide: true, distance: 64 }),
                    "ground"
                ];
            },

            // --- UPWARD SPIKES (Stalagmites) ---
            "A": () => [ // BASE UP
                sprite("cave", { frame: 4, flipY: false }),
                area({ shape: new Rect(vec2(2, 0), 12, 16) }),
                body({ isStatic: true }),
                "spike"
            ],
            "a": () => [ // MID UP
                sprite("cave", { frame: 2, flipY: false }),
                area({ shape: new Rect(vec2(2, 0), 12, 16) }),
                body({ isStatic: true }),
                "spike"
            ],
            "^": () => [ // SHARP UP
                sprite("cave", { frame: 0, flipY: false }),
                area({ shape: new Rect(vec2(2, 2), 12, 14) }),
                body({ isStatic: true }),
                "spike"
            ],

            // --- DOWNWARD SPIKES (Stalactites) ---
            "V": () => [ // BASE DOWN
                sprite("cave", { frame: 4, flipY: true }),
                area({ shape: new Rect(vec2(2, 0), 12, 16) }),
                body({ isStatic: true }),
                "spike"
            ],
            "v": () => [ // MID DOWN
                sprite("cave", { frame: 2, flipY: true }),
                area({ shape: new Rect(vec2(2, 0), 12, 16) }),
                body({ isStatic: true }),
                "spike"
            ],
            "√": () => [ // SHARP DOWN
                sprite("cave", { frame: 0, flipY: true }),
                area({ shape: new Rect(vec2(2, 0), 12, 14) }),
                body({ isStatic: true }),
                "spike"
            ],

            // --- VINES ---
            "K": () => [
                sprite("vine", { frame: 1 }),
                area({ shape: new Rect(vec2(0, 0), 16, 16) }),
                body({ isStatic: true }),
                "vine"
            ],
            "k": () => [
                sprite("vine", { frame: 0 }),
                area({ shape: new Rect(vec2(0, 8), 16, 8) }),
                body({ isStatic: true }),
                "vine"
            ],

            // --- COLLECTIBLES ---
            "1": () => [sprite("banana1", { anim: "idle" }), area({ shape: new Rect(vec2(1, 1), 14, 14) }), "banana", { bType: 1 }],
            "2": () => [sprite("banana2", { anim: "idle" }), area({ shape: new Rect(vec2(1, 1), 14, 14) }), "banana", { bType: 2 }],
            "3": () => [sprite("banana3", { anim: "idle" }), area({ shape: new Rect(vec2(1, 1), 14, 14) }), "banana", { bType: 3 }],
            "4": () => [sprite("banana4", { anim: "idle" }), area({ shape: new Rect(vec2(1, 1), 14, 14) }), "banana", { bType: 4 }],
            "P": () => ["spawnpoint"]
        }
    };

    // --- SPAWNPOINT FINDER SCRIPT ---
    let playerStartPos = vec2(40, 140);

    for (let y = 0; y < config.map.length; y++) {
        const x = config.map[y].indexOf("P");
        if (x !== -1) {
            playerStartPos = vec2(x * 16, y * 16);
            break;
        }
    }

    addLevel(config.map, levelConfig);

    // --- PARTICLES ---
    const isWaterLevel = config.animal === "fish" || config.animal === "shark";
    const isCaveLevel = config.animal === "lizard" || config.animal === "dinosaur";

    if (isWaterLevel || isCaveLevel) {
        const spriteName = isWaterLevel ? "bubble" : "dust";
        const dirY = isWaterLevel ? -1 : 1;
        const speedRange = isWaterLevel ? [15, 35] : [10, 25];
        const wobbleMult = isWaterLevel ? 2 : 1;

        // Dynamic map-size particle scaling (around ~30 particles per screen)
        const mapScreensArea = (GAME_WIDTH * GAME_HEIGHT) / (VIEW_WIDTH * VIEW_HEIGHT);
        const particleCount = Math.floor(mapScreensArea * 30);

        for (let i = 0; i < particleCount; i++) {
            const p = add([
                sprite(spriteName, { frame: randi(0, 4) }),
                pos(rand(0, GAME_WIDTH), rand(0, GAME_HEIGHT)),
                opacity(rand(0.3, 0.7)),
                z(5), // Render right on top of level tiles, but under the player
                "particle",
                {
                    speed: rand(speedRange[0], speedRange[1]),
                    wobbleOffset: rand(0, Math.PI * 2),
                }
            ]);

            p.onUpdate(() => {
                p.pos.y += dirY * p.speed * dt();
                p.pos.x += Math.sin(time() * wobbleMult + p.wobbleOffset) * 0.3; // Gentle horizontal drifting

                // Screen/Level wrapping (vertically and horizontally)
                if (isWaterLevel && p.pos.y < -8) p.pos.y = GAME_HEIGHT + 8;
                if (isCaveLevel && p.pos.y > GAME_HEIGHT + 8) p.pos.y = -8;

                if (p.pos.x < -8) p.pos.x = GAME_WIDTH + 8;
                if (p.pos.x > GAME_WIDTH + 8) p.pos.x = -8;
            });
        }
    }

    // --- PLAYER CREATION ---
    const [wMult, hMult] = ANIMAL_SIZES[config.animal] || [1, 1];

    const isWide = wMult > 1;
    const paddingX = isWide ? 4 : 1;
    const paddingY = 2;

    const player = add([
        sprite(`${config.animal}${currentForm}`, { anim: "idle" }),
        pos(playerStartPos),
        area({
            shape: new Rect(
                vec2(paddingX, paddingY),
                (wMult * 16) - (paddingX * 2),
                (hMult * 16) - (paddingY * 2)
            )
        }),
        body(),
        z(10), // Ensures the player will render slightly above level geometry & particles
        "player"
    ]);

    let lastCamX = null;
    let lastCamY = null;

    function updateCamera() {
        const currentQuadX = Math.floor(player.pos.x / VIEW_WIDTH);
        const currentQuadY = Math.floor(player.pos.y / VIEW_HEIGHT);

        const camX = (currentQuadX * VIEW_WIDTH) + (VIEW_WIDTH / 2);
        const camY = (currentQuadY * VIEW_HEIGHT) + (VIEW_HEIGHT / 2);

        if (camX !== lastCamX || camY !== lastCamY) {
            setCamPos(camX, camY);
            lastCamX = camX;
            lastCamY = camY;
        }
    }

    // --- UI ---
    const uiBox = add([
        rect(130, 26, { radius: 3 }),
        pos(5, 5),
        color(0, 0, 0),
        opacity(0.6),
        fixed(),
        z(100)
    ]);

    const uiText = add([
        text("", { size: 8 }),
        pos(10, 10),
        color(255, 255, 255),
        fixed(),
        z(101)
    ]);

    function updateUI() {
        const required = config.bananasRequired[currentForm - 1] - bananasEaten;
        const currentName = FORM_NAMES[`${config.animal}${currentForm}`] || `${config.animal} ${currentForm}`;
        const bananaName = BANANA_NAMES[currentForm] || `Banana ${currentForm}`;

        uiText.text = `Form: ${currentName}\nNeed: ${required}x ${bananaName}`;
    }
    updateUI();

    // --- CONTROLS ---
    const keys = {
        left: ["left", "a"],
        right: ["right", "d"],
        up: ["up", "w"],
        down: ["down", "s"],
        jump: ["space", "up", "w", "space"]
    };

    function getInputDirection() {
        let dx = 0;
        let dy = 0;
        if (keys.left.some(k => isKeyDown(k))) dx -= 1;
        if (keys.right.some(k => isKeyDown(k))) dx += 1;

        if (config.gravity === 0) {
            if (keys.up.some(k => isKeyDown(k))) dy -= 1;
            if (keys.down.some(k => isKeyDown(k))) dy += 1;
        }

        return vec2(dx, dy).unit();
    }

    // Configuration variables
    const CLIMB_SPEED = 120;
    const SLIDE_SPEED = 5; // How fast they slowly slide down
    let isTouchingVine = false;

    // 1. Initial Impact: Stop them dead in their tracks
    player.onCollide("vine", () => {
        isTouchingVine = true;     // Erase any momentum from falling
    });

    // 2. Leaving the vine: Restore physics
    player.onCollideEnd("vine", () => {
        isTouchingVine = false;
    });

    player.onUpdate(() => {
        updateCamera();

        const dir = getInputDirection();

        if (dir.x !== 0 || dir.y !== 0) {
            player.move(dir.scale(config.speed));

            if (dir.x < 0) player.flipX = true;
            if (dir.x > 0) player.flipX = false;
        }

        if (player.pos.y > GAME_HEIGHT + 64) {
            go("lose", "Fell into the abyss!", levelIndex);
        }

        if (isTouchingVine) {
            if (isKeyDown("up")) {
                // Climb up
                player.vel.y = -CLIMB_SPEED;
            } else if (isKeyDown("down")) {
                // Climb down faster
                player.vel.y = CLIMB_SPEED;
            } else {
                // Not pressing anything: Slow, controlled slide
                player.vel.y = SLIDE_SPEED;
            }
        }
    });

    onKeyPress((k) => {
        if (keys.jump.includes(k) && config.gravity > 0 && player.isGrounded()) {
            player.jump(config.jumpForce);
        } else if (isTouchingVine) {
            // Optional: Detach them slightly so they don't immediately re-collide
            player.gravityScale = 1;
            isTouchingVine = false;

            // Execute the jump
            player.jump((config.jumpForce) * 0.5);
        }
    });

    onKeyPress("p", () => debug.inspect = !debug.inspect);
    onKeyPress("enter", () => go("game", levelIndex));

    // --- HAZARDS & EVOLUTION ---
    player.onCollide("spike", () => {
        go("lose", "Impaled on a spike!", levelIndex);
    });

    player.onCollide("banana", (banana) => {
        if (banana.bType === currentForm) {
            destroy(banana);
            bananasEaten++;

            if (bananasEaten >= config.bananasRequired[currentForm - 1]) {
                currentForm++;
                bananasEaten = 0;

                if (currentForm > 4) {
                    go("game", levelIndex + 1);
                } else {
                    player.use(sprite(`${config.animal}${currentForm}`, { anim: "idle" }));
                }
            }
            updateUI();
        } else {
            go("lose", "Ate the wrong banana sequence!", levelIndex);
        }
    });
});

// --- LOSE SCENE ---
scene("lose", (reason, levelIndex) => {
    setBackground(Color.fromHex("#000000"));

    add([
        text("Game Over\n" + reason + "\n\n[Press Enter to Restart]", { size: 14, align: "center" }),
        pos(VIEW_WIDTH / 2, VIEW_HEIGHT / 2),
        anchor("center"),
        color(255, 50, 50)
    ]);

    onKeyPress("enter", () => go("game", levelIndex));
});

// --- WIN SCENE ---
scene("win", () => {
    setBackground(Color.fromHex("#000000"));

    add([
        text("You Evolved!\nFully Completed!", { size: 16, align: "center" }),
        pos(VIEW_WIDTH / 2, VIEW_HEIGHT / 2),
        anchor("center"),
        color(50, 255, 50)
    ]);
});

go("game", 0);