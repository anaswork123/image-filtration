let body = document.getElementsByTagName("body")[0];
const imageEl = document.querySelector("#myImage");
let input = document.querySelector("input");
let checkboxesEl = document.querySelectorAll("input[type='checkbox']");
let imageUrl = "";

var canvas = initializeCanvas();
canvas.selection = false;

function initializeCanvas() {
  let myCanvas = document.getElementById("myCanvas");

  let canvas = new fabric.Canvas(myCanvas, {
    width: 500,
    height: 600,
    selection: true,
  });
  canvas.freeDrawingBrush.width = 4;
  return canvas;
}

function setBackground(imageUrl) {
  const color = "lightgrey";
  const background = new fabric.Rect({
    width: canvas.width,
    height: canvas.height,
    fill: color,
    selectable: false,
    evented: false,
    objectCaching: false, // Prevent caching for dynamic color changes
  });

  // fabric.Image.fromURL(imageUrl, (img) => {
  //   img.set({
  //     scaleX: canvas.width / img.width,
  //     scaleY: canvas.height / img.height,
  //   });
  //   canvas.setBackgroundImage(img);
  canvas.add(background);
  canvas.renderAll();
  // });
}

function enableCheckBoxes() {
  checkboxesEl.forEach((element) => {
    element.disabled = false;
  });
  input.disabled = true;
}

function disalbeCheckBoxes() {
  checkboxesEl.forEach((element) => {
    element.disabled = true;
  });
}

function deselectAllCheckboxes() {
  // Loop through checkboxes and set checked to false
  checkboxesEl.forEach(function (checkbox) {
    checkbox.checked = false;
  });
}

const currentFilters = [];

function checkBoxHandler(check) {
  const filters = {
    gray: new fabric.Image.filters.Grayscale(),
    blur: new fabric.Image.filters.Blur({ blur: 0.1 }),
    sepia: new fabric.Image.filters.Sepia(),
    invert: new fabric.Image.filters.Invert(),
    contrast: new fabric.Image.filters.Contrast({ contrast: 0.5 }),
    saturation: new fabric.Image.filters.Saturation({ saturation: 0.5 }),
    blackwhite: new fabric.Image.filters.BlackWhite(),
    polaroid: new fabric.Image.filters.Polaroid(),
  };

  const checkedCheckboxes = Array.from(checkboxesEl).filter(
    (checkbox) => checkbox.checked
  );

  const checkedResult = checkedCheckboxes.map((item) => filters[item.value]);

  const img = canvas.getActiveObject();
  if (img && img.type === "image") {
    enableCheckBoxes();
    applyFilters(img);
  } else {
    console.warn("Please select an image first");
  }

  function applyFilters(img) {
    img.filters = checkedResult;
    img.applyFilters();
    console.log(img.filters);
    canvas.renderAll();
  }
}

function imageHandler(e) {
  imageUrl = e.target.files[0];
  setBackground(canvas);
}

const reader = new FileReader();
const backgroundReader = new FileReader();
function backgroundChange(e) {
  const file = e.target.files[0];
  backgroundReader.readAsDataURL(file);
}

function imageUploadHandler(e) {
  const file = e.target.files[0];
  reader.readAsDataURL(file);
}

function textureHandler(img) {
  let imageTextureSize = img.width > img.height ? img.width : img.height;

  if (imageTextureSize > fabric.textureSize) {
    fabric.textureSize = imageTextureSize;
  }
}

function clearHandler() {
  canvas.clear();
  deselectAllCheckboxes();
  input.disabled = false;
  input.value = "";
}

//Event listeners
imageEl.addEventListener("change", imageUploadHandler);

reader.addEventListener("load", () => {
  const src = reader.result;
  fabric.Image.fromURL(src, (img) => {
    img.set({
      scaleX: canvas.width / img.width,
      scaleY: canvas.height / img.height,
    });

    textureHandler(img);
    canvas.add(img);
    canvas.renderAll();
  });
});

backgroundReader.addEventListener("load", () => {
  const src = backgroundReader.result;
  setBackground(src);
});

// Image is selected
canvas.on("selection:created", (event) => {
  enableCheckBoxes();
});
// Any object is not selected
canvas.on("selection:cleared", (event) => {
  disalbeCheckBoxes();
});

canvas.on("object:selected", function (event) {
  if (canvas.getObjects().length === 1) {
    // Run your code when there is only one object on the canvas
    console.log("Only one object is selected");
  }
});

//Initial funtion calls
// setBackground(imageUrl);
disalbeCheckBoxes();
