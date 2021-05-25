/* globals faceapi */
import 'https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js';

import loadRandomImage from './loadRandomImage.js';

async function update(context, contextCropped) {
  const image = await loadRandomImage();
  const faces = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions());

  context.canvas.height = image.naturalHeight;
  context.canvas.width = image.naturalWidth;
  context.drawImage(image, 0, 0);

  if (faces.length === 0) {
    contextCropped.canvas.hidden = true;
    return;
  }

  const box = {
    bottom: 0,
    left: image.naturalWidth,
    right: 0,
    top: image.naturalHeight,

    get height() {
      return this.bottom - this.top;
    },

    get width() {
      return this.right - this.left;
    },
  };

  for (const face of faces) {
    box.bottom = Math.max(box.bottom, face.box.bottom);
    box.left = Math.min(box.left, face.box.left);
    box.right = Math.max(box.right, face.box.right);
    box.top = Math.min(box.top, face.box.top);
  }

  contextCropped.canvas.height = box.height;
  contextCropped.canvas.width = box.width;
  contextCropped.canvas.hidden = false;

  contextCropped.drawImage(
    image,
    box.left,
    box.top,
    box.width,
    box.height,
    0,
    0,
    box.width,
    box.height,
  );
}

(async () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const canvasCropped = document.createElement('canvas');
  const contextCropped = canvasCropped.getContext('2d');

  const elementContainer = document.getElementById('container');
  const buttonRefresh = document.getElementById('button-refresh');

  elementContainer.appendChild(canvas);
  elementContainer.appendChild(canvasCropped);

  await faceapi.nets.tinyFaceDetector.loadFromUri('models');

  update(context, contextCropped);

  buttonRefresh.addEventListener('click', () => {
    update(context, contextCropped);
  });
})();
