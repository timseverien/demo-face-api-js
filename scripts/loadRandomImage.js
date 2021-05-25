export default function loadRandomImage() {
  const image = new Image();

  image.crossOrigin = true;

  return new Promise((resolve, reject) => {
    image.addEventListener('error', (error) => reject(error));
    image.addEventListener('load', () => resolve(image));
    image.src = 'https://source.unsplash.com/512x512/?face';
  });
}
