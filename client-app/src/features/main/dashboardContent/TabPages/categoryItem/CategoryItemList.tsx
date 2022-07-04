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
import { ICategoryItemListItemValues } from "../../../../../app/models/categoryItem";
import CategoryItem from "./CategoryItem";
import { ICategoryListItemValues } from "../../../../../app/models/category";
import FileList from "../file/FileList";

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const entiityName="CategoryItem";

const CategoryItemList: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadCategoryItem,
        categoryItemInfo,
        setCategoryItemInfo,
        categoryItemList,
        loadCategoryItemList,
        categoryItemCount,
        deleteCategoryItem,
        categoryItemListValues,
        setCategoryItemListValues,
        setCategoryItemListOrder,
        deletingCategoryItem,
        loadingCategoryItemList,
        sumbittingCategoryItem,
    } = rootStore.categoryItemStore;

    const {
        loadingCategoryList,
        loadCategoryList,
        categoryList
    } = rootStore.categoryStore;

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
        const selectedList = categoryItemList.filter(function (value: ICategoryItemListItemValues) {
            return selectedRows.includes(value.id!);
        }) as ICategoryItemListItemValues[];
        selectedList.forEach((item: ICategoryItemListItemValues) => {
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
                deleteCategoryItem(selectedRows);
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
            await loadCategoryItem(id!).then(() => {
                setDetaliFormVisible(true);
            });
        } else {
            clearFormValues();
            setDetaliFormVisible(false);
        }
    };

    const clearFormValues = () => {
        setCategoryItemInfo({
            ...categoryItemInfo,
            id: null,
            title: null,
            categoryId: null,
            price: null,
            discount: null,
            discountType: null,
            description: null,
            isExist: true,
            isUpdateMode: false
        })
    };

    useEffect(() => {
        loadCategoryList();
        loadCategoryItemList();
    }, []);

    const columns: ColumnsType<ICategoryItemListItemValues> = [
        {
            title: "ترتیب",
            key: "order",
            dataIndex: "order",
            width: 10,
            align: "center",
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.order! - b.order!,
        },
        {
            title: "ترتیب",
            key: "setOrder",
            dataIndex: "setOrder",
            width: 50,
            align: "center",
            render(value, record) {
                return {
                    children: (
                        <Fragment>
                            <Tooltip title="بالا" color="green">
                                <Button
                                    type="link"
                                    icon={<ArrowUpOutlined style={{ fontSize: '18px', color: '#099327' }} />}
                                    onClick={() => setCategoryItemListOrder(record?.id!, -1)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Tooltip>

                            <Tooltip title="پایین" color="red">
                                <Button
                                    type="link"
                                    icon={<ArrowDownOutlined style={{ fontSize: '18px', color: '#c31008' }} />}
                                    onClick={() => setCategoryItemListOrder(record?.id!, +1)}
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
            title: "عنوان",
            dataIndex: "title",
            key: "title",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!categoryItemListValues?.title ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadCategoryItemList();
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
                        defaultValue={categoryItemListValues?.title!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setCategoryItemListValues({
                                ...categoryItemListValues,
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
            title: "دسته",
            dataIndex: "categoryTitle",
            key: "categoryTitle",
            align: "center",
            width: 100,
            filterIcon: (filtered) => {
                return (
                    <SearchOutlined
                        style={{
                            color: !!categoryItemListValues?.categoryTitle ? "red" : "#1e1e1e"
                        }}
                    />
                );
            },

            filterDropdown: ({ confirm }) => {
                const doSearch = async (confirm: any) => {
                    await loadCategoryItemList();
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
                        defaultValue={categoryItemListValues?.categoryTitle!}
                        maxLength={50}
                        style={{ width: 250 }}
                        onBlur={(event: any) => {
                            setCategoryItemListValues({
                                ...categoryItemListValues,
                                page: 1,
                                categoryTitle: toDatabaseChar(event.target.value)!,
                            });
                            doSearch(confirm);
                        }}
                    />
                );
            },
        },
        {
            title: "قیمت (تومان)",
            dataIndex: "price",
            key: "price",
            align: "center",
            width: 80,
            render(value, record) {
                return {
                    children: (
                        <Fragment>{
                            (!!record?.discountValue && record.discountValue > 0) ?
                                <p style={{ direction: "ltr" }}>{toNumberFormat(record?.price! - record?.discountValue!)}  <span style={{ color: "red" }}>({record.discountPercent} %)</span></p>
                                :
                                <p>{toNumberFormat(record?.price!)}</p>
                        }</Fragment>

                    ),
                };
            },
        },
        {
            title: "وضعیت",
            dataIndex: "isExist",
            key: "isExist",
            align: "center",
            width: 60,
            render(value, record) {
                return {
                    children: (
                        <Fragment>
                            {record.isExist == true ?
                                <Tag color={"green"}>
                                    موجود
                                </Tag>
                                :
                                <Tag color={"red"}>
                                    ناموجود
                                </Tag>}
                        </Fragment>
                    )
                };
            }
        },
        {
            title: "تصویر پیشفرض",
            key: "url",
            dataIndex: "url",
            width: 80,
            align: "center",
            render(value, record) {
                return {
                    children: (
                        <Image className="bsImgIcon" key={`img-${record.id}`} src={!!value?`${value}?${Date.now()}`:"../../assets/Images/default-category-item.png"} preview />
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
                                    (sumbittingCategoryItem || loadingCategoryItemList) ?
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
                                    deletingCategoryItem ?
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
                                        name="categoryId"
                                    >
                                        <Select
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            loading={loadingCategoryList}
                                            onChange={(value: string) => {
                                                setCategoryItemListValues({
                                                    ...categoryItemListValues,
                                                    categoryId: !!value ? value : null
                                                });
                                                loadCategoryItemList();
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
                            columns={!!categoryItemListValues?.categoryId ? columns.filter(col => col.key != "order") : columns.filter(col => col.key != "order" && col.key != "setOrder")}
                            dataSource={categoryItemList}
                            bordered
                            scroll={{x:600}}
                            loading={loadingCategoryItemList}
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

                    {!!categoryItemList && categoryItemList.length > 0 && (
                        <Pagination
                            pageSizeOptions={["10", "20", "30", "40", "50"]}
                            showSizeChanger={true}
                            total={categoryItemCount}
                            current={categoryItemListValues.page!}
                            showQuickJumper
                            size="default"
                            pageSize={categoryItemListValues.limit == null ? 10 : categoryItemListValues.limit}
                            showTotal={(total) => (
                                <span > مجموع: {total} مورد </span>
                            )}
                            responsive={true}
                            className="bsPaging"
                            onChange={(page, pageSize) => {
                                setCategoryItemListValues({ ...categoryItemListValues, page: page, limit: pageSize! });
                                loadCategoryItemList();
                            }}
                        />
                    )}
                </Layout>
            </Row>

            <Modal
                className="bsModal"
                footer
                title={`${categoryItemInfo.isUpdateMode ? "ویرایش" : "افزودن"} آیتم های منو`}
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
                    <TabPane tab="اطلاعات آیتم" key="1"   >
                        <CategoryItem close={closeChildForm} />
                    </TabPane>

                    <TabPane tab="تصاویر مرتبط" key="2" disabled={!detaliFormVisible} >
                        <FileList entityName={entiityName} entityId={categoryItemInfo?.id!} />
                    </TabPane>

                </Tabs>
            </Modal>
        </Fragment>
    )
};

export default observer(CategoryItemList);

