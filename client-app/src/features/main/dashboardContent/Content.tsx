import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Tabs } from "antd";

import { RootStoreContext } from "../../../app/stores/rootStore";
import CallControl from "./CallControl";

// import AnalayzeSheet from "./TabPages/AdaptionReports/AnalayzeSheet";

const Content : React.FC = () => {
    const rootStore = useContext( RootStoreContext );
    const {
        panes,
        removePane,
        activeTabKey,
        setActiveTabKey,
    } = rootStore.mainStore;

    const onChange = ( activeKey : string ) => {
        setActiveTabKey( activeKey );
    };

    const { TabPane } = Tabs;

    const onEdit = ( targetKey : any, action : string ) => {
        if ( action === "remove" ) {
            removePane( targetKey );
        }
    };

    return (
        <Tabs
            hideAdd
            onChange={ onChange }
            activeKey={ activeTabKey }
            defaultActiveKey="0"
            type="editable-card"
            onEdit={ onEdit }
            tabPosition="top"
            size="small"
            animated={ true }

            style={ {
                marginTop: ".2rem",
                marginRight: "1rem",
                marginLeft: "1rem",
                height: "calc(100vh - 53px)",
            } }
        // addIcon={<Icon name='add user' />}
        >
            {panes.map( ( pane ) => (
                <TabPane tab={ pane.title } key={ pane.key } closable={ pane.closable }>
                    <CallControl resourceId={ pane.id } />
                </TabPane>
            ) ) }
        </Tabs>
    );
};

export default observer( Content );
