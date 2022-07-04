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
    Input
} from "antd";
import { ColumnsType } from "antd/es/table";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CloseOutlined,
    DeleteTwoTone,
    DownCircleTwoTone,
    EditTwoTone,
    ExclamationCircleOutlined,
    FormOutlined,
    LoadingOutlined,
    MenuOutlined,
    PlusCircleTwoTone,
    ProfileTwoTone,
    SearchOutlined,
    UpCircleTwoTone,
} from "@ant-design/icons"
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import update from 'immutability-helper';
// import {
//     SortableContainer,
//     SortableElement,
//     SortableHandle,
// } from 'react-sortable-hoc';
// import arrayMove from 'array-move';
// import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Content, Header } from "antd/lib/layout/layout";
import { IsNullOrEmpty, openNotification, selectTableRows, toDatabaseChar } from "../../../../../app/common/util/util";
import { ICategoryIconListItemValues } from "../../../../../app/models/categoryIcon";
import MenuCategory from "./MenuCategory";
import { ICategoryListItemValues } from "../../../../../app/models/category";


const MenuCategoryList: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadCategory,
        categoryInfo,
        setCategoryInfo,
        categoryList,
        loadCategoryList,
        categoryCount,
        deleteCategory,
        categoryListValues,
        setCategoryListValues,
        setCategoryListOrder,
        deletingCategory,
        loadingCategoryList,
        sumbittingCategory,
    } = rootStore.categoryStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const [childFormVisible, setChildFormVisible] = useState(false);

    const closeChildForm = () => setChildFormVisible(false)



    const deleteItems = () => {
        const list: string[] = [];
        const selectedList = categoryList.filter(function (value: ICategoryIconListItemValues) {
            return selectedRows.includes(value.id!);
        }) as ICategoryIconListItemValues[];
        selectedList.forEach((item: ICategoryIconListItemValues) => {
            list.push(item?.title!.toString());
        });

        Modal.confirm({
            title: "حذف اطلاعات",
            icon: <ExclamationCircleOutlined />,
            content: `آیا از حذف آیتم ${selectedRows.length > 1 ? "های" : ""
                } ${list.join(", ")} مطمئن هستید؟`,
            okText: "بله",
            cancelText: "خیر",
            onOk: () => {
                deleteCategory(selectedRows);
                setSelectedRows([]);
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
            await loadCategory(id!);
        } else {
            clearFormValues();
        }
    };

    const clearFormValues = () => {
        setCategoryInfo({
            ...categoryInfo,
            id: null,
            title: null,
            iconId: null,
            isUpdateMode: false
        })
    };

    useEffect(() => {
        loadCategoryList();
    }, []);

    const columns: ColumnsType<ICategoryListItemValues> = [
        {
            title: "ترتیب",
            key: "order",
            dataIndex: "order",
            width: 15,
            align: "center",
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.order! - b.order!,
        },
        {
            title: "ترتیب",
            key: "setOrder",
            dataIndex: "setOrder",
            width: 25,
            align: "center",
            render(value, record) {
                return {
                    children: (
                        <Fragment>
                            <Tooltip title="بالا" color="green">
                                <Button
                                    type="link"
                                    icon={<ArrowUpOutlined style={{ fontSize: '18px', color: '#099327' }} />}
                                    onClick={() => setCategoryListOrder(record?.id!, -1)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Tooltip>

                            <Tooltip title="پایین" color="red">
                                <Button
                                    type="link"
                                    icon={<ArrowDownOutlined style={{ fontSize: '18px', color: '#c31008' }} />}
                                    onClick={() => setCategoryListOrder(record?.id!, +1)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Tooltip>
                        </Fragment>
                    ),
                };
            }
        },
        {
            title: "ویرایش",
            key: "edit",
            dataIndex: "edit",
            width: 25,
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
            title: "عنوان دسته",
            dataIndex: "title",
            key: "title",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!categoryListValues?.title ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadCategoryList();
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
                        defaultValue={categoryListValues?.title!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setCategoryListValues({
                                ...categoryListValues,
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
            title: "آیکن",
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
                    دسته بندی منو
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
                                key="addNew"
                                disabled={false}
                                onClick={() => {
                                    getDetails(null);
                                }}
                                icon={
                                    (sumbittingCategory || loadingCategoryList) ?
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
                                    deletingCategory ?
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
                            columns={columns.filter(col => col.key != "order")}
                            dataSource={categoryList}
                            scroll={{x:500}}
                            bordered
                            loading={loadingCategoryList}
                            tableLayout="fixed"
                            pagination={false}
                            size="small"
                            sticky={true}
                            className="bsCustomTable"
                            onChange={() => { }}
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

                    {!!categoryList && categoryList.length > 0 && (
                        <Pagination
                            pageSizeOptions={["10", "20", "30", "40", "50"]}
                            showSizeChanger={true}
                            total={categoryCount}
                            current={categoryListValues.page!}
                            showQuickJumper
                            size="default"
                            pageSize={categoryListValues.limit == null ? 10 : categoryListValues.limit}
                            showTotal={(total) => (
                                <span > مجموع: {total} مورد </span>
                            )}
                            responsive={true}
                            className="bsPaging"
                            onChange={(page, pageSize) => {
                                setCategoryListValues({ ...categoryListValues, page: page, limit: pageSize! });
                                loadCategoryList();
                            }}
                        />
                    )}

                </Layout>
            </Row>



            <Modal
                className="bsModal"
                footer
                title={`${categoryInfo.isUpdateMode ? "ویرایش" : "افزودن"} دسته بندی منو`}
                visible={childFormVisible}
                onCancel={closeChildForm}
                keyboard={true}
                destroyOnClose
            >
                <MenuCategory close={closeChildForm} />

            </Modal>
        </Fragment>
    )
};

export default observer(MenuCategoryList);
