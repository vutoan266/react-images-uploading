import * as React from 'react';
import { getBase64, checkResolution } from './utils';
import {
  ImageType,
  ImageListType,
  ImageUploadingPropsType,
  ErrorsType,
  ResolutionType,
} from './typings';

const { useRef, useState, useCallback } = React;

const defaultErrors: ErrorsType = {
  maxFileSize: false,
  maxNumber: false,
  acceptType: false,
  resolution: false,
};
const defaultNullIndex = -1;

const ImageUploading: React.FC<ImageUploadingPropsType> = ({
  multiple = false,
  onChange,
  maxNumber = 1000,
  children,
  value = [],
  acceptType,
  maxFileSize,
  resolutionWidth,
  resolutionHeight,
  resolutionType,
  onError,
  dataURLKey = 'dataURL',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyUpdate, setKeyUpdate] = useState<number>(defaultNullIndex);
  const [errors, setErrors] = useState<ErrorsType>({ ...defaultErrors });
  const [isDragging, setIsDragging] = useState<Boolean>(false);

  const handleClickInput = useCallback((): void => {
    inputRef.current && inputRef.current.click();
  }, [inputRef]);

  const onImageUpload = useCallback((): void => {
    setKeyUpdate((prevKey) => {
      if (prevKey >= 0) {
        return defaultNullIndex;
      }
      return prevKey;
    });
    handleClickInput();
  }, [handleClickInput]);

  const onImageRemoveAll = useCallback((): void => {
    onChange && onChange([]);
  }, [onChange]);

  const onImageRemove = (index: number | Array<number>): void => {
    const updatedList = [...value];
    if (Array.isArray(index)) {
      index.forEach((i) => {
        updatedList.splice(i, 1);
      });
    } else {
      updatedList.splice(index, 1);
    }
    onChange && onChange(updatedList);
  };

  const onImageUpdate = (index: number): void => {
    setKeyUpdate(index);
    handleClickInput();
  };

  const getListFile = (files: FileList): Promise<ImageListType> => {
    const promiseFiles: Array<Promise<string>> = [];
    for (let i = 0; i < files.length; i++) {
      promiseFiles.push(getBase64(files[i]));
    }
    return Promise.all(promiseFiles).then((fileListBase64: Array<string>) => {
      const fileList: ImageListType = fileListBase64.map((base64, index) => ({
        [dataURLKey]: base64,
        file: files[index],
      }));
      return fileList;
    });
  };

  const validate = async (fileList: ImageListType): Promise<boolean> => {
    const newErrors = { ...defaultErrors };

    if (
      maxNumber &&
      keyUpdate === defaultNullIndex &&
      fileList.length + value.length > maxNumber
    ) {
      newErrors.maxNumber = true;
    } else {
      for (let i = 0; i < fileList.length; i++) {
        const { file, dataURL } = fileList[i];

        if (file) {
          const fileType: string = file.type;
          if (!fileType.includes('image')) {
            newErrors.acceptType = true;
            break;
          }
          if (maxFileSize) {
            if (file.size > maxFileSize) {
              newErrors.maxFileSize = true;
              break;
            }
          }
          if (acceptType && acceptType.length > 0) {
            const type: string = file.name.split('.').pop() || '';
            if (acceptType.indexOf(type) < 0) {
              newErrors.acceptType = true;
              break;
            }
          }
        }
        if (dataURL && resolutionType) {
          const checkRes = await checkResolution(
            dataURL,
            resolutionType,
            resolutionWidth,
            resolutionHeight
          );
          if (!checkRes) {
            newErrors.resolution = true;
            break;
          }
        }
      }
    }
    setErrors(newErrors);
    if (Object.values(newErrors).find(Boolean)) {
      onError && onError(newErrors, fileList);
      return false;
    }
    return true;
  };

  const handleChange = async (files: FileList | null) => {
    if (files) {
      const fileList = await getListFile(files);
      if (fileList.length > 0) {
        const checkValidate = await validate(fileList);
        if (checkValidate) {
          let updatedFileList: ImageListType;
          const addUpdateIndex: number[] = [];
          if (keyUpdate > defaultNullIndex) {
            updatedFileList = [...value];
            updatedFileList[keyUpdate] = fileList[0];
            addUpdateIndex.push(keyUpdate);
          } else {
            if (multiple) {
              updatedFileList = [...value, ...fileList];
              for (
                let i = value.length as number;
                i < updatedFileList.length;
                i++
              ) {
                addUpdateIndex.push(i);
              }
            } else {
              updatedFileList = [fileList[0]];
              addUpdateIndex.push(0);
            }
          }
          onChange && onChange(updatedFileList, addUpdateIndex);
        }
      }
    }
    keyUpdate > defaultNullIndex && setKeyUpdate(defaultNullIndex);
  };

  const onInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    await handleChange(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const acceptString =
    acceptType && acceptType.length > 0
      ? acceptType.map((item) => `.${item}`).join(', ')
      : 'image/*';

  const handleDrag = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <>
      <input
        type="file"
        accept={acceptString}
        ref={inputRef}
        multiple={multiple && keyUpdate === defaultNullIndex}
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
      {children &&
        children({
          imageList: value,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          errors,
          dragProps: {
            onDrop: handleDrop,
            onDragEnter: handleDragIn,
            onDragLeave: handleDragOut,
            onDragOver: handleDrag,
          },
          isDragging,
        })}
    </>
  );
};

export default ImageUploading;

export {
  ImageType,
  ImageListType,
  ImageUploadingPropsType,
  ErrorsType,
  ResolutionType,
};
