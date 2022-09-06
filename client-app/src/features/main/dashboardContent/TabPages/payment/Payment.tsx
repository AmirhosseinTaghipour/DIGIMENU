import React, { Fragment, useContext, useEffect, useState } from "react";
import {
    Table,
    Image,
    Tooltip,
    Button,
    Row,
    Layout,
    Menu,
    Form,
    Col,
    Modal,
    Pagination,
    Tag,
    Input,
    Radio,
    Space
} from "antd";
import { ColumnsType } from "antd/es/table";
import {
    CloseOutlined,
    DeleteTwoTone,
    DollarTwoTone,
    EditTwoTone,
    ExclamationCircleOutlined,
    EyeTwoTone,
    FormOutlined,
    LoadingOutlined,
    PlusCircleTwoTone,
    SaveTwoTone,
    SearchOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite"
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { IMenuFormValues } from "../../../../../app/models/menu";
import { IPaymentFormValues, IPaymentListItemValues } from "../../../../../app/models/payment";
import { IsNullOrEmpty, openNotification, selectTableRows, toDatabaseChar, toNumberFormat } from "../../../../../app/common/util/util";


const { Content, Header } = Layout;
const { TextArea } = Input;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const Payment: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadUnitPaymentList,
        loadingPaymentList,
        paymentCount,
        paymentList,
        paymentInfo,
        setPaymentInfo,
        submittingPayment,
        setPaymentListValues,
        paymentListValues,
        insertPayment,
        payment,
        callingPayment
    } = rootStore.paymentStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const [form] = Form.useForm();
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    //سابمیت فرم 
    const onFinish = async (formValues: IPaymentFormValues) => {
        setPaymentInfo({
            ...paymentInfo,
            type: formValues.type,
        });
        await insertPayment(paymentInfo).then(() => loadUnitPaymentList());
    };

    const callPayment = async (recordId: string) => {
        await payment(recordId);
    }

    useEffect(() => {
        loadUnitPaymentList();
    }, []);

    const columns: ColumnsType<IPaymentListItemValues> = [
        {
            title: "پرداخت",
            key: "payment",
            dataIndex: "payment",
            width: 100,
            align: "center",
            render(value, record) {
                return {
                    children: (
                        <Fragment>
                            {record?.status == 2 ?
                                <Button
                                    type="primary"
                                    onClick={() => callPayment(record?.id!)}
                                    style={{ cursor: "pointer" }}
                                    loading={callingPayment}
                                >
                                    پرداخت
                                </Button> : null
                            }
                        </Fragment>
                    ),
                };
            },
        },

        {
            title: "عنوان",
            dataIndex: "title",
            key: "title",
            align: "center",
            width: 170,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!paymentListValues?.title ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },
            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadUnitPaymentList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="عنوان"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={paymentListValues?.title!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setPaymentListValues({
                                ...paymentListValues,
                                page: 1,
                                title: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },

        {
            title: "مبلغ (تومان)",
            dataIndex: "amount",
            key: "amount",
            align: "center",
            width: 100,
        },

        {
            title: "وضعیت",
            dataIndex: "statusTitle",
            key: "statusTitle",
            align: "center",
            width: 120,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!paymentListValues?.statusTitle ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },
            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadUnitPaymentList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="وضعیت"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={paymentListValues?.statusTitle!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setPaymentListValues({
                                ...paymentListValues,
                                page: 1,
                                statusTitle: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },

        },

        {
            title: "شناسه",
            dataIndex: "pId",
            key: "pId",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!paymentListValues?.pId ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },
            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadUnitPaymentList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="شناسه پرداخت"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={paymentListValues?.pId!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setPaymentListValues({
                                ...paymentListValues,
                                page: 1,
                                pId: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },

        {
            title: "تاریخ",
            dataIndex: "pDate",
            key: "pDate",
            align: "center",
            width: 100,
        },

        {
            title: "ساعت",
            dataIndex: "pTime",
            key: "pTime",
            align: "center",
            width: 100,
        },

        {
            title: "اتمام اشتراک",
            dataIndex: "expireDate",
            key: "expireDate",
            align: "center",
            width: 100,
        },

        {
            title: "فعال؟",
            dataIndex: "isActivated",
            key: "isActivated",
            align: "center",
            width: 100,
            render(value, record) {
                return {
                    children: (
                        <Fragment>
                            {record.isActivated &&
                                <Tag color={"green"}>
                                    فعال
                                </Tag>
                            }
                        </Fragment>
                    )
                };
            }
        },
    ];

    return <Fragment>
        <Row className="bsFormHeader">
            <div className="bsFormTitle"> <FormOutlined />
                پرداخت و اشتراک
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
                                (loadingPaymentList || submittingPayment) ? <LoadingOutlined spin /> :
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
                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    label="نوع اشتراک"
                                    name="type"
                                    initialValue={20}
                                >
                                    <Radio.Group>
                                        <Space direction="vertical">
                                            <Radio value={10}>فعال شدن منو دیجیتال به صورت دمو (تست رایگان 15 روزه)</Radio>
                                            <Radio value={20}>خرید اشتراک یکساله</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                        </Row>
                    </Form>

                    <Table
                        key="paymentList"
                        columns={columns.filter(col => col.key != "key")}
                        dataSource={paymentList}
                        bordered
                        scroll={{ x: 600 }}
                        loading={loadingPaymentList}
                        tableLayout="fixed"
                        pagination={false}
                        size="small"
                        sticky={true}
                        className="bsCustomTable"
                        onRow={(record) => {
                            return {
                                className:
                                    selectedRows.indexOf(record.key!) > -1 ? "isSelected" : "",
                                onClick: (event: any) => {
                                    setSelectedRows(selectTableRows(event, record.key!, selectedRows));
                                }
                            }
                        }
                        }
                    />

                </Content>

                {!!paymentList && paymentList.length > 0 && (
                    <Pagination
                        pageSizeOptions={["10", "20", "30", "40", "50"]}
                        showSizeChanger={true}
                        total={paymentCount}
                        current={paymentListValues.page!}
                        showQuickJumper
                        size="default"
                        pageSize={paymentListValues.limit == null ? 10 : paymentListValues.limit}
                        showTotal={(total) => (
                            <span > مجموع: {total} مورد </span>
                        )}
                        responsive={true}
                        className="bsPaging"
                        onChange={(page, pageSize) => {
                            setPaymentListValues({ ...paymentListValues, page: page, limit: pageSize! });
                            loadUnitPaymentList();
                        }}
                    />
                )}
            </Layout>
        </Row>
    </Fragment>

};

export default observer(Payment);


