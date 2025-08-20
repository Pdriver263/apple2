import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, DashboardOutlined, SearchOutlined } from '@ant-design/icons';

const Navbar = () => {
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: <Link to="/search">Search</Link>,
    }
  ];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      items={menuItems}
      style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#001529',
        color: 'white',
        padding: '0 20px'
      }}
    />
  );
};

export default Navbar;