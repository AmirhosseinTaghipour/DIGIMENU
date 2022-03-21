import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IConfirmCodeFormValues, IUserFormValues } from "../../app/models/user";
import { Form, Input, Button, Row, Card, Alert, Divider, Space } from "antd";
import { UserOutlined, BarcodeOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import { AxiosResponse } from "axios";
import "react-client-captcha/dist/index.css";
import LoginForm from "./LoginForm";
import ChangePassword from "./ChangePassword";
import { Redirect } from "react-router-dom";
import { checkJustNumber } from "../../app/common/util/util";
import Captcha from "../common/Captcha/Captcha";

interface IProps {
    userName: string;
}
const defaultProps: any = {
};

const InsertConfirmCode: React.FC<IProps> = ({ userName }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        confirmSMS,
        submitting,
        isChangePasswordMode
    } = rootStore.userStore;
    const [form] = Form.useForm();

    const [loginPage, setLoginPage] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const onFinish = (values: IConfirmCodeFormValues) => {
        confirmSMS(values).then(success => {
            isChangePasswordMode ?
                setChangePassword(true) :
                window.location.replace("/")
        })
    };

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
            style={{
                backgroundColor: "rgb(240, 242, 245)",
                minHeight: "100vh",
            }}
        >
            <Card
                title={
                    <Row>
                        <Meta
                            title={
                                <h2 style={{ marginTop: "5px" }}>دیجی منو</h2>
                            }
                            description={
                                <p style={{ marginTop: "-8px", textAlign: "center" }}>
                                    منو دیجیتال رستوران، کافی شاپ و ...
                                </p>
                            }
                        />
                    </Row>
                }
                bordered={false}
                style={{
                    borderTop: "2px solid #fa983a",
                    borderRadius: "5px",
                    boxShadow: "0 5px 5px -7px rgba(0,0,0,0.9)",
                    minWidth: 320,
                    width: "20vw",
                    maxWidth: 400,
                }}
            >
                <Form
                    form={form}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Divider
                        style={{
                            fontSize: ".9rem",
                            marginTop: "-1rem",
                            color: "rgba(0,0,0,.4)",
                        }}
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
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            style={{ background: "#13c2c2" }}
                            loading={submitting}
                        >
                            ورود
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="link"
                            onClick={() => {
                                setLoginPage(true);
                            }}
                            style={{ fontSize: "0.8rem" }}
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
