import React, { Fragment, useContext, useEffect, useState } from "react"
import { Input, Layout, Menu, Row, Form, Col, Modal, Button, Upload, message } from "antd";
import ImgCrop from 'antd-img-crop';
import { observer } from "mobx-react-lite"
import { CloseOutlined, FormOutlined, LoadingOutlined, SaveTwoTone, UploadOutlined } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { IDepartmentFormValues } from "../../../../../app/models/department";
import { checkJustNumber } from "../../../../../app/common/util/util";
import { SiGooglemaps } from "react-icons/si";
import LeafletMap from "../../../../common/Map/LeafletMap";
import SkeletonImage from "antd/lib/skeleton/Image";
import { UploadChangeParam } from "antd/lib/upload";
import { ok } from "assert";
import { UploadRequestOption } from "rc-upload/lib/interface";


const { Content, Header } = Layout;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
const UnitInformation: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { insertingDepartment,
        insertDepartment,
        loadDepartment,
        loadingDepartment,
        departmentInfo
    } = rootStore.departmentStore;
    const [form] = Form.useForm();

    const [locationVisible, setLocationVisible] = useState(false);

    const handleOk = (e: any) => {
        setLocationVisible(false);
    };

    const handleCancel = (e: any) => {
        setLocationVisible(false);
    };

    const onClickMap = (point: L.LatLng) => {
        departmentInfo.xpos = point.lat;
        departmentInfo.ypos = point.lng;
        form.validateFields(['location']);
    }


    const setImage = async (input: UploadChangeParam) => {
        if (input.file.status != "removed")
            departmentInfo.image = input.file.originFileObj as Blob;
        else
            departmentInfo.image = null
        form.validateFields(['image']);
    }

    const setLogo = async (input: UploadChangeParam) => {
        if (input.file.status != "removed")
            departmentInfo.logo = input.file.originFileObj as Blob;
        else
            departmentInfo.logo = null
        form.validateFields(['logo']);

    }
    //سابمیت فرم 
    const onFinish = async (values: IDepartmentFormValues) => {
        form.setFieldsValue({
            ["xpos"]: departmentInfo.xpos,
            ["ypos"]: departmentInfo.ypos,
            ["image"]: departmentInfo.image,
            ["logo"]: departmentInfo.logo,
        });
        await insertDepartment(values);
    };

    //اعتبار سنجی های مورد نیاز فرم
    const isFormValid = (): boolean => {
        let res = true;
        return res;
    }
    return <Fragment>
        <Row className="bsFormHeader">
            <div className="bsFormTitle"> <FormOutlined />
                اطلاعات مجموعه
            </div>

            <Button>
                <CloseOutlined />
            </Button>
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
                                (loadingDepartment || insertingDepartment) ? <LoadingOutlined spin /> :
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
                                            message: "حجم تصویر باید کمتر از یک مگابایت باشد",
                                            validator: async (rule: any, value: any) => {
                                                if (departmentInfo.image?.size! > 1000)

                                                    throw new Error("Something wrong!");

                                            },
                                        },
                                    ]}
                                >
                                    <ImgCrop grid shape="rect" aspect={16 / 9} quality={1} rotate modalTitle="انتخاب تصویر">
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
                                            customRequest={(e: any) => e.onSuccess("Ok")}
                                            onChange={setImage}
                                        >
                                            <Button icon={<UploadOutlined />}>انتخاب تصویر</Button>
                                        </Upload>
                                    </ImgCrop>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                <Form.Item
                                    label="لوگو"
                                    name="logo"
                                    initialValue={departmentInfo.logo}
                                    rules={[{
                                        required: true, message: 'فیلد لوگو نمی تواند خالی باشد',
                                        validator: async () => {
                                            if (!departmentInfo.logo)
                                                throw new Error("Something wrong!");
                                        },
                                    }]}
                                >
                                    <ImgCrop shape="round" quality={1} rotate modalTitle="انتخاب لوگو">
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
                                            customRequest={(e: any) => e.onSuccess("Ok")}
                                            onChange={setLogo}

                                        >
                                            <Button icon={<UploadOutlined />}>انتخاب لوگو</Button>
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
                                <Form.Item
                                    name="xpos"
                                    hidden
                                />
                                <Form.Item
                                    name="ypos"
                                    hidden
                                />
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
    </Fragment>

};

export default observer(UnitInformation);
