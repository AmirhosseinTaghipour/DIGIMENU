import React, { useContext, useEffect } from "react";
// import { Menu, Dropdown, Image } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import {
    DoubleRightOutlined,
    CaretDownOutlined,
    UserOutlined,
    PoweroffOutlined,
} from "@ant-design/icons";
import { Row, Menu, Dropdown, Avatar, Select } from "antd";
import { IComboBoxType } from "../../../app/models/common";

const { Option } = Select;

interface IProps {
    onToggleSidebar: () => void;
    toggle: boolean;
}

const Header: React.FC<IProps> = ({ onToggleSidebar, toggle }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        user,
        logout,
    } = rootStore.userStore;

    const dropdownMenu = (
        <Menu>
            <Menu.Item
                style={{ fontSize: ".7rem", fontWeight: "bold" }}
                key="0"
                icon={<UserOutlined style={{ color: "#1abc9c" }} />}
            >
                {`${user?.roleTitle}${!user?.departmentName ? "" : " - " + user?.departmentName}`}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
                style={{ fontSize: ".7rem", fontWeight: "bold" }}
                key="1"
                onClick={logout}
                icon={<PoweroffOutlined style={{ color: "#e74c3c" }} />}
            >
                خروج
            </Menu.Item>
        </Menu>
    );
    return (
        <Row className="bsHeader">
            <DoubleRightOutlined
                style={{
                    color: toggle ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.4)",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    marginRight: "10px",
                    zIndex: 10,
                }}
                rotate={toggle ? 180 : 0}
                onClick={onToggleSidebar}
            />

            <Dropdown
                overlay={dropdownMenu}
                trigger={["click"]}
                arrow
                placement="bottomLeft"
            >
                <span
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                    style={{
                        cursor: "pointer",
                        fontSize: ".7rem",
                        fontWeight: "bold",
                        color: "gray",
                        display:
                            window.innerWidth < 762
                                ? toggle
                                    ? "inline-block"
                                    : "none"
                                : "inline-block",
                    }}
                >
                    <Avatar
                        size={30}
                        style={{ marginLeft: "4px" }}
                        icon={<UserOutlined />}
                    />
                    {user?.userTitle}
                    <CaretDownOutlined style={{ top: "3px", position: "relative", paddingRight:"5px" }} />
                </span>
            </Dropdown>
        </Row>
    );
};

export default observer(Header);
