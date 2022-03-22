import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IChangePasswordFormValues, IUserFormValues } from "../../app/models/user";
import { Form, Input, Button, Row, Card, Alert, Divider, Space } from "antd";
import { BarcodeOutlined, LockOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import Avatar from "antd/lib/avatar/avatar";
import { AxiosResponse } from "axios";
import { checkJustNumber } from "../../app/common/util/util";
import Captcha from "../common/Captcha/Captcha";

const ChangePassword = () => {
    const rootStore = useContext(RootStoreContext);
    const { changePassword, submitting } = rootStore.userStore;
    const [form] = Form.useForm();
    const [notEqual, setNotEqual] = useState(false);

    const onFinish = (values: IChangePasswordFormValues) => {
        if (values.password === values.repeatedPassword) {
            changePassword(values)
                .catch((err: AxiosResponse) => {
                    form.resetFields(["password", "repeatedPassword"]);
                });
        } else {
            setNotEqual(true);
        }
    };

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
                        تغییر رمز عبور
                    </Divider>
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
                            minLength={6}
                        />
                    </Form.Item>
                    <Form.Item
                        name="repeatedPassword"
                        rules={[
                            { required: true, message: "لطفا تکرار رمز ورود را وارد نمایید" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="تکرار رمز عبور"
                            maxLength={25}
                            onPressEnter={() => form.submit()}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            className="bsBtn"
                            loading={submitting}
                        >
                            ثبت رمز عبور جدید
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

export default observer(ChangePassword);
