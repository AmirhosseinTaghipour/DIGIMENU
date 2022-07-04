import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Select, Image } from "antd";
import { observer } from "mobx-react-lite"
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import TextArea from "antd/lib/input/TextArea";


const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
interface IProps {
    close: () => void;
}
const SMSLog: React.FC<IProps> = ({ close }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadingSMSLog,
        smsLogInfo,
    } = rootStore.smsLogStore;


    const { Option } = Select;
    const { Content, Header } = Layout;
    const [form] = Form.useForm();

    //سابمیت فرم

    const initialLoad = async () => {

    }
    useEffect(() => {
        initialLoad();
    }, []);

    return <Fragment>
        <Row className="bsFormBody">
            <Layout className="formBodyLayout">
                <Content >
                    <Form
                        form={form}
                        name="basic"
                        onFinish={() => { }}
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

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="دریافت کننده"
                                    name="receiver"
                                    initialValue={smsLogInfo.receiver}
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>


                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="موبایل"
                                    name="mobile"
                                    initialValue={smsLogInfo.mobile}
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="وضعیت"
                                    name="status"
                                    initialValue={smsLogInfo.status}
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="نوع پیام"
                                    name="type"
                                    initialValue={smsLogInfo.type}
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="پارامتر ارسالی"
                                    name="keyParam"
                                    initialValue={smsLogInfo.keyParam}
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="پیام ارسالی"
                                    name="message"
                                    initialValue={smsLogInfo.message}
                                >
                                    <TextArea
                                        disabled
                                        rows={window.innerWidth < 1025 ? 4 : 2}
                                    />
                                </Form.Item>
                            </Col>


                        </Row>
                    </Form>
                </Content>
            </Layout>
        </Row>
    </Fragment>

};

export default observer(SMSLog);
