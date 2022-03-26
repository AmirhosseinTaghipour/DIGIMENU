import React, { Fragment, useContext, useEffect } from "react"
import { Input, Layout, Menu, Row, Form, Col, Button } from "antd";
import { observer } from "mobx-react-lite"
import { CloseCircleOutlined, CloseOutlined, FormOutlined, LoadingOutlined, SaveTwoTone } from "@ant-design/icons";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { Footer } from "antd/lib/layout/layout";

const { Content, Header } = Layout;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const UnitMenu: React.FC = () => {
    const rootStore = useContext(RootStoreContext);

    // const {
    //     insertingReceiptSampleCondition,
    //     updatingReceiptSampleCondition,
    //     insertReceiptSampleCondition,
    //     updateReceiptSampleCondition,
    //     receiptSampleConditionFormValues,
    //     setReceiptSampleConditionFormValues
    // } = rootStore.receiptSampleConditionStore;


    const [form] = Form.useForm();

    //سابمیت فرم 
    const onFinish = async () => {
        // if (isFormValid())
        //     if (false)
        //         await updateReceiptSampleCondition();
        //     else
        //         await insertReceiptSampleCondition();
    };

    //اعتبار سنجی های مورد نیاز فرم
    const isFormValid = (): boolean => {
        let res = true;
        // let msg = "";
        // if (!receiptSampleConditionFormValues.min && !receiptSampleConditionFormValues.max && !receiptSampleConditionFormValues.conditionDesc?.trim()) {
        //     res = false;
        //     msg = "حداقل / حداکثر شرایط نگهداری یا شرح شرایط نگهداری ، باید وارد شود";
        // }
        // if (!!receiptSampleConditionFormValues.min && !!receiptSampleConditionFormValues.max) {
        //     if (receiptSampleConditionFormValues.max < receiptSampleConditionFormValues.min) {
        //         res = false;
        //         msg = "حداکثر شرایط نگهداری نمی تواند کوچکتر از حداقل آن باشد";
        //     }
        // }

        // if (!!receiptSampleConditionFormValues.min || !!receiptSampleConditionFormValues.max) {
        //     if (!receiptSampleConditionFormValues.maxCountingUnitCode && !receiptSampleConditionFormValues.conditionDesc) {
        //         res = false;
        //         msg = "واحد اندازه گیری / شرح شرایط نگهداری تعیین نشده است";
        //     }
        // }

        // !res && openNotification("error", "", msg, "topRight");
        return res;
    }

    // در صورت نیاز به آپدیت سرچ پارامز این فانکشن به کامپوننت ارسال می شود
    // const setReceiptSampleConditionFunction = (input: object) => {
    //     setReceiptSampleConditionFormValues(input as IReceiptSampleConditionFormValues);
    // }


    useEffect(() => {
        /* console.log('Im rerendering...  :)')*/
    }, []);

    return <Fragment>
        <Row className="bsFormHeader">
            <div className="bsFormTitle"> <FormOutlined />
                ساخت منو
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
                                form.validateFields(['hcSampleConditionTypeCode']).then(() => {
                                    onFinish().then(() => { });
                                });

                            }}
                            icon={
                                false ? <LoadingOutlined spin /> :
                                    <SaveTwoTone
                                        twoToneColor="#52c41a"
                                        style={{
                                            fontSize: "1.1rem",
                                            top: "0.1rem",
                                            position: "relative",
                                            marginLeft: "5px",
                                        }}
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
                            <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                                <Form.Item
                                    label="شرایط نگهداری"
                                    name="hcSampleConditionTypeCode"
                                    rules={[{
                                        required: true, message: 'مقدار شرایط نگهداری نمی تواند خالی باشد',
                                    }]}
                                >
                                    <Input
                                        onChange={() => { }}
                                        maxLength={11}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                                <Form.Item
                                    label="حداقل"
                                    name="min"
                                    initialValue={null}
                                >
                                    <Input
                                        onChange={() => { }}
                                        maxLength={11}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                                <Form.Item
                                    label="حداکثر"
                                    name="max"
                                    initialValue={null}

                                >
                                    <Input
                                        onChange={() => { }}
                                        maxLength={11}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                                <Form.Item
                                    label="واحد"
                                    name="maxCountingUnitCode"
                                >
                                    <Input
                                        onChange={() => { }}
                                        maxLength={11}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="شرح"
                                    name="conditionDesc"
                                    initialValue={null}
                                >
                                    <TextArea
                                        rows={window.innerWidth < 1025 ? 4 : 2}
                                        onChange={(el) => { }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Content>
            </Layout>
        </Row>
    </Fragment>
}
export default observer(UnitMenu);