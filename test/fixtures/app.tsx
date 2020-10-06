import * as React from 'react';
import ImageUploading, { ImageListType } from '../../src';

export default (props: Props) => {
  const [images, setImages] = React.useState([]);

  const onChange = (imageList) => {
    setImages(imageList);
  };

  return (
    <div id="app">
      <ImageUploading value={images} onChange={onChange} {...props}>
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
          return (
            <div className="upload__image-wrapper">
              {errors && errors.maxNumber && (
                <span>Number of selected images exceed maxNumber</span>
              )}

              <button
                id="btn-upload"
                type="button"
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>

              <button id="btn-remove" type="button" onClick={onImageRemoveAll}>
                Remove all images
              </button>

              <div id="list-images">
                {imageList.map((image, index) => (
                  <div key={`image-${image.dataURL}`} className="image-item">
                    <img
                      id={`image_${index}`}
                      src={image.dataURL}
                      alt="preview"
                    />
                    <div className="image-item__btn-wrapper">
                      <button
                        id={`update_${index}`}
                        type="button"
                        onClick={() => onImageUpdate(index)}
                      >
                        {`Update ${index}`}
                      </button>
                      <button
                        id={`remove_${index}`}
                        type="button"
                        onClick={() => onImageRemove(index)}
                      >
                        {`Remove ${index}`}
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

type Props = {
  value?: ImageListType;
  multiple?: boolean;
};
