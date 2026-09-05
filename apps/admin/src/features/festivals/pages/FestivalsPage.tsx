import React, { useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Modal, Form, Input, Switch, DatePicker } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import dayjs from 'dayjs';
import { computeDelta, hasDelta } from '@/utils/delta';

export default function FestivalPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFestival, setEditingFestival] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['Festival'],
    queryFn: () => apiClient.get('/Festival/GetFestivals').then((res) => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/Festival/DeleteFestival/${id}`),
    onSuccess: () => {
      message.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['Festival'] });
    },
    onError: () => message.error('Failed to delete'),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/Festival/CreateFestival', data),
    onSuccess: () => {
      message.success('Created successfully');
      queryClient.invalidateQueries({ queryKey: ['Festival'] });
      handleCancel();
    },
    onError: () => message.error('Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiClient.put(`/Festival/UpdateFestival/${data.id}`, data),
    onSuccess: () => {
      message.success('Updated successfully');
      queryClient.invalidateQueries({ queryKey: ['Festival'] });
      handleCancel();
    },
    onError: () => message.error('Failed to update'),
  });

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingFestival(null);
    form.resetFields();
  };

  const showModal = (festival?: any) => {
    if (festival) {
      setEditingFestival(festival);
      form.setFieldsValue({
        ...festival,
        startDate: festival.startDate ? dayjs(festival.startDate) : null,
        endDate: festival.endDate ? dayjs(festival.endDate) : null,
      });
    } else {
      setEditingFestival(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
    };
    if (editingFestival) {
      const delta = computeDelta(editingFestival, payload);
      if (!hasDelta(delta)) {
        message.info('No changes detected.');
        handleCancel();
        return;
      }
      updateMutation.mutate({ ...delta, id: editingFestival.id });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (val: boolean) => val ? 'Yes' : 'No' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)} style={{ padding: 0 }}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button type="link" danger style={{ padding: 0 }}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Festivals</h2>
        <Button type="primary" onClick={() => showModal()}>Add Festival</Button>
      </div>
      <Table scroll={{ x: 'max-content' }} columns={columns} dataSource={data || []} rowKey="id" loading={isLoading} />

      <Modal
        title={editingFestival ? 'Edit Festival' : 'Add Festival'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="e.g. Modakam, Kozhukattai..." />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date">
            <DatePicker 
              showTime 
              style={{ width: '100%' }} 
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <DatePicker 
              showTime 
              style={{ width: '100%' }} 
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
