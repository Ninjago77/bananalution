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

// --- DICTIONARIES ---
const FORM_NAMES = {
    "fish1": "Tadpole", "fish2": "Minnow", "fish3": "Goldfish", "fish4": "Bass",
    "shark1": "Baby Shark", "shark2": "Tiger Shark", "shark3": "Great White", "shark4": "Megalodon",
};

const BANANA_NAMES = {
    1: "Blue Banana", 2: "Green Banana", 3: "Brown Banana", 4: "Golden Banana"
};

// --- SPRITE LOADING ---
loadSpriteAtlas("bananas.png", Object.fromEntries(
    Array.from({ length: 4 }, (_, i) => [
        `banana${i + 1}`, 
        { x: 0, y: i * 16, width: 32, height: 16, sliceX: 2, anims: { idle: { from: 0, to: 1, loop: true, speed: 4 } } }
    ])
));

[
    ["fish", 1, 1], ["shark", 2, 1], ["lizard", 1, 1], 
    ["dinosaur", 1, 2], ["monkey", 1, 2], ["hackcluborg", 1, 3]
].forEach(([name, wMult, hMult]) => {
    const sliceWidth = wMult * 16;
    const sliceHeight = hMult * 16;

    loadSpriteAtlas(`${name}.png`, Object.fromEntries(
        Array.from({ length: 4 }, (_, i) => [
            `${name}${i + 1}`, 
            { x: i * sliceWidth, y: 0, width: sliceWidth, height: sliceHeight, sliceX: 1, anims: { idle: { from: 0, to: 0, loop: true, speed: 4 } } }
        ])
    ));
});

loadSprite("green_coral", "green_coral.png", {
    sliceX: 2,
    sliceY: 2,
});

// --- LEVEL CONFIGURATIONS ---
const LEVELS = [
    {
        animal: "fish",
        bgColor: "#6695ff",
        barrierSprite: "green_coral", 
        gravity: 800,
        speed: 120,
        jumpForce: 300,
        bananasRequired: [2, 1, 2, 1], 
        map: [
            "========================================",
            "=                  ||                  =",
            "= 1  2    3  4     ||                  =",
            "= =====       ==== ||   ===========    =",
            "=                  ||         3        =",
            "=    ===   2  1    ||    ====          =",
            "=  3               ||        ==        =",
            "=         ===      ||         2        =",
            "=                  ||                  =",
            "======================= ================", 
            "======================= ================",
            "=                  ||                  =",
            "= P                ||                  =",
            "=   ====           ||       ===        =",
            "=                  ||        1         =",
            "=         ====     ||                  =",
            "=                  ||             2    =",
            "=    3     4       ||    ======        =",
            "=                  ||                  =",
            "========================================"
        ]
    },
    {
        animal: "shark",
        bgColor: "#002a66",
        barrierSprite: "green_coral", 
        gravity: 600,       
        speed: 160,         
        jumpForce: 400,     
        bananasRequired: [3, 3, 3, 3], 
        map: [
            "==================================================",
            "=                                                =",
            "= P   1   2   3   4      4   3   2   1           =",
            "====== === === === ====== === === === === =======",
            "=                                                =",
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
    
    const levelConfig = {
        tileWidth: 16,
        tileHeight: 16,
        tiles: {
            "=": () => [
                sprite(config.barrierSprite, { frame: Math.floor(Math.random() * 4) }),
                area(),
                body({ isStatic: true }),
                "ground"
            ],
            // Applied area scale: 0.8 to make grabbing bananas more forgiving and seamless!
            "1": () => [ sprite("banana1", { anim: "idle" }), area({ scale: 0.8 }), "banana", { bType: 1 } ],
            "2": () => [ sprite("banana2", { anim: "idle" }), area({ scale: 0.8 }), "banana", { bType: 2 } ],
            "3": () => [ sprite("banana3", { anim: "idle" }), area({ scale: 0.8 }), "banana", { bType: 3 } ],
            "4": () => [ sprite("banana4", { anim: "idle" }), area({ scale: 0.8 }), "banana", { bType: 4 } ],
            "P": () => [ "spawnpoint" ] 
        }
    };

    addLevel(config.map, levelConfig);

    const spawnPoint = get("spawnpoint")[0]?.pos || vec2(40, 40);

    const player = add([
        sprite(`${config.animal}${currentForm}`),
        // Since we anchor to "center", we offset the spawn by 8px to keep the player aligned perfectly
        pos(spawnPoint.add(8, 8)), 
        anchor("center"), // Centers scaling and collision calculation!
        // --- PHYSICS GREASE ---
        // 0.75 means the physical hitbox is 75% of the visual sprite width (leaves a nice gap on sides to slide past blocks)
        // 0.95 keeps the vertical height almost pixel perfect to prevent floating/sinking
        area({ scale: vec2(0.75, 0.95) }), 
        body(),
        "player"
    ]);

    // --- OLD AUTO-ROOM CAMERA LOGIC ---
    player.onUpdate(() => {
        const currentQuadX = Math.floor(player.pos.x / VIEW_WIDTH);
        const currentQuadY = Math.floor(player.pos.y / VIEW_HEIGHT);

        const camX = (currentQuadX * VIEW_WIDTH) + (VIEW_WIDTH / 2);
        const camY = (currentQuadY * VIEW_HEIGHT) + (VIEW_HEIGHT / 2);

        setCamPos(camX, camY);

        if (player.pos.y > GAME_HEIGHT + 32) {
            go("lose", "Fell out of the world!", levelIndex);
        }
    });

    // --- UI (SHRUNK) ---
    const uiBox = add([
        rect(90, 26, { radius: 3 }), 
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
    const moveLeft = () => {
        player.move(-config.speed, 0);
        player.flipX = true;
    };
    const moveRight = () => {
        player.move(config.speed, 0);
        player.flipX = false;
    };
    const jump = () => {
        if (player.isGrounded()) player.jump(config.jumpForce);
    };

    onKeyDown("left", moveLeft);
    onKeyDown("a", moveLeft);
    
    onKeyDown("right", moveRight);
    onKeyDown("d", moveRight);
    
    onKeyPress("up", jump);
    onKeyPress("w", jump);
    onKeyPress("space", jump);

    onKeyPress("p", () => debug.inspect = !debug.inspect);
    onKeyPress("enter", () => go("game", levelIndex)); 

    // --- EVOLUTION ---
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
                    player.use(sprite(`${config.animal}${currentForm}`));
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