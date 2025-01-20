let directions = [
  [0, -1],
  [0.5, -0.5],
  [1, 0],
  [0.5, 0.5],
  [0, 1],
  [-0.5, 0.5],
  [-1, 0],
  [-0.5, -0.5],
];
let texts = [
  "Our story begins here",
  "Mẹ ơi sau này mình sống ở đây ha?",
  "Em ơi đường này trông cũng nhiều tiện ích ha.",
  "Có hơi hẹp tí.",
  "Giao thương phát triển quá",
  "Xuống phía kia nguye hiểm hơn",
  "Khởi đầu như vậy cũng tốt!",
  "We're living in the center of East District 2.",
  "Impressive conveniences.",
  "Can't wait to explore this place.",
  "I think I'll love it.",
  "The infrastructure must develop one day.",
];
let rays = [];
let speedMultiplier = 2; // Default speed multiplier
let textSizeValue = 20;
let hoverPadding = 20; // Padding for the hover area around the text
let spawnInterval = 4; // Interval (in frames) for new text objects

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); // Attach the canvas to the #sketch-container div
  frameRate(30);
  fill("#BDBDBD");
  textFont("Loretta Display");
  textSize(textSizeValue);
}

function draw() {
  // Clear the canvas fully to remove the trail effect
  background(211, 211, 211); // Light gray

  // Adjust speed based on mouse position
  adjustSpeed();

  // Create new text objects at a controlled interval
  if (frameCount % spawnInterval === 0) {
    let dir = random(directions);
    let textContent = random(texts);
    rays.push({
      x: width / 2,
      y: height / 2,
      vx: dir[0] * random(1, 3) * speedMultiplier,
      vy: dir[1] * random(1, 3) * speedMultiplier,
      content: textContent,
      angle: atan2(dir[1], dir[0]),
      alive: true,
    });
  }

  for (let i = rays.length - 1; i >= 0; i--) {
    let ray = rays[i];
    if (ray.alive) {
      ray.x += ray.vx;
      ray.y += ray.vy;

      push();
      translate(ray.x, ray.y);
      rotate(ray.angle);

      // Get the bounding box of the text
      let textWidthValue = textWidth(ray.content);
      let textHeightValue = textSizeValue;

      // Define the area around the text where hover should be detected
      let left = -textWidthValue / 2 - hoverPadding;
      let right = textWidthValue / 2 + hoverPadding;
      let top = -textHeightValue / 2 - hoverPadding;
      let bottom = textHeightValue / 2 + hoverPadding;

      // Check if the mouse is within the hover area (bounding box around the text)
      let mouseInBounds =
        mouseX >= ray.x + left &&
        mouseX <= ray.x + right &&
        mouseY >= ray.y + top &&
        mouseY <= ray.y + bottom;

      // Change the text opacity based on whether the mouse is in the hover area
      if (mouseInBounds) {
        fill(0, 0, 0); // Opaque black
      } else {
        fill(0, 0, 0, 40); // Semi-transparent black
      }

      textStyle(ITALIC);
      text(ray.content, 0, 0);
      pop();

      if (ray.x < 0 || ray.x > width || ray.y < 0 || ray.y > height) {
        rays.splice(i, 1);
      }
    }
  }
}

function adjustSpeed() {
  // Canvas regions
  let top = height / 3;
  let bottom = (2 * height) / 3;
  let left = width / 3;
  let right = (2 * width) / 3;

  // Change speed based on mouse position
  if (mouseX < left && mouseY < top) {
    speedMultiplier = 2; // Top-left
  } else if (mouseX > right && mouseY < top) {
    speedMultiplier = 3; // Top-right
  } else if (mouseX >= left && mouseX <= right && mouseY < top) {
    speedMultiplier = 4; // Top-center
  } else if (mouseX < left && mouseY > bottom) {
    speedMultiplier = 5; // Bottom-left
  } else if (mouseX > right && mouseY > bottom) {
    speedMultiplier = 6; // Bottom-right
  } else if (mouseX >= left && mouseX <= right && mouseY > bottom) {
    speedMultiplier = 7; // Bottom-center
  } else if (mouseX < left && mouseY >= top && mouseY <= bottom) {
    speedMultiplier = 8; // Middle-left
  } else if (mouseX > right && mouseY >= top && mouseY <= bottom) {
    speedMultiplier = 9; // Middle-right
  } else if (
    mouseX >= left &&
    mouseX <= right &&
    mouseY >= top &&
    mouseY <= bottom
  ) {
    speedMultiplier = 10; // Middle-center
  } else {
    speedMultiplier = 5; // Default speed
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
