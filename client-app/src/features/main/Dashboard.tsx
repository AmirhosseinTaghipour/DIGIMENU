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
    <Layout dir="rtl">
      <Sider trigger={null} collapsible collapsed={toggle} width="290px">
        <MainSidebar toggle={toggle} />
      </Sider>
      <Layout>
        <MainHeader toggle={toggle} onToggleSidebar={onToggleSidebar} />
        <Content>
          <MainContent />
        </Content>
      </Layout>
    </Layout>

    // <Segment basic attached style={{ margin: "0", padding: "0" }}>
    //   <MainHeader onToggleSidebar={onToggleSidebar} />
    //   {/* <div className="ui attached pushable" style={{ height: "100vh" }}> */}
    //   <Sidebar.Pushable as={Segment} style={{ height: "calc(100vh - 54px)", marginTop:'0' }}>
    //     <Sidebar visible={toggle} direction="right" animation="push" style={{backgroundColor:'#1b1c1d'}}>
    //       <MainSidebar />
    //     </Sidebar>

    //     <Sidebar.Pusher
    //       style={{direction:'rtl' , width: `${toggle ? "calc(100% - 260px)" : "100%"}` , right:`${toggle ? "-260px" : "0"}`}}
    //     >
    //       <MainContent />
    //     </Sidebar.Pusher>
    //   </Sidebar.Pushable>
    // </Segment>
  );
};
export default Dashboard;
