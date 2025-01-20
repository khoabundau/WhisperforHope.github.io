let downTexts = [];
let upTexts = [];
const downMessages = [
  "Nền kinh tế chỗ này ổn định",
  "Đi mua về bán",
  "Dân buôn ở đây sống ổn lắm",
  "Hay mình đầu tư miếng đất đó đi",
  "Đất ở đây là tấc đất tấc vàng",
  "Commerce and trade peaked highest recent years",
  "I've planned to investigate in this place",
  "It's worth living here - a prosperous place",
];
const upMessages = [
  "Sao cái đường lỗ không zậy",
  "Khi nào mới sửa đường đây",
  "Á, nguy hiểm quá",
  "Why there are no seperated lanes",
  "Containers and bikes on the same lane?",
  "This street is insane",
  "BAD INFRASTRUCTURE",
  "Quá mệt với tinh thần này rồi",
];

let speedFactor = 1; // Variable to change speed based on hover position

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  textFont("Loretta Display");

  // Create down texts
  let downTextSize = 15;
  for (let i = 0; i < 30; i++) {
    let message = random(downMessages);
    downTexts.push(new DownText(message, 14));
  }

  // Create up texts
  let upTextSize = 20;
  for (let i = 0; i < 30; i++) {
    let message = random(upMessages);
    upTexts.push(new UpText(message, 28));
  }
}

function draw() {
  background(211, 211, 211); // D3D3D3

  // Check mouse position to adjust speed factor
  updateSpeedFactor();

  for (let txt of downTexts) {
    txt.fall();
    txt.show("#000000");
  }
  for (let txt of upTexts) {
    txt.rise();
    txt.show("#000000");
  }
}

function updateSpeedFactor() {
  // Top left corner
  if (mouseX < width / 4 && mouseY < height / 4) {
    speedFactor = 0.5; // Slow speed
  }
  // Top right corner
  else if (mouseX > (width * 3) / 4 && mouseY < height / 4) {
    speedFactor = 2; // Fast speed
  }
  // Top center
  else if (
    mouseX > width / 4 &&
    mouseX < (width * 3) / 4 &&
    mouseY < height / 4
  ) {
    speedFactor = 1.5; // Medium fast speed
  }
  // Bottom left corner
  else if (mouseX < width / 4 && mouseY > (height * 3) / 4) {
    speedFactor = 0.3; // Slow speed
  }
  // Bottom right corner
  else if (mouseX > (width * 3) / 4 && mouseY > (height * 3) / 4) {
    speedFactor = 2.5; // Very fast speed
  }
  // Bottom center
  else if (
    mouseX > width / 4 &&
    mouseX < (width * 3) / 4 &&
    mouseY > (height * 3) / 4
  ) {
    speedFactor = 0.7; // Medium speed
  }
  // Default center area (no hover)
  else {
    speedFactor = 1; // Normal speed
  }
}

class DownText {
  constructor(message, size) {
    this.message = message;
    this.size = size;
    this.x = random(width);
    this.y = random(height / 2, height);
    this.z = random(0, 20);
    this.yspeed = map(this.z, 0, 20, 0.5, 10);
  }

  fall() {
    this.y = this.y + this.yspeed * speedFactor; // Apply speed factor

    let grav = map(this.z, 0, 20, 0, 0.1);
    this.yspeed = this.yspeed + grav;

    if (this.y > height) {
      this.y = random(height / 2, height);
      this.yspeed = map(this.z, 0, 20, 0.5, 10);
    }
  }

  show(color) {
    textSize(this.size);
    textAlign(CENTER);
    drawingContext.globalAlpha = 0.5;
    fill(color + "50");
    push();
    translate(this.x, this.y);
    rotate(PI / 2);
    textStyle(ITALIC);
    text(this.message, 0, 0);
    pop();
  }
}

class UpText {
  constructor(message, size) {
    this.message = message;
    this.size = size;
    this.x = random(width);
    this.y = random(0, height / 2);
    this.z = random(0, 20);
    this.yspeed = map(this.z, 0, 20, 1, 20);
  }

  rise() {
    this.y = this.y - this.yspeed * speedFactor; // Apply speed factor

    let grav = map(this.z, 0, 20, 0, 0.2);
    this.yspeed = this.yspeed + grav;

    if (this.y < 0) {
      this.y = random(0, height / 2);
      this.yspeed = map(this.z, 0, 20, 4, 10);
    }
  }

  show(color) {
    textSize(this.size);
    textAlign(CENTER);
    fill(color + "50");
    push();
    translate(this.x, this.y);
    rotate(PI / 2);
    textStyle(ITALIC);
    text(this.message, 0, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
