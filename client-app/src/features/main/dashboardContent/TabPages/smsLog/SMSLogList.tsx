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
    Input
} from "antd";
import { ColumnsType } from "antd/es/table";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import {
    DeleteTwoTone,
    EditTwoTone,
    ExclamationCircleOutlined,
    EyeTwoTone,
    LoadingOutlined,
    PlusCircleTwoTone,
    SearchOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/lib/layout/layout";
import { IsNullOrEmpty, openNotification, selectTableRows, toDatabaseChar } from "../../../../../app/common/util/util";
import { ISMSLogListItemValues } from "../../../../../app/models/smsLog";
import SMSLog from "./SMSLog";

interface IProps {
    userId: string;
}

const SMSLogList: React.FC<IProps> = ({ userId }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadSMSLogList,
        loadingSMSLogList,
        loadSMSLog,
        smsLogCount,
        smsLogInfo,
        smsLogListValues,
        setSMSLogInfo,
        setSMSLogListValues,
        loadingSMSLog,
        smsLogList
    } = rootStore.smsLogStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const [selectedRow, setSelectedRow] = useState<string>("");

    const [childFormVisible, setChildFormVisible] = useState(false);

    const closeChildForm = () => setChildFormVisible(false)


    const getDetails = async (id: string | null) => {
        await initialFormParams(id).then(() => {
            setChildFormVisible(true);
        });
    };

    const initialFormParams = async (id: string | null) => {
        if (!IsNullOrEmpty(id)) {
            await loadSMSLog(id!);
        } else {
            clearFormValues();
        }
    };

    const clearFormValues = () => {
        setSMSLogInfo({
            ...smsLogInfo,
            id: null,
            receiver: null,
            mobile: null,
            message: null,
            keyParam: null,
            type: null,
            status: null
        });
    };
    const initialLoad = async () => {
        await setSMSLogListValues({
            ...smsLogListValues,
            userId: userId,
            page:1,
            limit:10
        }).then(() => loadSMSLogList());
    }
    useEffect(() => {
        initialLoad();
    }, [userId]);

    const columns: ColumnsType<ISMSLogListItemValues> = [
        {
            title: "مشاهده",
            key: "view",
            dataIndex: "view",
            width: 50,
            align: "center",

            render(value, record) {
                return {
                    children: (
                        <Tooltip title="مشاهده" color="orange">
                            <Button
                                type="link"
                                icon={<EyeTwoTone twoToneColor="#d35400" />}
                                onClick={() => getDetails(record.id)}
                                style={{ cursor: "pointer" }}
                            />
                        </Tooltip>
                    ),
                };
            },
        },
        {
            title: "دریافت کننده",
            dataIndex: "receiver",
            key: "receiver",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!smsLogListValues?.receiver ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadSMSLogList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="دریافت کننده"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={smsLogListValues?.receiver!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setSMSLogListValues({
                                ...smsLogListValues,
                                page: 1,
                                receiver: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },
        {
            title: "موبایل",
            dataIndex: "mobile",
            key: "mobile",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!smsLogListValues?.mobile ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadSMSLogList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="موبایل"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={smsLogListValues?.mobile!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setSMSLogListValues({
                                ...smsLogListValues,
                                page: 1,
                                mobile: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },
        {
            title: "پارامتر",
            dataIndex: "keyParam",
            key: "keyParam",
            align: "center",
            width: 100,
        },
        {
            title: "نوع",
            dataIndex: "type",
            key: "type",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!smsLogListValues?.type ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadSMSLogList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="نوع"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={smsLogListValues?.type!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setSMSLogListValues({
                                ...smsLogListValues,
                                page: 1,
                                type: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },
        {
            title: "وضعیت",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 100,
        }
    ];

    return (
        <Fragment>
            <Row className="bsFormBody">
                <Layout className="formBodyLayout">

                    <Content >
                        <Table
                            key="categoryIconList"
                            columns={columns}
                            dataSource={smsLogList}
                            bordered
                            loading={loadingSMSLogList}
                            tableLayout="fixed"
                            scroll={{x:600}}
                            pagination={false}
                            size="small"
                            sticky={true}
                            className="bsCustomTable"
                            onRow={(record) => {
                                return {
                                    className:
                                        selectedRow.indexOf(record.id!) > -1 ? "isSelected" : "",
                                    onClick: () => {
                                        setSelectedRow(record.id!)
                                    },
                                };
                            }}
                        />
                    </Content>

                    {!!smsLogList && smsLogList.length > 0 && (
                        <Pagination
                            pageSizeOptions={["10", "20", "30", "40", "50"]}
                            showSizeChanger={true}
                            total={smsLogCount}
                            current={smsLogListValues.page!}
                            showQuickJumper
                            size="default"
                            pageSize={smsLogListValues.limit == null ? 10 : smsLogListValues.limit}
                            showTotal={(total) => (
                                <span > مجموع: {total} مورد </span>
                            )}
                            responsive={true}
                            className="bsPaging"
                            onChange={(page, pageSize) => {
                                setSMSLogListValues({ ...smsLogListValues, page: page, limit: pageSize! });
                                loadSMSLogList();
                            }}
                        />
                    )}

                </Layout>
            </Row>

            <Modal
                className="bsModal"
                footer
                title="مشاهده پیام"
                visible={childFormVisible}
                onCancel={closeChildForm}
                keyboard={true}
                destroyOnClose
            >
                <SMSLog close={closeChildForm} />
            </Modal>
        </Fragment>
    )
};

export default observer(SMSLogList);

