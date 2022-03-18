import React, { Fragment, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import {
    Button,
    Image,
    Input,
    Space,
    Tooltip,
} from "antd";

import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { BsArrowRepeat } from "react-icons/bs";
import { BarcodeOutlined } from "@ant-design/icons";



const Captcha: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        captchaImage,
        loadingCaptchaImage,
        getCaptchaImage,
    } = rootStore.userStore;

    useEffect(() => {
        getCaptchaImage()
    }, []);

    return (
        <Space size={6} align="start" >
            <Image
                width={116}
                height={34}
                src={`data:image/jpeg;base64,${captchaImage && captchaImage!.image}`}
                style={{ borderRadius: "4px", overflow: "hidden" }}
            />
            <Tooltip title="تغییر تصویر امنیتی">
                <Button
                    type="default"
                    shape="circle"
                    loading={loadingCaptchaImage}
                    className="bsBtnIcon"      
                    onClick={() => {
                        getCaptchaImage();
                    }}
                    icon={<BsArrowRepeat style={{ fontSize: "1.4rem", marginTop: "0.15rem" }} />}
                />
            </Tooltip>
        </Space>
    );
};

export default observer(Captcha);
