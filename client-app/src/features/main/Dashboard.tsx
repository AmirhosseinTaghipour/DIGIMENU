import React, { useState } from "react";
import MainContent from "./dashboardContent/Content";
import MainSidebar from "./dashboardSideBar/Sidebar";
import MainHeader from "./dashboardHeader/Header";

import { Layout } from "antd";

const { Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const [toggle, setToggle] = useState(window.innerWidth < 762 ? true : false);
  const onToggleSidebar = () => {
    setToggle(!toggle);
  };


  return (
    <Layout dir="rtl" className="bsLayout">
      <Sider trigger={null} collapsible collapsed={toggle} className="bsSider" width={220}>
        <MainSidebar toggle={toggle} />
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
