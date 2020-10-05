import * as React from 'react';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './fixtures/app';
import * as Utils from '../src/utils';

describe('testing ReactImageUploading component', () => {
  let sandbox;
  let openDialog;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    openDialog = sandbox.stub(Utils, 'openFileDialog');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should open dialog', () => {
    const { getByText } = render(<App />);
    fireEvent.click(getByText(/Click or Drop here/));
    expect(openDialog.called).toBeTruthy();
  });

  it('should upload image & show image', async () => {
    const { getByAltText, getByText } = render(<App />);

    // 1. Open file dialog
    fireEvent.click(getByText(/Click or Drop here/));
    expect(openDialog.called).toBeTruthy();

    // 2. Mock file data
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const inputEl = document.querySelectorAll(
      '[type="file"]'
    )[0] as HTMLInputElement;

    Object.defineProperty(inputEl, 'files', { value: [file] });

    // 3. Change data of file dialog
    fireEvent.change(inputEl);

    // 4. Wait to re-render
    await waitFor(() => getByAltText('preview'));

    // 5. Compare the image url
    const dataURL = (getByAltText('preview') as HTMLImageElement).src;
    expect(dataURL).toMatchSnapshot('data:image/png;base64,KOKMkOKWoV/ilqEp');
  });

  it('should remove all images', async () => {
    const { queryByTestId, getByAltText, getByText } = render(<App />);

    // 1. Open file dialog
    fireEvent.click(getByText(/Click or Drop here/));
    expect(openDialog.called).toBeTruthy();

    // 2. Mock file data
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const inputEl = document.querySelectorAll(
      '[type="file"]'
    )[0] as HTMLInputElement;

    Object.defineProperty(inputEl, 'files', { value: [file] });

    // 3. Change data of file dialog
    fireEvent.change(inputEl);

    // 4. Wait to re-render
    await waitFor(() => getByAltText('preview'));

    fireEvent.click(getByText(/Remove all images/));
    expect(queryByTestId('image_0')).toBeNull();
  });

  it('should remove specific image', async () => {
    const { queryByTestId, getByAltText, getByText } = render(<App />);

    // 1. Open file dialog
    fireEvent.click(getByText(/Click or Drop here/));
    expect(openDialog.called).toBeTruthy();

    // 2. Mock file data
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const inputEl = document.querySelectorAll(
      '[type="file"]'
    )[0] as HTMLInputElement;

    Object.defineProperty(inputEl, 'files', { value: [file] });

    // 3. Change data of file dialog
    fireEvent.change(inputEl);

    // 4. Wait to re-render
    await waitFor(() => getByAltText('preview'));

    // 5. Remove first image
    fireEvent.click(getByText('Remove 0'));
    expect(queryByTestId('image_0')).toBeNull();
  });
});
