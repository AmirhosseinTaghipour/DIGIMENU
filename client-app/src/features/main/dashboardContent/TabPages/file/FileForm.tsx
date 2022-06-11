import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Modal, Button, Upload, message, Checkbox } from "antd";
import ImgCrop from 'antd-img-crop';
import { observer } from "mobx-react-lite"
import { DeleteOutlined, FormOutlined, LoadingOutlined, PaperClipOutlined, SaveTwoTone, UploadOutlined } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { UploadChangeParam } from "antd/lib/upload";
import FileViewer from "../../../../common/FileViewer/FileViewer";
import { UploadFile } from "antd/lib/upload/interface";
import { IFileFormValues } from "../../../../../app/models/file";


const { Content, Header } = Layout;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
const imgSize = 5000000;
interface IProps {
    close: () => void;
}
const FileForm: React.FC<IProps> = ({ close }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadingFile,
        sumbittingFile,
        setFileFormInfo,
        fileFormInfo,
        fileInfo,
        setFileInfo,
        insertFile,
        updateFile
    } = rootStore.fileStore;

    const [form] = Form.useForm();

    const [fileViewerVisible, setFileViewerVisible] = useState<string | null>(null);
    const [file, setFile] = useState<UploadFile<any>[] | any[]>([]);

    const closeFileViewer = () => {
        setFileViewerVisible(null);
    }

    const setIcon = async (input: UploadChangeParam) => {
        if (input.file.status != "removed") {
            setFileInfo({ ...fileInfo, file: input.file.originFileObj as Blob });
            setFile([input.file]);
        }
        else {
            setFileInfo({ ...fileInfo, file: null });
            setFile([]);
        }
        setFileInfo({ ...fileInfo, isChanged: true });
        form.validateFields(['icon']);
    }

    //سابمیت فرم 
    const onFinish = async (formValues: IFileFormValues) => {
        setFileFormInfo({
            ...fileFormInfo,
            title: formValues.title,
            file: {...fileInfo},
            isDefault: formValues.isDefault,
        });
        if (fileFormInfo.isUpdateMode)
            await updateFile(fileFormInfo).then(() => close());
        else
            await insertFile(fileFormInfo).then(() => close());
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
                                (loadingFile || sumbittingFile) ? <LoadingOutlined spin /> :
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
                                    label="نام تصویر"
                                    name="title"
                                    initialValue={fileFormInfo.title}
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
                                    label="فایل تصویر"
                                    name="icon"
                                    rules={[{
                                        required: true, message: 'فیلد تصویر نمی تواند خالی باشد',
                                        validator: async () => {
                                            if (
                                                (!fileFormInfo.isUpdateMode && !fileInfo.file) ||
                                                (fileFormInfo.isUpdateMode && (!fileInfo.url && !fileInfo.file))
                                            )
                                                throw new Error("Something wrong!");
                                        }
                                    },
                                    {
                                        message: "حجم تصویر بیش از حد مجاز است",
                                        validator: async (rule: any, value: any) => {
                                            if (fileInfo.file?.size! > imgSize)
                                                throw new Error("Something wrong!");
                                        },
                                    },]}
                                >
                                    <ImgCrop shape="rect" aspect={8 / 7} quality={0.9} rotate modalTitle="انتخاب تصویر">
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
                                            fileList={file}
                                            customRequest={(e: any) => e.onSuccess("Ok")}
                                            onChange={setIcon}
                                        >
                                            <Button icon={<UploadOutlined />}>انتخاب لوگو</Button>
                                            {!!fileInfo.name &&
                                                <div className="ant-upload-list-item ant-upload-list-item-default ant-upload-list-item-list-type-text">
                                                    <div className="ant-upload-list-item-info bs-file-btn-box">
                                                        <Button
                                                            style={{ height: "auto", padding: 0 }}
                                                            title={`${fileInfo.name}`}
                                                            onClick={(e) => {
                                                                setFileViewerVisible("icon");
                                                                e.stopPropagation();
                                                            }}
                                                            type="link"
                                                            icon={<PaperClipOutlined />}
                                                        >
                                                            {fileInfo.name}
                                                        </Button>
                                                        <Button
                                                            style={{ height: "auto", padding: 0 }}
                                                            onClick={(e) => {
                                                                setFileInfo({ ...fileInfo, isChanged: true, name: null, url: null });
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
                                <Form.Item
                                    label="انتخاب به عنوان تصویر پیشفرض"
                                    name="isDefault"
                                    initialValue={fileFormInfo.isDefault}
                                >
                                    <Checkbox
                                        name="isDefault"
                                    />
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
                    file={{ ...fileInfo }}
                /> : null
        }
    </Fragment>

};

export default observer(FileForm);
