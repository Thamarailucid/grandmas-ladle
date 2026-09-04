import { useState } from 'react';
import { Table, Button, Space, Typography, Card, Modal, Form, Input, Switch, DatePicker, Select, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

const { Title } = Typography;

export default function MarketingPage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['salesCampaigns'],
    queryFn: async () => {
      const response = await apiClient.get('/SalesCampaign');
      return response.data.data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await apiClient.get('/Product/GetProducts?pageSize=100');
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (values: any) => apiClient.post('/SalesCampaign', values),
    onSuccess: () => {
      message.success('Campaign created successfully!');
      queryClient.invalidateQueries({ queryKey: ['salesCampaigns'] });
      setIsModalVisible(false);
    },
    onError: () => message.error('Failed to create campaign'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: any }) => apiClient.put(`/SalesCampaign/${id}`, values),
    onSuccess: () => {
      message.success('Campaign updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['salesCampaigns'] });
      setIsModalVisible(false);
    },
    onError: () => message.error('Failed to update campaign'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/SalesCampaign/${id}`),
    onSuccess: () => {
      message.success('Campaign deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['salesCampaigns'] });
    },
    onError: () => message.error('Failed to delete campaign'),
  });

  const handleOpenModal = (campaign: any = null) => {
    setEditingCampaign(campaign);
    if (campaign) {
      form.setFieldsValue({
        ...campaign,
        startDate: campaign.startDate ? dayjs(campaign.startDate) : null,
        endDate: campaign.endDate ? dayjs(campaign.endDate) : null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        isAnnouncementActive: false,
        isGlobalSaleActive: false,
        isSaleWidgetActive: false,
        preVisibilityDays: 1,
        postVisibilityDays: 0,
      });
    }
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };

      if (editingCampaign) {
        updateMutation.mutate({ id: editingCampaign.id, values: payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch (error) {
      // Validation error handled by form
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text: string) => <strong>{text}</strong> },
    { 
      title: 'Dates', 
      key: 'dates', 
      render: (_: any, record: any) => (
        <span className="text-sm text-gray-600">
          {record.startDate ? dayjs(record.startDate).format('MMM D, YYYY HH:mm') : 'N/A'} - <br/>
          {record.endDate ? dayjs(record.endDate).format('MMM D, YYYY HH:mm') : 'N/A'}
        </span>
      ) 
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        if (!record.isActive) return <Tag color="default">Inactive</Tag>;
        const now = dayjs();
        const start = record.startDate ? dayjs(record.startDate) : null;
        const end = record.endDate ? dayjs(record.endDate) : null;
        
        if (end && now.isAfter(end)) return <Tag color="error">Ended</Tag>;
        if (start && now.isBefore(start)) return <Tag color="warning">Upcoming</Tag>;
        return <Tag color="success">Active Now</Tag>;
      }
    },
    {
      title: 'Global Sale / Widget / Marquee',
      key: 'features',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          {record.isGlobalSaleActive ? <Tag color="blue">Global Sale</Tag> : null}
          {record.isSaleWidgetActive ? <Tag color="purple">Widget</Tag> : null}
          {record.isAnnouncementActive ? <Tag color="cyan">Marquee</Tag> : null}
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Edit</Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => {
              Modal.confirm({
                title: 'Delete Campaign',
                content: 'Are you sure you want to delete this campaign?',
                onOk: () => deleteMutation.mutate(record.id)
              });
            }} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ color: '#2C4A3B', margin: 0 }}>Marketing & Sales Campaigns</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => handleOpenModal()}
          style={{ backgroundColor: '#2C4A3B' }}
        >
          Create New Sale
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={campaigns} 
          rowKey="id" 
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="Campaign Name" rules={[{ required: true, message: 'Please enter campaign name' }]}>
            <Input placeholder="e.g. Diwali Mega Sale 2026" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="startDate" label="Sale Start Date">
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="endDate" label="Sale End Date" dependencies={['startDate']}>
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="announcementText" label="Announcement Marquee Text">
              <Input placeholder="e.g. Diwali Mega Sale is Live!" />
            </Form.Item>
            
            <Form.Item name="announcementLink" label="Announcement Link">
              <Select placeholder="Select a page to link to" allowClear>
                <Select.Option value="/">Home</Select.Option>
                <Select.Option value="/menu">Menu</Select.Option>
                <Select.Option value="/festivals">Festivals</Select.Option>
                <Select.Option value="/corporate">Corporate Enquiries</Select.Option>
                <Select.Option value="/our-story">Our Story</Select.Option>
                <Select.Option value="/visit-us">Visit Us</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="preVisibilityDays" label="Days before start to show 'Starts Soon'">
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item name="postVisibilityDays" label="Days after end to keep visible">
              <Input type="number" min={0} />
            </Form.Item>
          </div>

          <Form.Item name="productIds" label="Sale / Featured Products">
            <Select 
              mode="multiple" 
              showSearch
              placeholder="Select products to highlight on sale"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={products?.map((p: any) => ({ label: p.name, value: p.id }))}
            />
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Form.Item name="isActive" valuePropName="checked" label="Master Switch (Active)" style={{ margin: 0 }}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
            <Form.Item name="isAnnouncementActive" valuePropName="checked" label="Marquee Slider" style={{ margin: 0 }}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
            <Form.Item name="isSaleWidgetActive" valuePropName="checked" label="Floating Badge" style={{ margin: 0 }}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
            <Form.Item name="isGlobalSaleActive" valuePropName="checked" label="Global Sale Engine" style={{ margin: 0 }}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
