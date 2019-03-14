// Followed the following tutorial to complete this assignment :
// https://www.youtube.com/watch?v=FWSR_7kZuYg
let socket;
let grid;
window.onload = function() {
  socket = io.connect("http://24.16.255.56:8888");
  socket.on("load", function(data) {
    grid = data.data;
    draw();
    alert("Loading last saved board state...\n\n\n\nClick OK");
  });
};

let cols;
let rows;
let resolution = 20;
let flag = false;
let saveGrid;
function setup() {
  createCanvas(600, 400);
  frameRate(20);
  resetSketch();

  var button = createButton("Run Random");
  button.position(10, 500);
  button.style("font-size", "15px");
  button.mousePressed(resetSketch);
  var play = createButton("Pause/Play");
  play.position(150, 500);
  play.style("font-size", "15px");
  play.mousePressed(flip);

  var step = createButton("Step");
  step.position(300, 500);
  step.style("font-size", "15px");
  step.mousePressed(stepThrough);

  var save = createButton("Save State");
  save.position(400, 500);
  save.style("font-size", "15px");
  save.mousePressed(saveState);

  var load = createButton("Load State");
  load.position(550, 500);
  load.style("font-size", "15px");
  load.mousePressed(loadState);
}

function loadState() {
  if (!flag) {
    alert("Hit Pause button before loading the state!");
  } else {
    socket.emit("load", {
      studentname: "Jason Dhami",
      statename: "gameoflife491save"
    });
  }
}
function saveState() {
  if (!flag) {
    alert("Hit Pause button before saving the state!");
  } else {
    socket.emit("save", {
      studentname: "Jason Dhami",
      statename: "gameoflife491save",
      data: saveGrid
    });

    alert("Saved current board state!");
  }
}

function stepThrough() {
  if (!flag) {
    alert("Pause the simulation before stepping through");
  } else {
    draw();
  }
}
function flip() {
  if (!flag) {
    noLoop();
  } else {
    loop();
  }
  flag = !flag;
}

function resetSketch() {
  loop();
  flag = false;
  cols = width / resolution;
  rows = height / resolution;
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

function draw() {
  background(0);
  saveGrid = grid;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        fill(255);
        stroke(0);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }

  let next = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];

      let sum = 0;
      let neighbors = countNeighbors(grid, i, j);

      if (state == 0 && neighbors == 3) {
        next[i][j] = 1;
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  grid = next;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}
