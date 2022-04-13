import React, { Fragment, useContext } from "react";
import {
    Table,
    Input,  
    Tooltip,
    Button
} from "antd";
import { ColumnsType } from "antd/es/table";
import { RootStoreContext } from "../../../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
// import Highlighter from 'react-highlight-words';
import {
    ColumnHeightOutlined,
    EditTwoTone,
    ExpandOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { toDatabaseChar } from "../../../../../app/common/util/util";
import { ICategoryFormValues } from "../../../../../app/models/category";



const MenuCategoryTable: React.FC=() => {
    const rootStore = useContext(RootStoreContext);
    // const {
    //     searchParams,
    //     operationalReportList,
    //     loadingOperationalReport,
    //     setSearchParameters,
    //     loadOperationalReport,
    //     setCurrentPage,
    // } = rootStore.operationalReportStore;

    const onTableChange = async (pagination: any, filters: any, sorter: any) => {
        // setCurrentPage(1);
        // setSearchParameters({
        //     ...searchParams,
        //     POrder: `${sorter.order === undefined
        //         ? "TITLE ASC"
        //         : sorter.columnKey.toUpperCase()
        //         } ${sorter.order === undefined
        //             ? ""
        //             : sorter.order === "ascend"
        //                 ? "ASC"
        //                 : "DESC"
        //         }`,
        // });
        // await loadOperationalReport();
    };

    const columns: ColumnsType<ICategoryFormValues> = [
        {
            title: "ترتیب",
            dataIndex: "order",
            key: "order",
            align: "center",
            width: 20,
            render ( value, record ) {
                return {
                    children: (
                        <Tooltip title="ترتیب دسته بندی" color="orange">
                            <Button
                                type="link"
                                icon={ <ColumnHeightOutlined twoToneColor="#d35400" /> }
                                onClick={ ( event : any ) => {
                                    event.stopPropagation();
                                } }
                                style={ { cursor: "pointer" } }
                            />
                        </Tooltip>
                    ),
                };
            },
        },   
        {
            title: "ویرایش",
            key: "edit",
            dataIndex: "edit",
            width: 20,
            align: "center",

            render ( value, record ) {
                return {
                    children: (
                        <Tooltip title="ویرایش" color="orange">
                            <Button
                                type="link"
                                icon={ <EditTwoTone twoToneColor="#d35400" /> }
                                onClick={ ( event : any ) => {
                                    event.stopPropagation();
                                } }
                                style={ { cursor: "pointer" } }
                            />
                        </Tooltip>
                    ),
                };
            },
        },
        {
            title: "عنوان دسته",
            dataIndex: "title",
            key: "dakhlivaredati",
            align: "center",
            width: 100,
        },   
        {
            title: "فایل",
            key: "icon",
            dataIndex: "icon",
            width: 20,
            align: "center",
            render ( value, record ) {
                return {
                    children: (
                        <Tooltip title="نمایش" color="orange">
                            <Button
                                type="link"
                                icon={ <ExpandOutlined /> }
                                onClick={ ( event : any ) => {
                                    // showFile( record );
                                    event.stopPropagation();
                                } }
                                style={ { cursor: "pointer" } }
                            />
                        </Tooltip>
                    ),
                };
            },
        },
        {
            title: "حذف",
            key: "delete",
            dataIndex: "delete",
            width: 20,
            align: "center",

            render ( value, record ) {
                return {
                    children: (
                        <Tooltip title="حذف" color="orange">
                            <Button
                                type="link"
                                icon={ <EditTwoTone twoToneColor="#d35400" /> }
                                onClick={ ( event : any ) => {
                                    event.stopPropagation();
                                } }
                                style={ { cursor: "pointer" } }
                            />
                        </Tooltip>
                    ),
                };
            },
        },     
    ];
    return (
        <Fragment>
            <Table
                key="operationalReport"
                columns={columns}
                dataSource={[]}
                scroll={{ x: 650, y: 2000 }}
                bordered
                loading={false}
                pagination={false}
                size="small"
                className="ReportsTable"
                onChange={onTableChange}
            />
        </Fragment>
    );
};

export default observer(MenuCategoryTable);
