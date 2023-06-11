// Get the cat element
var cat = document.getElementById("cat");
// Get the initial position of the cat
var catX = Math.random() * document.body.clientWidth - cat.offsetWidth / 2; // Random x coordinate
var catY = Math.random() * document.body.clientHeight - cat.offsetHeight / 2; // Random y coordinate
// Move the cat to the initial position
cat.style.left = catX + "px";
cat.style.top = catY + "px";

// Define some variables for the movement and animation of the cat
var speed = 5; // The speed of the cat in pixels per frame
var angle = Math.random() * Math.PI * 2; // The initial angle of the cat in radians
var targetX = null; // The x coordinate of the target (cursor or finger)
var targetY = null; // The y coordinate of the target (cursor or finger)
var distance = null; // The distance between the cat and the target
var foodArray = []; // Array of food elements
var foodTime = Math.random() * 4000 + 3000; // Random time between 3 and 7 seconds that represents the time interval for the next food appearance
var margin = -40; // The number of pixels that represents the margin of error for the collision between the cat and the food

// Define some variables for the movement and animation of the mouse
var mouse = document.getElementById("mouse"); // Get the mouse element
var defaultMouseSpeed = 7; // The default speed of the mouse in pixels per frame
var mouseSpeed = defaultMouseSpeed; // The speed of the mouse in pixels per frame
var mouseAngle = Math.random() * Math.PI * 2; // The initial angle of the mouse in radians
var mouseAngleTime = Math.random() * 2000 + 1000; // Random time between 1 and 3 seconds that represents the time interval for changing the mouse angle
var mouseX = Math.random() * document.body.clientWidth - mouse.offsetWidth / 2; // Random x coordinate for mouse
var mouseY = Math.random() * document.body.clientHeight - mouse.offsetHeight / 2; // Random y coordinate for mouse
var mouseTargetX = null; // The x coordinate of mouse's target (food item)
var mouseTargetY = null; // The y coordinate of mouse's target (food item)
var mousePanicTime = 0; // Time that represents the time the mouse will ignore any target to run from the cat, set to 0 in the start
var mouseDistance = null; // The distance between mouse and its target
var mouseTime = Math.random() * 5000 + 10000; // Random time between 10 and 15 seconds that represents when a new mouse appears

// Move and rotate mouse to initial position
mouse.style.left = mouseX + "px";
mouse.style.top = mouseY + "px";
mouse.style.transform = "rotate(" + mouseAngle + "rad)";

