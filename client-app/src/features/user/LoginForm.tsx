import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ILoginFormValues } from "../../app/models/user";
import { Form, Input, Button, Row, Card, Alert, Divider, Space } from "antd";
import { UserOutlined, LockOutlined, BarcodeOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import Avatar from "antd/lib/avatar/avatar";
import { Redirect } from "react-router-dom";
import Captcha from "../../features/common/Captcha/Captcha";


const LoginForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { login, submitting, getCaptchaImage } = rootStore.userStore;
    const [form] = Form.useForm();

    const [activeForm, setactiveForm] = useState("login");


    const onFinish = async (values: ILoginFormValues) => {
        await login(values).catch(() => {
            getCaptchaImage();
            form.resetFields(["captchaText"]);
        })
    }

    switch (activeForm) {
        case "forgotpassword":
            return <Redirect to="/forgotpassword" />;
        case "register":
            return <Redirect to="/register" />;
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
                        ورود
                    </Divider>
                    <Form.Item
                        name="userName"
                        rules={[
                            { required: true, message: "لطفا نام کاربری خود را وارد کنید" },
                            {
                                pattern: new RegExp(
                                    "^[a-z|A-Z|0-9|@|#|$|%|^|&|*|)|(|+|=|.|_|-|!]+$"
                                ),
                                message: "تنها حروف لاتین، اعداد و کاراکترهای خاص مجاز می باشد",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="نام کاربری"
                            maxLength={25}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "لطفا رمز ورود را وارد نمایید" },
                            {
                                pattern: new RegExp(
                                    "^[a-z|A-Z|0-9|@|#|$|%|^|&|*|)|(|+|=|.|_|!]+$"
                                ),
                                message: "تنها حروف لاتین، اعداد و کاراکترهای خاص مجاز می باشد",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="رمز عبور"
                            maxLength={25}
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
                            ورود
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                                type="link"
                                onClick={() => {
                                    setactiveForm("register");
                                }}
                                className="bsLink"
                            >
                                ثبت نام
                            </Button>
                            <Button
                                type="link"
                                onClick={() => {
                                    setactiveForm("forgotpassword");
                                }}
                                className="bsLink"
                            >
                                بازیابی رمز عبور
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </Row>
    );
};

export default observer(LoginForm);

