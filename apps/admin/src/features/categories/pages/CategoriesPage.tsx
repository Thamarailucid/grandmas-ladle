import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message, Space, InputNumber } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { ProductCategory, ApiListResponse, ApiResponse } from '@grandmas-ladle/shared';

// API functions
const fetchCategories = async (): Promise<ProductCategory[]> => {
  const response = await apiClient.get<ApiListResponse<ProductCategory>>('/ProductCategory/GetProductCategories');
  return response.data.data;
};

const createCategory = async (data: Partial<ProductCategory>): Promise<ProductCategory> => {
  const response = await apiClient.post<ApiResponse<ProductCategory>>('/ProductCategory/CreateProductCategory', data);
  return response.data.data;
};

const updateCategory = async ({ id, data }: { id: string; data: Partial<ProductCategory> }): Promise<ProductCategory> => {
  const response = await apiClient.put<ApiResponse<ProductCategory>>(`/ProductCategory/UpdateProductCategory/${id}`, data);
  return response.data.data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/ProductCategory/DeleteProductCategory/${id}`);
};

export default function CategoriesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Queries
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      message.success('Category created successfully');
      handleCancel();
    },
    onError: () => {
      message.error('Failed to create category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      message.success('Category updated successfully');
      handleCancel();
    },
    onError: () => {
      message.error('Failed to update category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      message.success('Category deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete category');
    },
  });

  // Handlers
  const showModal = (category?: ProductCategory) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        updateMutation.mutate({ id: editingCategory.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      // Form validation error
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ProductCategory) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the category"
            description="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
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
        <h2>Categories</h2>
        <Button type="primary" onClick={() => showModal()}>
          Add Category
        </Button>
      </div>

      <Table scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical" name="categoryForm">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label="Sort Order"
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
