import React, { Fragment, useContext, useEffect } from "react"
import { Input, Layout, Menu, Row, Form, Col, Button, Radio, Space } from "antd";
import { observer } from "mobx-react-lite"
import { CloseOutlined, FormOutlined, LoadingOutlined, SaveTwoTone } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { IMenuFormValues } from "../../../../../app/models/menu";

const { Content, Header } = Layout;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const Payment: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadingMenu,
        loadMenu,
        sumbittingMenu,
        insertMenu,
        updateMenu,
        menuInfo,
        setMenuInfo
    } = rootStore.menuStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const [form] = Form.useForm();


    //سابمیت فرم 
    const onFinish = async (formValues: IMenuFormValues) => {
        setMenuInfo({
            ...menuInfo,
            title: formValues.title,
            description: formValues.description,
        });
        if (menuInfo.isUpdateMode)
            await updateMenu(menuInfo);
        else
            await insertMenu(menuInfo).then(() => setInitialConfig());
    };
    const setInitialConfig = () => {
        loadMenu().then(() => {
            form.resetFields();
        })
    }
    useEffect(() => {
        setInitialConfig();
    }, []);

    return <Fragment>
        <Row className="bsFormHeader">
            <div className="bsFormTitle"> <FormOutlined />
            پرداخت و اشتراک
            </div>

            <Button icon={<CloseOutlined />} onClick={closeForm} />

        </Row>

        <Row className="bsFormBody">
            <Layout className="formBodyLayout">
                <Header>
                    <Menu
                        mode="horizontal"
                        style={{
                            backgroundColor: "transparent",
                            borderBottom: "none",
                            textAlign: "center",
                        }}
                    >
                        <Menu.Item
                            key="save"
                            disabled={false}
                            onClick={() => {
                                form.validateFields().then(() => {
                                    form.submit();
                                });

                            }}
                            icon={
                                (loadingMenu || sumbittingMenu) ? <LoadingOutlined spin /> :
                                    <SaveTwoTone
                                        twoToneColor="#52c41a"
                                        className="bsBtnSave"
                                    />
                            }
                        >
                            ثبت
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content >
                    <Form
                        form={form}
                        name="basic"
                        onFinish={onFinish}
                        layout="horizontal"
                        {...layout}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                            }
                        }}
                        autoComplete="off"
                    >
                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="نوع اشتراک"
                                    name="description"
                                    initialValue={1}
                                >
                                    <Radio.Group onChange={() => { }}>
                                        <Space direction="vertical">
                                            <Radio value={1}>فعال شدن منو دیجیتال به صورت دمو (تست رایگان 15 روزه)</Radio>
                                            <Radio value={2}>خرید اشتراک یکساله</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                        </Row>
                    </Form>
                </Content>
            </Layout>
        </Row>
    </Fragment>

};

export default observer(Payment);
