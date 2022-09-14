import React from 'react';

export interface ICanvasProps {
  id: string;
  imgData: ImageData;
  width?: number;
  height?: number;
}

export const Canvas: React.FC<ICanvasProps> = ({ id, imgData, ...props }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null
  );

  React.useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext('2d');

      if (renderCtx) {
        if (imgData !== undefined) {
          renderCtx.putImageData(imgData, 0, 0);
        }
        setContext(renderCtx);
      }
    }
  }, [context, imgData]);

  return (
    <canvas
      id={id}
      ref={canvasRef}
      width={props.width || imgData.width}
      height={props.height || imgData.height}
    ></canvas>
  );
};
