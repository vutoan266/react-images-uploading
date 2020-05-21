# react-images-uploading

>

[![NPM](https://img.shields.io/npm/v/react-images-uploading.svg)](https://www.npmjs.com/package/react-images-uploading) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Images uploader

A simple images uploader without UI. Building by yourself.

## [#Demo](https://codesandbox.io/s/react-images-uploading-demo-u0khz)

## [Introduce blog](https://medium.com/@imvutoan/make-image-upload-in-react-easier-with-react-images-uploading-and-your-ui-983fed029ee2)

## Install

With npm

```bash
npm install --save react-images-uploading
```

With yarn

```bash
yarn add react-images-uploading
```

## Usage

```tsx
import * as React from "react";

import ImageUploading from "react-images-uploading";
// { ImageUploadingPropsType, ImageListType, ImageType } is type for typescript

const maxNumber = 10;
const maxMbFileSize = 5 * 1024 * 1024; // 5Mb

class Example extends React.Component {
  onChange = (imageList) => {
    // data for submit
    console.log(imageList);
  };

  render() {
    return (
      <ImageUploading
        onChange={this.onChange}
        maxNumber={maxNumber}
        multiple
        maxFileSize={maxMbFileSize}
        acceptType={["jpg", "gif", "png"]}
      >
        {({ imageList, onImageUpload, onImageRemoveAll }) => (
          // write your building UI
          <div>
            <button onClick={onImageUpload}>Upload images</button>
            <button onClick={onImageRemoveAll}>Remove all images</button>

            {imageList.map((image) => (
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

### Validate

```
...
  {({ imageList, onImageUpload, onImageRemoveAll, errors }) => (
    <div>
      {errors.maxNumber && <span>Number of selected images exceed maxNumber</span>}
      {errors.acceptType && <span>Your selected file type is not allow</span>}
      {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>}
      {errors.resolution && <span>Selected file is not match your desired resolution</span>}
    </div>
  )}
...
```

### Resolution

- "absolute": resolutionWidth and resolutionHeight is equal with selected image absolutely
- "ratio": resolutionWidth/resolutionHeight ratio is equal with width/height ratio of selected image
- "less: image width must less than resolutionWidth and image height must less than resolutionHeight
- "more: image width must more than resolutionWidth and image height must more than resolutionHeight

## Props

| parameter        | type     | options                                   | default | description                                                                    |
| ---------------- | -------- | ----------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| multiple         | boolean  |                                           | false   | Set true for multiple choose                                                   |
| maxNumber        | number   |                                           | 1000    | Number of images user can select if mode = "multiple"                          |
| onChange         | function |                                           |         | Called every update                                                            |
| defaultValue     | array    | \[\{dataURL: \.\.\. \}, \.\.\.\]          |         | Init data                                                                      |
| acceptType       | array    | \['jpg', 'gif', 'png'\]                   | \[\]    | Supported image extension                                                      |
| maxFileSize      | number   |                                           |         | Max image size\(Byte\) \(will use in the image validation\)                    |
| resolutionType   | string   | "absolute" \| "less" \| "more" \| "ratio" |         | Using for validate image with your width \- height resolution that you provide |
| resolutionWidth  | number   | > 0                                       |         |                                                                                |
| resolutionHeight | number   | > 0                                       |         |                                                                                |

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
| errors                    | object   | Export type of validation                                                 |

## License

MIT © [](https://github.com/)
