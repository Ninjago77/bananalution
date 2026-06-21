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
    "lizard1": "Gecko", "lizard2": "Chameleon", "lizard3": "Iguana", "lizard4": "Komodo Dragon",
    "monkey1": "Lemur", "monkey2": "Macaque", "monkey3": "Chimp", "monkey4": "Gorilla",
};

const BANANA_NAMES = {
    1: "Red Banana", 2: "Orange Banana", 3: "Green Banana", 4: "Blue Banana"
};

const ANIMAL_SIZES = {
    "fish": [1, 1],
    "shark": [2, 1],
    "lizard": [2, 1],
    "monkey": [1, 2],
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
            { x: i * sliceWidth, y: 0, width: sliceWidth, height: sliceHeight*4, sliceY: 4, anims: { idle: { from: 0, to: 3, loop: true, speed: 4 } } }
        ])
    ));
});

loadSprite("green_coral", "green_coral.png", { sliceX: 2, sliceY: 2 });
loadSprite("pink_coral", "pink_coral.png", { sliceX: 2, sliceY: 2 });
loadSprite("cave", "cave.png", { sliceX: 2, sliceY: 4 });

// --- LEVEL CONFIGURATIONS ---
const LEVELS = [
    {
        // Level 0: Fish - Top-Down Puzzle
        animal: "fish",
        bgColor: "#6695ff",
        barrierSprite: "green_coral", 
        gravity: 0, // No gravity for top-down
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
        // Level 1: Shark - Top-Down Puzzle
        animal: "shark",
        bgColor: "#002a66",
        barrierSprite: "pink_coral", 
        gravity: 0, // No gravity for top-down
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
    {
        // Level 2: Lizard - Platformer (Old Fish Puzzle)
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
    {
        // Level 3: dinosaur - Platformer (Old Shark Puzzle with Spikes)
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
            "= V V V                                    V V V =",
            "= P   1   2   3   4      4   3   2   1           =",
            "====== === === === ====== === === === === =======",
            "=      A   A   A          A   A   A   A          =",
            "=================================================="
        ]
    },
    {
        // Level 4: Primates - Platformer Blank Space
        animal: "primates",
        bgColor: "#87ceeb",
        barrierSprite: "cave", 
        gravity: 600,       
        speed: 150,         
        jumpForce: 300,     
        bananasRequired: [1, 1, 1, 1], 
        map: [
            "==================================================",
            "=                                                =",
            "=                                                =",
            "=                                                =",
            "=                                                =",
            "= P  1         2         3         4             =",
            "=================================================="
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
    
    // Dynamic Frame Generator for Auto-Stretching Spikes
    const getSpikeFrame = (type, pos) => {
        const gx = Math.round(pos.x / 16);
        const gy = Math.round(pos.y / 16);
        
        const isTop = gy <= 0 || config.map[gy - 1][gx] !== type;
        const isBottom = gy >= config.map.length - 1 || config.map[gy + 1][gx] !== type;
        
        if (type === "A") { // Stalagmite (Growing up)
            if (isTop) return 0; // Tip frame
            if (isBottom) return 6; // Base frame
            return 2; // Middle stretch frame
        } else { // Stalactite (Hanging down)
            if (isBottom) return 4; // Downward Tip frame
            if (isTop) return 6; // Base frame
            return 2; // Middle stretch frame
        }
    };

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
            "|": () => { // Handling old map specific walls 
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
            "A": (pos) => [
                sprite("cave", { frame: getSpikeFrame("A", pos) }),
                area({ shape: new Rect(vec2(2, 2), 12, 14) }), // Slightly forgiving hitbox
                body({ isStatic: true }),
                "spike"
            ],
            "V": (pos) => [
                sprite("cave", { frame: getSpikeFrame("V", pos) }),
                area({ shape: new Rect(vec2(2, 0), 12, 14) }),
                body({ isStatic: true }),
                "spike"
            ],
            "1": () => [ sprite("banana1", { anim: "idle" }), area({ shape: new Rect(vec2(1,1), 14, 14) }), "banana", { bType: 1 } ],
            "2": () => [ sprite("banana2", { anim: "idle" }), area({ shape: new Rect(vec2(1,1), 14, 14) }), "banana", { bType: 2 } ],
            "3": () => [ sprite("banana3", { anim: "idle" }), area({ shape: new Rect(vec2(1,1), 14, 14) }), "banana", { bType: 3 } ],
            "4": () => [ sprite("banana4", { anim: "idle" }), area({ shape: new Rect(vec2(1,1), 14, 14) }), "banana", { bType: 4 } ],
            "P": () => [ "spawnpoint" ]
        }
    };

    // --- SPAWNPOINT FINDER SCRIPT ---
    let playerStartPos = vec2(40, 140); // Default fallback

    for (let y = 0; y < config.map.length; y++) {
        const x = config.map[y].indexOf("P");
        if (x !== -1) {
            playerStartPos = vec2(x * 16, y * 16);
            break;
        }
    }

    addLevel(config.map, levelConfig);

    // --- PLAYER CREATION (FIXED HITBOX) ---
    const [wMult, hMult] = ANIMAL_SIZES[config.animal] || [1, 1];
    
    // Create a "buffer" for 2-wide animals so they don't snag on walls
    const isWide = wMult > 1;
    const paddingX = isWide ? 4 : 1; 
    const paddingY = 2;

    const player = add([
        sprite(`${config.animal}${currentForm}`, { anim: "idle" }),
        pos(playerStartPos), 
        // The Rect is positioned at (paddingX, paddingY) and narrowed by paddingX * 2
        area({ 
            shape: new Rect(
                vec2(paddingX, paddingY), 
                (wMult * 16) - (paddingX * 2), 
                (hMult * 16) - (paddingY * 2)
            ) 
        }),
        body(),
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

    player.onUpdate(() => {
        updateCamera();

        if (player.pos.y > GAME_HEIGHT + 32) {
            go("lose", "Fell out of the world!", levelIndex);
        }
    });

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

    // --- CONSOLIDATED CONTROLS ---
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
        
        // Top-Down movement (Fish/Shark)
        if (config.gravity === 0) {
            if (keys.up.some(k => isKeyDown(k))) dy -= 1;
            if (keys.down.some(k => isKeyDown(k))) dy += 1;
        }
        
        return vec2(dx, dy).unit(); // Normalizes diagonal speed
    }

    player.onUpdate(() => {
        updateCamera();

        const dir = getInputDirection();

        // Perform a single move call per frame to prevent clipping
        if (dir.x !== 0 || dir.y !== 0) {
            player.move(dir.scale(config.speed));
            
            // Visual flip
            if (dir.x < 0) player.flipX = true;
            if (dir.x > 0) player.flipX = false;
        }

        if (player.pos.y > GAME_HEIGHT + 64) {
            go("lose", "Fell into the abyss!", levelIndex);
        }
    });

    // Jump Logic (Platformer only)
    onKeyPress((k) => {
        if (keys.jump.includes(k) && config.gravity > 0 && player.isGrounded()) {
            player.jump(config.jumpForce);
        }
    });
    // Keep Debug/Restart shortcuts
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

            console.log(bananasEaten, config, levelIndex);

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
go("game", 2);