import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Popconfirm, message, Space, Typography, Upload, DatePicker, Tag } from 'antd';
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

  const toggleFieldMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      message.success('Product updated');
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
        isListed: record.isListed !== false,
        isAvailable: record.isAvailable !== false,
        isVegetarian: record.isVegetarian !== false,
        isOnSale: Boolean(record.isOnSale),
        offerStartDate: record.offerStartDate ? dayjs(record.offerStartDate) : null,
        offerEndDate: record.offerEndDate ? dayjs(record.offerEndDate) : null,
      });
    } else {
      setEditingProduct(null);
      form.resetFields();
      form.setFieldsValue({
        isListed: true,
        isAvailable: true,
        isVegetarian: true,
        isOnSale: false,
      });
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
        isListed: values.isListed !== false,
        isAvailable: values.isAvailable !== false,
        isVegetarian: values.isVegetarian !== false,
        isOnSale: Boolean(values.isOnSale),
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
      title: 'Name & Short Desc',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Product) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{name}</span>
            {record.isListed === false && (
              <Tag color="default" style={{ fontSize: 10, padding: '0 4px', lineHeight: '16px', margin: 0 }}>
                Hidden
              </Tag>
            )}
          </div>
          {record.shortDescription && (
            <div style={{ fontSize: 12, color: '#64748b', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {record.shortDescription}
            </div>
          )}
        </div>
      ),
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
      title: 'Price Details',
      dataIndex: 'price',
      key: 'price',
      render: (price: number | string, record: Product) => (
        <div>
          <div style={{ fontWeight: 600, color: '#2C4A3B' }}>₹{Number(price || 0).toFixed(2)}</div>
          {record.offerPrice && (
            <div style={{ fontSize: 11, color: '#e11d48', fontWeight: 500 }}>
              Offer: ₹{Number(record.offerPrice).toFixed(2)}
            </div>
          )}
          {record.originalPrice && (
            <div style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>
              MRP: ₹{Number(record.originalPrice).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Portion',
      key: 'portionSize',
      render: (_: any, record: Product) => `${record.portionSize || ''} ${record.unit || ''}`.trim(),
    },
    {
      title: 'Listed (Web)',
      dataIndex: 'isListed',
      key: 'isListed',
      render: (isListed: boolean, record: Product) => (
        <Switch
          checked={isListed !== false}
          checkedChildren="Listed"
          unCheckedChildren="Hidden"
          style={{ backgroundColor: isListed !== false ? '#2C4A3B' : undefined }}
          onChange={(checked) => toggleFieldMutation.mutate({ id: record.id, data: { isListed: checked } })}
          loading={toggleFieldMutation.isPending}
        />
      ),
    },
    {
      title: 'Availability',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable: boolean, record: Product) => (
        <Switch
          checked={isAvailable !== false}
          checkedChildren="In Stock"
          unCheckedChildren="Out"
          onChange={(checked) => availabilityMutation.mutate({ id: record.id, isAvailable: checked })}
          loading={availabilityMutation.isPending}
        />
      ),
    },
    {
      title: 'Diet (Veg)',
      dataIndex: 'isVegetarian',
      key: 'isVegetarian',
      render: (isVegetarian: boolean, record: Product) => (
        <Space size={6}>
          <div 
            style={{
              width: 14,
              height: 14,
              border: `1.5px solid ${isVegetarian !== false ? '#16a34a' : '#dc2626'}`,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
            title={isVegetarian !== false ? 'Pure Vegetarian' : 'Non-Vegetarian'}
          >
            <div 
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: isVegetarian !== false ? '#16a34a' : '#dc2626',
              }}
            />
          </div>
          <Switch
            checked={isVegetarian !== false}
            checkedChildren="Veg"
            unCheckedChildren="Non"
            style={{ backgroundColor: isVegetarian !== false ? '#16a34a' : undefined }}
            onChange={(checked) => toggleFieldMutation.mutate({ id: record.id, data: { isVegetarian: checked } })}
            loading={toggleFieldMutation.isPending}
          />
        </Space>
      ),
    },
    {
      title: 'Sale Active',
      dataIndex: 'isOnSale',
      key: 'isOnSale',
      render: (isOnSale: boolean, record: Product) => (
        <Switch
          checked={Boolean(isOnSale)}
          checkedChildren="Sale"
          unCheckedChildren="Off"
          style={{ backgroundColor: isOnSale ? '#e11d48' : undefined }}
          onChange={(checked) => toggleFieldMutation.mutate({ id: record.id, data: { isOnSale: checked } })}
          loading={toggleFieldMutation.isPending}
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

      <Table 
        scroll={{ x: 'max-content' }}
        dataSource={products || []}
        columns={columns}
        rowKey="id"
        loading={isLoadingProducts || isLoadingCategories}
        pagination={{ defaultPageSize: 10 }}
        rowClassName={(record: Product) => record.isListed === false ? 'opacity-70 bg-slate-50' : ''}
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
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                  Product Switches
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>Listed on Website</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Show on customer web app (turn OFF to hide completely)</div>
                    </div>
                    <Form.Item name="isListed" valuePropName="checked" noStyle initialValue={true}>
                      <Switch checkedChildren="Listed" unCheckedChildren="Hidden" />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>In Stock (Available)</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Item can be purchased (turn OFF for 'Out of Stock')</div>
                    </div>
                    <Form.Item name="isAvailable" valuePropName="checked" noStyle initialValue={true}>
                      <Switch checkedChildren="In Stock" unCheckedChildren="Out" />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>Pure Vegetarian</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Displays Indian green Veg symbol</div>
                    </div>
                    <Form.Item name="isVegetarian" valuePropName="checked" noStyle initialValue={true}>
                      <Switch checkedChildren="Veg" unCheckedChildren="Non-Veg" />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>Active On Sale</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Directly trigger sale price & badge</div>
                    </div>
                    <Form.Item name="isOnSale" valuePropName="checked" noStyle initialValue={false}>
                      <Switch checkedChildren="On Sale" unCheckedChildren="Regular" />
                    </Form.Item>
                  </div>
                </div>
              </div>

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
