import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Select, Image, Switch } from "antd";
import { observer } from "mobx-react-lite"
import { CheckOutlined, LoadingOutlined, SaveTwoTone, } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { ICategoryFormValues } from "../../../../../app/models/category";
import { toDatabaseChar } from "../../../../../app/common/util/util";
import { IComboBoxType } from "../../../../../app/models/common";
import { ICategoryIconListItemValues } from "../../../../../app/models/categoryIcon";
import { IUserManagementFormValues } from "../../../../../app/models/user";
import { IDepartmentManagementFormValues } from "../../../../../app/models/department";
import TextArea from "antd/lib/input/TextArea";


const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
interface IProps {
    close: () => void;
}
const UnitManagement: React.FC<IProps> = ({ close }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadingUnit,
        sumbittingUnit,
        setUnitInfo,
        unitInfo,
        updateUser,
    } = rootStore.departmentStore;

  

    const { Option } = Select;
    const { Content, Header } = Layout;
    const [form] = Form.useForm();

    //سابمیت فرم 
    const onFinish = async (formValues: IDepartmentManagementFormValues) => {
        debugger;
        setUnitInfo({
            ...unitInfo,
            title: formValues.title,
            description: formValues.description,
            phone: formValues.phone,
            isActivated: formValues.isActivated == undefined ? unitInfo.isActivated : formValues.isActivated,
            postalCode: formValues.postalCode,
            address: formValues.address,
        });
        if (unitInfo.isUpdateMode)
            await updateUser(unitInfo).then(() => close());
        // else
        //     await insertUser(userInfo).then(() => close());
    };

    const initialLoad = async () => {
      
    }
    useEffect(() => {
        initialLoad();
    }, []);

    return <Fragment>
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
                                    form.submit()
                                });
                            }}
                            icon={
                                (loadingUnit || sumbittingUnit) ? <LoadingOutlined spin /> :
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

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="نام"
                                    name="title"
                                    initialValue={unitInfo.title}
                                    rules={[{
                                        required: true, message: 'فیلد نام نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        maxLength={200}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="تلفن"
                                    name="phone"
                                    initialValue={unitInfo.phone}
                                    rules={[{
                                        required: true, message: 'فیلد تلفن نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        maxLength={15}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="کد پستی"
                                    name="postalCode"
                                    initialValue={unitInfo.postalCode}

                                >
                                    <Input
                                        maxLength={10}
                                    />
                                </Form.Item>
                            </Col>


                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="وضعیت"
                                    name="isActivated"
                                >
                                    <Switch
                                        checkedChildren=" فعال "
                                        unCheckedChildren=" غیرفعال "
                                        defaultChecked={unitInfo?.isActivated!}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="آدرس"
                                    name="address"
                                    initialValue={unitInfo.address}
                                    rules={[{
                                      required: true, message: 'فیلد آدرس نمی تواند خالی باشد',
                                  }]}
                                >
                                    <TextArea
                                        rows={window.innerWidth < 1025 ? 4 : 2}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="توضیحات"
                                    name="description"
                                    initialValue={unitInfo.description}
                                >
                                    <TextArea
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

export default observer(UnitManagement);
