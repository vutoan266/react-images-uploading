import { DEFAULT_NULL_INDEX } from './constants';
import { ResolutionType, ErrorsType } from './typings';

export const isResolutionValid = (
  dataURL: string,
  resolutionType: ResolutionType,
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

export const isMaxFileSizeValid = (fileSize, maxFileSize) => {
  return fileSize <= maxFileSize;
};

export const isAcceptTypeValid = (acceptType, fileName) => {
  if (acceptType && acceptType.length > 0) {
    const type: string = fileName.name.split('.').pop() || '';
    if (acceptType.findIndex(item => item.toLowerCase() === type.toLowerCase()) < 0) {
      return false;
    }
  }
  return true;
};

export const isMaxNumberValid = (totalNumber, maxNumber, keyUpdate) => {
  if (keyUpdate === DEFAULT_NULL_INDEX && maxNumber && totalNumber > maxNumber)
    return false;
  return true;
};

export const getErrorValidation = async ({
  fileList,
  value,
  maxNumber,
  keyUpdate,
  dataURLKey,
  acceptType,
  maxFileSize,
  resolutionType,
  resolutionWidth,
  resolutionHeight,
}): Promise<ErrorsType> => {
  const newErrors: ErrorsType = {};
  if (!isMaxNumberValid(fileList.length + value.length, maxNumber, keyUpdate)) {
    newErrors.maxNumber = true;
  } else {
    for (let i = 0; i < fileList.length; i++) {
      const { file, [dataURLKey]: dataURL } = fileList[i];
      if (file) {
        if (!isImageValid(file.type)) {
          newErrors.acceptType = true;
          break;
        }
        if (!isAcceptTypeValid(acceptType, file.name)) {
          newErrors.acceptType = true;
          break;
        }
        if (!isMaxFileSizeValid(file.size, maxFileSize)) {
          newErrors.maxFileSize = true;
          break;
        }
      }
      if (dataURL && resolutionType) {
        const checkRes = await isResolutionValid(
          dataURL,
          resolutionType,
          resolutionWidth,
          resolutionHeight
        );
        if (!checkRes) {
          newErrors.resolution = true;
          break;
        }
      }
    }
  }
  if (Object.values(newErrors).find(Boolean)) return newErrors;
  return null;
};
