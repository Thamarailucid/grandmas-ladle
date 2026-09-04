import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, InputNumber, Upload, message, Popconfirm, Space, Select } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { HeroSlide, ApiListResponse, ApiResponse } from '@grandmas-ladle/shared';
import { getAccessToken } from '@/stores/authStore';

const fetchSlides = async () => {
  const response = await apiClient.get<ApiListResponse<HeroSlide>>('/HeroSlide/GetHeroSlides');
  return response.data.data;
};

const createSlide = async (data: Partial<HeroSlide>) => {
  const response = await apiClient.post<ApiResponse<HeroSlide>>('/HeroSlide/CreateHeroSlide', data);
  return response.data.data;
};

const updateSlide = async ({ id, data }: { id: string; data: Partial<HeroSlide> }) => {
  const response = await apiClient.put<ApiResponse<HeroSlide>>(`/HeroSlide/UpdateHeroSlide/${id}`, data);
  return response.data.data;
};

const deleteSlide = async (id: string) => {
  await apiClient.delete(`/HeroSlide/DeleteHeroSlide/${id}`);
};

export default function HeroSliderPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isImageOnly = Form.useWatch('isImageOnly', form);

  const { data: slides, isLoading } = useQuery({
    queryKey: ['heroSlides'],
    queryFn: fetchSlides,
  });

  const createMutation = useMutation({
    mutationFn: createSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      message.success('Slide created successfully');
      handleCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      message.success('Slide updated successfully');
      handleCancel();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroSlides'] });
      message.success('Slide deleted successfully');
    },
  });

  const handleOpenModal = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      form.setFieldsValue(slide);
    } else {
      setEditingSlide(null);
      form.resetFields();
      form.setFieldsValue({ isActive: true, isImageOnly: false, sortOrder: 0 });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingSlide(null);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingSlide) {
        updateMutation.mutate({ id: editingSlide.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    });
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url: string) => <img src={url} alt="Slide" style={{ width: 100, height: 50, objectFit: 'cover' }} />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: HeroSlide) => record.isImageOnly ? <span style={{ color: '#aaa' }}>N/A (Image Only)</span> : text,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: HeroSlide) => (
        <Switch 
          checked={isActive} 
          onChange={(checked) => updateMutation.mutate({ id: record.id, data: { isActive: checked } })} 
        />
      ),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: HeroSlide) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm title="Are you sure?" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 16px', overflowX: 'hidden', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#2C4A3B' }}>Hero Slider</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()} style={{ backgroundColor: '#2C4A3B' }}>
          Add Slide
        </Button>
      </div>

      <Table 
        scroll={{ x: 'max-content' }}
        columns={columns} 
        dataSource={slides} 
        rowKey="id" 
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title={editingSlide ? 'Edit Slide' : 'Add Slide'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={700}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="imageUrl" label="Slide Image URL" rules={[{ required: true, message: 'Image is required' }]}>
            <Input readOnly placeholder="Upload an image below" style={{ marginBottom: 8 }} />
          </Form.Item>
          
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
                message.success('Image uploaded successfully');
                form.setFieldValue('imageUrl', info.file.response.data.url);
              } else if (info.file.status === 'error') {
                message.error('Image upload failed');
              }
            }}
          >
            <Button icon={<UploadOutlined />} style={{ marginBottom: 24 }}>Upload Image</Button>
          </Upload>

          <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, marginBottom: 24 }}>
            <Form.Item name="isImageOnly" valuePropName="checked" label="Image Only (No Text / CTA Overlay)">
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
            <div style={{ color: '#666', fontSize: 12, marginTop: -16, marginBottom: 16 }}>
              If ON, the text and button fields below will be completely hidden on the web app.
            </div>

            {!isImageOnly && (
              <>
                <Form.Item name="title" label="Title">
                  <Input placeholder="e.g. GRANDMA'S LADLE" />
                </Form.Item>
                <Form.Item name="subtitle" label="Subtitle">
                  <Input.TextArea rows={3} placeholder="e.g. Traditional goodness..." />
                </Form.Item>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="ctaText" label="Primary Button Text" style={{ flex: 1 }}>
                    <Input placeholder="e.g. ORDER NOW" />
                  </Form.Item>
                  <Form.Item name="ctaLink" label="Primary Button Link" style={{ flex: 1 }}>
                    <Select 
                      options={[
                        { label: 'Home', value: '/' },
                        { label: 'Our Story', value: '/our-story' },
                        { label: 'Menu', value: '/menu' },
                        { label: 'Corporate', value: '/corporate' },
                        { label: 'Festivals', value: '/festivals' },
                        { label: 'Visit Us', value: '/visit-us' },
                        { label: 'Sale', value: '/sale' },
                      ]} 
                      placeholder="Select a page" 
                      allowClear 
                    />
                  </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item name="secondaryCtaText" label="Secondary Button Text" style={{ flex: 1 }}>
                    <Input placeholder="e.g. OUR STORY" />
                  </Form.Item>
                  <Form.Item name="secondaryCtaLink" label="Secondary Button Link" style={{ flex: 1 }}>
                    <Select 
                      options={[
                        { label: 'Home', value: '/' },
                        { label: 'Our Story', value: '/our-story' },
                        { label: 'Menu', value: '/menu' },
                        { label: 'Corporate', value: '/corporate' },
                        { label: 'Festivals', value: '/festivals' },
                        { label: 'Visit Us', value: '/visit-us' },
                        { label: 'Sale', value: '/sale' },
                      ]} 
                      placeholder="Select a page" 
                      allowClear 
                    />
                  </Form.Item>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="sortOrder" label="Sort Order" style={{ flex: 1 }}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="isActive" valuePropName="checked" label="Active" style={{ flex: 1 }}>
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
