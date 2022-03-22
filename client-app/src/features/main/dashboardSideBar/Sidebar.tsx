import { Menu, Row, Avatar } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { IMainMenu, ITab } from "../../../app/models/main";
import { RootStoreContext } from "../../../app/stores/rootStore";
import Icon, { FolderFilled, FileFilled, HomeOutlined, MenuOutlined, ShopOutlined, SwitcherOutlined, DollarOutlined, ProfileOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
const { SubMenu } = Menu;

interface IProps {
    toggle: boolean;
}

const Sidebar: React.FC<IProps> = ({ toggle }) => {
    const rootStore = useContext(RootStoreContext);
    const {
        // loadMenuItems,
        // loadingInitial,
        // mainMenuList,
        // expanded,
        // addExpanded,
        // removeExpanded,
        // addPane,
        // newTabIndex,
        // addNewTabIndex,
        // activeTabKey,
        // panes,
    } = rootStore.mainStore;


    const [activeIndex, setActiveIndex] = useState<string | number | undefined>(
        0
    );

    // useEffect(() => {
    //     panes.forEach((item: ITab) => {
    //         if (item.key === activeTabKey) {
    //             setActiveIndex(item.id);
    //         }
    //     });
    // }, [activeTabKey, panes]);

    const handleClick = (event: any) => {
        // setActiveIndex(event.key);
        // const childernItems = GetNodeChildren(event.key);
        // const node = GetNodeById(event.key);
        // if (expanded.includes(event.key)) {
        //     removeExpanded(node.id);
        // } else {
        //     addExpanded(node.id);
        //     if (!(childernItems !== [] && childernItems.length > 0)) {
        //         addPane({
        //             id: node.resourceid,
        //             key: newTabIndex.toString(),
        //             title: node.resourcename,
        //             content: node.resourcename,
        //             closable: true,
        //         });
        //         addNewTabIndex();
        //     }
        // }
    };







    //     <Menu.Item
    //     icon={
    //         <FileFilled
    //             style={ {
    //                 color: "#535c68",
    //                 fontSize: "1.1rem",
    //                 position: "relative",
    //                 top: "1px",
    //                 marginLeft: "5px"
    //             } }
    //         />
    //     }
    //     key={ item.resourceid }
    // >
    //     {item.resourcename }
    // </Menu.Item>
    // useEffect(() => {
    //     loadMenuItems();
    // }, [loadMenuItems]);
    return (
        <Fragment>
            <Row className="bsSiderHeader">
                <span
                    style={{
                        width: "200px",
                        paddingRight: "10px",
                        display: toggle ? "none" : "inline",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                    }}
                >
                    دیجی منو
                </span>
            </Row>
            {false && <LoadingComponent spinnerSize="small" />}
            <Menu
                theme="dark"
                mode="inline"
                className="sidebarMenu"
                style={{ marginTop: "20px" }}
                onClick={handleClick}
                selectedKeys={[activeIndex ? activeIndex!.toString() : ""]}
                defaultOpenKeys={["5"]}
            >
                {/* {mainMenuList.map((MenuItem: IMainMenu) => {
                    return */}
                     <Menu.Item
                        icon={
                            <ShopOutlined />
                        }
                        key={"1"}
                    >
                        {"اطلاعات مجموعه"}
                    </Menu.Item>

                    <Menu.Item
                        icon={
                            <MenuOutlined/>
                        }
                        key={"2"}
                    >
                        {"ساخت منو"}
                    </Menu.Item>

                    <Menu.Item
                        icon={
                            <SwitcherOutlined/>
                        }
                        key={"3"}
                    >
                        {"دسته بندی منو"}
                    </Menu.Item>

                    <Menu.Item
                        icon={
                            <ProfileOutlined/>
                        }
                        key={"4"}
                    >
                        {"آیتم های هردسته"}
                    </Menu.Item>

                    <Menu.Item
                        icon={
                            <DollarOutlined/>
                        }
                        key={"5"}
                    >
                        {"پرداخت"}
                    </Menu.Item>
                 {/* })} */}
            </Menu>
        </Fragment>
    );
};

export default observer(Sidebar);
