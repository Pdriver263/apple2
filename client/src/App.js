import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import 'antd/dist/reset.css';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

const { Header, Content } = Layout;

export default function App() {
  console.log('App component rendered');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Spin 
        size="large" 
        tip="Loading..."
        fullscreen
      />
    );
  }

  return (
    <ErrorBoundary>
      <Layout className="app-layout" style={{ minHeight: '100vh' }}>
        <Header className="app-header" style={{ background: '#001529', padding: '0 24px' }}>
          <Navbar />
        </Header>

        <Content className="app-content" style={{ padding: '24px', background: '#fff' }}>
          <Outlet /> {/* Child routes will render here */}
        </Content>

        <Footer />
      </Layout>
    </ErrorBoundary>
  );
}
