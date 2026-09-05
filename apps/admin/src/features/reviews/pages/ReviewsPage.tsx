import React, { useState, useRef } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Popconfirm,
  message,
  Rate,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  Radio,
  Typography,
  Select,
  Descriptions,
  Divider
} from 'antd';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CheckOutlined,
  PlusOutlined,
  StarFilled,
  GlobalOutlined,
  SafetyCertificateFilled,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  EyeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import dayjs from 'dayjs';
import { computeDelta, hasDelta } from '@/utils/delta';

const { Text, Paragraph } = Typography;

interface Review {
  id: string;
  customerName: string;
  customerLocation?: string | null;
  rating: number;
  content: string;
  adminReply?: string | null;
  isApproved: boolean;
  isPublished: boolean;
  isVerified: boolean;
  productNames?: string[];
  createdAt: string;
}

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'HIDDEN'>('ALL');

  // Queries
  const { data: reviewsData = [], isLoading } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () => apiClient.get('/Review/GetReviews').then((res: any) => res.data.data || []),
  });

  const { data: productsData = [] } = useQuery({
    queryKey: ['adminProductsList'],
    queryFn: () => apiClient.get('/Product/GetProducts').then((res: any) => res.data.data || []),
  });

  const productOptions = productsData.map((p: any) => ({
    label: p.name,
    value: p.name
  }));

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
      message.success('Listing status updated');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => message.error('Failed to update listing status'),
  });

  const toggleApprovalMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      apiClient.patch(`/Review/UpdateReviewApprovalStatus/${id}`, { isApproved }),
    onSuccess: () => {
      message.success('Approval status updated');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => message.error('Failed to update approval status'),
  });

  const toggleVerifyMutation = useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      apiClient.patch(`/Review/UpdateReviewVerificationStatus/${id}`, { isVerified }),
    onSuccess: () => {
      message.success('Verified buyer badge updated');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: () => message.error('Failed to update verification status'),
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
    form.setFieldsValue({
      rating: 5,
      isApproved: true,
      isPublished: true,
      isVerified: true,
      productNames: []
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record: Review) => {
    setEditingId(record.id);
    form.setFieldsValue({
      customerName: record.customerName,
      customerLocation: record.customerLocation,
      rating: record.rating,
      content: record.content,
      adminReply: record.adminReply,
      isApproved: record.isApproved,
      isPublished: record.isPublished,
      isVerified: record.isVerified,
      productNames: record.productNames || []
    });
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
        const originalReview = reviewsData.find((r: any) => r.id === editingId);
        const delta = computeDelta(originalReview, values);
        if (!hasDelta(delta)) {
          message.info('No changes detected.');
          handleCancel();
          return;
        }
        updateMutation.mutate({ id: editingId, data: delta });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Metrics computation
  const totalReviews = reviewsData.length;
  const pendingReviews = reviewsData.filter(r => !r.isApproved).length;
  const publishedReviews = reviewsData.filter(r => r.isPublished && r.isApproved).length;
  const verifiedReviews = reviewsData.filter(r => r.isVerified).length;
  const averageRating = totalReviews > 0
    ? (reviewsData.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) / totalReviews).toFixed(1)
    : '5.0';

  // Filtering
  const filteredData = reviewsData.filter(r => {
    if (activeFilter === 'PENDING') return !r.isApproved;
    if (activeFilter === 'APPROVED') return r.isApproved;
    if (activeFilter === 'HIDDEN') return !r.isPublished;
    return true;
  });

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_: any, record: Review) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text strong style={{ fontSize: 14 }}>{record.customerName}</Text>
            {record.isVerified && (
              <Tooltip title="Verified Customer (Blue Tick)">
                <CheckCircleFilled style={{ color: '#1677ff', fontSize: 15 }} />
              </Tooltip>
            )}
          </div>
          {record.customerLocation && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <EnvironmentOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
              <span>{record.customerLocation}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating: number) => (
        <Space direction="vertical" size={2}>
          <Rate disabled defaultValue={rating} style={{ fontSize: 12, color: '#f59e0b' }} />
          <Tag color="gold" style={{ fontSize: 11, padding: '0 6px', margin: 0 }}>{rating}.0 / 5</Tag>
        </Space>
      ),
    },
    {
      title: 'Items Ordered',
      key: 'productNames',
      width: 180,
      render: (_: any, record: Review) => {
        if (!record.productNames || record.productNames.length === 0) {
          return <span style={{ color: '#bfbfbf', fontSize: 12 }}>General review</span>;
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {record.productNames.map((p, idx) => (
              <Tag key={idx} color="green" icon={<ShoppingOutlined />} style={{ fontSize: 11, margin: 0 }}>
                {p}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Review Content & Reply',
      key: 'content',
      width: 280,
      render: (_: any, record: Review) => (
        <div>
          <Paragraph
            ellipsis={{ rows: 2, symbol: '...' }}
            style={{ marginBottom: 4, color: '#262626', fontSize: 13 }}
          >
            "{record.content}"
          </Paragraph>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setViewingReview(record)}
              style={{ padding: 0, fontSize: 12, color: '#2C4A3B' }}
            >
              View Full Review
            </Button>
            {record.adminReply && (
              <Tag color="blue" icon={<MessageOutlined />} style={{ fontSize: 10, margin: 0 }}>
                Replied
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (dateStr: string) => {
        if (!dateStr) return '-';
        const d = dayjs(dateStr);
        return (
          <div>
            <div style={{ fontWeight: 500, color: '#262626', fontSize: 13 }}>{d.format('DD MMM YYYY')}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{d.format('hh:mm A')}</div>
          </div>
        );
      },
    },
    {
      title: 'Approval',
      key: 'isApproved',
      width: 110,
      render: (_: any, record: Review) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.isApproved ? 'success' : 'warning'} icon={record.isApproved ? <CheckOutlined /> : <ClockCircleOutlined />} style={{ margin: 0 }}>
            {record.isApproved ? 'Approved' : 'Pending'}
          </Tag>
          <Switch
            size="small"
            checked={record.isApproved}
            checkedChildren="Approve"
            unCheckedChildren="Pending"
            onChange={(checked) => toggleApprovalMutation.mutate({ id: record.id, isApproved: checked })}
            loading={toggleApprovalMutation.isPending && toggleApprovalMutation.variables?.id === record.id}
          />
        </Space>
      ),
    },
    {
      title: 'Listed (Web)',
      key: 'isPublished',
      width: 110,
      render: (_: any, record: Review) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.isPublished ? 'processing' : 'default'} style={{ margin: 0 }}>
            {record.isPublished ? 'Live on Web' : 'Hidden'}
          </Tag>
          <Switch
            size="small"
            checked={record.isPublished}
            checkedChildren="Listed"
            unCheckedChildren="Hidden"
            onChange={(checked) => togglePublishMutation.mutate({ id: record.id, isPublished: checked })}
            loading={togglePublishMutation.isPending && togglePublishMutation.variables?.id === record.id}
          />
        </Space>
      ),
    },
    {
      title: 'Verified Buyer',
      key: 'isVerified',
      width: 110,
      render: (_: any, record: Review) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.isVerified ? 'blue' : 'default'} icon={record.isVerified ? <CheckCircleFilled /> : undefined} style={{ margin: 0 }}>
            {record.isVerified ? 'Verified' : 'Regular'}
          </Tag>
          <Switch
            size="small"
            checked={record.isVerified}
            checkedChildren="Blue Tick"
            unCheckedChildren="Off"
            onChange={(checked) => toggleVerifyMutation.mutate({ id: record.id, isVerified: checked })}
            loading={toggleVerifyMutation.isPending && toggleVerifyMutation.variables?.id === record.id}
          />
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      fixed: 'right' as const,
      render: (_: any, record: Review) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#1677ff' }} />}
            onClick={() => handleEdit(record)}
            title="Edit Review"
          />
          <Popconfirm
            title="Delete Review"
            description="Are you sure you want to delete this customer review?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete Review"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1f1f1f' }}>Customer Reviews Moderation</h2>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
            Moderate customer reviews, verify purchasers with blue tick badges, and control web app visibility.
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ background: '#2C4A3B', borderColor: '#2C4A3B', borderRadius: 8 }}
          onClick={handleAdd}
        >
          Add Review
        </Button>
      </div>

      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Average Rating"
              value={averageRating}
              suffix="/ 5.0"
              prefix={<StarFilled style={{ color: '#faad14', fontSize: 22 }} />}
              valueStyle={{ color: '#d48806', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Total Reviews"
              value={totalReviews}
              prefix={<SafetyCertificateFilled style={{ color: '#1677ff', fontSize: 22 }} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Pending Approval"
              value={pendingReviews}
              prefix={<ClockCircleOutlined style={{ color: pendingReviews > 0 ? '#fa8c16' : '#52c41a', fontSize: 22 }} />}
              valueStyle={{ color: pendingReviews > 0 ? '#fa8c16' : '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Live on Web App"
              value={publishedReviews}
              prefix={<GlobalOutlined style={{ color: '#52c41a', fontSize: 22 }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card with Mouse Drag-to-Scroll */}
      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 16 }}>Reviews Feed</span>
            <Radio.Group
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              buttonStyle="solid"
              size="middle"
            >
              <Radio.Button value="ALL">All ({totalReviews})</Radio.Button>
              <Radio.Button value="PENDING">Pending ({pendingReviews})</Radio.Button>
              <Radio.Button value="APPROVED">Approved ({reviewsData.filter(r => r.isApproved).length})</Radio.Button>
              <Radio.Button value="HIDDEN">Hidden ({reviewsData.filter(r => !r.isPublished).length})</Radio.Button>
            </Radio.Group>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1300 }}
          tableLayout="fixed"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* View Full Review Details Popup Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 700, color: '#2C4A3B' }}>
            <SafetyCertificateFilled style={{ color: '#2C4A3B' }} />
            <span>Customer Review Details</span>
          </div>
        }
        open={!!viewingReview}
        onCancel={() => setViewingReview(null)}
        footer={[
          <Button key="close" onClick={() => setViewingReview(null)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            style={{ background: '#2C4A3B', borderColor: '#2C4A3B' }}
            onClick={() => {
              const r = viewingReview;
              setViewingReview(null);
              if (r) handleEdit(r);
            }}
          >
            Edit / Reply
          </Button>
        ]}
        width={650}
      >
        {viewingReview && (
          <div style={{ marginTop: 16 }}>
            {/* Customer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#FAF6EE', padding: 16, borderRadius: 10, marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Text strong style={{ fontSize: 18, color: '#1f1f1f' }}>{viewingReview.customerName}</Text>
                  {viewingReview.isVerified && (
                    <Tag color="blue" icon={<CheckCircleFilled />}>Verified Buyer</Tag>
                  )}
                </div>
                {viewingReview.customerLocation && (
                  <div style={{ color: '#666', fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <EnvironmentOutlined style={{ fontSize: 12 }} />
                    <span>{viewingReview.customerLocation}</span>
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <Rate disabled defaultValue={viewingReview.rating} style={{ fontSize: 16, color: '#f59e0b' }} />
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#d48806', marginLeft: 4 }}>
                    {viewingReview.rating}.0 / 5
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                  {dayjs(viewingReview.createdAt).format('DD MMMM YYYY, hh:mm A')}
                </div>
              </div>
            </div>

            {/* Products Purchased if any */}
            {viewingReview.productNames && viewingReview.productNames.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>
                  Items Purchased / Reviewed:
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {viewingReview.productNames.map((p, idx) => (
                    <Tag key={idx} color="green" icon={<ShoppingOutlined />} style={{ padding: '3px 8px', fontSize: 13 }}>
                      {p}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {/* Review Content */}
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>
                Customer Feedback:
              </Text>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                padding: '14px 16px',
                fontSize: 15,
                lineHeight: 1.6,
                color: '#262626',
                fontStyle: 'italic'
              }}>
                "{viewingReview.content}"
              </div>
            </div>

            {/* Official Reply */}
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>
                Official Reply from Grandma's Ladle:
              </Text>
              {viewingReview.adminReply ? (
                <div style={{
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#262626'
                }}>
                  {viewingReview.adminReply}
                </div>
              ) : (
                <div style={{ color: '#8c8c8c', fontStyle: 'italic', fontSize: 13 }}>
                  No reply posted yet. Click "Edit / Reply" to write a response.
                </div>
              )}
            </div>

            {/* Quick Status Bar */}
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', padding: '10px 16px', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Approved:</span>
                <Switch
                  checked={viewingReview.isApproved}
                  onChange={(checked) => {
                    toggleApprovalMutation.mutate({ id: viewingReview.id, isApproved: checked });
                    setViewingReview({ ...viewingReview, isApproved: checked });
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Live on Web:</span>
                <Switch
                  checked={viewingReview.isPublished}
                  onChange={(checked) => {
                    togglePublishMutation.mutate({ id: viewingReview.id, isPublished: checked });
                    setViewingReview({ ...viewingReview, isPublished: checked });
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Verified Badge:</span>
                <Switch
                  checked={viewingReview.isVerified}
                  onChange={(checked) => {
                    toggleVerifyMutation.mutate({ id: viewingReview.id, isVerified: checked });
                    setViewingReview({ ...viewingReview, isVerified: checked });
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal for Add / Edit */}
      <Modal
        title={editingId ? 'Edit Customer Review' : 'Create Customer Review'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingId ? 'Save Changes' : 'Create Review'}
        okButtonProps={{ style: { background: '#2C4A3B', borderColor: '#2C4A3B' } }}
        width={620}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[{ required: true, message: 'Please enter customer name' }]}
              >
                <Input placeholder="e.g. Ananya Sundaram" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="customerLocation"
                label="Location (City / State)"
              >
                <Input placeholder="e.g. Chennai, TN" prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="rating"
            label="Star Rating"
            rules={[{ required: true, message: 'Please select a star rating' }]}
          >
            <Rate style={{ color: '#f59e0b', fontSize: 22 }} />
          </Form.Item>

          <Form.Item
            name="productNames"
            label="Products Ordered / Reviewed (Optional)"
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select products"
              options={productOptions}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Review Text"
            rules={[{ required: true, message: 'Please enter customer review text' }]}
          >
            <Input.TextArea rows={4} placeholder="What did the customer say about Grandma's Ladle?" />
          </Form.Item>

          <Form.Item
            name="adminReply"
            label="Official Reply from Grandma's Ladle (Optional)"
          >
            <Input.TextArea rows={3} placeholder="Thank you for your warm words! We are glad you enjoyed the Kai Murukku..." />
          </Form.Item>

          <Row gutter={16} style={{ background: '#fafafa', padding: 12, borderRadius: 8, marginTop: 12 }}>
            <Col span={8}>
              <Form.Item
                name="isApproved"
                label="Admin Approved"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isPublished"
                label="Listed on Web"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isVerified"
                label="Verified Buyer"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch checkedChildren="Blue Tick" unCheckedChildren="Off" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
