import React, { Fragment, useEffect, useState } from "react";
import { Progress } from "antd";

interface IProps {
  isDescending: boolean;
  // startPercent: number | null;
  totalTimeSecond: number;
  reset: number;
  onFinish: () => void;
}

const ProgressCountdown: React.FC<IProps> = ({
  isDescending,
  // startPercent,
  totalTimeSecond,
  reset,
  onFinish,
}) => {
  const [counter, setCounter] = useState<number>(0);

  const runTimer = () => {
    setCounter((preCounter) => preCounter + 1);
  };

  useEffect(() => {
    setCounter(0);
  }, [reset]);

  useEffect(() => {
    const interval = setInterval(() => runTimer(), 1000);
    return () => clearInterval(interval);
  }, []);

  if (counter >= totalTimeSecond) {
    onFinish();
  }

  return (
    <Fragment>
      <Progress
        strokeColor={
          counter < totalTimeSecond * 0.7
            ? {
                from: "#3498db",
                to: "#2ecc71",
              }
            : {
                from: "#f39c12",
                to: "#c0392b",
              }
        }
        percent={
          isDescending
            ? 100 - Math.round((counter! / totalTimeSecond) * 100 * 100) / 100
            : Math.round((counter! / totalTimeSecond) * 100 * 100) / 100
        }
        status="active"
        size="small"
        trailColor="rgba(135, 208, 104, 0)"
        showInfo={false}
        style={{ height: "8px", overflowY: "hidden" }}
      />
    </Fragment>
  );
};

export default ProgressCountdown;
