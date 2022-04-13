import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Button, Upload, message, Divider } from "antd";
import { observer } from "mobx-react-lite"
import { CloseOutlined, DeleteOutlined, FormOutlined, LoadingOutlined, PaperClipOutlined, PlusOutlined, SaveOutlined, SaveTwoTone, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { IMenuFormValues } from "../../../../../app/models/menu";
import ImgCrop from "antd-img-crop";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import FileViewer from "../../../../common/FileViewer/FileViewer";
import MenuCategoryTable from "./MenuCategoryTable";

const { Content, Header } = Layout;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const imgSize = 5000000;
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
        iconInfo,
        setIconInfo
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

    const setIcon = async (input: UploadChangeParam) => {
        if (input.file.status != "removed") {
            setIconInfo({ ...iconInfo, file: input.file.originFileObj as Blob });
            setIconFile([input.file]);
        }
        else {
            setIconInfo({ ...iconInfo, file: null });
            setIconFile([]);
        }
        setIconInfo({ ...iconInfo, isChanged: true });
        form.validateFields(['icon']);
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
                                    rules={[
                                        {
                                            message: "حجم تصویر باید بیش از جد مجاز است",
                                            validator: async (rule: any, value: any) => {
                                                if (iconInfo.file?.size! > imgSize)
                                                    throw new Error("Something wrong!");
                                            },
                                        },
                                    ]}
                                >
                                    <ImgCrop grid shape="rect" aspect={1 / 1} quality={0.9} rotate modalTitle="انتخاب آیکن">
                                        <Upload
                                            beforeUpload={(file) => {
                                                const isAllowedFormat = ["image/png", "image/jpg", "image/jpeg"]
                                                    .includes(file.type);
                                                if (!isAllowedFormat) {
                                                    message.error("تصویر باید دارای یکی از فرمت های png، jpg یا jpeg باشد.");
                                                }
                                                return isAllowedFormat;
                                            }}
                                            name="icon"
                                            accept={".png, .jpg, .jpeg, "}
                                            multiple={false}
                                            maxCount={1}
                                            fileList={iconFile}
                                            customRequest={(e: any) => e.onSuccess("Ok")}
                                            onChange={setIcon}
                                        >
                                            <Button icon={<UploadOutlined />}>انتخاب آیکن</Button>
                                            {!!iconInfo.name &&
                                                <div className="ant-upload-list-item ant-upload-list-item-default ant-upload-list-item-list-type-text">
                                                    <div className="ant-upload-list-item-info bs-file-btn-box">
                                                        <Button
                                                            style={{ height: "auto", padding: 0 }}
                                                            title={`${iconInfo.name}`}
                                                            onClick={(e) => {
                                                                setFileViewerVisible("icon");
                                                                e.stopPropagation();
                                                            }}
                                                            type="link"
                                                            icon={<PaperClipOutlined />}
                                                        >
                                                            {iconInfo.name}
                                                        </Button>
                                                        <Button
                                                            style={{ height: "auto", padding: 0 }}
                                                            onClick={(e) => {
                                                                setIconInfo({ ...iconInfo, isChanged: true, name: null, url: null })
                                                                e.stopPropagation();
                                                            }}
                                                            type="link"
                                                            icon={<DeleteOutlined />}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        </Upload>
                                    </ImgCrop>
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
        {
            fileViewerVisible === "icon" ?
                <FileViewer
                    close={closeFileViewer}
                    file={{ ...iconInfo }}
                />
                :
                null
        }
    </Fragment>

};

export default observer(MenuCategory);
