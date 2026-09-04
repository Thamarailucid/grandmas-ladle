import { useEffect } from 'react';
import { Form, Input, Button, Card, message, Switch } from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface BusinessSettings {
  businessName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  openingHours?: string;
  fssaiNumber?: string;
  tagline?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  googleMapsUrl?: string;
  isCartEnabled?: boolean;
  enableEmailNotifications?: boolean;
  notificationEmail?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
}

export default function SettingsPage() {
  const [form] = Form.useForm();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const response = await apiClient.get('/BusinessSetting/GetBusinessSettings');
      return response.data.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: BusinessSettings) => {
      await apiClient.put('/BusinessSetting/UpdateBusinessSettings', values);
    },
    onSuccess: () => {
      message.success('Business settings updated successfully!');
    },
    onError: () => {
      message.error('Failed to update business settings.');
    },
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const onFinish = (values: BusinessSettings) => {
    mutation.mutate(values);
  };

  if (isError) {
    message.error('Failed to load business settings.');
  }

  return (
    <Card title="Business Settings" className="max-w-4xl mx-auto mt-8">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isLoading || mutation.isPending}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="businessName" label="Business Name">
            <Input placeholder="Enter business name" />
          </Form.Item>
          
          <Form.Item name="tagline" label="Tagline">
            <Input placeholder="Enter tagline" />
          </Form.Item>
          
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          
          <Form.Item name="whatsapp" label="WhatsApp">
            <Input placeholder="Enter WhatsApp number" />
          </Form.Item>
          
          <Form.Item name="email" label="Email">
            <Input type="email" placeholder="Enter email address" />
          </Form.Item>
          
          <Form.Item name="fssaiNumber" label="FSSAI Number">
            <Input placeholder="Enter FSSAI number" />
          </Form.Item>
          
          <Form.Item name="openingHours" label="Opening Hours">
            <Input placeholder="e.g., 9:00 AM - 9:00 PM" />
          </Form.Item>
          
          <Form.Item name="instagramUrl" label="Instagram URL">
            <Input placeholder="Enter Instagram URL" />
          </Form.Item>
          
          <Form.Item name="facebookUrl" label="Facebook URL">
            <Input placeholder="Enter Facebook URL" />
          </Form.Item>
          
          <Form.Item name="googleMapsUrl" label="Google Maps URL">
            <Input placeholder="Enter Google Maps URL" />
          </Form.Item>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Form.Item name="isCartEnabled" label="Enable Cart & Bulk Ordering" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <Form.Item name="address" label="Address">
          <Input.TextArea rows={4} placeholder="Enter full address" />
        </Form.Item>

        <div className="border-t border-gray-200 pt-6 mt-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-[#2C4A3B]">Email Notifications (SMTP)</h3>
          
          <div className="mb-4">
            <Form.Item name="enableEmailNotifications" label="Enable Email Notifications" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="notificationEmail" label="Receive Notifications At (Email)">
              <Input type="email" placeholder="e.g., admin@grandmasladle.com" />
            </Form.Item>
            
            <Form.Item name="smtpHost" label="SMTP Host">
              <Input placeholder="e.g., smtp.gmail.com" />
            </Form.Item>
            
            <Form.Item name="smtpPort" label="SMTP Port">
              <Input type="number" placeholder="e.g., 587 or 465" />
            </Form.Item>
            
            <Form.Item name="smtpUser" label="SMTP Username">
              <Input placeholder="e.g., your-email@gmail.com" />
            </Form.Item>
            
            <Form.Item name="smtpPassword" label="SMTP Password (App Password)">
              <Input.Password placeholder="Enter SMTP Password" />
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={mutation.isPending}
            className="w-full md:w-auto"
            style={{ backgroundColor: '#2C4A3B' }}
          >
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
