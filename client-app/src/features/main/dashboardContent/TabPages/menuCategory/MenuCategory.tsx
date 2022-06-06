import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Select, Image } from "antd";
import { observer } from "mobx-react-lite"
import { CheckOutlined, LoadingOutlined, SaveTwoTone, } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { ICategoryFormValues } from "../../../../../app/models/category";
import { toDatabaseChar } from "../../../../../app/common/util/util";
import { IComboBoxType } from "../../../../../app/models/common";
import { ICategoryIconListItemValues } from "../../../../../app/models/categoryIcon";


const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
interface IProps {
    close: () => void;
}
const MenuCategory: React.FC<IProps> = ({ close }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadingCategory,
        sumbittingCategory,
        setCategoryInfo,
        categoryInfo,
        insertCategory,
        updateCategory
    } = rootStore.categoryStore;

    const {
        loadCategoryIconList,
        loadingCategoryIconList,
        setCategoryIconListValues,
        categoryIconListValues,
        categoryIconList
    } = rootStore.categoryIconStore;

    const { Option } = Select;
    const { Content, Header } = Layout;
    const [form] = Form.useForm();

    //سابمیت فرم 
    const onFinish = async (formValues: ICategoryFormValues) => {
        setCategoryInfo({
            ...categoryInfo,
            title: formValues.title,
            iconId: formValues.iconId,
        });
        if (categoryInfo.isUpdateMode)
            await updateCategory(categoryInfo).then(() => close());
        else
            await insertCategory(categoryInfo).then(() => close());
    };

    const initialLoad = async () => {
        setCategoryIconListValues({
            ...categoryIconListValues,
            page: 1,
            limit: 500,
            title: null,
            sortColumn: null,
            sortDirection: null,
        });
        await loadCategoryIconList().then(() => {
            form.resetFields(['iconId']);
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
                                (loadingCategory || sumbittingCategory) ? <LoadingOutlined spin /> :
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
                                    label="نام دسته"
                                    name="title"
                                    initialValue={categoryInfo.title}
                                    rules={[{
                                        required: true, message: 'فیلد نام دسته نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        maxLength={200}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="آیکن"
                                    name="iconId"
                                    rules={[{
                                        required: true, message: 'فیلد آیکن نمی تواند خالی باشد',
                                    }]}
                                    initialValue={categoryInfo?.iconId!}

                                >
                                    <Select

                                        showSearch
                                        style={{
                                            width: "100%",
                                        }}
                                        loading={loadingCategoryIconList}
                                        onChange={(value: string) => {
                                            setCategoryInfo({
                                                ...categoryInfo,
                                                iconId: !!value ? value : null
                                            });
                                        }}
                                        filterOption={(input, option) =>
                                            option!.children
                                                .toLowerCase()
                                                .indexOf(toDatabaseChar(input.toLowerCase())) >= 0
                                        }
                                        placeholder="انتخاب"
                                        allowClear={
                                            categoryIconList &&
                                            categoryIconList.length > 1
                                        }
                                        bordered
                                        menuItemSelectedIcon={
                                            <CheckOutlined style={{ color: "green" }} />
                                        }
                                    >
                                        {categoryIconList &&
                                            categoryIconList.length > 0 &&
                                            categoryIconList.map((val: ICategoryIconListItemValues) => {
                                                return (
                                                    <Option key={val.key!} value={val.key!}>
                                                        {toDatabaseChar(val.title)} <Image className="bsImgInDropDown" key={`img-${val.key}`} src={`${val.url}?${Date.now()}`} preview={false} />
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Form.Item>
                            </Col>

                        </Row>
                    </Form>
                </Content>
            </Layout>
        </Row>
    </Fragment>

};

export default observer(MenuCategory);
