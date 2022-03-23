import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Tabs } from "antd";

import { RootStoreContext } from "../../../app/stores/rootStore";
import ContentControl from "./ContentControl";


const Content: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        activeMenuCode,
    } = rootStore.mainStore;

    return (
        <ContentControl menuCode={activeMenuCode} />
    );
};

export default observer(Content);
