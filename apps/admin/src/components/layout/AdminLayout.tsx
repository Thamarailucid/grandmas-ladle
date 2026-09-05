import { Layout, Menu, Button } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BankOutlined,
  MailOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  NotificationOutlined,
  UserOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { clearAuth } from '@/stores/authStore';
import logoImg from '@/assets/logo.jpg';
import { useTableDragScroll } from '@/hooks/useTableDragScroll';

const { Header, Sider, Content } = Layout;

export function AdminLayout() {
  useTableDragScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: '/products', icon: <ShoppingOutlined />, label: <Link to="/products">Products</Link> },
    { key: '/categories', icon: <AppstoreOutlined />, label: <Link to="/categories">Categories</Link> },
    { key: '/festivals', icon: <CalendarOutlined />, label: <Link to="/festivals">Festivals</Link> },
    { key: '/orders', icon: <FileTextOutlined />, label: <Link to="/orders">Orders</Link> },
    { key: '/corporate-enquiries', icon: <BankOutlined />, label: <Link to="/corporate-enquiries">Corporate Enquiries</Link> },
    { key: '/contact-enquiries', icon: <MailOutlined />, label: <Link to="/contact-enquiries">Contact Enquiries</Link> },
    { key: '/reviews', icon: <StarOutlined />, label: <Link to="/reviews">Reviews</Link> },
    { key: '/faqs', icon: <QuestionCircleOutlined />, label: <Link to="/faqs">FAQs</Link> },
    { key: '/marketing', icon: <NotificationOutlined />, label: <Link to="/marketing">Marketing</Link> },
    { key: '/hero-slider', icon: <PictureOutlined />, label: <Link to="/hero-slider">Hero Slider</Link> },
    { key: '/settings', icon: <SettingOutlined />, label: <Link to="/settings">Settings</Link> },
    { key: '/profile', icon: <UserOutlined />, label: <Link to="/profile">Profile / Account</Link> },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0" 
        theme="dark"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ height: '100vh', position: 'sticky', top: 0, left: 0, zIndex: 100, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="p-3.5 flex items-center justify-center gap-2.5 border-b border-gray-700 bg-gray-900/60" style={{ flexShrink: 0 }}>
            <img src={logoImg} alt="Grandma's Ladle" className="w-8 h-8 rounded-full object-cover border border-[#B8925A] flex-shrink-0" />
            {!collapsed && <h1 className="text-white text-base font-bold truncate m-0 font-serif tracking-wide">Grandma's Ladle</h1>}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </div>
          <div style={{ flexShrink: 0, padding: '16px', borderTop: '1px solid #303030' }}>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={handleLogout} 
              block
            >
              {!collapsed && 'Logout'}
            </Button>
          </div>
        </div>
      </Sider>
      <Layout>
        <Header className="bg-white px-4 sm:px-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
          <h2 className="m-0 text-lg sm:text-xl font-medium">Admin Panel</h2>
          <div className="text-gray-500 font-medium hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </Header>
        <Content className="m-2 p-2 sm:m-6 sm:p-6 bg-white rounded-lg shadow-sm overflow-x-hidden min-h-[calc(100vh-140px)]">
          <Outlet />
        </Content>
        <Layout.Footer className="text-center text-gray-500 bg-transparent py-4">
          Designed & Developed by{' '}
          <a href="https://novacodex.in" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 font-medium">
            NovaCodex
          </a>
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
