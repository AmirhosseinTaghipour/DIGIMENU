import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Select, Image, Switch, InputNumber } from "antd";
import { observer } from "mobx-react-lite"
import { CheckOutlined, LoadingOutlined, SaveTwoTone, } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { ICategoryFormValues, ICategoryListItemValues } from "../../../../../app/models/category";
import { checkJustNumber, toDatabaseChar } from "../../../../../app/common/util/util";
import { IComboBoxType } from "../../../../../app/models/common";
import { ICategoryIconListItemValues } from "../../../../../app/models/categoryIcon";
import TextArea from "antd/lib/input/TextArea";
import { ICategoryItemFormValues } from "../../../../../app/models/categoryItem";

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
interface IProps {
    close: () => void;
}
const CategoryItem: React.FC<IProps> = ({ close }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadingCategoryItem,
        sumbittingCategoryItem,
        setCategoryItemInfo,
        categoryItemInfo,
        insertCategoryItem,
        updateCategoryItem
    } = rootStore.categoryItemStore;

    const {
        loadCategoryList,
        loadingCategoryList,
        setCategoryListValues,
        categoryListValues,
        categoryList
    } = rootStore.categoryStore;

    const { Option } = Select;
    const { Content, Header } = Layout;
    const [form] = Form.useForm();

    const [showDiscount, setShowDiscount] = useState<boolean>(false);


    //سابمیت فرم 
    const onFinish = async (formValues: ICategoryItemFormValues) => {
        setCategoryItemInfo({
            ...categoryItemInfo,
            title: formValues.title,
            categoryId: formValues.categoryId,
            description: formValues.description,
            price: formValues.price,
            discount: formValues.discount,
            discountType: formValues.discountType,
            isExist: formValues.isExist,
            useDiscount: formValues.useDiscount
        });
        if (categoryItemInfo.isUpdateMode)
            await updateCategoryItem(categoryItemInfo).then(() => close());
        else
            await insertCategoryItem(categoryItemInfo).then(() => close());
    };

    const initialLoad = async () => {
        setShowDiscount(categoryItemInfo.useDiscount);
        setCategoryListValues({
            ...categoryListValues,
            page: 1,
            limit: 500,
            title: null,
            sortColumn: null,
            sortDirection: null,
        });
        await loadCategoryList();
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
                                (loadingCategoryItem || sumbittingCategoryItem) ? <LoadingOutlined spin /> :
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
                                    label="نام آیتم"
                                    name="title"
                                    initialValue={categoryItemInfo.title}
                                    rules={[{
                                        required: true, message: 'فیلد نام آیتم نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        maxLength={200}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="دسته"
                                    name="categoryId"
                                    rules={[{
                                        required: true, message: 'فیلد دسته نمی تواند خالی باشد',
                                    }]}
                                    initialValue={categoryItemInfo?.categoryId!}

                                >
                                    <Select
                                        showSearch
                                        style={{
                                            width: "100%",
                                        }}
                                        loading={loadingCategoryList}
                                        onChange={(value: string) => {
                                            setCategoryItemInfo({
                                                ...categoryItemInfo,
                                                categoryId: !!value ? value : null
                                            });
                                        }}
                                        filterOption={(input, option) =>
                                            option!.children
                                                .toLowerCase()
                                                .indexOf(toDatabaseChar(input.toLowerCase())) >= 0
                                        }
                                        placeholder="انتخاب"
                                        allowClear={
                                            categoryList &&
                                            categoryList.length > 1
                                        }
                                        bordered
                                        menuItemSelectedIcon={
                                            <CheckOutlined style={{ color: "green" }} />
                                        }
                                    >
                                        {categoryList &&
                                            categoryList.length > 0 &&
                                            categoryList.map((val: ICategoryListItemValues) => {
                                                return (
                                                    <Option key={val.key!} value={val.key!}>
                                                        {toDatabaseChar(val.title)} <Image className="bsImgInDropDown" key={`img-${val.key}`} src={`${val.url}?${Date.now()}`} preview={false} />
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="قیمت (تومان)"
                                    name="price"
                                    initialValue={categoryItemInfo.price}
                                    rules={[{
                                        required: true, message: 'فیلد قیمت  نمی تواند خالی باشد',
                                    }]}
                                >
                                    <InputNumber
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        style={{ width: '100%' }}
                                        maxLength={10}
                                        onKeyDown={(e) => {
                                            checkJustNumber(e);
                                        }}
                                        min={1}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="وضعیت"
                                    name="isExist"
                                >
                                    <Switch
                                        checkedChildren=" موجود "
                                        unCheckedChildren=" ناموجود "
                                        defaultChecked={categoryItemInfo?.isExist!}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="تخفیف"
                                    name="useDiscount"
                                >
                                    <Switch
                                        onChange={(event) => setShowDiscount(event.valueOf())}
                                        checkedChildren=" اعمال تخفیف "
                                        unCheckedChildren=" حذف تخفیف "
                                        defaultChecked={categoryItemInfo?.useDiscount!}
                                    />
                                </Form.Item>
                            </Col>


                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    style={{ marginBottom: 0 }}
                                    label="تخفیف"
                                    hidden={!showDiscount}
                                >
                                    <Form.Item
                                        name="discount"
                                        initialValue={categoryItemInfo.discount}
                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                                        rules={[
                                            {
                                                message: "تخفیف درصدی، بین 1 تا100",
                                                validator: async (rule: any, value: any) => {
                                                    if (form.getFieldValue('discountType') > 0 &&
                                                        (form.getFieldValue('discount') == 0 || form.getFieldValue('discount') > 99)) {
                                                        throw new Error("Something wrong!");
                                                    }
                                                },
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            style={{ width: '100%' }}
                                            maxLength={10}
                                            min={1}
                                            onKeyDown={(e) => {
                                                checkJustNumber(e);
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="discountType"
                                        initialValue={categoryItemInfo.discountType}
                                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                                    >
                                        <Select placeholder="نوع"
                                            onChange={() => {
                                                form.setFieldsValue({
                                                    discount: null,
                                                });
                                            }}>
                                            <Option value={0}>مقداری</Option>
                                            <Option value={1}>درصدی</Option>
                                        </Select>
                                    </Form.Item>
                                </Form.Item>
                            </Col>



                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="توضیحات"
                                    name="description"
                                    initialValue={categoryItemInfo.description}
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

export default observer(CategoryItem);

