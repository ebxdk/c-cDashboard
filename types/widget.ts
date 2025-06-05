export interface WidgetData {
  id: string;
  type: 'small' | 'medium' | 'large';
  availableSizes: ('small' | 'medium' | 'large')[];
}

export interface WidgetPosition {
  id: string;
  gridX: number;
  gridY: number;
  size: 'small' | 'medium' | 'large';
  width: number; // Grid cells wide
  height: number; // Grid cells tall
}

export interface DraggableWidgetProps {
  children: React.ReactNode;
  widgetId: string;
  onPositionChange: (id: string, x: number, y: number) => void;
  onResize: (id: string, size: 'small' | 'medium' | 'large') => void;
  onLiveRearrange?: (id: string, x: number, y: number) => void;
}

export interface GridUtilsProps {
  widgetPositions: WidgetPosition[];
}

export type WidgetSize = 'small' | 'medium' | 'large'; 