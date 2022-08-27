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


const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
interface IProps {
    close: () => void;
}
const UserManagement: React.FC<IProps> = ({ close }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadingUser,
        sumbittingUser,
        setUserInfo,
        userInfo,
        insertUser,
        updateUser,
    } = rootStore.userStore;

    const {
        loadRoleComboBoxList,
        loadingRoleComboBoxList,
        roleComboBoxList
    } = rootStore.roleStore;

    const {
        loadingDepartmentComboBoxList,
        loadDepartmentComboBoxList,
        departmentComboBoxList
    } = rootStore.departmentStore


    const { Option } = Select;
    const { Content, Header } = Layout;
    const [form] = Form.useForm();

    //سابمیت فرم 
    const onFinish = async (formValues: IUserManagementFormValues) => {
        debugger;
        setUserInfo({
            ...userInfo,
            name: formValues.name,
            userName: formValues.userName,
            password: formValues.password,
            isActivated: formValues.isActivated == undefined ? userInfo.isActivated : formValues.isActivated,
            roleId: formValues.roleId,
            departmentId: formValues.departmentId,
            mobile: formValues.mobile,
        });
        if (userInfo.isUpdateMode)
            await updateUser(userInfo).then(() => close());
        else
            await insertUser(userInfo).then(() => close());
    };

    const initialLoad = async () => {
        await loadDepartmentComboBoxList().then(() => {
            form.resetFields(['departmentId']);
        });

        await loadRoleComboBoxList().then(() => {
            form.resetFields(['roleId']);
        });

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
                                (loadingUser || sumbittingUser) ? <LoadingOutlined spin /> :
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
                                    name="name"
                                    initialValue={userInfo.name}
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
                                    label="نام کاربری"
                                    name="userName"
                                    initialValue={userInfo.userName}
                                    rules={[{
                                        required: true, message: 'فیلد نام کاربری نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        maxLength={200}
                                        disabled={userInfo.isUpdateMode}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="کلمه عبور"
                                    name="password"
                                    initialValue={userInfo.password}

                                >
                                    <Input
                                        maxLength={200}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="موبایل"
                                    name="mobile"
                                    initialValue={userInfo.mobile}
                                    rules={[{
                                        required: true, message: 'فیلد موبایل نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        maxLength={200}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="نقش"
                                    name="roleId"
                                    initialValue={userInfo.roleId}
                                    rules={[{
                                        required: true, message: 'فیلد نقش نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Select
                                        showSearch
                                        style={{
                                            width: "100%",
                                        }}
                                        loading={loadingRoleComboBoxList}
                                        onChange={(value: string) => {
                                            setUserInfo({
                                                ...userInfo,
                                                roleId: !!value ? value : null
                                            });
                                        }}
                                        filterOption={(input, option) =>
                                            option!.children
                                                .toLowerCase()
                                                .indexOf(toDatabaseChar(input.toLowerCase())) >= 0
                                        }
                                        placeholder="انتخاب"
                                        allowClear={
                                            roleComboBoxList &&
                                            roleComboBoxList.length > 1
                                        }
                                        bordered
                                        menuItemSelectedIcon={
                                            <CheckOutlined style={{ color: "green" }} />
                                        }
                                    >
                                        {roleComboBoxList &&
                                            roleComboBoxList.length > 0 &&
                                            roleComboBoxList.map((combo: IComboBoxType) => {
                                                return (
                                                    <Option key={combo.key!} value={combo.key!}>
                                                        {toDatabaseChar(combo.value)}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="مجموعه"
                                    name="departmentId"
                                    initialValue={userInfo.departmentId}

                                >
                                    <Select
                                        showSearch
                                        style={{
                                            width: "100%",
                                        }}
                                        loading={loadingDepartmentComboBoxList}
                                        onChange={(value: string) => {
                                            setUserInfo({
                                                ...userInfo,
                                                departmentId: !!value ? value : null
                                            });
                                        }}
                                        filterOption={(input, option) =>
                                            option!.children
                                                .toLowerCase()
                                                .indexOf(toDatabaseChar(input.toLowerCase())) >= 0
                                        }
                                        placeholder="انتخاب"
                                        allowClear
                                        bordered
                                        menuItemSelectedIcon={
                                            <CheckOutlined style={{ color: "green" }} />
                                        }
                                    >
                                        {departmentComboBoxList &&
                                            departmentComboBoxList.length > 0 &&
                                            departmentComboBoxList.map((combo: IComboBoxType) => {
                                                return (
                                                    <Option key={combo.key!} value={combo.key!}>
                                                        {toDatabaseChar(combo.value)}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
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
                                        defaultChecked={userInfo?.isActivated!}
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

export default observer(UserManagement);
