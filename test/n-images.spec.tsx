import * as React from 'react';
import { render } from '@testing-library/react';
import { ImageListType } from '../src';
import App from './fixtures/app';

describe('testing initial list of n images', () => {
  it('should render component', () => {
    const file = new File([''], 'image-1-name', { type: 'image/png' });

    const images: ImageListType = [
      {
        file,
        dataURL: 'image 1',
      },
    ];
    const { container } = render(<App value={images} />);
    expect(container).toMatchSnapshot();
  });
});
