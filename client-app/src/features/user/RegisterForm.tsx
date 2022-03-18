import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IRegisterFormValues } from "../../app/models/user";
import { Form, Input, Button, Row, Card, Alert, Divider, Space } from "antd";
import { UserOutlined, LockOutlined, BarcodeOutlined, MobileOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import { Redirect } from "react-router-dom";
import Captcha from "../../features/common/Captcha/Captcha";
import ConfirmCodeForm from "./InsertConfirmCode";

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { register, submitting, getCaptchaImage } = rootStore.userStore;
    const [form] = Form.useForm();

    const [activeForm, setactiveForm] = useState<String>("register");

    const onFinish = async (values: IRegisterFormValues) => {
        await register(values).then(success => {
            setactiveForm("confirmCode");
        }, error => {
            setactiveForm("register")
        }).finally(() => {
            getCaptchaImage();
            form.resetFields(["captchaText"]);
        })
    }


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
                    {...layout}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}

                >
                    <Divider
                    className="bsDivider"   
                    >
                        ثبت نام
                    </Divider>
                    <Form.Item
                        name="name"
                        rules={[
                            { required: true, message: "لطفا نام و نام خانوادگی خود را وارد کنید" },
                            {
                                pattern: new RegExp(
                                    "^[\u0600-\u06FF\s]+$"
                                ),
                                message: "تنها حروف فارسی مجاز می باشد",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="نام و نام خانوادگی"
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
                        />
                    </Form.Item>
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
                        name="repreatedPassword"
                        rules={[
                            { required: true, message: "لطفا تکرار رمز ورود را وارد نمایید" },

                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="تکرار رمز عبور"
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
                            ثبت نام
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

export default observer(RegisterForm);
