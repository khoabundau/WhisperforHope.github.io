let messages = [
  "Cố lên 1 năm nữa là đường đổi rồi",
  "Giồi ôi thấy dựnng mấy cái 'lô cốt' chắc sắp đổi mới gì rồi",
  "Cố lên sắp đến rồi",
  "Với cái nền kinh tế như này thì kiểu gì cơ sở hạ tầng chẳng đổi",
  "Ừ mấy ổng hứa năm sau hoàn thiện mà",
  "Just keep our ambition",
  "I think there would be a change for this road's transformation",
  "1 more year",
  "Turn real for sure, not just a dream",
  "Did you hear that",
  "Tomorrow there will be a big reconstruction",
  "Bà nghe gì chưa",
  "Mai tái xây dựng hay sao đó",
];
let drops = [];
let draggedDrop = null;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  textFont("Loretta Display");
  textSize(20);
  for (let i = 0; i < 25; i++) {
    drops.push(new Drop());
  }
  textAlign(CENTER, CENTER);
}

function draw() {
  background("#D3D3D3");
  let speedMultiplier = 1;

  if (mouseX < width / 3 && mouseY < height / 3) {
    speedMultiplier = 0.5;
  } else if (
    mouseX >= width / 3 &&
    mouseX < (2 * width) / 3 &&
    mouseY < height / 3
  ) {
    speedMultiplier = 0.75;
  } else if (mouseX >= (2 * width) / 3 && mouseY < height / 3) {
    speedMultiplier = 1;
  } else if (mouseX < width / 3 && mouseY >= (2 * height) / 3) {
    speedMultiplier = 1.25;
  } else if (
    mouseX >= width / 3 &&
    mouseX < (2 * width) / 3 &&
    mouseY >= (2 * height) / 3
  ) {
    speedMultiplier = 1.5;
  } else if (mouseX >= (2 * width) / 3 && mouseY >= (2 * height) / 3) {
    speedMultiplier = 1.75;
  } else if (
    mouseX >= width / 3 &&
    mouseX < (2 * width) / 3 &&
    mouseY >= height / 3 &&
    mouseY < (2 * height) / 3
  ) {
    speedMultiplier = 2;
  }

  for (let drop of drops) {
    drop.rise(speedMultiplier);
    drop.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  for (let drop of drops) {
    if (dist(mouseX, mouseY, drop.x, drop.y) < drop.textSize * 2) {
      draggedDrop = drop;
      break;
    }
  }
}

function mouseDragged() {
  if (draggedDrop) {
    draggedDrop.x = mouseX;
    draggedDrop.y = mouseY;
    draggedDrop.opacity = 1; // Increase opacity while dragging
  }
}

function mouseReleased() {
  if (draggedDrop) {
    draggedDrop.yspeed = map(draggedDrop.z, 0, 20, 0.05, 0.5); // Resume slower vertical movement
    draggedDrop.xspeed = random(-5, 5); // Resume slower horizontal movement
    draggedDrop.opacity = map(draggedDrop.z, 0, 20, 0.05, 0.25); // Reduced opacity
    draggedDrop = null;
  }
}

class Drop {
  constructor() {
    this.x = width / 2; // Start from the center horizontally
    this.y = height; // Start from the bottom vertically
    this.z = random(0, 20);
    this.yspeed = map(this.z, 0, 20, 0.05, 0.5); // Reduced the speed
    this.xspeed = random(-5, 5); // Increased horizontal speed
    this.text = random(messages);
    this.textSize = map(this.z, 0, 20, 12, 28);
    this.opacity = map(this.z, 0, 20, 0.05, 0.4); // Reduced initial opacity
  }

  rise(speedMultiplier) {
    if (!draggedDrop || this !== draggedDrop) {
      this.y -= this.yspeed * speedMultiplier;
      this.x += this.xspeed * speedMultiplier;
      let grav = map(this.z, 0, 20, 0, 0.05);
      this.yspeed += grav;

      if (this.y < 0 || this.x < 0 || this.x > width) {
        this.y = height;
        this.x = width / 2; // Reset to the center horizontally
        this.yspeed = map(this.z, 0, 20, 0.05, 0.5);
        this.xspeed = random(-5, 5); // Increased horizontal speed
        this.text = random(messages);
        this.textSize = map(this.z, 0, 10, 8, 22);
        this.opacity = map(this.z, 0, 20, 0.05, 0.4); // Reset opacity
      }
    }
  }

  show() {
    fill(0, this.opacity * 255); // Apply reduced opacity
    textFont("Loretta Display");
    textSize(this.textSize);
    textStyle(ITALIC);
    text(this.text, this.x, this.y);
  }
}
