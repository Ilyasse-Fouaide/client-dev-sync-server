const { createCanvas, registerFont } = require('canvas');
const path = require('path');

const fontPath = path.join(__dirname, '..', '/fonts', '/Poppins-Regular.ttf');
const canvasWidth = 80;
const canvasHeight = 80;

registerFont(fontPath, { family: 'Poppins' });

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateDefaultProfileImage(initial) {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext('2d');

  // Generate random background color
  const backgroundColor = getRandomColor();

  // Fill the canvas with the background color
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  // Set the text properties
  const fontSize = canvasWidth / 2;
  context.font = `${fontSize}px Poppins`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#FFFFFF';


  const fisrt_name = initial.split(' ')[0]; // ilyasse
  const last_name = initial.split(' ')[1]; // fouaide

  const fisrt_name_letter = fisrt_name.split('')[0].toUpperCase();
  const last_name_letter = last_name.split('')[0].toUpperCase();

  // Draw the initial letter
  context.fillText(fisrt_name_letter + last_name_letter, canvasWidth / 2, canvasHeight / 2);

  // Convert the canvas to a base64-encoded PNG
  const image = canvas.toDataURL('image/png');

  return image;
}

console.log(generateDefaultProfileImage('kamal fouaide'))

module.exports = generateDefaultProfileImage;
