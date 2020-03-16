import * as React from "react";
import { getBase64 } from "./utils";

const { useRef, useState, useEffect } = React;
export interface ImageType {
  dataURL: string;
  file?: File;
  key?: string;
  onUpdate?: () => void;
  onRemove?: () => void;
}

export type ImageListType = Array<ImageType>;

export interface ImageUploadingPropsType {
  children?: (props: ExportInterface) => React.ReactNode;
  defaultValue?: ImageListType;
  onChange?: (value: ImageListType) => void;
  multiple?: boolean;
  maxNumber?: number;
  acceptType?: Array<string>;
  maxFileSize?: number;
}

export interface ExportInterface {
  imageList: ImageListType;
  onImageUpload: () => void;
  onImageRemoveAll: () => void;
  errors: Record<string, any>;
}

const defaultErrors = {
  maxFileSize: false
};

const ImageUploading: React.FC<ImageUploadingPropsType> = ({
  multiple,
  onChange,
  maxNumber,
  children,
  defaultValue,
  acceptType,
  maxFileSize
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageList, setImageList] = useState(() => {
    let initImageList: Array<ImageType> = [];
    if (defaultValue) {
      initImageList = defaultValue.map((item: ImageType) => ({
        ...item,
        key: item.dataURL,
        onUpdate: (): void => onImageUpdate(item.dataURL),
        onRemove: (): void => onImageRemove(item.dataURL)
      }));
    }
    return initImageList;
  });

  // the "id unique" of the image that need update by new image upload
  const [keyUpdate, setKeyUpdate] = useState("");

  const [errors, setErrors] = useState({ ...defaultErrors });

  // for getting the latest imageList state
  const imageListRef = useRef(imageList);
  useEffect(() => {
    imageListRef.current = imageList;
  }, [imageList]);

  // export only fields that needed for user
  const onStandardizeDataChange = (list: ImageListType): void => {
    if (onChange) {
      const sData: ImageListType = list.map(item => ({
        file: item.file,
        dataURL: item.dataURL
      }));
      onChange(sData);
    }
  };

  // trigger input click
  const onImageUpload = (): void => {
    inputRef.current && inputRef.current.click();
  };

  // exported function
  const onImageRemoveAll = (): void => {
    setImageList([]);
    onStandardizeDataChange([]);
  };

  const onImageRemove = (key: string): void => {
    const updatedList: ImageListType = imageListRef.current.filter(
      (item: ImageType) => item.key !== key
    );
    setImageList(updatedList);
    onStandardizeDataChange(updatedList);
  };

  useEffect(() => {
    if (keyUpdate) {
      onImageUpload();
    }
  }, [keyUpdate]);

  const onImageUpdate = (key: string): void => {
    setKeyUpdate(key);
  };

  // read files and add some needed properties, func for update/remove actions
  const getListFile = (files: FileList): Promise<ImageListType> => {
    const promiseFiles: Array<Promise<string>> = [];

    for (let i = 0; i < files.length; i++) {
      promiseFiles.push(getBase64(files[i]));
    }

    return Promise.all(promiseFiles).then((fileListBase64: Array<string>) => {
      const fileList: ImageListType = fileListBase64.map((base64, index) => {
        const key = `${new Date().getTime().toString()}-${files[index].name}`;
        return {
          dataURL: base64,
          file: files[index],
          key,
          onUpdate: (): void => onImageUpdate(key),
          onRemove: (): void => onImageRemove(key)
        };
      });
      return fileList;
    });
  };

  const validate = (fileList: ImageListType): boolean => {
    setErrors({ ...defaultErrors });
    if (maxFileSize) {
      for (let i = 0; i < fileList.length; i++) {
        // check size
        const file = fileList[i].file;
        if (file) {
          const size = Math.round(file.size / 1024 / 1024);
          if (maxFileSize && size > maxFileSize) {
            setErrors({ ...errors, maxFileSize: true });
            return false;
          }
        }
      }
    }
    return true;
  };

  const onInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const { files } = e.target;

    if (files) {
      const fileList = await getListFile(files);
      if (fileList.length > 0) {
        if (validate(fileList)) {
          let updatedFileList: ImageListType;
          if (keyUpdate) {
            updatedFileList = imageList.map((item: ImageType) => {
              if (item.key === keyUpdate) return { ...fileList[0] };
              return item;
            });
            setKeyUpdate("");
          } else {
            if (multiple) {
              updatedFileList = [...imageList, ...fileList];
              if (maxNumber && updatedFileList.length > maxNumber) {
                updatedFileList = imageList;
              }
            } else {
              updatedFileList = [fileList[0]];
            }
          }
          setImageList(updatedFileList);
          onStandardizeDataChange(updatedFileList);
        } else {
        }
      } else {
        keyUpdate && setKeyUpdate("");
      }
    }
  };

  const acceptString =
    acceptType && acceptType.length > 0
      ? acceptType
          .reduce((acceptStr, item) => acceptStr.concat(`, image/${item}`), "")
          .slice(2)
      : "image/*";

  return (
    <>
      <input
        type="file"
        accept={acceptString}
        ref={inputRef}
        multiple={multiple && !keyUpdate}
        onChange={onInputChange}
        style={{ display: "none" }}
      />
      {children &&
        children({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          errors
        })}
    </>
  );
};

ImageUploading.defaultProps = {
  maxNumber: 1000,
  multiple: false,
  acceptType: []
};

export default ImageUploading;
