import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '@/stores/authStore';
import { apiClient } from '@/lib/apiClient';
import loginBg from '@/assets/login-bg.jpg';
import logoImg from '@/assets/logo.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await apiClient.post('/Auth/Login', values);
      if (response.data.success) {
        const { accessToken, user } = response.data.data;
        setAuth(accessToken, user);
        message.success('Logged in successfully');
        navigate('/');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20">
          
          {/* Logo Section */}
          <div className="text-center mb-8">
            <img 
              src={logoImg} 
              alt="Grandma's Ladle Logo" 
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow-xl border-2 border-[#B8925A] p-0.5 bg-white" 
            />
            <h1 className="text-3xl font-serif font-bold text-[#2C4A3B] tracking-wide">
              Grandma's Ladle
            </h1>
            <p className="text-[#B85C3E] text-sm font-medium tracking-widest uppercase mt-1">
              Admin Dashboard
            </p>
            <div className="w-16 h-0.5 bg-[#B8925A] mx-auto mt-3" />
          </div>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              label={<span className="text-[#2C4A3B] font-medium">Email</span>}
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input 
                type="email" 
                placeholder="admin@grandmasladle.com"
                className="rounded-lg"
                style={{ borderColor: '#d9d9d9', height: 44 }}
              />
            </Form.Item>
            
            <Form.Item
              label={<span className="text-[#2C4A3B] font-medium">Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                placeholder="Enter your password"
                className="rounded-lg"
                style={{ borderColor: '#d9d9d9', height: 44 }}
              />
            </Form.Item>
            
            <Form.Item className="mb-2">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                className="w-full h-12 rounded-lg text-base font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300"
                style={{ 
                  backgroundColor: '#2C4A3B', 
                  borderColor: '#2C4A3B',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Homemade • Pure • Wholesome
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-6">
          © {new Date().getFullYear()} Grandma's Ladle · Powered by{' '}
          <a href="https://novacodex.in" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white underline">
            NovaCodex
          </a>
        </p>
      </div>
    </div>
  );
}
