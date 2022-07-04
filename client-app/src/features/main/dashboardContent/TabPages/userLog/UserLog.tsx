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
const UserLog: React.FC<IProps> = ({ close }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingUserLog,
    userLogInfo,
  } = rootStore.userLogStroe;


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
                  label="نام"
                  name="name"
                  initialValue={userLogInfo.name}
                >
                  <Input disabled />
                </Form.Item>
              </Col>


              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <Form.Item
                  label="نام کاربری"
                  name="userName"
                  initialValue={userLogInfo.userName}
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <Form.Item
                  label="تاریخ"
                  name="date"
                  initialValue={userLogInfo.date}
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <Form.Item
                  label="آی پی"
                  name="ip"
                  initialValue={userLogInfo.ip}
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                <Form.Item
                  label="وضعیت"
                  name="status"
                  initialValue={userLogInfo.status}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Content>
      </Layout>
    </Row>
  </Fragment>

};

export default observer(UserLog);
