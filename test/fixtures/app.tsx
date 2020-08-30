import * as React from 'react';
import ImageUploading, { ImageUploadingPropsType } from '../../src';

export const App = (props: ImageUploadingPropsType) => {
  return (
    <div id="app">
      <ImageUploading {...props}>
        {({
          imageList,
          errors,
          isDragging,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          dragProps,
        }) => {
          // onImageUpload = onImageUploadStub;
          return (
            // write your building UI
            <div className="upload__image-wrapper">
              {errors && errors.maxNumber && (
                <span>Number of selected images exceed maxNumber</span>
              )}

              <button
                id="btn-upload"
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>

              <button id="btn-remove" onClick={onImageRemoveAll}>
                Remove all images
              </button>

              <div id="list-images">
                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img id={`image_${index}`} src={image['data_url']} />
                    <div className="image-item__btn-wrapper">
                      <button
                        id={`update_${index}`}
                        onClick={() => onImageUpdate(index)}
                      >
                        Update
                      </button>
                      <button
                        id={`remove_${index}`}
                        onClick={() => onImageRemove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </ImageUploading>
    </div>
  );
};
