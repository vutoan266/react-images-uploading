# react-images-uploading

>

[![NPM](https://img.shields.io/npm/v/react-images-uploading.svg)](https://www.npmjs.com/package/react-images-uploading) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Images uploader

A simple images uploader without UI. Building by yourself.

## [#Demo](https://codesandbox.io/s/react-images-uploading-demo-u0khz)

## [Introduce blog](https://medium.com/@imvutoan/make-image-upload-in-react-easier-with-react-images-uploading-and-your-ui-983fed029ee2)

## Docs for old version 2.x.x

There are some breaking changes from version 3, so if you are using the old version, please follow [this](https://github.com/vutoan266/react-images-uploading/tree/backup_v2x)

## Install

With npm

```bash
npm install --save react-images-uploading
```

With yarn

```bash
yarn add react-images-uploading
```

## Basic Usage

```tsx
import * as React from "react";

import ImageUploading from "react-images-uploading";
// { ImageUploadingPropsType, ImageListType, ImageType } is type for typescript

const maxNumber = 10;
const maxMbFileSize = 5 * 1024 * 1024; // 5Mb

class Example extends React.Component {
  const [images, setImages] = useState([]);

  onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);
    console.log('index of new chosen images: ', addUpdateIndex)
  };
  onError = (errors, files) => {
    console.log(errors, files);
  };

  render() {
    return (
      <ImageUploading
        value={images}
        onChange={this.onChange}
        maxNumber={maxNumber}
        multiple
        maxFileSize={maxMbFileSize}
        acceptType={["jpg", "gif", "png"]}
        onError={this.onError}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove }) => (
          // write your building UI
          <div>
            <button onClick={onImageUpload}>Upload images</button>
            <button onClick={onImageRemoveAll}>Remove all images</button>

            {imageList.map((image, index) => (
              <div key={index}>
                <img src={image.data_url} />
                <button onClick={() => onImageUpdate(index)}>Update</button>
                <button onClick={() => onImageRemove(index)}>Remove</button>
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

### Drag and Drop

There are two props for this feature is `dragProps` and `isDragging`.
Usage is very simple. Follow this:

```tsx
<ImageUploading value={images} onChange={this.onChange} dataURLKey="data_url">
  {({ imageList, dragProps, isDragging }) => (
    // write your building UI
    <div {...dragProps}>
      {isDragging ? "Drop here please" : "Upload space"}
      {imageList.map((image, index) => (
        <img key={index} src={image.data_url} />
      ))}
    </div>
  )}
</ImageUploading>
```

## Props

| parameter        | type     | options                                   | default   | description                                                                      |
| ---------------- | -------- | ----------------------------------------- | --------- | -------------------------------------------------------------------------------- |
| value            | array    |                                           | \[\]      | Array of image list                                                              |
| onChange         | function | \(imageList, addUpdateindex\) => void     |           | Called every add, update or delete action                                        |
| dataURLKey       | string   |                                           | "dataURL" | Field name that base64 of selected image is assign to                            |
| multiple         | boolean  |                                           | false     | Set true for multiple choose                                                     |
| maxNumber        | number   |                                           | 1000      | Number of images user can select if mode = "multiple"                            |
| onError          | function | \(errors, files\) => void                 |           | Called if have error on validate each update                                     |
| acceptType       | array    | \['jpg', 'gif', 'png'\]                   | \[\]      | Supported image extension                                                        |
| maxFileSize      | number   |                                           |           | Max image size\(Byte\) \(will use in the image validation\)                      |
| resolutionType   | string   | "absolute" \| "less" \| "more" \| "ratio" |           | Using for validate image with your width \\\- height resolution that you provide |
| resolutionWidth  | number   | > 0                                       |           |                                                                                  |
| resolutionHeight | number   | > 0                                       |           |                                                                                  |

## Exported options

| parameter        | type                                             | description                                           |
| ---------------- | ------------------------------------------------ | ----------------------------------------------------- |
| imageList        | array                                            | List of images for render\.                           |
| onImageUpload    | function                                         | Call for upload new image\(s\)                        |
| onImageRemoveAll | function                                         | Call for remove all image\(s\)                        |
| onImageUpdate    | \(updateIndex: number\) => void                  | Call for update at updateIndex\.                      |
| onImageRemove    | \(deleteIndex: number \| Array<number>\) => void | Call for remove one/list image\.                      |
| errors           | object                                           | Export list of validation                             |
| dragProps        | object                                           | Native element props for drag and drop feature        |
| isDragging       | boolean                                          | "true" if image\(s\) is dragged into drag and space\. |

## License

MIT © [](https://github.com/)
