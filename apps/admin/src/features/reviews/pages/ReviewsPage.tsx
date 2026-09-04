import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Popconfirm, message, Rate, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  content: string;
  adminReply?: string;
  isPublished: boolean;
}

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Queries
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => apiClient.get('/Review/GetReviews').then((res: any) => res.data.data),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/Review/CreateReview', data),
    onSuccess: () => {
      message.success('Review created successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      handleCancel();
    },
    onError: () => message.error('Failed to create review'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiClient.put(`/Review/UpdateReview/${id}`, data),
    onSuccess: () => {
      message.success('Review updated successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      handleCancel();
    },
    onError: () => message.error('Failed to update review'),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      apiClient.patch(`/Review/UpdateReviewPublicationStatus/${id}`, { isPublished }),
    onSuccess: () => {
      message.success('Publication status updated');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => message.error('Failed to update publication status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/Review/DeleteReview/${id}`),
    onSuccess: () => {
      message.success('Review deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => message.error('Failed to delete review'),
  });

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Review) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        updateMutation.mutate({ id: editingId, data: values });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Review Content',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minWidth: 200, maxWidth: 400 }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Admin Reply',
      dataIndex: 'adminReply',
      key: 'adminReply',
      render: (text: string) => (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minWidth: 200, maxWidth: 400 }}>
          {text || <span style={{ color: '#ccc', fontStyle: 'italic' }}>No reply yet</span>}
        </div>
      ),
    },
    {
      title: 'Published',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished: boolean, record: Review) => (
        <Switch
          checked={isPublished}
          onChange={(checked) => togglePublishMutation.mutate({ id: record.id, isPublished: checked })}
          loading={togglePublishMutation.isPending && togglePublishMutation.variables?.id === record.id}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Review) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)} style={{ padding: 0 }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this review?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger style={{ padding: 0 }}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Reviews Management</h2>
        <Button type="primary" onClick={handleAdd}>
          Add Review
        </Button>
      </div>

      <Table scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={reviewsData}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingId ? 'Edit Review' : 'Add Review'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: 'Please enter customer name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="content"
            label="Review Content"
            rules={[{ required: true, message: 'Please enter review text' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="adminReply"
            label="Admin Reply (Optional)"
          >
            <Input.TextArea rows={3} placeholder="Reply to this review..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
