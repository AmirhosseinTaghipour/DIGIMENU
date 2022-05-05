import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Modal, Button, Upload, message } from "antd";
import ImgCrop from 'antd-img-crop';
import { observer } from "mobx-react-lite"
import { DeleteOutlined, FormOutlined, LoadingOutlined, PaperClipOutlined, SaveTwoTone, UploadOutlined } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { UploadChangeParam } from "antd/lib/upload";
import FileViewer from "../../../../common/FileViewer/FileViewer";
import { UploadFile } from "antd/lib/upload/interface";
import { ICategoryIconFormValues } from "../../../../../app/models/categoryIcon";


const { Content, Header } = Layout;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
const imgSize = 50000;
interface IProps {
    close: () => void;
}
const CategoryIcon: React.FC<IProps> = ({ close }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadingCategoryIcon,
        sumbittingCategoryIcon,
        setCategoryIconInfo,
        categoryIconInfo,
        iconInfo,
        setIconInfo,
        insertCategoryIcon,
        updateCategoryIcon
    } = rootStore.categoryIconStore;

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
    const onFinish = async (formValues: ICategoryIconFormValues) => {
       setCategoryIconInfo({
            ...categoryIconInfo,
            title: formValues.title,
            icon: { ...iconInfo },
        });
        if (categoryIconInfo.isUpdateMode)
            await updateCategoryIcon(categoryIconInfo).then(() => close());
        else
            await insertCategoryIcon(categoryIconInfo).then(() => close());
    };

    useEffect(() => {
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
                                (loadingCategoryIcon || sumbittingCategoryIcon) ? <LoadingOutlined spin /> :
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
                                    label="نام آیکن"
                                    name="title"
                                    initialValue={categoryIconInfo.title}
                                    rules={[{
                                        required: true, message: 'فیلد نام آیکن نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        name="title"
                                        maxLength={200}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="آیکن"
                                    name="icon"
                                    rules={[{
                                        required: true, message: 'فیلد آیکن نمی تواند خالی باشد',
                                        validator: async () => {
                                            if (
                                                (!categoryIconInfo.isUpdateMode && !iconInfo.file) ||
                                                (categoryIconInfo.isUpdateMode && (!iconInfo.url && !iconInfo.file))
                                            )
                                                throw new Error("Something wrong!");
                                        }
                                    },
                                    {
                                        message: "حجم تصویر بیش از حد مجاز است",
                                        validator: async (rule: any, value: any) => {
                                            if (iconInfo.file?.size! > imgSize)
                                                throw new Error("Something wrong!");
                                        },
                                    },]}
                                >
                                    <ImgCrop shape="rect" aspect={1 / 1} quality={0.9} rotate modalTitle="انتخاب لوگو">
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
                                            accept={".png, .jpg, .jpeg"}
                                            multiple={false}
                                            maxCount={1}
                                            fileList={iconFile}
                                            customRequest={(e: any) => e.onSuccess("Ok")}
                                            onChange={setIcon}
                                        >
                                            <Button icon={<UploadOutlined />}>انتخاب لوگو</Button>
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
                                                                setIconInfo({ ...iconInfo, isChanged: true, name: null, url: null });
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

                        </Row>
                    </Form>
                </Content>
            </Layout>
        </Row>


        {
            fileViewerVisible === "icon" ?
                <FileViewer
                    close={closeFileViewer}
                    file={{ ...iconInfo }}
                /> : null
        }
    </Fragment>

};

export default observer(CategoryIcon);
