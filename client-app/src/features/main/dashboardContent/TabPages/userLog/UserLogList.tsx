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
import { IUserLogListItemValues } from "../../../../../app/models/userLog";
import UserLog from "./UserLog";

interface IProps {
  userId: string;
}

const UserLogList: React.FC<IProps> = ({ userId }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadUserLogList,
    loadingUserLogList,
    loadUserLog,
    userLogCount,
    userLogInfo,
    userLogListValues,
    setUserLogInfo,
    setUserLogListValues,
    loadingUserLog,
    userLogList
  } = rootStore.userLogStroe;

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
      await loadUserLog(id!);
    } else {
      clearFormValues();
    }
  };

  const clearFormValues = () => {
    setUserLogInfo({
      ...userLogInfo,
      id: null,
      name: null,
      userName: null,
      date: null,
      ip: null,
      status: null
    });
  };
  const initialLoad = async () => {
    await setUserLogListValues({
      ...userLogListValues,
      userId: userId,
      page: 1,
      limit: 10
    }).then(() => loadUserLogList());
  }
  useEffect(() => {
    initialLoad();
  }, [userId]);

  const columns: ColumnsType<IUserLogListItemValues> = [
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
      title: "نام",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 100,
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
              color: !!userLogListValues?.userName ? "red" : "#1e1e1e"
            }}
          />
        );
      },

      filterDropdown: ({ confirm }) => {
        const doSearch = async (confirm: any) => {
          await loadUserLogList();
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
            defaultValue={userLogListValues?.userName!}
            maxLength={50}
            style={{ width: 250 }}
            onBlur={(event: any) => {
              setUserLogListValues({
                ...userLogListValues,
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
      title: "تاریخ",
      dataIndex: "date",
      key: "date",
      align: "center",
      width: 100,
      filterIcon: (filtered) => {
        return (
          <SearchOutlined
            style={{
              color: !!userLogListValues?.date ? "red" : "#1e1e1e"
            }}
          />
        );
      },

      filterDropdown: ({ confirm }) => {
        const doSearch = async (confirm: any) => {
          await loadUserLogList();
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
            defaultValue={userLogListValues?.date!}
            maxLength={50}
            style={{ width: 250 }}
            onBlur={(event: any) => {
              setUserLogListValues({
                ...userLogListValues,
                page: 1,
                date: toDatabaseChar(event.target.value)!,
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
      filterIcon: (filtered) => {
        return (
          <SearchOutlined
            style={{
              color: !!userLogListValues?.status ? "red" : "#1e1e1e"
            }}
          />
        );
      },

      filterDropdown: ({ confirm }) => {
        const doSearch = async (confirm: any) => {
          await loadUserLogList();
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
            defaultValue={userLogListValues?.status!}
            maxLength={50}
            style={{ width: 250 }}
            onBlur={(event: any) => {
              setUserLogListValues({
                ...userLogListValues,
                page: 1,
                status: toDatabaseChar(event.target.value)!,
              });
              doSearch(confirm);
            }}
          />
        );
      },
    },
    {
      title: "آی پی",
      dataIndex: "ip",
      key: "ip",
      align: "center",
      width: 100,
      filterIcon: (filtered) => {
        return (
          <SearchOutlined
            style={{
              color: !!userLogListValues?.ip ? "red" : "#1e1e1e"
            }}
          />
        );
      },

      filterDropdown: ({ confirm }) => {
        const doSearch = async (confirm: any) => {
          await loadUserLogList();
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
            defaultValue={userLogListValues?.ip!}
            maxLength={50}
            style={{ width: 250 }}
            onBlur={(event: any) => {
              setUserLogListValues({
                ...userLogListValues,
                page: 1,
                ip: toDatabaseChar(event.target.value)!,
              });
              doSearch(confirm);
            }}
          />
        );
      },
    },
 
  ];

  return (
    <Fragment>
      <Row className="bsFormBody">
        <Layout className="formBodyLayout">

          <Content >
            <Table
              key="userLogList"
              columns={columns}
              dataSource={userLogList}
              bordered
              loading={loadingUserLogList}
              tableLayout="fixed"
              scroll={{ x: 600 }}
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

          {!!userLogList && userLogList.length > 0 && (
            <Pagination
              pageSizeOptions={["10", "20", "30", "40", "50"]}
              showSizeChanger={true}
              total={userLogCount}
              current={userLogListValues.page!}
              showQuickJumper
              size="default"
              pageSize={userLogListValues.limit == null ? 10 : userLogListValues.limit}
              showTotal={(total) => (
                <span > مجموع: {total} مورد </span>
              )}
              responsive={true}
              className="bsPaging"
              onChange={(page, pageSize) => {
                setUserLogListValues({ ...userLogListValues, page: page, limit: pageSize! });
                loadUserLogList();
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
        <UserLog close={closeChildForm} />
      </Modal>
    </Fragment>
  )
};

export default observer(UserLogList);

