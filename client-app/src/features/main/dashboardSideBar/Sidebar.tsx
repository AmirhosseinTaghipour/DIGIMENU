import { Menu, Row, Avatar } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import Icon, { FolderFilled, FileFilled, HomeOutlined, MenuOutlined, ShopOutlined, SwitcherOutlined, DollarOutlined, ProfileOutlined, SmileOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { IDictionary } from "../../../app/models/common";
import { IAppMenu } from "../../../app/models/main";
const { SubMenu } = Menu;

interface IProps {
    onToggleClose: () => void;
}
const menuIconDictionay: IDictionary<React.RefAttributes<HTMLSpanElement>> = {}
menuIconDictionay["unit-info"] = <ShopOutlined />;
menuIconDictionay["create-menu"] = <MenuOutlined />;
menuIconDictionay["create-category"] = <SwitcherOutlined />;
menuIconDictionay["create-item"] = <ProfileOutlined />;
menuIconDictionay["payment"] = <DollarOutlined />;
menuIconDictionay["icon-management"] = <SmileOutlined />;


const Sidebar: React.FC<IProps> = ({ onToggleClose }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadAppMenu,
        loadingAppMenu,
        appMenuList,
        setActiveMenuCode,
    } = rootStore.mainStore;

    const setMenuItem = () => {
        return (
            <Menu
                theme="dark"
                mode="inline"
                className="sidebarMenu"
                style={{ marginTop: "20px" }}
                onClick={(event) => {
                    onToggleClose();
                    handleClick(event.key);
                }}
            //defaultOpenKeys={["5"]}
            >
                {appMenuList.map((menu: IAppMenu) => {
                    return (<Menu.Item
                        icon={
                            menuIconDictionay[`${menu.menuCode}`]
                        }
                        key={menu.menuCode}
                    >
                        {menu.menuTitle}
                    </Menu.Item>)
                })}
            </Menu>
        )
    }

    const initialLoad = (): void => {
        loadAppMenu();
    }

    useEffect(() => {
        initialLoad();
    }, []);

    const handleClick = (menuCode: any) => {
        if (!!menuCode)
            setActiveMenuCode(menuCode);
        else
            setActiveMenuCode(null);
    };

    return (
        <Fragment>
            <Row className="bsSiderHeader">
                <span
                    style={{
                        width: "200px",
                        paddingRight: "10px",
                        display: "inline",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                    }}
                >
                    دیجی منو
                </span>
            </Row>
            {loadingAppMenu
                ?
                <LoadingComponent spinnerSize="small" />
                :
                setMenuItem()
            }

        </Fragment>
    );
};

export default observer(Sidebar);
