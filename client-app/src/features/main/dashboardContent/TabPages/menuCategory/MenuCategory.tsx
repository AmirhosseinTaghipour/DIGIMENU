import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Button, Image, message, Divider, Select } from "antd";
import { observer } from "mobx-react-lite"
import { CheckOutlined, CloseOutlined, DeleteOutlined, FormOutlined, LoadingOutlined, PaperClipOutlined, PlusOutlined, SaveOutlined, SaveTwoTone, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { IMenuFormValues } from "../../../../../app/models/menu";
import ImgCrop from "antd-img-crop";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import FileViewer from "../../../../common/FileViewer/FileViewer";
import MenuCategoryTable from "./MenuCategoryTable";
import { toDatabaseChar } from "../../../../../app/common/util/util";

const { Content, Header } = Layout;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
const { Option } = Select;
const MenuCategory: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        insertCategory,
        updateCategory,
        sumbittingCategory,
        loadCategory,
        loadingCategory,
        categoryInfo,
        setCategoryInfo,
    } = rootStore.categoryStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const [form] = Form.useForm();

    const [fileViewerVisible, setFileViewerVisible] = useState<string | null>(null);
    const [iconFile, setIconFile] = useState<UploadFile<any>[] | any[]>([]);

    const closeFileViewer = () => {
        setFileViewerVisible(null);
    }

    //سابمیت فرم 
    const onFinish = async (formValues: IMenuFormValues) => {
        setCategoryInfo({
            ...categoryInfo,
            title: formValues.title,
        });
        if (categoryInfo.isUpdateMode)
            await updateCategory(categoryInfo);
        else
            await insertCategory(categoryInfo).then(() => setInitialConfig());
    };
    const setInitialConfig = () => {
        loadCategory().then(() => {
            form.resetFields();
        })
    }
    useEffect(() => {
        setInitialConfig();
    }, []);

    return <Fragment>
        <Row className="bsFormHeader">
            <div className="bsFormTitle"> <FormOutlined />
                دسته بندی منو
            </div>

            <Button icon={<CloseOutlined />} onClick={closeForm} />

        </Row>

        <Row className="bsFormBody">
            <Layout className="formBodyLayout">
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
                                    label="عنوان دسته"
                                    name="title"
                                    initialValue={categoryInfo.title}
                                    rules={[{
                                        required: true, message: 'فیلد عنوان دسته نمی تواند خالی باشد',
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
                                    name="icon"
                                    initialValue={categoryInfo.title}
                                    rules={[{
                                        required: true, message: 'فیلد آیکن نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Select
                                        showSearch
                                        style={{
                                            width: "100%",
                                        }}
                                        loading={false}
                                        onChange={() => {
                                        }}
                                        onClear={() => {
                                        }}
                                        filterOption={(input, option) =>
                                            option!.children
                                                .toLowerCase()
                                                .indexOf(toDatabaseChar(input.toLowerCase())) >= 0
                                        }
                                        placeholder="انتخاب"
                                        // allowClear={
                                        //     TestWayComboList &&
                                        //     TestWayComboList.length > 1
                                        // }
                                        bordered
                                        menuItemSelectedIcon={
                                            <CheckOutlined style={{ color: "green" }} />
                                        }
                                     value={2}
                                    >


                                        <Option key={1} value={1}>
                                        <Image key="imageViewer" src={"https://localhost:5001/CategoryIcon/a8469554-c5a0-11ec-9d64-0242ac120002.png"} preview={false} />
                                        </Option>
                                        <Option key={2} value={2}>
                                        <Image key="imageViewer" src={"https://localhost:5001/CategoryIcon/a8469554-c5a0-11ec-9d64-0242ac120002.png"} preview={false} />
                                        </Option>



                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item label="&nbsp;" >
                                    <Button
                                        className="bsBtn"
                                        loading={false}
                                        type="primary"
                                        htmlType="submit"
                                        icon={
                                            <PlusOutlined />
                                        }
                                    >
                                        افزودن
                                    </Button>
                                </Form.Item>

                            </Col>


                        </Row>
                    </Form>
                    <Divider className="bsDivider">
                        لیست دسته ها
                    </Divider>
                    <MenuCategoryTable />
                </Content>
            </Layout>
        </Row>
    </Fragment>
};

export default observer(MenuCategory);
