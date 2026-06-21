import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 160;

const scaleX = window.innerWidth / VIEW_WIDTH;
const scaleY = window.innerHeight / VIEW_HEIGHT;
const dynamicScale = Math.min(scaleX, scaleY);

let colorblind = false;

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
    "dinosaur1": "Yoshi", "dinosaur2": "Dilophosaurus", "dinosaur3": "Chrome Dino", "dinosaur4": "Orpheus",
    "primates1": "Monkey", "primates2": "Gorilla", "primates3": "Caveman", "primates4": "Hack Clubber"
};

const ANIMAL_SIZES = {
    "fish": [1, 1],
    "shark": [2, 1],
    "lizard": [2, 1],
    "dinosaur": [1.5, 1.5],
    "primates": [1, 1]
};

const BANANA_NAMES = {
    1: "Red Banana", 2: "Orange Banana", 3: "Green Banana", 4: "Blue Banana",
    1: "Apple", 2: "Orange", 3: "Pear", 4: "Banana",
};

// --- SPRITE LOADING ---
loadSpriteAtlas("bananas.png", Object.fromEntries(
    Array.from({ length: 4 }, (_, i) => [
        `banana${i + 1}`,
        { y: 0, x: i * 16, width: 16, height: 64, sliceY: 4, anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } } }
    ])
));

loadSpriteAtlas("morph.png", {
    "morph": {
        x: 0,
        y: 0,
        width: 16,
        height: 64,
        sliceY: 4,
        anims: { boom: { from: 0, to: 3, loop: false, speed: 10 }, },
    },
});

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
loadSprite("leaf", "leaves.png", { sliceX: 2, sliceY: 2 });
loadSprite("grass_block", "minecraft_grass_block.png", { sliceX: 2, sliceY: 2 });
loadSprite("cave", "cave.png", { sliceX: 2, sliceY: 4 });
loadSprite("vine", "vines.png", { sliceX: 1, sliceY: 2 });

