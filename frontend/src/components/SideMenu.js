import {
    WechatOutlined,
    FileSearchOutlined,
    UserOutlined,
  } from "@ant-design/icons";
  import { Menu } from "antd";
  import { useEffect, useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import { useAuth } from '../common/AuthProvider'

  function SideMenu() {
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState("/");
    const { user } = useAuth()
 
    useEffect(() => {
      const pathName = location.pathname;
      setSelectedKeys(pathName);
    }, [location.pathname]);
  
    const navigate = useNavigate();
  // Define menu items based on user role
  const menuItems = [
    {
      label: "Chat",
      key: "/",
      icon: <WechatOutlined />,
    },
  ];

  // Conditionally add "Users" and "Documents" based on the user's role
  if (user.sub === 'root') {
    menuItems.push(
      {
        label: "Users",
        icon: <UserOutlined />,
        key: "/users",
      },
      {
        label: "Documents",
        key: "/documents",
        icon: <FileSearchOutlined />,
      }
    );
  }
    return (
        <div className="SideMenu">
        <Menu
          className="SideMenuVertical"
          mode="vertical"
          onClick={(item) => {
            //item.key
            navigate(item.key);
          }}
          selectedKeys={[selectedKeys]}
          items={menuItems}
        ></Menu>
      </div>
    );
  }
  export default SideMenu;
  