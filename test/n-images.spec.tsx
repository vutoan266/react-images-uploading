import * as React from 'react';
import { mount } from 'enzyme';
import { stub } from 'sinon';
import toJson from 'enzyme-to-json';
import { ImageListType } from '../src';
import { App } from './fixtures/app';

describe('testing initial list of n images', () => {
  it('should render component', () => {
    var file = new File([''], 'image-1-name', { type: 'image/png' });

    const images: ImageListType = [
      {
        file,
        dataURL: 'image 1',
      },
    ];
    const wrapper = mount(<App value={images} onChange={stub()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
