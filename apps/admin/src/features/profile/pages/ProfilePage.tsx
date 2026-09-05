import { useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { computeDelta, hasDelta } from '@/utils/delta';

const { Title } = Typography;

export default function ProfilePage() {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get('/Auth/GetCurrentUser');
      return response.data.data;
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        email: user.email,
        name: user.name || user.first_name,
      });
    }
  }, [user, profileForm]);

  const profileMutation = useMutation({
    mutationFn: async (values: { email?: string; name?: string }) => {
      await apiClient.post('/Auth/UpdateProfile', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      message.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to update profile');
    },
  });

  const onProfileFinish = (values: { email: string; name?: string }) => {
    const delta = computeDelta(user, values);
    if (!hasDelta(delta)) {
      message.info('No changes detected.');
      return;
    }
    profileMutation.mutate(delta);
  };

  const passwordMutation = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.post('/Auth/ChangePassword', values);
    },
    onSuccess: () => {
      message.success('Password changed successfully!');
      passwordForm.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.error?.message || 'Failed to change password');
    },
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '20px' }}>
      <Title level={2} style={{ color: '#2C4A3B', marginBottom: '24px' }}>Admin Profile</Title>
      
      <Card title="Account Details" style={{ marginBottom: '24px' }}>
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={onProfileFinish}
          disabled={isLoading || profileMutation.isPending}
        >
          <Form.Item
            name="email"
            label="Admin Email Address"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={profileMutation.isPending} style={{ backgroundColor: '#2C4A3B' }}>
            Update Profile
          </Button>
        </Form>
      </Card>

      <Card title="Change Password">
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={(values) => passwordMutation.mutate(values)}
          disabled={passwordMutation.isPending}
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please input your current password!' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={passwordMutation.isPending} style={{ backgroundColor: '#2C4A3B' }}>
            Change Password
          </Button>
        </Form>
      </Card>
    </div>
  );
}
