export interface ImageType {
  dataURL?: string;
  file?: File;
}

export type ImageListType = Array<ImageType>;

export interface ImageUploadingPropsType {
  value: ImageListType;
  onChange: (value: ImageListType, addUpdatedIndex?: Array<number>) => void;
  children?: (props: ExportInterface) => React.ReactNode;
  multiple?: boolean;
  maxNumber?: number;
  acceptType?: Array<string>;
  maxFileSize?: number;
  resolutionWidth?: number;
  resolutionHeight?: number;
  resolutionType?: ResolutionType;
  onError?: (errors: ErrorsType, files?: ImageListType) => void;
  dataURLKey?: string;
}

export interface ExportInterface {
  imageList: ImageListType;
  onImageUpload: () => void;
  onImageRemoveAll: () => void;
  errors: Record<string, any>;
  onImageUpdate: (index: number) => void;
  onImageRemove: (index: number) => void;
  isDragging: Boolean;
  dragProps: {
    onDrop: (e: any) => void;
    onDragEnter: (e: any) => void;
    onDragLeave: (e: any) => void;
    onDragOver: (e: any) => void;
  };
}

export type ErrorsType = {
  maxFileSize: boolean;
  maxNumber: boolean;
  acceptType: boolean;
  resolution: boolean;
};

export type ResolutionType = "absolute" | "less" | "more" | "ratio";
