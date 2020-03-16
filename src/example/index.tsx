import * as React from "react";
import * as ReactDOM from "react-dom";
import ImageUploading, { ImageListType } from "../index";
import "./styles.css";

function Example() {
  const maxNumber = 69;
  const maxMbFileSize = 5;
  const onChange = (imageList: ImageListType) => {
    // data for submit
    console.log(imageList);
  };
  return (
    <div className="App">
      <ImageUploading
        onChange={onChange}
        maxNumber={maxNumber}
        multiple
        maxFileSize={maxMbFileSize}
        acceptType={["jpg", "gif", "png"]}
      >
        {({ imageList, onImageUpload, onImageRemoveAll }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button onClick={onImageUpload}>Upload images</button>&nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map(image => (
              <div key={image.key} className="image-item">
                <img src={image.dataURL} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={image.onUpdate}>Update</button>
                  <button onClick={image.onRemove}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Example />, rootElement);
