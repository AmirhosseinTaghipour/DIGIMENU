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
    Select
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
    MenuOutlined,
    PlusCircleTwoTone,
    ProfileTwoTone,
    SearchOutlined,
    UpCircleTwoTone,
} from "@ant-design/icons"
import { Content, Header } from "antd/lib/layout/layout";
import { IsNullOrEmpty, openNotification, selectTableRows, toDatabaseChar } from "../../../../../app/common/util/util";
import { ICategoryIconListItemValues } from "../../../../../app/models/categoryIcon";
import CategoryItem from "./CategoryItem";
import { ICategoryListItemValues } from "../../../../../app/models/category";
import CategoryItemImage from "./CategoryItemImage";

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const CategoryItemList: React.FC = () => {
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

    const { TabPane } = Tabs;
    const [form] = Form.useForm();
    const { Option } = Select;

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
            width: 15,
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
            // filterIcon: (filtered) => {
            //     return (
            //         <SearchOutlined
            //             style={{
            //                 color: !!categoryListValues?.title ? "red" : "#1e1e1e"
            //             }}
            //         />
            //     );
            // },

            // filterDropdown: ({ confirm }) => {
            //     const doSearch = async (confirm: any) => {
            //         await loadCategoryList();
            //         confirm();
            //     };
            //     return (
            //         <Input.Search
            //             allowClear
            //             placeholder="عنوان دسته"
            //             autoFocus
            //             onSearch={() => confirm()}
            //             onReset={() => confirm()}
            //             onPressEnter={() => confirm()}
            //             type="search"
            //             defaultValue={categoryListValues?.title!}
            //             maxLength={50}
            //             style={{ width: 250 }}
            //             onBlur={(event: any) => {
            //                 setCategoryListValues({
            //                     ...categoryListValues,
            //                     page: 1,
            //                     title: toDatabaseChar(event.target.value)!,
            //                 });
            //                 doSearch(confirm);
            //             }}
            //         />
            //     );
            // },
        },
        {
            title: "دسته",
            dataIndex: "categoryTitle",
            key: "categoryTitle",
            align: "center",
            width: 100,
            // filterIcon: (filtered) => {
            //     return (
            //         <SearchOutlined
            //             style={{
            //                 color: !!categoryListValues?.title ? "red" : "#1e1e1e"
            //             }}
            //         />
            //     );
            // },

            // filterDropdown: ({ confirm }) => {
            //     const doSearch = async (confirm: any) => {
            //         await loadCategoryList();
            //         confirm();
            //     };
            //     return (
            //         <Input.Search
            //             allowClear
            //             placeholder="عنوان دسته"
            //             autoFocus
            //             onSearch={() => confirm()}
            //             onReset={() => confirm()}
            //             onPressEnter={() => confirm()}
            //             type="search"
            //             defaultValue={categoryListValues?.title!}
            //             maxLength={50}
            //             style={{ width: 250 }}
            //             onBlur={(event: any) => {
            //                 setCategoryListValues({
            //                     ...categoryListValues,
            //                     page: 1,
            //                     title: toDatabaseChar(event.target.value)!,
            //                 });
            //                 doSearch(confirm);
            //             }}
            //         />
            //     );
            // },
        },
        {
            title: "تصویر پیشفرض",
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
                    آیتم های منو
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

                        <Form
                            form={form}
                            onFinish={() => { }}
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

                                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                    <Form.Item
                                        label="دسته بندی"
                                        name="iconId"
                                        initialValue={categoryInfo?.iconId!}
                                    >
                                        <Select
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            loading={loadingCategoryList}
                                            onChange={(value: string) => {
                                                setCategoryInfo({
                                                    ...categoryInfo,
                                                    iconId: !!value ? value : null
                                                });
                                            }}
                                            filterOption={(input, option) =>
                                                option!.children
                                                    .toLowerCase()
                                                    .indexOf(toDatabaseChar(input.toLowerCase())) >= 0
                                            }
                                            placeholder="انتخاب"
                                            allowClear={
                                                categoryList &&
                                                categoryList.length > 1
                                            }
                                            bordered
                                            menuItemSelectedIcon={
                                                <CheckOutlined style={{ color: "green" }} />
                                            }
                                        >
                                            {categoryList &&
                                                categoryList.length > 0 &&
                                                categoryList.map((val: ICategoryListItemValues) => {
                                                    return (
                                                        <Option key={val.key!} value={val.key!}>
                                                            {toDatabaseChar(val.title)} <Image className="bsImgInDropDown" key={`img-${val.key}`} src={`${val.url}?${Date.now()}`} preview={false} />
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>

                            </Row>
                        </Form>

                        <Table
                            key="categoryItemList"
                            columns={!!categoryInfo?.iconId ? columns.filter(col => col.key != "order") : columns.filter(col => col.key != "order" && col.key != "setOrder")}
                            dataSource={categoryList}
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
                title={`${categoryInfo.isUpdateMode ? "ویرایش" : "افزودن"} آیتم های منو`}
                visible={childFormVisible}
                onCancel={closeChildForm}
                keyboard={true}
                destroyOnClose
            >
                <Tabs
                    hideAdd
                    // onChange={onChange}
                    // activeKey={activeKey}
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
                // addIcon={<Icon name='add user' />}
                >
                    <TabPane tab="اطلاعات آیتم" key="1"   >
                        <CategoryItem close={closeChildForm} />
                    </TabPane>

                    <TabPane tab="تصاویر مرتبط" key="2" disabled={false} >
                        <CategoryItemImage />
                    </TabPane>

                </Tabs>


            </Modal>

        </Fragment>
    )
};

export default observer(CategoryItemList);

