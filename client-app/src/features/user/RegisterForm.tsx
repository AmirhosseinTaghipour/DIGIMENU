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
import { checkJustNumber } from "../../app/common/util/util";

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { register, submitting, getCaptchaImage } = rootStore.userStore;
    const [form] = Form.useForm();

    const [activeForm, setactiveForm] = useState<String>("register");
    const [notEqual, setNotEqual] = useState(false);


    const onFinish = async (values: IRegisterFormValues) => {
        if (values.password === values.repreatedPassword) {
            await register(values).then(success => {
                setactiveForm("confirmCode");
            }, error => {
                setactiveForm("register")
            }).finally(() => {
                getCaptchaImage();
                form.resetFields(["captchaText"]);
            })
        }
        else
            setNotEqual(true);
    }


    switch (activeForm) {
        case "login":
            return <Redirect to="/login" />;
        case "confirmCode":
            return (<ConfirmCodeForm userName={form.getFieldValue("userName")} mobile={form.getFieldValue("mobile")} />);
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
                                    "^[\u0600-\u06FF\s ]+$"
                                ),
                                message: "تنها حروف فارسی مجاز می باشد",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="نام و نام خانوادگی"
                            maxLength={100}
                        />
                    </Form.Item>
                    <Form.Item
                        name="mobile"
                        rules={[
                            { required: true, message: "لطفا تلفن همراه خود را وارد کنید" },
                            {
                                min: 11,
                                message: "شماره تلفن همراه باید 11 رقم باشد",
                            },
                            {
                                required: true,
                                message: "لطفا شماره موبایل را با پیش شماره 09 وارد نمایید",
                                validator: async (rule: any, value: any) => {
                                    if (!!form.getFieldValue('mobile') && form.getFieldValue('mobile').length == 11)
                                        if (form.getFieldValue('mobile').substr(0, 2) != "09") {
                                            throw new Error("Something wrong!");
                                        }
                                },
                            },
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
                                min: 6,
                                message: "رمز نباید کمتر از ۶ حرف باشد",

                            },
                            {
                                pattern: new RegExp("^[a-zA-Z0-9!@#$%^&*)(+=._-]+$"),
                                message: "تنها کاراکترهای لاتین برای پسورد مجاز است",
                            },
                            {
                                required: true,
                                message: "پسورد باید شامل حروف بزرگ باشد",
                                validator: async (rule: any, value: any) => {
                                    if (!!form.getFieldValue('password') && form.getFieldValue('password').length >= 6)
                                        if (!/[A-Z]/.test(form.getFieldValue('password'))) {
                                            throw new Error("Something wrong!");
                                        }
                                },
                            },
                            {
                                required: true,
                                message: "پسورد باید شامل حروف کوچک باشد",
                                validator: async (rule: any, value: any) => {
                                    if (!!form.getFieldValue('password') && form.getFieldValue('password').length >= 6)
                                        if (!/[a-z]/.test(form.getFieldValue('password'))) {
                                            throw new Error("Something wrong!");
                                        }
                                },
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
                {notEqual && (
                    <Alert
                        message="خطا"
                        description="رمز و تکرار رمز یکسان نیستند."
                        type="error"
                        closable
                        onClose={() => setNotEqual(false)}
                    />
                )}
            </Card>
        </Row>
    );
};

export default observer(RegisterForm);
