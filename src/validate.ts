import { DEFAULT_NULL_INDEX } from './constants';
import { ResolutionType } from './typings';

export const isResolutionValid = (
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

export const isImageValid = (fileType: string) => {
  if (fileType.includes('image')) {
    return true;
  }
  return false;
};

export const maxFileSizeValid = (fileSize, maxFileSize) => {
  return maxFileSize ? fileSize <= maxFileSize : true;
};

export const acceptTypeValid = (acceptType, fileName) => {
  if (acceptType && acceptType.length > 0) {
    const type: string = fileName.name.split('.').pop() || '';
    if (acceptType.indexOf(type) < 0) {
      return false;
    }
  }
  return true;
};

export const maxNumberValid = (totalNumber, maxNumber, keyUpdate) => {
  if (keyUpdate === DEFAULT_NULL_INDEX && maxNumber && totalNumber > maxNumber)
    return false;
  return true;
};
