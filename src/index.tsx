import * as React from 'react';
import { triggerOpenDialog, getListFile, getAcceptString } from './utils';
import {
  isResolutionValid,
  isImageValid,
  maxFileSizeValid,
  acceptTypeValid,
  maxNumberValid,
} from './validate';
import {
  ImageType,
  ImageListType,
  ImageUploadingPropsType,
  ErrorsType,
  ResolutionType,
} from './typings';
import {
  DEFAULT_NULL_INDEX,
  INIT_ERROR,
  INIT_MAX_NUMBER,
  DEFAULT_DATA_URL_KEY,
} from './constants';

const { useRef, useState, useCallback, useMemo } = React;

const ReactImageUploading: React.FC<ImageUploadingPropsType> = ({
  value = [],
  onChange,
  onError,
  children,
  dataURLKey = DEFAULT_DATA_URL_KEY,
  multiple = false,
  maxNumber = INIT_MAX_NUMBER,
  acceptType,
  maxFileSize,
  resolutionWidth,
  resolutionHeight,
  resolutionType,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyUpdate, setKeyUpdate] = useState<number>(DEFAULT_NULL_INDEX);
  const [errors, setErrors] = useState<ErrorsType>(null);
  const [isDragging, setIsDragging] = useState<Boolean>(false);

  const handleClickInput = useCallback(() => triggerOpenDialog(inputRef), [
    inputRef,
  ]);

  const onImageUpload = useCallback((): void => {
    setKeyUpdate(DEFAULT_NULL_INDEX);
    handleClickInput();
  }, [handleClickInput]);

  const onImageRemoveAll = useCallback((): void => {
    if (onChange) onChange([]);
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
    if (onChange) onChange(updatedList);
  };

  const onImageUpdate = (index: number): void => {
    setKeyUpdate(index);
    handleClickInput();
  };

  const validate = async (fileList: ImageListType): Promise<boolean> => {
    const newErrors = { ...INIT_ERROR };
    if (!maxNumberValid(fileList.length + value.length, maxNumber, keyUpdate)) {
      newErrors.maxNumber = true;
    } else {
      for (let i = 0; i < fileList.length; i++) {
        const { file, [dataURLKey]: dataURL } = fileList[i];
        if (file) {
          if (!isImageValid(file.type)) {
            newErrors.acceptType = true;
            break;
          }
          if (!acceptTypeValid(acceptType, file.name)) {
            newErrors.acceptType = true;
            break;
          }
          if (!maxFileSizeValid(file.size, maxFileSize)) {
            newErrors.maxFileSize = true;
            break;
          }
        }
        if (dataURL && resolutionType) {
          const checkRes = await isResolutionValid(
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
    if (Object.values(newErrors).find(Boolean)) {
      setErrors(newErrors);
      if (onError) onError(newErrors, fileList);
      return false;
    }
    if (errors) setErrors(null);
    return true;
  };

  const handleChange = async (files: FileList | null) => {
    if (!files) return;
    const fileList = await getListFile(files, dataURLKey);
    if (!(fileList.length > 0)) return;
    const checkValidate = await validate(fileList);
    if (!checkValidate) return;
    let updatedFileList: ImageListType;
    const addUpdateIndex: number[] = [];
    if (keyUpdate > DEFAULT_NULL_INDEX) {
      updatedFileList = [...value];
      updatedFileList[keyUpdate] = fileList[0];
      addUpdateIndex.push(keyUpdate);
    } else {
      if (multiple) {
        updatedFileList = [...value, ...fileList];
        for (let i = value.length as number; i < updatedFileList.length; i++) {
          addUpdateIndex.push(i);
        }
      } else {
        updatedFileList = [fileList[0]];
        addUpdateIndex.push(0);
      }
    }
    if (onChange) onChange(updatedFileList, addUpdateIndex);
  };

  const onInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    await handleChange(e.target.files);
    if (keyUpdate > DEFAULT_NULL_INDEX) setKeyUpdate(DEFAULT_NULL_INDEX);
    if (inputRef.current) inputRef.current.value = '';
  };

  const acceptString = useMemo(() => getAcceptString(acceptType), [acceptType]);

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
        multiple={multiple && keyUpdate === DEFAULT_NULL_INDEX}
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

export default ReactImageUploading;

export {
  ImageType,
  ImageListType,
  ImageUploadingPropsType,
  ErrorsType,
  ResolutionType,
};
