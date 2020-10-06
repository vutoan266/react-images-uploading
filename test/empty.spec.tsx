import * as React from 'react';
import { render } from '@testing-library/react';
import { ImageListType } from '../src';
import App from './fixtures/app';

describe('testing empty case', () => {
  it('should render component', () => {
    const { container } = render(<App value={[] as ImageListType} />);
    expect(container).toMatchSnapshot();
  });
});
