import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";
import { Form, Input, Button, Row, Card, Alert, Divider } from "antd";
import { UserOutlined, BarcodeOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import Avatar from "antd/lib/avatar/avatar";
import { AxiosResponse } from "axios";
import "react-client-captcha/dist/index.css";
import LoginForm from "./LoginForm";
import ChangePassword from "./ChangePassword";

interface IProps {
    userName : string;
}

const InsertConfirmCode : React.FC<IProps> = ( { userName } ) => {
    const rootStore = useContext( RootStoreContext );
    const {
        confirmSMS,
        submitting,
        forgotPasswordResponse,
    } = rootStore.userStore;
    const [ form ] = Form.useForm();

    const [ confirm, setConfirm ] = useState( false );

    const [ error, setError ] = useState<AxiosResponse>();

    const [ loginPage, setLoginPage ] = useState( false );

    const onFinish = ( values : IUserFormValues ) => {
        confirmSMS( values )
            .then( () => {
                setConfirm( true );
            } )
            .catch( ( er : any ) => {
                setError( er.response );
            } );
    };

    if ( confirm ) {
        return <ChangePassword />
    }
    if ( loginPage ) {
        return <LoginForm />;
    }
    return (
        <Row
            justify="center"
            align="middle"
            style={ {
                backgroundColor: "rgb(240, 242, 245)",
                minHeight: "100vh",
            } }
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
                bordered={ false }
                style={ {
                    borderTop: "2px solid #fa983a",
                    borderRadius: "5px",
                    boxShadow: "0 5px 5px -7px rgba(0,0,0,0.9)",
                    minWidth: 320,
                    width: "20vw",
                    maxWidth: 400,
                } }
            >
                <Form
                    form={ form }
                    name="normal_login"
                    className="login-form"
                    initialValues={ { remember: true } }
                    onFinish={ onFinish }
                >
                    <Divider
                        style={ {
                            fontSize: ".9rem",
                            marginTop: "-1rem",
                            color: "rgba(0,0,0,.4)",
                        } }
                    >
                        بازیابی رمز عبور
          </Divider>
                    <Form.Item
                        name="username"
                        initialValue={ userName }
                        rules={ [
                            { required: true, message: "لطفا نام کاربری خود را وارد کنید" },
                        ] }
                    >
                        <Input
                            prefix={ <UserOutlined className="site-form-item-icon" /> }
                            placeholder="نام کاربری"
                            maxLength={ 25 }
                            value={ userName }
                            disabled={ true }
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmCode"
                        rules={ [
                            {
                                required: true,
                                message: "لطفا کد پیامک شده به تلفن همراه خود را وارد کنید",
                            },
                        ] }
                    >
                        <Input
                            prefix={ <BarcodeOutlined className="site-form-item-icon" /> }
                            placeholder="کد پیامک شده"
                            maxLength={ 10 }
                            onChange={ () => {
                                setError( undefined );
                            } }
                            onPressEnter={ () => form.submit() }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            style={ { background: "#13c2c2" } }
                            loading={ submitting }
                        >
                            ورود
            </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="link"
                            onClick={ () => {
                                setLoginPage( true );
                            } }
                            style={ { fontSize: "0.8rem" } }
                        >
                            بازگشت به صفحه ورود
            </Button>
                    </Form.Item>
                </Form>
                { error && (
                    <Alert
                        message="خطا"
                        description={
                            error !== undefined && error.data ? error.data.errors.Message : ""
                        }
                        type="error"
                        closable
                        onClose={ () => {
                            setError( undefined );
                        } }
                    />
                ) }

                { forgotPasswordResponse &&
                    forgotPasswordResponse ===
                    "کد فعال سازی به تلفن همراه شما پیامک گردید" && (
                        <Alert
                            message="تایید"
                            description={ forgotPasswordResponse }
                            type="success"
                            closable
                        />
                    ) }
            </Card>
        </Row>
    );
};

export default observer( InsertConfirmCode );
