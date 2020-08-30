import * as React from 'react';
import { mount } from 'enzyme';
import { stub } from 'sinon';
import toJson from 'enzyme-to-json';
import { ImageListType } from '../src';
import { App } from './fixtures/app';

describe('testing uploading multiple files', () => {
  it('should render component', () => {
    const wrapper = mount(
      <App
        multiple
        maxNumber={5}
        value={[] as ImageListType}
        onChange={stub()}
        dataURLKey={'imgSrc'}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
