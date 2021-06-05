/* globals faceapi */
import 'https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js';

import createFeedbackBox from './createFeedbackBox.js';
import getBoxFromPoints from './getBoxFromPoints.js';
import loadRandomImage from './loadRandomImage.js';

async function update(context, feedbackBox) {
  feedbackBox.show('Loading random image', { withSpinner: true });
  const image = await loadRandomImage();

  context.canvas.height = image.naturalHeight;
  context.canvas.width = image.naturalWidth;
  context.drawImage(image, 0, 0);

  feedbackBox.show('Detecting face(s)', { withSpinner: true });
  const faces = await faceapi.detectAllFaces(image).withFaceLandmarks();

  if (faces.length === 0) {
    feedbackBox.show('No face detected');

    return;
  }

  feedbackBox.hide();

  for (const face of faces) {
    const features = {
      jaw: face.landmarks.positions.slice(0, 17),
      eyebrowLeft: face.landmarks.positions.slice(17, 22),
      eyebrowRight: face.landmarks.positions.slice(22, 27),
      noseBridge: face.landmarks.positions.slice(27, 31),
      nose: face.landmarks.positions.slice(31, 36),
      eyeLeft: face.landmarks.positions.slice(36, 42),
      eyeRight: face.landmarks.positions.slice(42, 48),
      lipOuter: face.landmarks.positions.slice(48, 60),
      lipInner: face.landmarks.positions.slice(60),
    };

    for (const eye of [features.eyeLeft, features.eyeRight]) {
      const eyeBox = getBoxFromPoints(eye);
      const fontSize = 6 * eyeBox.height;

      context.font = `${fontSize}px/${fontSize}px serif`;
      context.textAlign = 'center';
      context.textBaseline = 'bottom';

      context.fillStyle = '#000';
      context.fillText('👄', eyeBox.center.x, eyeBox.center.y + 0.6 * fontSize);
    }
  }
}

(async () => {
  const feedbackBox = createFeedbackBox(
    document.getElementById('feedback-box'),
  );

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const elementContainer = document.getElementById('container');
  const buttonRefresh = document.getElementById('button-refresh');

  elementContainer.appendChild(canvas);

  feedbackBox.show('Loading TensorFlow models', { withSpinner: true });
  await faceapi.nets.faceLandmark68Net.loadFromUri('models');
  await faceapi.nets.ssdMobilenetv1.loadFromUri('models');

  update(context, feedbackBox);

  buttonRefresh.addEventListener('click', () => update(context, feedbackBox));
})();
