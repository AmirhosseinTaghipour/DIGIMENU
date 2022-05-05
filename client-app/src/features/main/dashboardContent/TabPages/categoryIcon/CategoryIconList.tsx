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
    Modal
} from "antd";
import { ColumnsType } from "antd/es/table";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import {
    AppstoreOutlined,
    CloseOutlined,
    ColumnHeightOutlined,
    DeleteTwoTone,
    EditTwoTone,
    ExclamationCircleOutlined,
    ExpandOutlined,
    FormOutlined,
    LoadingOutlined,
    PlusCircleTwoTone,
} from "@ant-design/icons";
import { Content, Header } from "antd/lib/layout/layout";
import { IsNullOrEmpty, openNotification, selectTableRows } from "../../../../../app/common/util/util";
import { ICategoryIconListItemValues } from "../../../../../app/models/categoryIcon";
import CategoryIcon from "./CategoryIcon";



const CategoryIconList: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        iconInfo,
        setIconInfo,
        loadCategoryIcon,
        categoryIconInfo,
        setCategoryIconInfo,
        categoryIconList,
        loadCategoryIconList,
        deleteCategoryIcon,
        deletingCategoryIcon,
        loadingCategoryIconList,
        sumbittingCategoryIcon,
    } = rootStore.categoryIconStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const [selectedRow, setSelectedRow] = useState<string>("");

    const [childFormVisible, setChildFormVisible] = useState(false);

    const closeChildForm = () => setChildFormVisible(false)

    const deleteItems = () => {
        const list: string[] = [];
        const selectedList = categoryIconList.filter(function (value: ICategoryIconListItemValues) {
            return selectedRow.includes(value.id!);
        }) as ICategoryIconListItemValues[];
        selectedList.forEach((item: ICategoryIconListItemValues) => {
            list.push(item?.title!.toString());
        });

        Modal.confirm({
            title: "حذف اطلاعات",
            icon: <ExclamationCircleOutlined />,
            content: `آیا از حذف آیتم ${selectedRow.length > 1 ? "های" : ""
                } ${list.join(", ")} مطمئن هستید؟`,
            okText: "بله",
            cancelText: "خیر",
            onOk: () => {
                deleteCategoryIcon(selectedRow);
                setSelectedRow("");
            },
            bodyStyle: { direction: "rtl" },
        });
    };

    const getDetails = async (id: string | null) => {
        await initialFormParams(id).then(() => {
            setChildFormVisible(true);
        });
    };

    const initialFormParams = async (id: string | null) => {
        if (!IsNullOrEmpty(id)) {
           await loadCategoryIcon(id!);
        } else {
            clearFormValues();
        }
    };

    const clearFormValues = () => {
        setIconInfo({
            ...iconInfo,
            isChanged: false,
            file: null,
            name: null,
            url: null
        })
        setCategoryIconInfo({
            ...categoryIconInfo,
            id: null,
            title: null,
            icon: iconInfo,
            isUpdateMode: false
        })
    };

    useEffect(() => {
        loadCategoryIconList();
    }, []);

    const columns: ColumnsType<ICategoryIconListItemValues> = [
        {
            title: "ویرایش",
            key: "edit",
            dataIndex: "edit",
            width: 20,
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
            title: "عنوان",
            dataIndex: "title",
            key: "title",
            align: "center",
            width: 100,
        },
        {
            title: "فایل",
            key: "url",
            dataIndex: "url",
            width: 50,
            align: "center",
            render(value, record) {
                return {
                    children: (
                        <Image className="bsImgIcon" key={`img-${record.id}`} src={`${value}?${Date.now()}`} preview />
                    ),
                };
            },
        },
    ];

    return (
        <Fragment>
            <Row className="bsFormHeader">
                <div className="bsFormTitle"> <FormOutlined />
                    مدیریت آیکن
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
                                key="addNewCondition"
                                disabled={false}
                                onClick={() => {
                                    getDetails(null);
                                }}
                                icon={
                                    (sumbittingCategoryIcon || loadingCategoryIconList) ?
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
                                key="removeCondition"
                                disabled={false}
                                onClick={() => {
                                    if (selectedRow.length == 0) {
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
                                    deletingCategoryIcon ?
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
                            key="categoryIconList"
                            columns={columns}
                            dataSource={categoryIconList}
                            bordered
                            loading={loadingCategoryIconList}
                            tableLayout="fixed"
                            pagination={false}
                            size="small"
                            sticky={true}
                            className="bsCustomTable"
                            onChange={() => { }}
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
                </Layout>
            </Row>



            <Modal
                className="bsModal"
                footer
                title={`${categoryIconInfo.isUpdateMode ? "ویرایش" : "افزودن"} آیکن`}
                visible={childFormVisible}
                onCancel={closeChildForm}
                keyboard={true}
                destroyOnClose
            >
                <CategoryIcon close={closeChildForm} />

            </Modal>
        </Fragment>
    )
};

export default observer(CategoryIconList);