// Define a function to update both positions and rotations of cat and mouse 
function updateCatAndMouse() {

    // Update Cat

    // Calculate distance between cat and its target 
    distance = Math.sqrt(Math.pow(targetX - catX, 2) + Math.pow(targetY - catY, 2));
    // Check if distance is less than threshold (10 pixels)
    if (distance < 10) {
        // If so, stop moving and pause GIF animation
        cat.style.backgroundImage = 'url("./assets//cute-animated-cat.png")';
    } else {
        // If not, keep moving and resume GIF animation
        cat.style.backgroundImage = 'url("./assets//cute-animated-cat.gif")';
        // Calculate angle between cat and its target 
        angle = Math.atan2(targetY - catY, targetX - catX);
        // Update position based on angle and speed 
        catX += Math.cos(angle) * speed;
        catY += Math.sin(angle) * speed;
    }
    // Move and rotate element according to calculated values 
    cat.style.left = catX + "px";
    cat.style.top = catY + "px";
    cat.style.transform = "rotate(" + angle + "rad)";

    // Update Mouse
    // Check if there is any food item on screen
    if (foodArray.length > 0 && mousePanicTime <= 0) {
        // If so, choose nearest food item as target
        var nearestFood = null;
        var nearestDistance = Infinity;
        for (var i = 0; i < foodArray.length; i++) {
            var foodItem = foodArray[i];
            var foodRect = foodItem.getBoundingClientRect();
            var foodX = foodRect.left + foodRect.width / 2;
            var foodY = foodRect.top + foodRect.height / 2;
            var distance = Math.sqrt(Math.pow(foodX - mouseX, 2) + Math.pow(foodY - mouseY, 2));
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestFood = foodItem;
            }
        }
        if (nearestFood != null) {
            var nearestFoodRect = nearestFood.getBoundingClientRect();
            mouseTargetX = nearestFoodRect.left + nearestFoodRect.width / 2;
            mouseTargetY = nearestFoodRect.top + nearestFoodRect.height / 2;
        }
    } else {
        if (mouseAngleTime <= 0) {
            // If not, choose random target within small range around current position
            mouseTargetX = mouseX + Math.random() * 2000 - 100;
            mouseTargetY = mouseY + Math.random() * 2000 - 100;
            mouseAngleTime = Math.random() * 2000 + 1000;
        }
    }

    // Calculate distance between mouse and its target
    mouseDistance = Math.sqrt(Math.pow(mouseTargetX - mouseX, 2) + Math.pow(mouseTargetY - mouseY, 2));

    // Check if distance is less than threshold (10 pixels)
    if (mouseDistance < 10) {
        // If so, stop moving
        mouseSpeed = 0;
    } else {
        // If not, keep moving
        mouseSpeed = defaultMouseSpeed;

        // Calculate angle between mouse and its target
        mouseAngle = Math.atan2(mouseTargetY - mouseY, mouseTargetX - mouseX);

        // Update position based on angle and speed
        mouseX += Math.cos(mouseAngle) * mouseSpeed;
        mouseY += Math.sin(mouseAngle) * mouseSpeed;

        var avoidDistance; // Distance between mouse and closest point on circle around cat
        var avoidThreshold; // Threshold distance for avoiding collision

        avoidDistance = Math.sqrt(Math.pow(catX - mouseX, 2) + Math.pow(catY - mouseY, 2)) - margin;
        avoidThreshold = 200;

        if (avoidDistance < avoidThreshold && mousePanicTime <= 0) {
            if (mousePanicTime <= 3000) {
                mousePanicTime += Math.random() * 1000 + 1000;
                // Add a random time between 1 and 2 seconds that represents the time the 
                //mouse will ignore any target to run from the cat 
            }

            var dx = mouseX - catX; // The x component of the cat-mouse vector
            var dy = mouseY - catY; // The y component of the cat-mouse vector
            var dot = dx * Math.cos(mouseAngle) + dy * Math.sin(mouseAngle);
            // The dot product of the mouse velocity vector and the cat-mouse vector

            // Add some randomness to the mouse angle
            mouseAngle += Math.random() * 0.1 - 0.05;

            // Choose a new target that is 90 degrees away from the dot product sign
            mouseTargetX = mouseX + Math.cos(mouseAngle + Math.sign(dot) * Math.PI / 2) * (2 * avoidThreshold);
            mouseTargetY = mouseY + Math.sin(mouseAngle + Math.sign(dot) * Math.PI / 2) * (2 * avoidThreshold);

            // Check if the new target is out of bounds and adjust if necessary
            if (mouseTargetX < 0) {
                mouseTargetX = 0;
            } else if (mouseTargetX > document.body.clientWidth) {
                mouseTargetX = document.body.clientWidth;
            }
            if (mouseTargetY < 0) {
                mouseTargetY = 0;
            } else if (mouseTargetY > document.body.clientHeight) {
                mouseTargetY = document.body.clientHeight;
            }
        }
    }

    // Move and rotate element according to calculated values
    mouse.style.left = mouseX + "px";
    mouse.style.top = mouseY + "px";
    mouse.style.transform = "rotate(" + mouseAngle + "rad)";

    // Check collision between mouse and cat using circle-ellipse collision detection
    var mouseRadius = mouse.offsetWidth / 2; // Use half of mouse width as radius
    var catA = cat.offsetWidth / 2; // Use half of cat width as ellipse parameter a
    var catB = cat.offsetHeight / 2; // Use half of cat height as ellipse parameter b

    if (circleEllipseCollision(mouseX, mouseY, mouseRadius, catX, catY, catA, catB)) {
        // Trigger collision between cat and mouse setting bypassCollisionCheck to true
        checkCollision(cat, [mouse], true);
    }

    // Check collision between cat and food
    checkCollision(cat, foodArray, false);

    // Check collision between mouse and food
    checkCollision(mouse, foodArray, false);
}

// Define a function to get the mouse position on the screen
function getMousePosition(event) {
    // Set the target coordinates to the mouse coordinates
    targetX = event.clientX;
    targetY = event.clientY;
}

// Define a function to get the touch position on the screen
function getTouchPosition(event) {
    // Set the target coordinates to the touch coordinates
    targetX = event.touches[0].clientX;
    targetY = event.touches[0].clientY;
}

// Define a function to move randomly on mobile devices when there is no touch input
function moveRandomly() {
    // Check if there is no target coordinates set yet (meaning no touch input)
    if (targetX == null || targetY == null) {
        // If so, set a random target coordinates within a small range around the current position of the cat
        targetX = catX + Math.random() * 200 - 100;
        targetY = catY + Math.random() * 200 - 100;
    }
}

