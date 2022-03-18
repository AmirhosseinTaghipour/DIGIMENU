import React from "react";
import { Result, Button } from "antd";

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="متاسفانه چنین صفحه ای وجود ندارد"
      extra={
        <Button type="primary" href="/">
          صفحه نخست
        </Button>
      }
      style={{ direction: "rtl" }}
    />
  );
};

export default NotFound;
