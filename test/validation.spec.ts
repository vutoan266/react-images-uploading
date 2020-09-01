import { isImageValid, isMaxFileSizeValid } from '../src/validation';

describe('testing isImageValid', () => {
  it('should return true', () => {
    const actual = isImageValid('image/png');
    expect(actual).toBeTruthy();
  });

  it('should return true', () => {
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