// Define a function to create a new food element and append it to the body
function createFood() {
    // Generate a random number between 0 and 1 using Math.random()
    var randomNumber = Math.random();
    // Create a new div element
    var food = document.createElement("div");
    // Set class to "food"
    food.className += "food";
    // Check which range of values does randomNumber fall into
    if (randomNumber < 0.33) {
        // If it is between 0 and 0.33, choose tuna can as background image
        food.style.backgroundImage = 'url("./assets//canned-tuna.png")';
    } else if (randomNumber < 0.66) {
        // If it is between 0.33 and 0.66, choose fish as background image
        food.style.backgroundImage = 'url("./assets//fish.png")';
    } else {
        // If it is between 0.66 and 1, choose bowl of milk as background image
        food.style.backgroundImage = 'url("./assets//milk-bowl.png")';
    }
    // Set its x and y coordinates to random values within the window boundaries
    food.style.left = Math.random() * (document.body.clientWidth - food.offsetWidth) + "px";
    food.style.top = Math.random() * (document.body.clientHeight - food.offsetHeight) + "px";
    // Append it to the body element
    document.body.appendChild(food);
    // Push it to the array of food elements
    foodArray.push(food);
}

// Define a function to check if two elements are overlapping
function checkCollision(element1, elementArray, bypassCollisionCheck) {

    var rect1; // Bounding rectangle of element1
    var rect2; // Bounding rectangle of element2
    rect1 = element1.getBoundingClientRect();

    for (var i = 0; i < elementArray.length; i++) {
        var element2 = elementArray[i];
        rect2 = element2.getBoundingClientRect();

        if ((rect1.left - margin < rect2.right && rect1.right + margin > rect2.left && rect1.top - margin < rect2.bottom && rect1.bottom + margin > rect2.top) || bypassCollisionCheck) {
            document.body.removeChild(element2);
            elementArray.splice(i, 1);
            var audio;

            if (element1 == cat) {
                audio = new Audio("./assets//meow.mp3");
                audio.play();

                if (element2 == mouse) {
                    mouseTime = Math.random() * 5000 + 10000;
                    mouseTargetX = null;
                    mouseTargetY = null;
                    mouseX = Math.random() * document.body.clientWidth - mouse.offsetWidth / 2;
                    mouseY = Math.random() * document.body.clientHeight - mouse.offsetHeight / 2;
                    mouseAngle = Math.random() * Math.PI * 2;
                    mouseSpeed = defaultMouseSpeed;
                    mouse.style.left = mouseX + "px";
                    mouse.style.top = mouseY + "px";
                    mouse.style.transform = "rotate(" + mouseAngle + "rad)";
                }
            } else if (element1 == mouse) {
                audio = new Audio("./assets//squeak.mp3");

                audio.play();
            }
        }
    }
}

// Define a function to check if a point (x,y) is inside an ellipse (cx,cy,a,b)
function isInEllipse(x, y, cx, cy, a, b) {
    var dx = x - cx;
    var dy = y - cy;
    return ((dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1);
}

// Define a function to check if a circle (x,y,r) intersects with an ellipse (cx,cy,a,b)
function circleEllipseCollision(x, y, r, cx, cy, a, b) {
    // Check if circle center is inside ellipse
    if (isInEllipse(x, y, cx, cy, a, b)) {
        return true;
    }
    // Check if any point on ellipse perimeter is inside circle
    var angle = 0;
    var step = Math.PI / 180; // 1 degree step
    while (angle < Math.PI * 2) {
        var ex = cx - (a * Math.cos(angle));
        var ey = cy + (b * Math.sin(angle));
        var dx = x - ex;
        var dy = y - ey;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= r) {
            return true;
        }
        angle += step;
    }
    // No intersection
    return false;
}

// Add event listeners for mousemove and touchmove events
window.addEventListener("mousemove", getMousePosition);
window.addEventListener("touchmove", getTouchPosition);

// Start a loop to update both positions and rotations every frame (60 times per second)
setInterval(function() {

    mouseAngleTime -= 16.67;
    if (mousePanicTime > 0) {
        mousePanicTime -= 16.67;
    }

    updateCatAndMouse();

    foodTime -= 16.67;

    if (foodTime <= 0) {
        createFood();
        foodTime = Math.random() * 4000 + 3000;
    }

    mouseTime -= 16.67;

    if (mouseTime <= 0 && (!document.getElementById("mouse") || document.getElementById("mouse").style.display != "block")) {
        document.body.appendChild(mouse);
        mouseX = Math.random() * document.body.clientWidth - mouse.offsetWidth / 2;
        mouseY = Math.random() * document.body.clientHeight - mouse.offsetHeight / 2;
        mouseAngle = Math.random() * Math.PI * 2;
        mouseSpeed = defaultMouseSpeed;
        mouse.style.left = mouseX + "px";
        mouse.style.top = mouseY + "px";
        mouse.style.transform = "rotate(" + mouseAngle + "rad)";
        mouse.style.display = "block"; // Show the mouse div when appended
        mouseTime = Math.random() * 5000 + 10000;
    }

}, 1000 / 60);

// Start a loop to move randomly on mobile devices every second
setInterval(moveRandomly, 1000);