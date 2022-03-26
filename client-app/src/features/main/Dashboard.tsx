import React, { useContext, useEffect, useState } from "react";
import MainContent from "./dashboardContent/Content";
import MainSidebar from "./dashboardSideBar/Sidebar";
import MainHeader from "./dashboardHeader/Header";

import { Layout } from "antd";
import { RootStoreContext } from "../../app/stores/rootStore";

const { Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);

  const [toggle, setToggle] = useState(window.innerWidth <= 767 ? true : false);
  const collapsible = window.innerWidth <= 767 ? true : false;
  const onToggleSidebar = () => {
    setToggle(!toggle);
  };

  const onToggleClose = () => {
    collapsible &&
      setToggle(true);
  };

  return (
    <Layout dir="rtl" className="bsLayout">
      <Sider trigger={null} collapsible collapsed={toggle} className="bsSider" >
        <MainSidebar onToggleClose={onToggleClose} />
      </Sider>
      <Layout>
        <MainHeader toggle={toggle} onToggleSidebar={onToggleSidebar} />
        <Content className="bsContent">
          <MainContent />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
