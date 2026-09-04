import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '@/stores/authStore';
import { apiClient } from '@/lib/apiClient';

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
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-brand-green">Grandma's Ladle Admin</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full bg-brand-green hover:bg-brand-green/90">
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
