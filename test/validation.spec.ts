import {
  isImageValid,
  isMaxFileSizeValid,
  isAcceptTypeValid,
  isMaxNumberValid,
  isResolutionValid,
} from '../src/validation';
import { DEFAULT_NULL_INDEX } from '../src/constants';

describe('testing isImageValid', () => {
  it('should return true', () => {
    const actual = isImageValid('image/png');
    expect(actual).toBeTruthy();
  });

  it('should return false', () => {
    const actual = isImageValid('plain/text');
    expect(actual).toBeFalsy();
  });
});

describe('testing isMaxFileSizeValid', () => {
  it('should return true', () => {
    const oneMB = 1024;
    const fiveMB = oneMB * 5;
    const actual = isMaxFileSizeValid(oneMB, fiveMB);
    expect(actual).toBeTruthy();
  });

  it('should return false', () => {
    const oneMB = 1024;
    const twoMB = oneMB * 2;
    const actual = isMaxFileSizeValid(oneMB * 3, twoMB);
    expect(actual).toBeFalsy();
  });
});

describe('testing isAcceptTypeValid', () => {
  it('should return true with null acceptType', () => {
    const acceptType = null;
    const fileType = 'png';
    const actual = isAcceptTypeValid(acceptType, fileType);
    expect(actual).toBeTruthy();
  });
  it('should return true', () => {
    const acceptType = ['png'];
    const fileType = 'png';
    const actual = isAcceptTypeValid(acceptType, fileType);
    expect(actual).toBeTruthy();
  });
  it('should return true with case sensitive', () => {
    const acceptType = ['png'];
    const fileType = 'PNG';
    const actual = isAcceptTypeValid(acceptType, fileType);
    expect(actual).toBeTruthy();
  });
  it('should return false', () => {
    const acceptType = ['jpg'];
    const fileType = 'png';
    const actual = isAcceptTypeValid(acceptType, fileType);
    expect(actual).toBeFalsy();
  });
});

describe('testing isMaxNumberValid', () => {
  it('should return true without keyUpdate', () => {
    const totalNumber = 2;
    const maxNumber = 2;
    const keyUpdate = DEFAULT_NULL_INDEX;
    const actual = isMaxNumberValid(totalNumber, maxNumber, keyUpdate);
    expect(actual).toBeTruthy();
  });
  it('should return false without keyUpdate', () => {
    const totalNumber = 3;
    const maxNumber = 2;
    const keyUpdate = DEFAULT_NULL_INDEX;
    const actual = isMaxNumberValid(totalNumber, maxNumber, keyUpdate);
    expect(actual).toBeFalsy();
  });
  it('should return true with keyUpdate', () => {
    const totalNumber = 3;
    const maxNumber = 2;
    const keyUpdate = 0;
    const actual = isMaxNumberValid(totalNumber, maxNumber, keyUpdate);
    expect(actual).toBeTruthy();
  });
  it('should return false with keyUpdate', () => {
    const totalNumber = 4;
    const maxNumber = 2;
    const keyUpdate = 0;
    const actual = isMaxNumberValid(totalNumber, maxNumber, keyUpdate);
    expect(actual).toBeFalsy();
  });
  it('should return true without maxNumber and keyUpdate', () => {
    const totalNumber = 4;
    const maxNumber = null;
    const keyUpdate = null;
    const actual = isMaxNumberValid(totalNumber, maxNumber, keyUpdate);
    expect(actual).toBeTruthy();
  });
  it('should return true without maxNumber but keyUpdate', () => {
    const totalNumber = 4;
    const maxNumber = null;
    const keyUpdate = 0;
    const actual = isMaxNumberValid(totalNumber, maxNumber, keyUpdate);
    expect(actual).toBeTruthy();
  });
});

describe('testing isResolutionValid', () => {
  it('should return true type absolute', () => {
    const image = { width: 160, height: 160 } as HTMLImageElement;
    const resolutionType = 'absolute';
    const resolutionWidth = 160;
    const resolutionHeight = 160;
    const actual = isResolutionValid(
      image,
      resolutionType,
      resolutionWidth,
      resolutionHeight
    );
    return expect(actual).toBeTruthy();
  });
  it('should return false type absolute', async () => {
    const image = { width: 160, height: 160 } as HTMLImageElement;
    const resolutionType = 'absolute';
    const resolutionWidth = 170;
    const resolutionHeight = 160;
    const actual = isResolutionValid(
      image,
      resolutionType,
      resolutionWidth,
      resolutionHeight
    );
    return expect(actual).toBeFalsy();
  });
  it('should return true type ratio', () => {
    const image = { width: 320, height: 180 } as HTMLImageElement;
    const resolutionType = 'ratio';
    const resolutionWidth = 16;
    const resolutionHeight = 9;
    const actual = isResolutionValid(
      image,
      resolutionType,
      resolutionWidth,
      resolutionHeight
    );
    return expect(actual).toBeTruthy();
  });
  it('should return false type ratio', async () => {
    const image = { width: 160, height: 160 } as HTMLImageElement;
    const resolutionType = 'ratio';
    const resolutionWidth = 16;
    const resolutionHeight = 9;
    const actual = isResolutionValid(
      image,
      resolutionType,
      resolutionWidth,
      resolutionHeight
    );
    return expect(actual).toBeFalsy();
  });
  it('should return true type less', () => {
    const image = { width: 150, height: 150 } as HTMLImageElement;
    const resolutionType = 'less';
    const resolutionWidth = 160;
    const resolutionHeight = 160;
    const actual = isResolutionValid(
      image,
      resolutionType,
      resolutionWidth,
      resolutionHeight
    );
    return expect(actual).toBeTruthy();
  });
  it('should return false type less', async () => {
    const image = { width: 150, height: 170 } as HTMLImageElement;
    const resolutionType = 'less';
    const resolutionWidth = 160;
    const resolutionHeight = 160;
    const actual = isResolutionValid(
      image,
      resolutionType,
      resolutionWidth,
      resolutionHeight
    );
    return expect(actual).toBeFalsy();
  });
  it('should return true type more', () => {
    const image = { width: 170, height: 170 } as HTMLImageElement;
    const resolutionType = 'more';
    const resolutionWidth = 160;
    const resolutionHeight = 160;
    const actual = isResolutionValid(
      image,
      resolutionType,
      resolutionWidth,
      resolutionHeight
    );
    return expect(actual).toBeTruthy();
  });
  it('should return false type more', async () => {
    const image = { width: 150, height: 170 } as HTMLImageElement;
    const resolutionType = 'more';
    const resolutionWidth = 160;
    const resolutionHeight = 160;
    const actual = isResolutionValid(
      image,
      resolutionType,
      resolutionWidth,
      resolutionHeight
    );
    return expect(actual).toBeFalsy();
  });
});