// --- LEVEL CONFIGURATIONS ---
const LEVELS = [
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
    {
        animal: "shark",
        bgColor: "#002a66",
        barrierSprite: "pink_coral",
        gravity: 0,
        speed: 160,
        jumpForce: 0,
        bananasRequired: [2, 2, 2, 2],
        // bananasRequired: [6, 6, 6, 6],
        map: [
            "============================================================",
            "= P        =                 =         ==                  =",
            "=             ======  ====   =   ===   ==    =========     =",
            "=  ======  =  =    =  =  =   =     =   ==    =       =     =",
            "=       =  =    1  =  =  =   ====  =   ==    =   3   =     =",
            "======  =  =  =    =  =  =         =   ==    =       21    =",
            "=       =  =  ======  =  ===========   ==    =========     =",
            "=  ======  =          =                ==                  =",
            "=          =          =             4  ==                  =",
            "========   ===================   =========   ===============",
            "========   ===================   =========   ===============",
            "=      =   =           =               ==                  =",
            "=  4   =   =   ======  =   ==========  ==22============    =",
            "=  1       =   =   ==  =            =  ==             =    =",
            "=  4   =   =   = 2     ===========  =  ==   =======   =    =",
            "========   =   =   ==            =  =  ==   = 4   =   =    =",
            "=          =   ======  =======   =  =  ==         =   =    =",
            "=  =========           =     =   =  =  ==   =======   =    =",
            "=          =============  2  =   =  =  ==             =    =",
            "======                       =   =  =  ================    =",
            "======                       =   =  =  ================    =",
            "=    =    ====================   =  =                      =",
            "=  21                        =   ======================    =",
            "=  1                                                       =",
            "========          =              ========   ============   =",
            "=                 =   =========        ==   =              =",
            "=   ===============   =3      =======  ==   =   =======    =",
            "=   =                2        =     =  ==   =   = 4 1 =    =",
            "=   =  ===============        =  =  =  ==   =   =          =",
            "=   =                ==========  =  =  ==   =   =======    =",
            "=   =                ==========  =  =  ==   =   =======    =",
            "=   ===========================  = 3=  ==   =              =",
            "=       3                        =  =  ==   =    4         =",
            "============================================================"
        ]
    },
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
            "=            ==    ||            3     =",
            "=    ===   3    1  ||     ===          =",
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
    // Level 4: Primates - Platformer Blank Space
    {
        animal: "primates",
        bgColor: "#87ceeb",
        barrierSprite: "grass_block",
        gravity: 600,
        speed: 100,
        jumpForce: 255,
        bananasRequired: [1, 1, 1, 1],
        map: [
            "========================================",
            "=  K2            = ||          1       =",
            "=  K     k   K==            K ===      =",
            "=  K     K   K   ==||=      K       == =",
            "=        K   3K    ||   =         =    =",
            "=        K    K    ||    = k     =     =",
            "=      ====        ||      K =         =",
            "=                  ||      K ===       =",
            "= P                ||      =   4=      =",
            "========================================"
        ]
    },
    /*
    {
        animal: "primates",
        bgColor: "#87ceeb",
        barrierSprite: "grass_block",
        gravity: 600,
        speed: 100,
        jumpForce: 255,
        bananasRequired: [1, 1, 1, 1],
        map: [
            "========================================",
            "=  K             = ||                  =",
            "=  K     k   K==            K ===      =",
            "=  K     K   K   ==||=      K       == =",
            "=        K    K    ||   =         =    =",
            "=        K    K    ||    = k      =    =",
            "=      ====        ||      K =         =",
            "=                  ||      K ===       =",
            "= P   1  2  3  4   ||      =    =      =",
            "========================================"
        ]
    }
    */
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

    // --- MUTABLE LOCAL MAP STATE ---
    let currentMapState = config.map.map(row => row.split(""));

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
                    "ground"
                ];
            },
            // Spikes
            "A": () => [sprite("cave", { frame: 4, flipY: false }), area({ shape: new Rect(vec2(2, 0), 12, 16) }), body({ isStatic: true }), "spike"],
            "a": () => [sprite("cave", { frame: 2, flipY: false }), area({ shape: new Rect(vec2(2, 0), 12, 16) }), body({ isStatic: true }), "spike"],
            "^": () => [sprite("cave", { frame: 0, flipY: false }), area({ shape: new Rect(vec2(2, 2), 12, 14) }), body({ isStatic: true }), "spike"],
            "V": () => [sprite("cave", { frame: 4, flipY: true }), area({ shape: new Rect(vec2(2, 0), 12, 16) }), body({ isStatic: true }), "spike"],
            "v": () => [sprite("cave", { frame: 2, flipY: true }), area({ shape: new Rect(vec2(2, 0), 12, 16) }), body({ isStatic: true }), "spike"],
            "√": () => [sprite("cave", { frame: 0, flipY: true }), area({ shape: new Rect(vec2(2, 0), 12, 14) }), body({ isStatic: true }), "spike"],
            // Vines
            "K": () => [sprite("vine", { frame: 1 }), area({ shape: new Rect(vec2(0, 0), 16, 16) }), body({ isStatic: true }), "vine"],
            "k": () => [sprite("vine", { frame: 0 }), area({ shape: new Rect(vec2(0, 8), 16, 8) }), body({ isStatic: true }), "vine"],
            // Collectibles
            "1": () => [sprite("banana1", { anim: "idle" }), area({ shape: new Rect(vec2(1, 1), 14, 14) }), "banana", { bType: 1 }],
            "2": () => [sprite("banana2", { anim: "idle" }), area({ shape: new Rect(vec2(1, 1), 14, 14) }), "banana", { bType: 2 }],
            "3": () => [sprite("banana3", { anim: "idle" }), area({ shape: new Rect(vec2(1, 1), 14, 14) }), "banana", { bType: 3 }],
            "4": () => [sprite("banana4", { anim: "idle" }), area({ shape: new Rect(vec2(1, 1), 14, 14) }), "banana", { bType: 4 }]
        }
    };

    // --- SPAWNPOINT FINDER SCRIPT ---
    let playerStartPos = vec2(40, 140);
    for (let y = 0; y < currentMapState.length; y++) {
        const x = currentMapState[y].indexOf("P");
        if (x !== -1) {
            playerStartPos = vec2(x * 16, y * 16);
            currentMapState[y][x] = " ";
            break;
        }
    }

    // --- CUSTOM SCREEN MANAGER ---
    let currentQuadX = -1;
    let currentQuadY = -1;

    function loadQuadrant(qX, qY) {
        destroyAll("map_object");

        const margin = 2;
        const startCol = Math.max(0, (qX * 20) - margin);
        const endCol = Math.min(currentMapState[0].length, (qX * 20) + 20 + margin);
        const startRow = Math.max(0, (qY * 10) - margin);
        const endRow = Math.min(currentMapState.length, (qY * 10) + 10 + margin);

        for (let y = startRow; y < endRow; y++) {
            for (let x = startCol; x < endCol; x++) {
                const tileChar = currentMapState[y][x];

                if (levelConfig.tiles[tileChar]) {
                    const comps = levelConfig.tiles[tileChar]();
                    comps.push(pos(x * 16, y * 16));
                    comps.push("map_object");

                    if (comps.includes("banana")) {
                        const dataComp = comps.find(c => c && c.bType !== undefined);
                        if (dataComp) {
                            dataComp.gridX = x;
                            dataComp.gridY = y;
                        }
                    }

                    add(comps);
                }
            }
        }
    }

    // --- PARTICLES ---
    const isWaterLevel = config.animal === "fish" || config.animal === "shark";
    const isCaveLevel = config.animal === "lizard" || config.animal === "dinosaur";
    const isGreenLevel = config.animal === "primates";

    if (isWaterLevel || isCaveLevel || isGreenLevel) {
        const spriteName = isWaterLevel ? "bubble" : isCaveLevel ? "dust" : "leaf";
        const dirY = isWaterLevel ? -1 : 1;
        const speedRange = isWaterLevel ? [15, 35] : [10, 25];
        const wobbleMult = isWaterLevel ? 2 : 1;
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            const p = add([
                sprite(spriteName, { frame: randi(0, 4) }),
                pos(
                    playerStartPos.x + rand(-VIEW_WIDTH, VIEW_WIDTH),
                    playerStartPos.y + rand(-VIEW_HEIGHT, VIEW_HEIGHT)
                ),
                opacity(rand(0.3, 0.7)),
                z(5),
                "particle",
                {
                    speed: rand(speedRange[0], speedRange[1]),
                    wobbleOffset: rand(0, Math.PI * 2),
                }
            ]);

            p.onUpdate(() => {
                p.pos.y += dirY * p.speed * dt();
                p.pos.x += Math.sin(time() * wobbleMult + p.wobbleOffset) * 0.3;

                const cam = camPos();
                const halfW = (VIEW_WIDTH / 2) + 32;
                const halfH = (VIEW_HEIGHT / 2) + 32;
                if (isWaterLevel && p.pos.y < -8) p.pos.y = GAME_HEIGHT + 8;
                if (isCaveLevel && p.pos.y > GAME_HEIGHT + 8) p.pos.y = -8;
                if (isGreenLevel && p.pos.y > GAME_HEIGHT + 8) p.pos.y = -8;

                if (p.pos.y < cam.y - halfH) p.pos.y += halfH * 2;
                if (p.pos.y > cam.y + halfH) p.pos.y -= halfH * 2;
                if (p.pos.x < cam.x - halfW) p.pos.x += halfW * 2;
                if (p.pos.x > cam.x + halfW) p.pos.x -= halfW * 2;
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
        z(10),
        {
            isFrozen: false
        },
        "player"
    ]);

    function spawnEffect(spawnPosition) {
        const fx = add([
            sprite("morph"),
            pos(spawnPosition),
            anchor("topleft"),
            z(15),
        ]);

        player.isFrozen = true;
        fx.play("boom");

        fx.onAnimEnd((anim) => {
            if (anim === "boom") {
                destroy(fx);
                player.isFrozen = false;
            }
        });
    }

    let lastCamX = null;
    let lastCamY = null;

    function updateCameraAndMap() {
        const newQuadX = Math.floor(player.pos.x / VIEW_WIDTH);
        const newQuadY = Math.floor(player.pos.y / VIEW_HEIGHT);

        if (newQuadX !== currentQuadX || newQuadY !== currentQuadY) {
            currentQuadX = newQuadX;
            currentQuadY = newQuadY;

            loadQuadrant(currentQuadX, currentQuadY);

            const camX = (currentQuadX * VIEW_WIDTH) + (VIEW_WIDTH / 2);
            const camY = (currentQuadY * VIEW_HEIGHT) + (VIEW_HEIGHT / 2);
            setCamPos(camX, camY);
        }
    }

    // Trigger very first screen load immediately
    updateCameraAndMap();

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

    // --- MOUSE & TOUCH JOYSTICK LOGIC ---
    let joystickDir = vec2(0, 0);
    let joyPointerId = null;
    let hasJumpedThisTouch = false;
    let isTouchingVine = false;

    let isHoldingReset = false;
    let resetTimer = 0;
    const HOLD_RESET_TIME = 2.5;

    const joyCenter = vec2(35, VIEW_HEIGHT - 35);
    const joyBaseRadius = 25;
    const joyKnobRadius = 12;

    // References for re-creation
    let joyBase, joyKnob, resetText;

    function createJoystickUI() {
        // Delete the old joystick if it exists
        destroyAll("joystick_ui");

        joyBase = add([
            circle(joyBaseRadius),
            pos(joyCenter),
            color(255, 255, 255),
            opacity(0.3),
            fixed(),
            anchor("center"),
            z(100),
            "joystick_ui"
        ]);

        joyKnob = add([
            circle(joyKnobRadius),
            pos(joyCenter),
            color(255, 255, 255),
            opacity(0.8),
            fixed(),
            anchor("center"),
            z(101),
            "joystick_ui"
        ]);

        resetText = add([
            text("Reset", { size: 6 }),
            pos(joyCenter),
            color(0, 0, 0),
            fixed(),
            anchor("center"),
            z(102),
            "joystick_ui"
        ]);

        // Reset the state to neutral
        resetJoystick();
    }

    function resetJoystick() {
        if (!joyKnob) return;
        joyKnob.pos = joyCenter;
        resetText.pos = joyCenter;
        joystickDir = vec2(0, 0);
        joyPointerId = null;
        hasJumpedThisTouch = false;
        joyKnob.color = rgb(255, 255, 255);
        isHoldingReset = false;
        resetTimer = 0;
    }

    function handlePointerDown(id, screenPos) {
        // Standard steer grab or hold-reset check
        if (screenPos.dist(joyCenter) < joyBaseRadius + 15) {
            joyPointerId = id; // Always accept the click to ensure the joystick doesn't get stuck

            if (screenPos.dist(joyCenter) < joyKnobRadius) {
                isHoldingReset = true;
                resetTimer = 0;
            } else {
                isHoldingReset = false;
                resetTimer = 0;
                updateJoystick(screenPos);
            }
        }
    }

    function handlePointerMove(id, screenPos) {
        if (id === joyPointerId) {
            if (isHoldingReset) {
                if (screenPos.dist(joyCenter) >= joyKnobRadius) {
                    isHoldingReset = false;
                    resetTimer = 0;
                    joyKnob.color = rgb(255, 255, 255);
                } else {
                    return;
                }
            }
            updateJoystick(screenPos);
        }
    }

    function handlePointerUp(id) {
        if (id === joyPointerId) {
            resetJoystick();
        }
    }

    function updateJoystick(screenPos) {
        if (!joyKnob) return;
        let dist = screenPos.dist(joyCenter);
        let dir = screenPos.sub(joyCenter).unit();

        if (dist > joyBaseRadius) dist = joyBaseRadius;

        const newPos = joyCenter.add(dir.scale(dist));
        joyKnob.pos = newPos;
        resetText.pos = newPos;

        if (dist > 5) {
            joystickDir = dir;

            if (config.gravity > 0 && dir.y < -0.6 && !hasJumpedThisTouch) {
                if (player.isGrounded()) {
                    player.jump(config.jumpForce);
                    hasJumpedThisTouch = true;
                } else if (isTouchingVine) {
                    player.gravityScale = 1;
                    isTouchingVine = false;
                    player.jump(config.jumpForce * 0.5);
                    hasJumpedThisTouch = true;
                }
            } else if (dir.y >= -0.6) {
                hasJumpedThisTouch = false;
            }
        } else {
            joystickDir = vec2(0, 0);
        }
    }

    onUpdate(() => {
        if (!joyKnob) return;

        // FAIL-SAFE: If the joystick is currently dragged by 'mouse' but the mouse button is no longer pressed, force release
        if (joyPointerId === 'mouse' && !isMouseDown()) {
            resetJoystick();
        }

        if (isHoldingReset) {
            resetTimer += dt();
            const progress = Math.min(resetTimer / HOLD_RESET_TIME, 1);

            // Fade from White to Red
            const r = 255;
            const g = 255 * (1 - progress);
            const b = 255 * (1 - progress);
            joyKnob.color = rgb(r, g, b);

            if (progress >= 1) {
                isHoldingReset = false;
                resetTimer = 0;
                go("game", levelIndex);
            }
        }
    });

    // Initial Camera/Map/Joystick setup
    createJoystickUI();
    updateCameraAndMap();

    // Touch API Bindings
    onTouchStart((id, pos) => handlePointerDown(id, toScreen(pos)));
    onTouchMove((id, pos) => handlePointerMove(id, toScreen(pos)));
    onTouchEnd((id) => handlePointerUp(id));

    // Mouse API Bindings (Direct and completely clean)
    onMouseDown(() => handlePointerDown('mouse', toScreen(mousePos())));
    onMouseMove(() => handlePointerMove('mouse', toScreen(mousePos())));
    onMouseRelease(() => handlePointerUp('mouse'));

    // --- CONTROLS & PHYSICS ---
    const keys = {
        left: ["left", "a"],
        right: ["right", "d"],
        up: ["up", "w"],
        down: ["down", "s"],
        jump: ["space", "up", "w", "space"]
    };

    function getInputDirection() {
        if (player.isFrozen) {
            return vec2(0, 0);
        }
        let dx = 0;
        let dy = 0;

        // Keyboard mapping
        if (keys.left.some(k => isKeyDown(k))) dx -= 1;
        if (keys.right.some(k => isKeyDown(k))) dx += 1;
        if (config.gravity === 0) {
            if (keys.up.some(k => isKeyDown(k))) dy -= 1;
            if (keys.down.some(k => isKeyDown(k))) dy += 1;
        }

        // Joystick mapping (rigid WASD digital parsing as requested)
        if (joystickDir.x < -0.3) dx -= 1;
        if (joystickDir.x > 0.3) dx += 1;
        if (config.gravity === 0) {
            if (joystickDir.y < -0.3) dy -= 1;
            if (joystickDir.y > 0.3) dy += 1;
        }

        // Clamping to strictly output standardized cardinal vectors
        dx = Math.max(-1, Math.min(1, dx));
        dy = Math.max(-1, Math.min(1, dy));

        return vec2(dx, dy).unit();
    }

    const CLIMB_SPEED = 120;
    const SLIDE_SPEED = 5;

    player.onCollide("vine", () => { isTouchingVine = true; });
    player.onCollideEnd("vine", () => { isTouchingVine = false; });

    player.onUpdate(() => {
        updateCameraAndMap();

        const dir = getInputDirection();
        if (dir.x !== 0 || dir.y !== 0) {
            if (dir.x !== 0) player.move(vec2(dir.x, 0).scale(config.speed));
            if (dir.y !== 0) player.move(vec2(0, dir.y).scale(config.speed));
            if (dir.x < 0) player.flipX = true;
            if (dir.x > 0) player.flipX = false;
        }

        if (player.pos.y > GAME_HEIGHT + 64) go("lose", "Fell into the abyss!", levelIndex);

        if (isTouchingVine) {
            if (isKeyDown("up") || joystickDir.y < -0.3) player.vel.y = -CLIMB_SPEED;
            else if (isKeyDown("down") || joystickDir.y > 0.3) player.vel.y = CLIMB_SPEED;
            else player.vel.y = SLIDE_SPEED;
        }
    });

    onKeyPress((k) => {
        if (player.isFrozen) {
            return;
        }
        if (keys.jump.includes(k) && config.gravity > 0 && player.isGrounded()) {
            player.jump(config.jumpForce);
        } else if (isTouchingVine) {
            player.gravityScale = 1;
            isTouchingVine = false;
            player.jump((config.jumpForce) * 0.5);
        }
    });

    onKeyPress("q", () => debug.inspect = !debug.inspect);
    onKeyPress("enter", () => go("game", levelIndex));


    // --- HAZARDS & EVOLUTION ---
    player.onCollide("spike", () => { go("lose", "Impaled on a spike!", levelIndex); });

    player.onCollide("banana", (banana) => {
        if (banana.bType === currentForm) {
            if (banana.gridX !== undefined && banana.gridY !== undefined) {
                currentMapState[banana.gridY][banana.gridX] = " ";
            }

            destroy(banana);
            bananasEaten++;

            if (bananasEaten >= config.bananasRequired[currentForm - 1]) {
                bananasEaten = 0;

                currentForm++;
                spawnEffect(player.pos);

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

loadSprite("win-screen", "win-screen.png");
loadSprite("logo", "logo.png");
// --- WIN SCENE ---
scene("win", () => {
    setBackground(Color.fromHex("#000000"));

    wait(1, () => {


        // 1. Background Screen (Starts at 0 opacity)
        const bg = add([
            sprite("win-screen"),
            pos(0, 0),
            opacity(0),
        ]);

        // 2. Title Text
        const title = add([
            text("You completed...", {
                size: 8,
                align: "center",
            }),
            pos(VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 8),
            anchor("center"),
            opacity(0),
            color(0, 0, 0),
            z(5),
        ]);

        // 3. Background Box for Text
        const box = add([
            rect(title.width + 16, title.height + 16, {
                radius: 4,
            }),
            pos(title.pos),
            anchor("center"),
            color(255, 255, 255),
            opacity(0),
            z(1),
        ]);

        // 4. Logo Sprite
        const logo = add([
            sprite("logo"),
            pos(center().x, center().y + 48),
            anchor("center"),
            color(255, 255, 255),
            scale(2),
            opacity(0),
            z(20),
            {
                shouldFadeIn: false,
                fadeSpeed: 1
            }
        ]);

        // Global Fade-In Controller Loop
        onUpdate(() => {
            bg.opacity = Math.min(bg.opacity + dt() * 0.5, 1);
            title.opacity = Math.min(title.opacity + dt() * 0.5, 1);

            box.opacity = Math.min(title.opacity * 0.9, 0.9);
        });

        // 3-Second Delayed Fade Logic for the Logo
        wait(3, () => {
            logo.shouldFadeIn = true;
        });

        logo.onUpdate(() => {
            if (logo.shouldFadeIn && logo.opacity < 1) {
                logo.opacity += logo.fadeSpeed * dt();
                if (logo.opacity > 1) {
                    logo.opacity = 1;
                }
            }
        });
    });
});

loadSprite("help-menu", "help-menu.png");
scene("help", () => {
    add([
        sprite("help-menu"),
        pos(0, 0),
        area(),
        "help-menu",
        z(1)
    ]);

    add([
        rect(18, 18),
        color(255, 255, 255),
        pos(259, 11),
        opacity(0),
        area(),
        "close-help",
        z(2)
    ]);

    add([
        rect(18, 18),
        color(255, 255, 255),
        pos(259, 119),
        opacity(0),
        area(),
        "continue-help",
        z(2)
    ]);

    function startGame() { go("game", 0); };

    onClick("close-help", () => { go("start"); });

    onKeyPress("enter", startGame);
    onClick("continue-help", () => { go("game", 0); });
});

loadSprite("start-bkgd", "start-menu-bkgd.png");
scene("start", () => {
    add([
        sprite("start-bkgd"),
        pos(0, 0),
        area(),
    ]);

    const startButton = add([
        pos(75, 102),
        rect(80, 35),
        area(),
        color(255, 255, 255),
        opacity(0),
        "startButton"
    ]);

    const colorblindStartButton = add([
        pos(165, 102),
        rect(80, 35),
        area(),
        color(255, 255, 255),
        opacity(0),
        "colorblindStartButton"
    ]);

    const gitButton = add([
        pos(146, 146),
        circle(8),
        area(),
        color(255, 255, 255),
        opacity(0),
        "gitButton"
    ]);

    const helpButton = add([
        pos(172, 146),
        circle(9),
        area(),
        color(255, 255, 255),
        opacity(0),
        "helpButton"
    ]);

    function startHelp() { go("help"); };

    onClick("startButton", () => { colorblind = false; startHelp(); });

    onClick("colorblindStartButton", () => { colorblind = true; startHelp(); });

    onKeyPress("i", () => {
        window.open("https://github.com/Ninjago77/bananalution", "_blank")
    });
    onClick("gitButton", () => {
        window.open("https://github.com/Ninjago77/bananalution", "_blank")
    });

    onKeyPress("p", () => {
        go("help");
    });
    onClick("helpButton", () => {
        go("help");
    });

});


go("start");