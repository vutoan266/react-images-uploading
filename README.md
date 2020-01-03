# react-images-uploading

>

[![NPM](https://img.shields.io/npm/v/react-images-uploading.svg)](https://www.npmjs.com/package/react-images-uploading) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Images uploader

A simple images uploader without UI. Building by yourself.

## [#Demo](https://codesandbox.io/s/react-images-uploading-demo-u0khz)

## Install

```bash
npm install --save react-images-uploading
```

## Usage

```tsx
import * as React from "react";

import ImageUploading from "react-images-uploading";
// { ImageUploadingPropsType, ImageListType, ImageType } is type for typescript

const mode = "single";
const maxNumber = 10;
class Example extends React.Component {
  onChange = imageList => {
    // data for submit
  };

  render() {
    return (
      <ImageUploading mode={mode} onChange={onChange} maxNumber={maxNumber}>
        {({ imageList, onImageUpload, onImageRemoveAll }) => (
          // write your building UI
          <div>
            <button onClick={onImageUpload}>Upload images</button>
            <button onClick={onImageRemoveAll}>Remove all images</button>

            {imageList.map(image => (
              <div key={image.key}>
                <img src={image.dataURL} />
                <button onClick={image.onUpdate}>Update</button>
                <button onClick={image.onRemove}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    );
  }
}
```

## Props

| parameter    | type     | options                | default | description                                           |
| ------------ | -------- | ---------------------- | ------- | ----------------------------------------------------- |
| mode         | string   | single/multiple        | single  | Select just one or multiple images                    |
| maxNumber    | number   |                        | 100     | Number of images user can select if mode = "multiple" |
| onChange     | function |                        |         | Called every update                                   |
| defaultValue | array    | [{dataURL: ... }, ...] |         | Init data                                             |

## Exported options

| parameter                 | type     | description                                                               |
| ------------------------- | -------- | ------------------------------------------------------------------------- |
| imageList                 | array    | List of images for render. Each item in imageList has some options below. |
| imageList[index].key      | string   | Generate filename                                                         |
| imageList[index].dataURL  | string   | Url image or base64                                                       |
| imageList[index].onUpdate | function | Call function for replace a new image on current position                 |
| imageList[index].onRemove | function | Call function for remove current image                                    |
| onImageUpload             | function | Call for upload new image(s)                                              |
| onImageRemoveAll          | function | Call for remove all image(s)                                              |

## License

MIT © [](https://github.com/)
