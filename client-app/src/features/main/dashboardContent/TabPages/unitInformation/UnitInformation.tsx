import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Modal, Button, Upload, message } from "antd";
import ImgCrop from 'antd-img-crop';
import { observer } from "mobx-react-lite"
import { CloseOutlined, DeleteOutlined, FormOutlined, LoadingOutlined, PaperClipOutlined, SaveTwoTone, UploadOutlined } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { IDepartmentFormValues } from "../../../../../app/models/department";
import { checkJustNumber, IsNullOrEmpty } from "../../../../../app/common/util/util";
import { SiGooglemaps } from "react-icons/si";
import LeafletMap from "../../../../common/Map/LeafletMap";
import { UploadChangeParam } from "antd/lib/upload";
import FileViewer from "../../../../common/FileViewer/FileViewer";
import { UploadFile } from "antd/lib/upload/interface";


const { Content, Header } = Layout;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
const imgSize = 5000000;
const UnitInformation: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        submittingDepartment,
        insertDepartment,
        updateDepartment,
        loadDepartment,
        loadingDepartment,
        departmentInfo,
        setDepartmentInfo,
        imageInfo,
        setImageInfo,
        logoInfo,
        setLogoInfo
    } = rootStore.departmentStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const [form] = Form.useForm();

    const [locationVisible, setLocationVisible] = useState(false);
    const [fileViewerVisible, setFileViewerVisible] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<UploadFile<any>[] | any[]>([]);
    const [logFile, setLogFile] = useState<UploadFile<any>[] | any[]>([]);

    const closeFileViewer = () => {
        setFileViewerVisible(null);
    }
    const handleOk = (e: any) => {
        setLocationVisible(false);
    };

    const handleCancel = (e: any) => {
        setLocationVisible(false);
    };

    const onClickMap = (point: L.LatLng) => {
        setDepartmentInfo({
            ...departmentInfo,
            xpos: point.lat,
            ypos: point.lng
        })
        form.validateFields(['location']);
    }


    const setImage = async (input: UploadChangeParam) => {
        if (input.file.status != "removed") {
            setImageInfo({ ...imageInfo, file: input.file.originFileObj as Blob });
            setImageFile([input.file]);
        }
        else {
            setImageInfo({ ...imageInfo, file: null });
            setImageFile([]);
        }
        setImageInfo({ ...imageInfo, isChanged: true });
        form.validateFields(['image']);
    }

    const setLogo = async (input: UploadChangeParam) => {
        if (input.file.status != "removed") {
            setLogoInfo({ ...logoInfo, file: input.file.originFileObj as Blob });
            setLogFile([input.file]);
        }
        else {
            setLogoInfo({ ...logoInfo, file: null });
            setLogFile([]);
        }
        setLogoInfo({ ...logoInfo, isChanged: true });
        form.validateFields(['logo']);
    }
    //سابمیت فرم 
    const onFinish = async (formValues: IDepartmentFormValues) => {
        setDepartmentInfo({
            ...departmentInfo,
            title: formValues.title,
            description: formValues.description,
            address: formValues.address,
            postalCode: formValues.postalCode,
            phone: formValues.phone,
            image: { ...imageInfo },
            logo: { ...logoInfo }
        });
        if (departmentInfo.isUpdateMode)
            await updateDepartment(departmentInfo).then(() => setInitialConfig());
        else
            await insertDepartment(departmentInfo).then(() => setInitialConfig());
    };
    const setInitialConfig = () => {
        loadDepartment().then(() => {
            form.resetFields();
            setLogFile([]);
            setImageFile([]);
        })
    }
    useEffect(() => {
        setInitialConfig();
    }, []);

    return <Fragment>
        <Row className="bsFormHeader">
            <div className="bsFormTitle"> <FormOutlined />
                اطلاعات مجموعه
            </div>

            <Button icon={<CloseOutlined />} onClick={closeForm} />

        </Row>

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
                                    form.submit();
                                });

                            }}
                            icon={
                                (loadingDepartment || submittingDepartment) ? <LoadingOutlined spin /> :
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
                                    label="نام مجموعه"
                                    name="title"
                                    initialValue={departmentInfo.title}
                                    rules={[{
                                        required: true, message: 'فیلد نام مجموعه نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        maxLength={200}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="تلفن ثابت"
                                    name="phone"
                                    initialValue={departmentInfo.phone}
                                    rules={[
                                        {
                                            required: true, message: 'فیلد تلفن ثابت نمی تواند خالی باشد',
                                        },
                                        {
                                            pattern: new RegExp("^[0-9]+$"),
                                            message: "تنها اعداد مجاز می باشد",
                                        }
                                    ]}

                                >
                                    <Input
                                        maxLength={11}
                                        onKeyDown={(e) => {
                                            checkJustNumber(e);
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="کد پستی"
                                    name="postalCode"
                                    initialValue={departmentInfo.postalCode}
                                    rules={[
                                        {
                                            pattern: new RegExp("^[0-9]+$"),
                                            message: "تنها اعداد مجاز می باشد",
                                        }
                                    ]}
                                >
                                    <Input
                                        maxLength={10}
                                        onKeyDown={(e) => {
                                            checkJustNumber(e);
                                        }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="توضیحات"
                                    name="description"
                                    initialValue={departmentInfo.description}
                                >
                                    <TextArea
                                        rows={window.innerWidth < 1025 ? 4 : 2}
                                        onChange={(el) => { }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="آدرس"
                                    name="address"
                                    initialValue={departmentInfo.address}
                                    rules={[{
                                        required: true, message: 'فیلد آدرس نمی تواند خالی باشد',
                                    }]}
                                >
                                    <TextArea
                                        rows={window.innerWidth < 1025 ? 4 : 2}
                                        onChange={(el) => { }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="تصویر"
                                    name="image"
                                    rules={[
                                        {
                                            message: "حجم تصویر بیش از حد مجاز است",
                                            validator: async (rule: any, value: any) => {
                                                if (imageInfo.file?.size! > imgSize)
                                                    throw new Error("Something wrong!");
                                            },
                                        },
                                    ]}
                                >
                                    <ImgCrop grid shape="rect" aspect={8 / 5} quality={0.9} rotate modalTitle="انتخاب تصویر">
                                        <Upload
                                            beforeUpload={(file) => {
                                                const isAllowedFormat = ["image/png", "image/jpg", "image/jpeg"]
                                                    .includes(file.type);
                                                if (!isAllowedFormat) {
                                                    message.error("تصویر باید دارای یکی از فرمت های png، jpg یا jpeg باشد.");
                                                }
                                                return isAllowedFormat;
                                            }}
                                            name="image"
                                            accept={".png, .jpg, .jpeg, "}
                                            multiple={false}
                                            maxCount={1}
                                            fileList={imageFile}
                                            customRequest={(e: any) => e.onSuccess("Ok")}
                                            onChange={setImage}
                                        >
                                            <Button icon={<UploadOutlined />}>انتخاب تصویر</Button>
                                            {!!imageInfo.name &&
                                                <div className="ant-upload-list-item ant-upload-list-item-default ant-upload-list-item-list-type-text">
                                                    <div className="ant-upload-list-item-info bs-file-btn-box">
                                                        <Button
                                                            style={{ height: "auto", padding: 0 }}
                                                            title={`${imageInfo.name}`}
                                                            onClick={(e) => {
                                                                setFileViewerVisible("image");
                                                                e.stopPropagation();
                                                            }}
                                                            type="link"
                                                            icon={<PaperClipOutlined />}
                                                        >
                                                            {imageInfo.name}
                                                        </Button>
                                                        <Button
                                                            style={{ height: "auto", padding: 0 }}
                                                            onClick={(e) => {
                                                                setImageInfo({ ...imageInfo, isChanged: true, name: null, url: null })
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
                                    label="لوگو"
                                    name="logo"
                                    rules={[{
                                        required: true, message: 'فیلد لوگو نمی تواند خالی باشد',
                                        validator: async () => {
                                            if (
                                                (!departmentInfo.isUpdateMode && !logoInfo.file) ||
                                                (departmentInfo.isUpdateMode && (!logoInfo.url && !logoInfo.file))
                                            )
                                                throw new Error("Something wrong!");
                                        }
                                    },
                                    {
                                        message: "حجم تصویر بیش از حد مجاز است",
                                        validator: async (rule: any, value: any) => {
                                            if (logoInfo.file?.size! > imgSize)
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
                                            name="logo"
                                            accept={".png, .jpg, .jpeg"}
                                            multiple={false}
                                            maxCount={1}
                                            fileList={logFile}
                                            customRequest={(e: any) => e.onSuccess("Ok")}
                                            onChange={setLogo}
                                        >
                                            <Button icon={<UploadOutlined />}>انتخاب لوگو</Button>
                                            {!!logoInfo.name &&
                                                <div className="ant-upload-list-item ant-upload-list-item-default ant-upload-list-item-list-type-text">
                                                    <div className="ant-upload-list-item-info bs-file-btn-box">
                                                        <Button
                                                            style={{ height: "auto", padding: 0 }}
                                                            title={`${logoInfo.name}`}
                                                            onClick={(e) => {
                                                                setFileViewerVisible("logo");
                                                                e.stopPropagation();
                                                            }}
                                                            type="link"
                                                            icon={<PaperClipOutlined />}
                                                        >
                                                            {logoInfo.name}
                                                        </Button>
                                                        <Button
                                                            style={{ height: "auto", padding: 0 }}
                                                            onClick={(e) => {
                                                                setLogoInfo({ ...logoInfo, isChanged: true, name: null, url: null });
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
                                    label="موقعیت مجموعه"
                                    rules={[{
                                        required: true, message: 'موقعیت روی نقشه، انتخاب شنده است.',
                                        validator: async () => {
                                            if (!departmentInfo.xpos || !departmentInfo.ypos)
                                                throw new Error("Something wrong!");
                                        },
                                    }]}
                                >
                                    <Button
                                        icon={<SiGooglemaps />}
                                        style={{ width: "100%" }}
                                        onClick={() => {
                                            setLocationVisible(true);
                                        }}
                                    >
                                        <span>انتخاب از روی تقشه</span>
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Content>
            </Layout>
        </Row>



        <Modal
            className="bsModal"
            footer
            title="انتخاب موقعیت"
            visible={locationVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            keyboard={true}
            destroyOnClose
        >
            <LeafletMap onclickMap={onClickMap} latitude={departmentInfo.xpos} longitude={departmentInfo.ypos} markerPopup={departmentInfo?.address!} showMarker />

        </Modal>

        {
            !!fileViewerVisible ?
                fileViewerVisible === "logo" ?
                    <FileViewer
                        close={closeFileViewer}
                        file={{ ...logoInfo }}
                    />
                    :
                    <FileViewer
                        close={closeFileViewer}
                        file={{ ...imageInfo }}
                    />
                :
                null
        }
    </Fragment>

};

export default observer(UnitInformation);
