import React from "react";
import { Spin } from "antd";

const defaultProps : any = {
  content: "درحال بارگذاری...",
  spinnerSize: "large",
};
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
LoadingComponent.defaultProps=defaultProps;
export default LoadingComponent;
