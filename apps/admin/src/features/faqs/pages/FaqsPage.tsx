import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Popconfirm, message, Space, InputNumber } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { computeDelta, hasDelta } from '@/utils/delta';

interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
}

export default function FaqsPage() {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [form] = Form.useForm();

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await apiClient.get('/Faq/GetFaqs');
      return response.data.data as Faq[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Faq>) => apiClient.post('/Faq/CreateFaq', data),
    onSuccess: () => {
      message.success('FAQ created successfully');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      handleCancel();
    },
    onError: () => {
      message.error('Failed to create FAQ');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: Partial<Faq> }) =>
      apiClient.put(`/Faq/UpdateFaq/${data.id}`, data.values),
    onSuccess: () => {
      message.success('FAQ updated successfully');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      handleCancel();
    },
    onError: () => {
      message.error('Failed to update FAQ');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string; isPublished: boolean }) =>
      apiClient.patch(`/Faq/UpdateFaqPublicationStatus/${data.id}`, { isPublished: data.isPublished }),
    onSuccess: () => {
      message.success('Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: () => {
      message.error('Failed to update status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/Faq/DeleteFaq/${id}`),
    onSuccess: () => {
      message.success('FAQ deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
    onError: () => {
      message.error('Failed to delete FAQ');
    },
  });

  const showModal = (faq?: Faq) => {
    if (faq) {
      setEditingFaq(faq);
      form.setFieldsValue(faq);
    } else {
      setEditingFaq(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingFaq(null);
    form.resetFields();
  };

  const handleFinish = (values: any) => {
    if (editingFaq) {
      const delta = computeDelta(editingFaq, values);
      if (!hasDelta(delta)) {
        message.info('No changes detected.');
        handleCancel();
        return;
      }
      updateMutation.mutate({ id: editingFaq.id, values: delta });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      render: (text: string) => <div style={{ whiteSpace: 'pre-wrap', minWidth: '300px' }}>{text}</div>,
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Published',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished: boolean, record: Faq) => (
        <Switch
          checked={isPublished}
          onChange={(checked) => updateStatusMutation.mutate({ id: record.id, isPublished: checked })}
          loading={updateStatusMutation.isPending}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Faq) => (
        <Space>
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this FAQ?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger loading={deleteMutation.isPending}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>FAQs</h2>
        <Button type="primary" onClick={() => showModal()}>
          Add FAQ
        </Button>
      </div>

      <Table scroll={{ x: 'max-content' }}
        dataSource={faqs}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: 'Please enter the question' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="answer"
            label="Answer"
            rules={[{ required: true, message: 'Please enter the answer' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label="Sort Order"
            rules={[{ required: true, message: 'Please enter the sort order' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
