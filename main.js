import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";
kaplay();



const obj = add([
    rect(32, 32), // Draw this object as a rectangle
    pos(10, 20), // Position this object in X: 10 and Y: 20
    "shape", // Classify this object as "shape"
]);


onKeyDown("right", () => {
    obj.move(200, 0); // Move the object while "right" key is held down [!code highlight]
});

const isShape = obj.is("shape"); // Check for tags [!code highlight]
debug.log(isShape); // Log it on the screen