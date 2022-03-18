import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/user";
import { Form, Input, Button, Row, Card, Alert } from "antd";
import { LockOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import Avatar from "antd/lib/avatar/avatar";
import { AxiosResponse } from "axios";

const ChangePassword = () => {
    const rootStore = useContext( RootStoreContext );
    const { changePassword, submitting } = rootStore.userStore;
    const [ form ] = Form.useForm();

    const [ error, setError ] = useState<AxiosResponse>();

    const [ notEqual, setNotEqual ] = useState( false );

    // const [password, setPassword] = useState("");

    const onFinish = ( values : IUserFormValues ) => {
        if ( values.password === values.repeatPassword ) {
            changePassword( values )
                .then( () => {
                    window.location.replace( "/" );
                } )
                .catch( ( er : AxiosResponse ) => {
                    setError( er );
                    form.resetFields( [ "password", "repeatPassword" ] );
                } );
        } else {
            setNotEqual( true );
        }
    };

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
                            avatar={ <Avatar shape="square" size={ 64 } src="logo.png" /> }
                            title={
                                <h2 style={ { marginTop: "5px" } }>شبکه کشوری آزمایشگاهی</h2>
                            }
                            description={
                                <p style={ { marginTop: "-8px", textAlign: "center" } }>
                                    سازمان غذا و دارو
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
                    <Form.Item
                        name="password"
                        rules={ [
                            {
                                required: true,
                                message: "لطفا رمز ورود را وارد نمایید",
                            },
                            {
                                min: 6,
                                message: "رمز نباید کمتر از ۶ حرف باشد",

                            },
                            {
                                pattern: new RegExp( "^[a-zA-Z0-9!@#$%^&*)(+=._-]+$" ),
                                message: "تنها کاراکترهای لاتین برای پسورد مجاز است",
                            },
                            {
                                pattern: new RegExp( "[0-9]+|[!@#$%^&*)(+=._-]+]" ),
                                message:
                                    "پسورد باید شامل اعداد یا کاراکتر های خاص (*,&,-,...) باشد",
                            },
                            {
                                pattern: new RegExp( "([A-Z])" ),
                                message: "پسورد باید شامل حروف بزرگ باشد",
                            },
                            {
                                pattern: new RegExp( "([a-z])" ),
                                message: "پسورد باید شامل حروف کوچک باشد",
                            },
                        ] }
                    >
                        <Input.Password
                            prefix={ <LockOutlined /> }
                            type="password"
                            placeholder="رمز عبور"
                            maxLength={ 25 }
                            minLength={ 6 }
                            onChange={ ( event ) => {
                                // setPassword(event.target.value!);
                                setError( undefined );
                            } }
                        />
                    </Form.Item>
                    <Form.Item
                        name="repeatPassword"
                        rules={ [
                            { required: true, message: "لطفا تکرار رمز ورود را وارد نمایید" },
                        ] }
                    >
                        <Input.Password
                            prefix={ <LockOutlined /> }
                            type="password"
                            placeholder="تکرار رمز عبور"
                            maxLength={ 25 }
                            minLength={ 6 }
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
                </Form>
                { error && (
                    <Alert
                        message="خطا"
                        description={ error !== undefined ? error.data.errors.Message : "" }
                        type="error"
                        closable
                        onClose={ () => {
                            setError( undefined );
                        } }
                    />
                ) }

                { notEqual && (
                    <Alert
                        message="خطا"
                        description="رمز و تکرار رمز یکسان نیستند."
                        type="error"
                        closable
                        onClose={ () => setNotEqual( false ) }
                    />
                ) }
            </Card>
        </Row>
    );
};

export default observer( ChangePassword );
