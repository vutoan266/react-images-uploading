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

interface UploadProps {
  children: (props: ExportInterface) => React.ReactNode;
  defaultValue?: ImageListType;
  onChange?: (value: ImageListType) => void;
  mode?: "single" | "multiple";
  maxNumber?: number;
}

interface ExportInterface {
  imageList: ImageListType;
  onImageUpload: () => void;
  onImageRemoveAll: () => void;
}

const ImageUploading: React.FC<UploadProps> = ({
  mode,
  onChange,
  maxNumber,
  children,
  defaultValue
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageList, setImageList] = useState(defaultValue || []);

  // the "id unique" of the image that need update by new image upload
  const [keyUpdate, setKeyUpdate] = useState("");

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

  const onInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const { files } = e.target;

    if (files) {
      const fileList = await getListFile(files);
      if (fileList.length > 0) {
        let updatedFileList: ImageListType;
        if (keyUpdate) {
          updatedFileList = imageList.map((item: ImageType) => {
            if (item.key === keyUpdate) return { ...fileList[0] };
            return item;
          });
          setKeyUpdate("");
        } else {
          if (mode === "multiple") {
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
        keyUpdate && setKeyUpdate("");
      }
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        multiple={mode === "multiple" && !keyUpdate}
        onChange={onInputChange}
        style={{ display: " none" }}
      />
      {children({ imageList: imageList, onImageUpload, onImageRemoveAll })}
    </>
  );
};

ImageUploading.defaultProps = {
  maxNumber: 100,
  mode: "single"
};

export default ImageUploading;
