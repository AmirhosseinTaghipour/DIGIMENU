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
    Tag
} from "antd";
import { ColumnsType } from "antd/es/table";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import {
    DeleteTwoTone,
    EditTwoTone,
    ExclamationCircleOutlined,
    LoadingOutlined,
    PlusCircleTwoTone,
} from "@ant-design/icons";
import { Content, Header } from "antd/lib/layout/layout";
import { IsNullOrEmpty, openNotification, selectTableRows } from "../../../../../app/common/util/util";
import { IFileListItemValues } from "../../../../../app/models/file";
import FileForm from "./FileForm";

interface IProps {
    entityId: string;
    entityName: string;
}

const FileList: React.FC<IProps> = ({ entityId, entityName }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        fileInfo,
        setFileInfo,
        loadFile,
        fileFormInfo,
        setFileFormInfo,
        fileList,
        loadFileList,
        fileCount,
        deleteFile,
        fileListValues,
        setFileListValues,
        deletingFile,
        loadingFile,
        sumbittingFile,
        loadingFileList
    } = rootStore.fileStore;

    const {
        closeForm,
    } = rootStore.mainStore;

    const [selectedRow, setSelectedRow] = useState<string>("");

    const [childFormVisible, setChildFormVisible] = useState(false);

    const closeChildForm = () => setChildFormVisible(false)

    const deleteItems = () => {
        const list: string[] = [];
        const selectedList = fileList.filter(function (value: IFileListItemValues) {
            return selectedRow.includes(value.id!);
        }) as IFileListItemValues[];
        selectedList.forEach((item: IFileListItemValues) => {
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
                deleteFile(selectedRow);
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
            await loadFile(id!);
        } else {
            clearFormValues();
        }
    };

    const clearFormValues = () => {
        setFileInfo({
            ...fileInfo,
            isChanged: false,
            file: null,
            name: null,
            url: null
        });
        setFileFormInfo({
            ...fileFormInfo,
            id: null,
            title: null,
            file: fileInfo,
            isDefault: false,
            isUpdateMode: false
        });
    };
    const initialLoad = async () => {
        await setFileListValues({
            ...fileListValues,
            entityId: entityId,
            entityName: entityName,
        }).then(()=> loadFileList());
    }
    useEffect(() => {
        initialLoad();
    }, [entityName, entityId]);

    const columns: ColumnsType<IFileListItemValues> = [
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
            title: "پیشفرض",
            dataIndex: "isDefault",
            key: "isDefault",
            align: "center",
            width: 100,
            render(value, record) {
                return {
                    children: (
                        <Fragment>{
                            (!!record?.isDefault) &&
                            <Tag color="blue">پیشفرض</Tag>
                        }</Fragment>
                    ),
                };
            },
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
                                    (sumbittingFile || loadingFileList) ?
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
                                    deletingFile ?
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
                            dataSource={fileList}
                            bordered
                            loading={loadingFileList}
                            tableLayout="fixed"
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

                    {!!fileList && fileList.length > 0 && (
                        <Pagination
                            pageSizeOptions={["10", "20", "30", "40", "50"]}
                            showSizeChanger={true}
                            total={fileCount}
                            current={fileListValues.page!}
                            showQuickJumper
                            size="default"
                            pageSize={fileListValues.limit == null ? 10 : fileListValues.limit}
                            showTotal={(total) => (
                                <span > مجموع: {total} مورد </span>
                            )}
                            responsive={true}
                            className="bsPaging"
                            onChange={(page, pageSize) => {
                                setFileListValues({ ...fileListValues, page: page, limit: pageSize! });
                                loadFileList();
                            }}
                        />
                    )}

                </Layout>
            </Row>

            <Modal
                className="bsModal"
                footer
                title={`${fileFormInfo.isUpdateMode ? "ویرایش" : "افزودن"} تصویر آیتم`}
                visible={childFormVisible}
                onCancel={closeChildForm}
                keyboard={true}
                destroyOnClose
            >
                <FileForm close={closeChildForm} />
            </Modal>
        </Fragment>
    )
};

export default observer(FileList);

