// script.js
let volume = 1;
let synth = window.speechSynthesis;
let voices = synth.getVoices();
let voiceSelect = document.getElementById("voice-selection");
voiceSelect.disabled = false;
for(let i = 0; i < voices.length ; i++) {
  let option = document.createElement('option');
  option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

  if(voices[i].default) {
    option.textContent += ' -- DEFAULT';
  }

  option.setAttribute('data-lang', voices[i].lang);
  option.setAttribute('data-name', voices[i].name);
  voiceSelect.appendChild(option);
}

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById("user-image");
let fileQuery = document.getElementById("image-input");
const submit = document.querySelector("[type='submit']");

fileQuery.addEventListener('change', () => {
  let file = fileQuery.files[0];
  img.src = URL.createObjectURL(file);
  img.alt = file.name;
});

document.getElementById("generate-meme").addEventListener('submit', function(event) {
  event.preventDefault();
  document.querySelector("[type='button']").disabled = false;
  document.querySelector("[type='reset']").disabled = false;
  let top = document.getElementById("text-top");
  let bottom = document.getElementById("text-bottom");
  let context = canvas.getContext("2d");
  context.font = "28px Comic Sans MS";
  context.fillStyle = "white";
  context.textAlign  = "center";
  context.fillText(top.value, canvas.height/2, canvas.width/5);
  context.fillText(bottom.value, canvas.height/2, (4*canvas.width)/5);
  
});

document.querySelector("[type='button']").addEventListener('click', () => {
  let utterT = new SpeechSynthesisUtterance(document.getElementById("text-top").value);
  let utterB = new SpeechSynthesisUtterance(document.getElementById("text-bottom").value);
  let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterT.voice = voices[i];
      utterB.voice - voices[i];
    }
  }
  utterT.volume = volume;
  utterB.volume = volume;
  synth.speak(utterT);
  synth.speak(utterB);
});

document.getElementById("volume-group").addEventListener('input', () => {
  let ran = document.querySelector("[type='range']").value
  volume = ran / 100;
  console.log(volume);
  if(ran >= 67 && ran <= 100) {
    document.querySelector("img").src = "icons/volume-level-3.svg";
  }
  else if (ran >= 34 && ran <= 66){
    document.querySelector("img").src = "icons/volume-level-2.svg";
  }
  else if (ran >= 1 && ran <= 33){
    document.querySelector("img").src = "icons/volume-level-1.svg";
  }
  else if (ran == 0){
    document.querySelector("img").src = "icons/volume-level-0.svg";
  }

})

document.querySelector("[type='reset']").addEventListener('click', () => {
  let context = canvas.getContext("2d");
  submit.disabled = false;
  document.querySelector("[type='button']").disabled = true;
  document.querySelector("[type='reset']").disabled = true;
  context.clearRect(0,0, 400,400);
  document.getElementById("text-top").value = '';
  document.getElementById("text-bottom").value = '';
});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  let context = canvas.getContext("2d");
  submit.disabled = false;
  document.querySelector("[type='button']").disabled = true;
  document.querySelector("[type='reset']").disabled = true;
  context.clearRect(0,0, 400,400);
  context.fillStyle = "black";
  context.fillRect(0,0, 400,400);
  let dim = getDimmensions(400,400, img.width, img.height);
  context.drawImage(img, dim.startX, dim.startY, dim.width, dim.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
