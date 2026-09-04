import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Popconfirm, message, Space, Typography, Upload, DatePicker } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Product, ProductCategory, ApiListResponse, ApiResponse } from '@grandmas-ladle/shared';
import { getAccessToken } from '@/stores/authStore';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

// API functions
const fetchProducts = async () => {
  const response = await apiClient.get<ApiListResponse<Product>>('/Product/GetProducts');
  return response.data.data;
};

const fetchCategories = async () => {
  const response = await apiClient.get<ApiListResponse<ProductCategory>>('/ProductCategory/GetProductCategories');
  return response.data.data;
};

const createProduct = async (data: Partial<Product>) => {
  const response = await apiClient.post<ApiResponse<Product>>('/Product/CreateProduct', data);
  return response.data.data;
};

const updateProduct = async ({ id, data }: { id: string; data: Partial<Product> }) => {
  const response = await apiClient.put<ApiResponse<Product>>(`/Product/UpdateProduct/${id}`, data);
  return response.data.data;
};

const updateAvailability = async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
  const response = await apiClient.patch<ApiResponse<Product>>(`/Product/UpdateProductAvailability/${id}`, { isAvailable });
  return response.data.data;
};

const deleteProduct = async (id: string) => {
  await apiClient.delete(`/Product/DeleteProduct/${id}`);
};

export default function ProductsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      message.success('Product created successfully');
      handleCancel();
    },
    onError: () => {
      message.error('Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      message.success('Product updated successfully');
      handleCancel();
    },
    onError: () => {
      message.error('Failed to update product');
    },
  });

  const availabilityMutation = useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      message.success('Availability updated');
    },
    onError: () => {
      message.error('Failed to update availability');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      message.success('Product deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete product');
    },
  });

  const showModal = (record?: any) => {
    if (record) {
      setEditingProduct(record);
      form.setFieldsValue({
        ...record,
        offerStartDate: record.offerStartDate ? dayjs(record.offerStartDate) : null,
        offerEndDate: record.offerEndDate ? dayjs(record.offerEndDate) : null,
      });
    } else {
      setEditingProduct(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        offerStartDate: values.offerStartDate ? values.offerStartDate.toISOString() : null,
        offerEndDate: values.offerEndDate ? values.offerEndDate.toISOString() : null,
      };
      if (editingProduct) {
        updateMutation.mutate({ id: editingProduct.id, data: payload });
      } else {
        createMutation.mutate(payload);
      }
    });
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, record: Product) => (
        imageUrl ? (
          <img 
            src={imageUrl} 
            alt={record.name} 
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #f0f0f0' }} 
          />
        ) : (
          <div style={{ width: 48, height: 48, background: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 10 }}>No Img</div>
        )
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      filters: categories?.map((c: ProductCategory) => ({ text: c.name, value: c.id })) || [],
      onFilter: (value: any, record: Product) => record.categoryId === value,
      render: (categoryId: string) => {
        const category = categories?.find((c: ProductCategory) => c.id === categoryId);
        return category ? category.name : 'Unknown';
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number | string) => `₹${Number(price || 0).toFixed(2)}`,
    },
    {
      title: 'Portion Size',
      key: 'portionSize',
      render: (_: any, record: Product) => `${record.portionSize || ''} ${record.unit || ''}`.trim(),
    },
    {
      title: 'Availability',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable: boolean, record: Product) => (
        <Switch
          checked={isAvailable}
          onChange={(checked) => availabilityMutation.mutate({ id: record.id, isAvailable: checked })}
          loading={availabilityMutation.isPending}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)} style={{ padding: 0 }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger style={{ padding: 0 }} loading={deleteMutation.isPending}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, color: '#2C4A3B' }}>Products</Title>
        <Button type="primary" onClick={() => showModal()} style={{ backgroundColor: '#B85C3E' }}>
          Add Product
        </Button>
      </div>

      <Table scroll={{ x: 'max-content' }}
        dataSource={products || []}
        columns={columns}
        rowKey="id"
        loading={isLoadingProducts || isLoadingCategories}
        pagination={{ defaultPageSize: 10 }}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={800}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter the product name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select a category" loading={isLoadingCategories} options={categories?.map(c => ({ label: c.name, value: c.id }))} />
              </Form.Item>
              <Form.Item
                name="shortDescription"
                label="Short Description"
                rules={[{ required: true, message: 'Please enter a short description' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter a description' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="originalPrice"
                  label="MRP (Strikethrough)"
                >
                  <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
                </Form.Item>
                <Form.Item
                  name="price"
                  label="Regular Selling Price"
                  rules={[{ required: true, message: 'Please enter the regular price' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
                </Form.Item>
                <Form.Item
                  name="offerPrice"
                  label="Special Sale Price"
                >
                  <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
                </Form.Item>
              </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Form.Item
                    name="portionSize"
                    label="Amount (e.g. 500, 1)"
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="Enter quantity" />
                  </Form.Item>
                  <Form.Item
                    name="unit"
                    label="Unit"
                    style={{ flex: 1 }}
                  >
                    <Select placeholder="Select unit" allowClear>
                      <Select.Option value="g">Grams (g)</Select.Option>
                      <Select.Option value="kg">Kilograms (kg)</Select.Option>
                      <Select.Option value="ml">Milliliters (ml)</Select.Option>
                      <Select.Option value="l">Liters (l)</Select.Option>
                      <Select.Option value="pcs">Pieces (pcs)</Select.Option>
                      <Select.Option value="box">Box</Select.Option>
                      <Select.Option value="pack">Pack</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
            </div>
            
            <div>
              <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
                <h4 style={{ marginTop: 0 }}>Offers & Tags</h4>
                <Form.Item name="tag" label="Tag (e.g. Must Try, Bestseller)">
                  <Input placeholder="Enter a tag" />
                </Form.Item>
                <Form.Item name="offerStartDate" label="Offer Start Date">
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="offerEndDate" label="Offer End Date">
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <Form.Item
                name="sortOrder"
                label="Sort Order"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.imageUrl !== currentValues.imageUrl}
              >
                {({ getFieldValue }) => {
                  const imageUrl = getFieldValue('imageUrl');
                  return imageUrl ? (
                    <div style={{ marginBottom: 16 }}>
                      <img src={imageUrl} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8, border: '1px solid #d9d9d9' }} />
                    </div>
                  ) : null;
                }}
              </Form.Item>

              <Form.Item
                name="imageUrl"
                label="Product Image URL"
              >
                <Input placeholder="Image URL will appear here after upload" readOnly style={{ marginBottom: '8px' }} />
              </Form.Item>
              <Form.Item>
                <Upload
                  name="image"
                  action={`${apiClient.defaults.baseURL}/Upload/Image`}
                  headers={{ Authorization: `Bearer ${getAccessToken() || ''}` }}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                if (!isImage) message.error('You can only upload image files!');
                return isImage;
              }}
              onChange={(info) => {
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} file uploaded successfully`);
                  form.setFieldValue('imageUrl', info.file.response.data.url);
                } else if (info.file.status === 'error') {
                  message.error(info.file.response?.message || `${info.file.name} file upload failed.`);
                }
              }}
            >
              <Button>Upload Image</Button>
              </Upload>
            </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
