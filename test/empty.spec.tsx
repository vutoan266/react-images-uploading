import * as React from 'react';
import { mount } from 'enzyme';
import { stub } from 'sinon';
import toJson from 'enzyme-to-json';
import { ImageListType } from '../src';
import { App } from './fixtures/app';

describe('testing empty case', () => {
  it('should render component', () => {
    const wrapper = mount(
      <App value={[] as ImageListType} onChange={stub()} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
