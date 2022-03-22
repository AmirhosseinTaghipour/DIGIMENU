import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IConfirmCodeFormValues, IResendCodeFormValues, IUserFormValues } from "../../app/models/user";
import { Form, Input, Button, Row, Card, Alert, Divider, Space } from "antd";
import { UserOutlined, BarcodeOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import "react-client-captcha/dist/index.css";
import LoginForm from "./LoginForm";
import ChangePassword from "./ChangePassword";
import { checkJustNumber } from "../../app/common/util/util";
import Captcha from "../common/Captcha/Captcha";
import { inherits } from "util";

interface IProps {
    userName: string;
    mobile: string;
}
const defaultProps: any = {
};

const InsertConfirmCode: React.FC<IProps> = ({ userName, mobile }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        confirmSMS,
        submitting,
        isChangePasswordMode,
        resendCode,
        resendingCode,
        getCaptchaImage
    } = rootStore.userStore;
    const [form] = Form.useForm();

    const [loginPage, setLoginPage] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false);
    const [sendButtonActive, setSendButtonActive] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(120);

    const onFinish = (values: IConfirmCodeFormValues) => {
        confirmSMS(values).then(success => {
            isChangePasswordMode ?
                setChangePassword(true) :
                window.location.replace("/")
        })
    };

    const onResendCode = () => {
        form.validateFields(["captchaText"]).then(() => {
            let values: IResendCodeFormValues = {
                mobile: mobile,
                userName: userName,
                isChangePasswordMode: isChangePasswordMode,
                captchaText: form.getFieldValue("captchaText"),
                token: null
            };
            resendCode(values)
                .then(success => {
                    setSendButtonActivation();
                })
                .finally(
                    () => getCaptchaImage()
                )
        })

    }

    const setSendButtonActivation = () => {
        setSendButtonActive(false);
        setCounter(120);
        setTimeout(() => setSendButtonActive(true), 125000);
    }

    useEffect(() => {
        var sendCodeInterval = setInterval(() => {
            if (counter > 0)
                setCounter(counter - 1)
            else
                clearInterval(sendCodeInterval);
        }, 1000);
        return () => {
            clearInterval(sendCodeInterval);
        };
    }, [counter]);

    useEffect(() => {
        setSendButtonActivation();
    }, []);

    if (loginPage) {
        return <LoginForm />;
    }
    if (changePassword) {
        return <ChangePassword />
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
                        {isChangePasswordMode ?
                            "بازیابی رمز عبور"
                            :
                            "فعال سازی"
                        }

                    </Divider>
                    <Form.Item
                        name="username"
                        initialValue={userName}
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
                            value={userName}
                            disabled={true}
                        />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: "لطفا کد پیامک شده به تلفن همراه خود را وارد کنید",
                            },
                        ]}
                    >
                        <Input
                            prefix={<BarcodeOutlined className="site-form-item-icon" />}
                            placeholder="کد پیامک شده"
                            maxLength={5}
                            onKeyDown={(e) => {
                                checkJustNumber(e);
                            }}
                            onPressEnter={() => form.submit()}
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
                        <Space size={6} className="spaceBtn" style={{ width: "100%" }}>
                            <Button
                                block
                                type="primary"
                                htmlType="submit"
                                className="bsBtn"
                                loading={submitting}
                            >{
                                    isChangePasswordMode ?
                                        "ثبت کد بازیابی" :
                                        "ورود"
                                }
                            </Button>
                            {sendButtonActive ?
                                <Button
                                    block
                                    type="primary"
                                    className="bsBtn"
                                    loading={resendingCode}
                                    onClick={() => {
                                        onResendCode()
                                    }}
                                >
                                    ارسال مجدد
                                </Button>
                                :
                                <Button
                                    block
                                    type="primary"
                                    disabled
                                    style={{
                                        backgroundColor: "#a9a9a9",
                                        borderColor: "#a9a9a9",
                                        color: "#3c3c3c"
                                    }}
                                >
                                    {`${counter} ثانیه دیگر`}
                                </Button>
                            }

                        </Space>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="link"
                            onClick={() => {
                                setLoginPage(true);
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
InsertConfirmCode.defaultProps = defaultProps;
export default observer(InsertConfirmCode);
