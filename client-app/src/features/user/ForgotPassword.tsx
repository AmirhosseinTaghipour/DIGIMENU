import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IForgotPasswordFormValues } from "../../app/models/user";
import { Form, Input, Button, Row, Card, Divider, Space } from "antd";
import { UserOutlined, MobileOutlined, BarcodeOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import "react-client-captcha/dist/index.css";
import ConfirmCodeForm from "./InsertConfirmCode";
import { Redirect } from "react-router-dom";
import Captcha from "../../features/common/Captcha/Captcha";
import { checkJustNumber } from "../../app/common/util/util";

const ForgotPassword = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        forgotPassword,
        submitting,
        getCaptchaImage
    } = rootStore.userStore;
    const [form] = Form.useForm();

    const [activeForm, setactiveForm] = useState("forgotPassword");


    const onFinish = async (values: IForgotPasswordFormValues) => {
        await forgotPassword(values)
            .then(success => {
                setactiveForm("confirmCode")
            }, error => {
                setactiveForm("forgotPassword")
            }).finally(() => {
                getCaptchaImage();
                form.resetFields(["captchaText"]);
            });
    };


    switch (activeForm) {
        case "login":
            return <Redirect to="/login" />;
        case "confirmCode":
            return (<ConfirmCodeForm userName={form.getFieldValue("userName")} />);
        default: break;
    }

    return (
        <Row
            justify="center"
            align="middle"
            className="bsRow"
        >
            <Card
                title={
                    <Row>
                        <Meta className="bsCard"
                            avatar={<img src="../../assets/Images/bslogo.png" />}
                        />
                    </Row>
                }
                bordered={false}
            >
                <Form
                    form={form}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Divider
                        className="bsDivider" 
                    >
                        بازیابی رمز عبور
                    </Divider>
                    <Form.Item
                        name="userName"
                        rules={[
                            { required: true, message: "لطفا نام کاربری خود را وارد کنید" },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="نام کاربری"
                            maxLength={25}
                        />
                    </Form.Item>

                    <Form.Item
                        name="mobile"
                        rules={[
                            { required: true, message: "لطفا تلفن همراه خود را وارد کنید" },
                        ]}
                    >
                        <Input
                            prefix={<MobileOutlined className="site-form-item-icon" />}
                            placeholder="تلفن همراه"
                            maxLength={11}
                            onKeyDown={(e) => {
                                checkJustNumber(e);
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="captchaText"
                        rules={[
                            { required: true, message: "لطفا تصویر امنیتی را وارد کنید" },
                            {
                                pattern: new RegExp("^[a-zA-Z0-9!@#$%^&*)(+=._-]+$"),
                                message: "تنها حروف و اعداد لاتین مجاز است",
                            },
                        ]}
                    >
                        <Space size={6} align="start" >
                            <Input
                                prefix={<BarcodeOutlined />}
                                placeholder="تصویر امنیتی"
                                maxLength={4}
                                autoSave="off"
                                autoComplete="off"
                                onKeyDown={(e) => {
                                    checkJustNumber(e);
                                }}
                            />
                            <Captcha />
                        </Space>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            className="bsBtn"
                            loading={submitting}
                        >
                            بازیابی رمز عبور
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="link"
                            onClick={() => {
                                setactiveForm("login");
                            }}
                            className="bsLink"
                        >
                            بازگشت به صفحه ورود
                        </Button>
                    </Form.Item>
                </Form>

            </Card>
        </Row>
    );
};

export default observer(ForgotPassword);

