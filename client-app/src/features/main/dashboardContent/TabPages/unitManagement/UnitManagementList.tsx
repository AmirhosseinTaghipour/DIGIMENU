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
import { IDepartmentManagementListItemValues } from "../../../../../app/models/department";
import UnitManagement from "./UnitManagement";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UnitManagementList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadUnit,
    unitInfo,
    setUnitInfo,
    unitList,
    loadUnitList,
    unitCount,
    unitListValues,
    setUnitListValues,
    loadingUnitList,
    loadingUnit,
    sumbittingUnit,
  } = rootStore.departmentStore;

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
    const selectedList = unitList.filter(function (value: IDepartmentManagementListItemValues) {
      return selectedRows.includes(value.id!);
    }) as IDepartmentManagementListItemValues[];
    selectedList.forEach((item: IDepartmentManagementListItemValues) => {
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
      await loadUnit(id!).then(() => {
        setDetaliFormVisible(true);
      });
    } else {
      clearFormValues();
      setDetaliFormVisible(false);
    }
  };

  const clearFormValues = () => {
    setUnitInfo({
      ...unitInfo,
      id: null,
      title: null,
      description: null,
      address: null,
      postalCode: null,
      phone: null,
      isActivated: false,
      isUpdateMode: false
    })
  };

  useEffect(() => {
    loadUnitList();
  }, []);

  const columns: ColumnsType<IDepartmentManagementListItemValues> = [
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
      title: "نام مجموعه",
      dataIndex: "title",
      key: "title",
      align: "center",
      width: 100,
      filterIcon: (filtered) => {
        return (
          <SearchOutlined
            style={{
              color: !!unitListValues?.title ? "red" : "#1e1e1e"
            }}
          />
        );
      },

      filterDropdown: ({ confirm }) => {
        const doSearch = async (confirm: any) => {
          await loadUnitList();
          confirm();
        };
        return (
          <Input.Search
            allowClear
            placeholder="نام مجموعه"
            autoFocus
            onSearch={() => confirm()}
            onReset={() => confirm()}
            onPressEnter={() => confirm()}
            type="search"
            defaultValue={unitListValues?.title!}
            maxLength={50}
            style={{ width: 250 }}
            onBlur={(event: any) => {
              setUnitListValues({
                ...unitListValues,
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
      title: "تلفن",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      width: 100,
      filterIcon: (filtered) => {
        return (
          <SearchOutlined
            style={{
              color: !!unitListValues?.phone ? "red" : "#1e1e1e"
            }}
          />
        );
      },

      filterDropdown: ({ confirm }) => {
        const doSearch = async (confirm: any) => {
          await loadUnitList();
          confirm();
        };
        return (
          <Input.Search
            allowClear
            placeholder="تلفن"
            autoFocus
            onSearch={() => confirm()}
            onReset={() => confirm()}
            onPressEnter={() => confirm()}
            type="search"
            defaultValue={unitListValues?.phone!}
            maxLength={50}
            style={{ width: 250 }}
            onBlur={(event: any) => {
              setUnitListValues({
                ...unitListValues,
                page: 1,
                phone: toDatabaseChar(event.target.value)!,
              });
              doSearch(confirm);
            }}
          />
        );
      },
    },
    {
      title: "کد پستی",
      dataIndex: "postalCode",
      key: "postalCode",
      align: "center",
      width: 100,
      filterIcon: (filtered) => {
        return (
          <SearchOutlined
            style={{
              color: !!unitListValues?.postalCode ? "red" : "#1e1e1e"
            }}
          />
        );
      },

      filterDropdown: ({ confirm }) => {
        const doSearch = async (confirm: any) => {
          await loadUnitList();
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
            defaultValue={unitListValues?.postalCode!}
            maxLength={50}
            style={{ width: 250 }}
            onBlur={(event: any) => {
              setUnitListValues({
                ...unitListValues,
                page: 1,
                postalCode: toDatabaseChar(event.target.value)!,
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
      <Row className="bsFormHeader">
        <div className="bsFormTitle"> <FormOutlined />
          مدیریت مجموعه ها
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
                disabled={true}
                onClick={() => {
                  getDetails(null);
                }}
                icon={
                  (sumbittingUnit || loadingUnitList) ?
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
                disabled={true}
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
                  // deletingUser ?
                  //   <LoadingOutlined spin />
                  //   :
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
              dataSource={unitList}
              bordered
              scroll={{ x: 600 }}
              loading={loadingUnitList}
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

          {!!unitList && unitList.length > 0 && (
            <Pagination
              pageSizeOptions={["10", "20", "30", "40", "50"]}
              showSizeChanger={true}
              total={unitCount}
              current={unitListValues.page!}
              showQuickJumper
              size="default"
              pageSize={unitListValues.limit == null ? 10 : unitListValues.limit}
              showTotal={(total) => (
                <span > مجموع: {total} مورد </span>
              )}
              responsive={true}
              className="bsPaging"
              onChange={(page, pageSize) => {
                setUnitListValues({ ...unitListValues, page: page, limit: pageSize! });
                loadUnitList();
              }}
            />
          )}
        </Layout>
      </Row>

      <Modal
        className="bsModal"
        footer
        title={`${unitInfo.isUpdateMode ? "ویرایش" : "افزودن"} مجموعه`}
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
          <TabPane tab="اطلاعات مجموعه" key="1"   >
            <UnitManagement close={closeChildForm} />
          </TabPane>

          <TabPane tab="لیست اشتراک" key="2" disabled={!detaliFormVisible} >
            <div>لیست اشتراک</div>
            {/* <UserLogList userId={userInfo?.id!} /> */}
          </TabPane>

          <TabPane tab="رنگ بندی" key="3" disabled={!detaliFormVisible} >
          <div>رنگ بندی</div>
            {/* <SMSLogList userId={userInfo?.id!} /> */}
          </TabPane>

          <TabPane tab="کاربران مجموعه" key="4" disabled={!detaliFormVisible} >
          <div>کاربران مجموعه</div>
            {/* <SMSLogList userId={userInfo?.id!} /> */}
          </TabPane>

        </Tabs>
      </Modal>
    </Fragment>
  )
};

export default observer(UnitManagementList);

