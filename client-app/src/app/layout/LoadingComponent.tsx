import React from "react";
import { Spin } from "antd";

const LoadingComponent: React.FC<{
  content?: string;
  spinnerSize?: "small" | "default" | "large" | undefined;
}> = ({ content, spinnerSize }) => {
  return (
    <Spin
      tip={content}
      size={spinnerSize}
      className="bsLoading"
    > 
    </Spin>
  );
};

export default LoadingComponent;
