import { Menu, Row, Avatar } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { IMainMenu, ITab } from "../../../app/models/main";
import { RootStoreContext } from "../../../app/stores/rootStore";
import Icon, { FolderFilled, FileFilled } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
const { SubMenu } = Menu;

interface IProps {
    toggle : boolean;
}

const Sidebar : React.FC<IProps> = ( { toggle } ) => {
    const rootStore = useContext( RootStoreContext );
    const {
        loadMenuItems,
        loadingInitial,
        mainMenuList,
        expanded,
        addExpanded,
        removeExpanded,
        addPane,
        newTabIndex,
        addNewTabIndex,
        activeTabKey,
        panes,
    } = rootStore.mainStore;


    const [ activeIndex, setActiveIndex ] = useState<string | number | undefined>(
        0
    );

    useEffect( () => {
        panes.forEach( ( item : ITab ) => {
            if ( item.key === activeTabKey ) {
                setActiveIndex( item.id );
            }
        } );
    }, [ activeTabKey, panes ] );

    const handleClick = ( event : any ) => {
        setActiveIndex( event.key );
        const childernItems = GetNodeChildren( event.key );
        const node = GetNodeById( event.key );
        if ( expanded.includes( event.key ) ) {
            removeExpanded( node.id );
        } else {
            addExpanded( node.id );
            if ( !( childernItems !== [] && childernItems.length > 0 ) ) {
                addPane( {
                    id: node.resourceid,
                    key: newTabIndex.toString(),
                    title: node.resourcename,
                    content: node.resourcename,
                    closable: true,
                } );
                addNewTabIndex();
            }
        }
    };

    const NodeIsRoot = ( id : string ) => {
        const findResult = mainMenuList.find(
            ( item : IMainMenu ) => item.resourceid === id
        );
        if ( findResult === undefined ) {
            return true;
        } else {
            return false;
        }
    };

    const SetItemToIMainMenu = ( item : any ) => {
        let node : IMainMenu = {
            resourceid: "",
            resourcename: "",
            resourcecode: "",
            resourcetype: 0,
            parentid: "",
            url: "",
            encrypted: 0,
            id: 0,
            isactive: 0,
            newuntil: "",
            description: "",
            url2: "",
        };
        if ( !!item && item !== undefined ) {
            node.resourceid = item[ "resourceid" ];
            node.resourcename = item[ "resourcename" ];
            node.resourcecode = item[ "resourcecode" ];
            node.resourcetype = item[ "resourcetype" ];
            node.parentid = item[ "parentid" ];
            node.url = item[ "url" ];
            node.encrypted = item[ "encrypted" ];
            node.id = item[ "id" ];
            node.isactive = item[ "isactive" ];
            node.newuntil = item[ "newuntil" ];
            node.description = item[ "description" ];
            node.url2 = item[ "url2" ];
        }

        return node;
    };

    const GetNodeById = ( id : string ) => {
        let node : IMainMenu = {
            resourceid: "",
            resourcename: "",
            resourcecode: "",
            resourcetype: 0,
            parentid: "",
            url: "",
            encrypted: 0,
            id: 0,
            isactive: 0,
            newuntil: "",
            description: "",
            url2: "",
        };
        mainMenuList.forEach( ( item : IMainMenu ) => {
            if ( item.resourceid === id ) {
                node.resourceid = item.resourceid;
                node.resourcename = item.resourcename;
                node.resourcecode = item.resourcecode;
                node.resourcetype = item.resourcetype;
                node.parentid = item.parentid;
                node.url = item.url;
                node.encrypted = item.encrypted;
                node.id = item.id;
                node.isactive = item.isactive;
                node.newuntil = item.newuntil;
                node.description = item.description;
                node.url2 = item.url2;
            }
        } );
        return node;
    };

    const GetNodeChildren = ( id : string ) => {
        let node : IMainMenu[] = [];
        mainMenuList.forEach( ( item : IMainMenu ) => {
            if ( !!item && item.parentid === id ) {
                node.push( SetItemToIMainMenu( item ) );
            }
        } );
        return node!;
    };

    const CreateNode = ( item : IMainMenu ) => {
        const childernItems = GetNodeChildren( item.resourceid );

        return !!childernItems &&
            childernItems.length > 0 &&
            childernItems[ 0 ].resourceid !== "" ? (
            <SubMenu
                title={ item.resourcename }
                key={ item.resourceid }

                icon={
                    <FolderFilled
                        style={ {
                            color: "#fa983a",
                            fontSize: "1.1rem",
                            position: "relative",
                            top: "1px",
                            marginLeft: "5px"
                        } }
                    />
                }
            >
                {childernItems.map( ( child : IMainMenu ) =>
                    child.resourceid !== ""
                        ? CreateNode( GetNodeById( child.resourceid ) )
                        : ""
                ) }
            </SubMenu>
        ) : (
            <Menu.Item
                icon={
                    <FileFilled
                        style={ {
                            color: "#535c68",
                            fontSize: "1.1rem",
                            position: "relative",
                            top: "1px",
                            marginLeft: "5px"
                        } }
                    />
                }
                key={ item.resourceid }
            >
                {item.resourcename }
            </Menu.Item>
        );
    };

    useEffect( () => {
        loadMenuItems();
    }, [ loadMenuItems ] );
    return (
        <Fragment>
            <Row
                style={ {
                    overflow: "hidden",
                    lineHeight: "3.12rem",
                    height: "3.12rem",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    whiteSpace: "nowrap",
                } }
            >
                <span
                    style={ {
                        width: "200px",
                        paddingRight: "10px",
                        display: toggle ? "none" : "inline",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                    } }
                >
                    دیجی منو
        </span>
            </Row>
            {loadingInitial && <LoadingComponent spinnerSize="small" /> }
            <Menu
                theme="dark"
                mode="inline"
                className="sidebarMenu"
                style={ { marginTop: "20px" } }
                onClick={ handleClick }
                selectedKeys={ [ activeIndex ? activeIndex!.toString() : "" ] }
                defaultOpenKeys={ [ "c976f4ac-7abf-413e-896a-f8e24e3214dc" ] }
            >
                { mainMenuList.map( ( MenuItem : IMainMenu ) => {
                    const isRootFlag = NodeIsRoot( MenuItem.parentid );
                    if ( MenuItem.resourceid !== "" && isRootFlag ) {
                        return CreateNode( GetNodeById( MenuItem.resourceid ) );
                    }
                } ) }
            </Menu>
        </Fragment>
    );
};

export default observer( Sidebar );
