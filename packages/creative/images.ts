const loadImage = (source: string, onLoad: () => void) => {
  const image = new Image();
  image.src = source;
  image.onload = onLoad;
  return image;
};

const loadImages = (sources: string[], target: HTMLImageElement[], onAllLoaded: () => void) => {
  let toLoadCount = sources.length;

  const onImageLoaded = () => {
    toLoadCount--;
    if (toLoadCount <= 0) onAllLoaded();
  };

  for (let i = 0; i < sources.length; i++) {
    const image = loadImage(sources[i], onImageLoaded);
    target.push(image);
  }
};

export default { loadImage, loadImages };
