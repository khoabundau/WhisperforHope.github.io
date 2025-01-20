let drops = [];
let numDrops = 30;
let textsToFall = [
  "Chờ thêm 10 năm nữa à?",
  "Thôi tôi không muốn đợi nữa",
  "Hôm nay lại vấp 1 cái ổ khủng long nữa rồi.",
  "Mẹ ơi hằng ngày đi học với cái đường này con chịu hết nổi rồi",
  "I couldn't bare it any longer.",
  "It's so dangerous.",
  "You keep promising but just doing nothing!",
  "I don't want to wait for like 10 or 20 years more",
  "10 years ago you promised to make it better.",
  "This is the street of commerce and trade! How about the infrastructure!",
  "Tôi cần có lời giải thích.",
  "Vậy bấy lâu nay chỉ là 1 giấc mộng hão huyền àh?",
];

let speeds = {
  topLeft: 1,
  bottomLeft: 4,
  topRight: 1,
  bottomRight: 3,
  topMiddle: 5,
  bottomMiddle: 8,
};

class Drop {
  constructor() {
    this.x = random(width);
    this.y = random(-200, -100); // Start above the screen
    this.z = random(0, 20);
    this.len = map(this.z, 0, 20, 10, 20);
    this.ydrop = map(this.z, 0, 20, 0.1, 1);
    this.text = random(textsToFall);
    this.opacity = 0.5;
  }

  fall() {
    let fallSpeed = getSpeedBasedOnMousePosition();
    this.y += this.ydrop * fallSpeed; // Change to += for downward movement
    let grav = map(this.z, 0, 20, 0, 0.01);
    this.ydrop += grav;

    if (this.y > height) {
      // Reset to top if it goes below the canvas
      this.y = random(-100, -200); // Start from above the screen
      this.ydrop = map(this.z, 0, 20, 0.1, 1);
      this.text = random(textsToFall);
    }
  }

  show() {
    let thick = map(this.z, 0, 20, 1, 2);
    textSize(20); // Set the text size to 28
    fill(255, 255, 255, this.opacity * 255); // Adjust opacity
    push();
    translate(this.x, this.y);
    rotate(HALF_PI);
    textFont("Loretta Display");
    drawingContext.font = `italic ${thick * 20}px "Loretta Display"`; // Keep italic only

    text(this.text, 0, 0);
    pop();
  }

  hover(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    if (d < 50) {
      // Adjust the hover detection radius as needed
      this.opacity = 1; // Full opacity when hovered
    } else {
      this.opacity = 0.05; // Default opacity
    }
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");
  for (let i = 0; i < numDrops; i++) {
    drops[i] = new Drop();
  }
}

function draw() {
  background(0, 30);
  for (let i = 0; i < numDrops; i++) {
    drops[i].fall();
    drops[i].hover(mouseX, mouseY); // Check for hover
    drops[i].show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function getSpeedBasedOnMousePosition() {
  if (mouseX < width / 3 && mouseY < height / 3) {
    return speeds.topLeft;
  } else if (mouseX < width / 3 && mouseY > (2 * height) / 3) {
    return speeds.bottomLeft;
  } else if (mouseX > (2 * width) / 3 && mouseY < height / 3) {
    return speeds.topRight;
  } else if (mouseX > (2 * width) / 3 && mouseY > (2 * height) / 3) {
    return speeds.bottomRight;
  } else if (
    mouseX > width / 3 &&
    mouseX < (2 * width) / 3 &&
    mouseY < height / 3
  ) {
    return speeds.topMiddle;
  } else if (
    mouseX > width / 3 &&
    mouseX < (2 * width) / 3 &&
    mouseY > (2 * height) / 3
  ) {
    return speeds.bottomMiddle;
  } else {
    return 5; // Default speed
  }
}
