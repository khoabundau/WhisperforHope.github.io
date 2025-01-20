let texts = [
  "ROAD OF DEATH",
  "Commerce and Trade",
  "Connection",
  "Đường này xây lâu lắm rồi.",
  "Hồi đó ở đây là đất ruộng",
  "Giờ phát triển chóng mắt quá!",
  "Có điều cơ sở hạ tầng vẫn tệ quá",
  "Narrow",
];
let textDrops = [];
let upTextDrops = [];
let frameCounter = 0;
let speedMultiplier = 1; // Default speed multiplier

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight * 2);
  canvas.parent("sketch-container");

  // Load and apply the font
  textFont("loretta");
  textSize(20);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(211, 211, 211, 100); // Background color (D3D3D3)

  frameCounter++;
  if (frameCounter % 10 === 0) {
    textDrops.push(new TextDrop());
    upTextDrops.push(new UpTextDrop());
  }

  // Adjust speeds based on mouse position
  speedMultiplier = getSpeedMultiplier();

  for (let i = textDrops.length - 1; i >= 0; i--) {
    textDrops[i].update(speedMultiplier);
    textDrops[i].show();
    if (textDrops[i].offscreen()) textDrops.splice(i, 1);
  }

  for (let i = upTextDrops.length - 1; i >= 0; i--) {
    upTextDrops[i].update(speedMultiplier);
    upTextDrops[i].show();
    if (upTextDrops[i].offscreen()) upTextDrops.splice(i, 1);
  }
}

class TextDrop {
  constructor() {
    this.text = random(texts);
    this.x = random(width);
    this.y = random(-200, -100);
    this.yspeed = random(2, 10); // Adjust speed for smoother or faster downward movement
    this.opacity = 1; // Start with full opacity to prevent fading
  }

  update(multiplier) {
    this.y += this.yspeed * multiplier; // Move text downward
  }

  show() {
    this.opacity = 1; // Set opacity to 1 for solid text, no fading

    push();
    translate(this.x, this.y);
    rotate(HALF_PI); // Optional: Rotating the text for stylistic effect

    // Apply font styling and change text color
    textFont("loretta");
    textStyle(NORMAL);
    fill(189, 189, 189, this.opacity * 255); // Full opacity (no blur effect)
    text(this.text, 0, 0); // Draw the text
    pop();
  }

  offscreen() {
    return this.y > height; // Check if the text has gone offscreen
  }
}

class UpTextDrop {
  constructor() {
    this.text = random(texts);
    this.x = random(width);
    this.y = random(height, height + 200);
    this.yspeed = random(2, 10); // Adjust speed for smoother or faster upward movement
    this.opacity = 1; // Start with full opacity to prevent fading
  }

  update(multiplier) {
    this.y -= this.yspeed * multiplier; // Move text upwards
  }

  show() {
    this.opacity = 1; // Set opacity to 1 for solid text, no fading

    push();
    translate(this.x, this.y);
    rotate(HALF_PI); // Optional: Rotating the text for stylistic effect

    // Apply font styling and change text color
    textFont("loretta");
    textStyle(NORMAL);
    fill(0, 0, 0, this.opacity * 70); // Full opacity (no blur effect)
    text(this.text, 0, 0); // Draw the text
    pop();
  }

  offscreen() {
    return this.y < 0; // Check if the text has gone offscreen
  }
}

function getSpeedMultiplier() {
  // Define regions with their respective speeds
  let regions = [
    { x: 0, y: 0, w: width / 3, h: height / 3, speed: 2 }, // top left
    { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 3, speed: 3 }, // top right
    { x: 0, y: (height / 3) * 2, w: width / 3, h: height / 3, speed: 1 }, // bottom left
    {
      x: (width / 3) * 2,
      y: (height / 3) * 2,
      w: width / 3,
      h: height / 3,
      speed: 0.5,
    }, // bottom right
    { x: width / 3, y: 0, w: width / 3, h: height / 3, speed: 1.5 }, // top center
    {
      x: width / 3,
      y: (height / 3) * 2,
      w: width / 3,
      h: height / 3,
      speed: 1.2,
    }, // bottom center
  ];

  // Smooth speed transition by checking the mouse position within the defined regions
  let targetSpeed = 1; // Default speed multiplier
  for (let region of regions) {
    if (
      mouseX >= region.x &&
      mouseX <= region.x + region.w &&
      mouseY >= region.y &&
      mouseY <= region.y + region.h
    ) {
      targetSpeed = region.speed;
      break;
    }
  }

  // Smooth the transition between the current speed and target speed
  speedMultiplier += (targetSpeed - speedMultiplier) * 0.1; // Smooth transition
  return speedMultiplier;
}

function getRegionSpeed(x, y) {
  // Check if the (x, y) position is inside any of the defined regions and return its speed
  let regions = [
    { x: 0, y: 0, w: width / 3, h: height / 3, speed: 2 }, // top left
    { x: (width / 3) * 2, y: 0, w: width / 3, h: height / 3, speed: 3 }, // top right
    { x: 0, y: (height / 3) * 2, w: width / 3, h: height / 3, speed: 1 }, // bottom left
    {
      x: (width / 3) * 2,
      y: (height / 3) * 2,
      w: width / 3,
      h: height / 3,
      speed: 0.5,
    }, // bottom right
    { x: width / 3, y: 0, w: width / 3, h: height / 3, speed: 1.5 }, // top center
    {
      x: width / 3,
      y: (height / 3) * 2,
      w: width / 3,
      h: height / 3,
      speed: 1.2,
    }, // bottom center
  ];

  for (let region of regions) {
    if (
      x >= region.x &&
      x <= region.x + region.w &&
      y >= region.y &&
      y <= region.y + region.h
    ) {
      return region.speed; // If the text drop is in this region, return the region's speed
    }
  }
  return 1; // Default speed if outside the regions
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 2);
}
