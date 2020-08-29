import { ResolutionType } from './typings';

export const getBase64 = (file: File): Promise<string> => {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.addEventListener('load', () => resolve(String(reader.result)));
    reader.readAsDataURL(file);
  });
};

export const checkResolution = (
  dataURL: string,
  resolutionType: ResolutionType = 'absolute',
  resolutionWidth: number = 0,
  resolutionHeight: number = 1
): Promise<boolean> => {
  const image = new Image();

  return new Promise((resolve) => {
    image.addEventListener('load', () => {
      if (image.width && image.height) {
        switch (resolutionType) {
          case 'absolute': {
            if (
              image.width === resolutionWidth &&
              image.height === resolutionHeight
            )
              return resolve(true);
            return resolve(false);
          }
          case 'ratio': {
            const ratio = resolutionWidth / resolutionHeight;
            if (image.width / image.height === ratio) return resolve(true);
            return resolve(false);
          }
          case 'less': {
            if (
              image.width <= resolutionWidth &&
              image.height <= resolutionHeight
            )
              return resolve(true);
            return resolve(false);
          }
          case 'more': {
            if (
              image.width >= resolutionWidth &&
              image.height >= resolutionHeight
            )
              return resolve(true);
            return resolve(false);
          }
        }
      }
      resolve(true);
    });
    image.src = dataURL;
  });
};
