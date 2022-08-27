import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
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
    Input,
    Tabs,
    Select,
    Tag
} from "antd";
import { ColumnsType } from "antd/es/table";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteTwoTone,
    DownCircleTwoTone,
    EditTwoTone,
    ExclamationCircleOutlined,
    FormOutlined,
    LoadingOutlined,
    PlusCircleTwoTone,
    SearchOutlined,
} from "@ant-design/icons"
import { Content, Header } from "antd/lib/layout/layout";
import { IsNullOrEmpty, openNotification, selectTableRows, toDatabaseChar, toNumberFormat } from "../../../../../app/common/util/util";
import { IUserManagementListItemValues } from "../../../../../app/models/user";
import UserManagement from "./UserManagement";
import SMSLogList from "../smsLog/SMSLogList";
import UserLogList from "../userLog/UserLogList";

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

interface IProps {
    departmentId?: string | null,
    isMain?:boolean
}

const defaultProps : any = {
    departmentId:null,
    isMain:false
};

const UserManagementList: React.FC<IProps> = ({ departmentId,isMain }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadUser,
        userInfo,
        setUserInfo,
        userList,
        loadUserList,
        userCount,
        deleteUser,
        userListValues,
        setUserListValues,
        deletingUser,
        loadingUserList,
        sumbittingUser,
    } = rootStore.userStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const { TabPane } = Tabs;
    const [form] = Form.useForm();
    const { Option } = Select;

    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const [formVisible, setFormVisible] = useState(false);
    const [detaliFormVisible, setDetaliFormVisible] = useState(false);

    const closeChildForm = () => setFormVisible(false)



    const deleteItems = () => {
        const list: string[] = [];
        const selectedList = userList.filter(function (value: IUserManagementListItemValues) {
            return selectedRows.includes(value.id!);
        }) as IUserManagementListItemValues[];
        selectedList.forEach((item: IUserManagementListItemValues) => {
            list.push(item?.userName!.toString());
        });

        Modal.confirm({
            title: "حذف اطلاعات",
            icon: <ExclamationCircleOutlined />,
            content: `آیا از حذف آیتم ${selectedRows.length > 1 ? "های" : ""
                } ${list.join(", ")} مطمئن هستید؟`,
            okText: "بله",
            cancelText: "خیر",
            onOk: () => {
                deleteUser(selectedRows);
                setSelectedRows([]);
            },
            bodyStyle: { direction: "rtl" },
        });
    };

    const getDetails = async (id: string | null) => {
        await initialFormParams(id).then(() => {
            setFormVisible(true);
        });
    };

    const initialFormParams = async (id: string | null) => {
        if (!IsNullOrEmpty(id)) {
            await loadUser(id!).then(() => {
                setDetaliFormVisible(true);
            });
        } else {
            clearFormValues();
            setDetaliFormVisible(false);
        }
    };

    const clearFormValues = () => {
        setUserInfo({
            ...userInfo,
            id: null,
            name: null,
            userName: null,
            password: null,
            departmentId: null,
            roleId: null,
            mobile: null,
            isActivated: false,
            isUpdateMode: false
        })
    };

    useEffect(() => {

        setUserListValues({ ...userListValues, departmentId: departmentId! }).then(
            () => loadUserList()
        );
    }, []);

    const columns: ColumnsType<IUserManagementListItemValues> = [
        {
            title: "ویرایش",
            key: "edit",
            dataIndex: "edit",
            width: 50,
            align: "center",

            render(value, record) {
                return {
                    children: (
                        <Tooltip title="ویرایش" color="orange">
                            <Button
                                type="link"
                                icon={<EditTwoTone twoToneColor="#d35400" />}
                                onClick={() => getDetails(record.id)}
                                style={{ cursor: "pointer" }}
                            />
                        </Tooltip>
                    ),
                };
            },
        },
        {
            title: "نام کاربری",
            dataIndex: "userName",
            key: "userName",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!userListValues?.userName ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadUserList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="نام کاربری"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={userListValues?.userName!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setUserListValues({
                                ...userListValues,
                                page: 1,
                                userName: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },
        {
            title: "نام",
            dataIndex: "name",
            key: "name",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!userListValues?.name ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadUserList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="عنوان دسته"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={userListValues?.name!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setUserListValues({
                                ...userListValues,
                                page: 1,
                                name: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },
        {
            title: "نقش",
            dataIndex: "roleName",
            key: "roleName",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!userListValues?.roleName ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadUserList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="نقش"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={userListValues?.roleName!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setUserListValues({
                                ...userListValues,
                                page: 1,
                                roleName: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },
        {
            title: "مجموعه",
            dataIndex: "departmentName",
            key: "departmentName",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!userListValues?.departmentName ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadUserList();
                    confirm();
                };
                return (
                    <Input.Search
                        allowClear
                        placeholder="مجموعه"
                        autoFocus
                        onSearch={() => confirm()}
                        onReset={() => confirm()}
                        onPressEnter={() => confirm()}
                        type="search"
                        defaultValue={userListValues?.departmentName!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setUserListValues({
                                ...userListValues,
                                page: 1,
                                departmentName: toDatabaseChar(event.target.value)!,
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
                            color: !!userListValues?.mobile ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadUserList();
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
                        defaultValue={userListValues?.mobile!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setUserListValues({
                                ...userListValues,
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
            title: "وضعیت",
            dataIndex: "isActivated",
            key: "isActivated",
            align: "center",
            width: 60,
            render(value, record) {
                return {
                    children: (
                        <Fragment>
                            {record.isActivated == true ?
                                <Tag color={"green"}>
                                    فعال
                                </Tag>
                                :
                                <Tag color={"red"}>
                                    غیرفعال
                                </Tag>}
                        </Fragment>
                    )
                };
            }
        }
    ];

    return (
        <Fragment>
           {isMain && <Row className="bsFormHeader">
                <div className="bsFormTitle"> <FormOutlined />
                    مدیریت کاربران
                </div>

                <Button icon={<CloseOutlined />} onClick={closeForm} />

            </Row>}

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
                                key="addNew"
                                disabled={false}
                                onClick={() => {
                                    getDetails(null);
                                }}
                                icon={
                                    (sumbittingUser || loadingUserList) ?
                                        <LoadingOutlined spin />
                                        :
                                        <PlusCircleTwoTone
                                            twoToneColor="#52c41a"
                                            className="bsBtnAdd"
                                        />

                                }
                            >
                                افزودن
                            </Menu.Item>

                            <Menu.Item
                                key="remove"
                                disabled={false}
                                onClick={() => {
                                    if (selectedRows.length == 0) {
                                        openNotification(
                                            "error",
                                            "خطا",
                                            "موردی برای حذف انتخاب نشده است",
                                            "topRight"
                                        );
                                    } else {
                                        deleteItems();
                                    }
                                }}
                                icon={
                                    deletingUser ?
                                        <LoadingOutlined spin />
                                        :
                                        <DeleteTwoTone
                                            twoToneColor="#d73a3a"
                                            className="bsBtnDelete"
                                        />
                                }
                            >
                                حذف
                            </Menu.Item>

                        </Menu>
                    </Header>
                    <Content >

                        <Table
                            key="userList"
                            columns={columns}
                            dataSource={userList}
                            bordered
                            scroll={{ x: 600 }}
                            loading={loadingUserList}
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

                    {!!userList && userList.length > 0 && (
                        <Pagination
                            pageSizeOptions={["10", "20", "30", "40", "50"]}
                            showSizeChanger={true}
                            total={userCount}
                            current={userListValues.page!}
                            showQuickJumper
                            size="default"
                            pageSize={userListValues.limit == null ? 10 : userListValues.limit}
                            showTotal={(total) => (
                                <span > مجموع: {total} مورد </span>
                            )}
                            responsive={true}
                            className="bsPaging"
                            onChange={(page, pageSize) => {
                                setUserListValues({ ...userListValues, page: page, limit: pageSize! }).then(
                                    () => loadUserList()
                                );
                            }}
                        />
                    )}
                </Layout>
            </Row>

            <Modal
                className="bsModal"
                footer
                title={`${userInfo.isUpdateMode ? "ویرایش" : "افزودن"} کاربران سامانه`}
                visible={formVisible}
                onCancel={closeChildForm}
                keyboard={true}
                destroyOnClose
            >
                <Tabs
                    hideAdd
                    defaultActiveKey="1"
                    type="card"
                    tabPosition="top"
                    size="small"
                    animated={true}
                    style={{
                        marginTop: ".2rem",
                        marginRight: "1rem",
                        marginLeft: "1rem",
                        height: "calc(100vh - 6.6rem)",
                    }}
                >
                    <TabPane tab="اطلاعات کاربر" key="1"   >
                        <UserManagement close={closeChildForm} />
                    </TabPane>

                    <TabPane tab="لاگهای مرتبط" key="2" disabled={!detaliFormVisible} >
                        <UserLogList userId={userInfo?.id!} />
                    </TabPane>

                    <TabPane tab="پیامهای مرتبط" key="3" disabled={!detaliFormVisible} >
                        <SMSLogList userId={userInfo?.id!} />
                    </TabPane>

                </Tabs>
            </Modal>
        </Fragment>
    )
};
UserManagementList.defaultProps=defaultProps;
export default observer(UserManagementList);

