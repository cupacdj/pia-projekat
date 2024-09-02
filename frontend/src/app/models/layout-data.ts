export interface LayoutObject {
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
}

export interface LayoutData {
  objects: LayoutObject[];
}
