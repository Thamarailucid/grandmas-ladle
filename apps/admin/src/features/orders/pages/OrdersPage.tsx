import React, { useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Modal, Descriptions } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import dayjs from 'dayjs';

export default function OrderPage() {
  const queryClient = useQueryClient();
  const [viewRecord, setViewRecord] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['Order'],
    queryFn: () => apiClient.get('/Order/GetOrders').then((res) => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/Order/DeleteOrder/${id}`),
    onSuccess: () => {
      message.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['Order'] });
    },
    onError: () => message.error('Failed to delete'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; status: string }) => apiClient.put(`/Order/UpdateOrder/${data.id}`, { status: data.status }),
    onSuccess: () => {
      message.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['Order'] });
    },
    onError: () => message.error('Failed to update status'),
  });

  const columns = [
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Phone', dataIndex: 'customerPhone', key: 'customerPhone' },
    { title: 'Type', dataIndex: 'orderType', key: 'orderType' },
    { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount', render: (val: any) => `₹${val}` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <select
          value={status || 'Pending'}
          onChange={(e) => updateMutation.mutate({ id: record.id, status: e.target.value })}
          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
          disabled={updateMutation.isPending && updateMutation.variables?.id === record.id}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="ReadyForPickup">Ready For Pickup</option>
          <option value="OutForDelivery">Out For Delivery</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => setViewRecord(record)} style={{ padding: 0 }}>View</Button>
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
      <h2 style={{ marginBottom: 16 }}>Orders</h2>
      <Table scroll={{ x: 'max-content' }} columns={columns} dataSource={data || []} rowKey="id" loading={isLoading} />

      <Modal
        title="Order Details"
        open={!!viewRecord}
        onCancel={() => setViewRecord(null)}
        footer={[
          <Button key="close" onClick={() => setViewRecord(null)}>Close</Button>
        ]}
        width={700}
      >
        {viewRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Customer Name">{viewRecord.customerName}</Descriptions.Item>
            <Descriptions.Item label="Contact">{viewRecord.customerEmail} | {viewRecord.customerPhone}</Descriptions.Item>
            <Descriptions.Item label="Order Type">{viewRecord.orderType}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">₹{viewRecord.totalAmount}</Descriptions.Item>
            <Descriptions.Item label="Delivery Address">
              {viewRecord.deliveryAddress || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Special Instructions">
              {viewRecord.specialInstructions || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">{viewRecord.status}</Descriptions.Item>
            <Descriptions.Item label="Ordered At">
              {viewRecord.createdAt ? dayjs(viewRecord.createdAt).format('DD MMM YYYY, hh:mm A') : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
