import React, { useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Modal, Descriptions } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import dayjs from 'dayjs';

export default function ContactEnquiryPage() {
  const queryClient = useQueryClient();
  const [viewRecord, setViewRecord] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['ContactEnquiry'],
    queryFn: () => apiClient.get('/ContactEnquiry/GetContactEnquirys').then((res) => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/ContactEnquiry/DeleteContactEnquiry/${id}`),
    onSuccess: () => {
      message.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['ContactEnquiry'] });
    },
    onError: () => message.error('Failed to delete'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; status: string }) => apiClient.put(`/ContactEnquiry/UpdateContactEnquiry/${data.id}`, { status: data.status }),
    onSuccess: () => {
      message.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['ContactEnquiry'] });
    },
    onError: () => message.error('Failed to update status'),
  });

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject', render: (text: string) => text ? (text.length > 20 ? text.substring(0, 20) + '...' : text) : '-' },
    { title: 'Message', dataIndex: 'message', key: 'message', render: (text: string) => <div style={{ whiteSpace: 'pre-wrap', minWidth: '300px' }}>{text}</div> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <select
          value={status || 'New'}
          onChange={(e) => updateMutation.mutate({ id: record.id, status: e.target.value })}
          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
          disabled={updateMutation.isPending && updateMutation.variables?.id === record.id}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
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
    <div style={{ padding: '24px 16px', overflowX: 'hidden', width: '100%' }}>
      <h2 style={{ marginBottom: 16 }}>Contact Enquiries</h2>
      <Table scroll={{ x: 'max-content' }} columns={columns} dataSource={data || []} rowKey="id" loading={isLoading} />

      <Modal
        title="Message Details"
        open={!!viewRecord}
        onCancel={() => setViewRecord(null)}
        footer={[
          <Button key="close" onClick={() => setViewRecord(null)}>Close</Button>
        ]}
        width={600}
      >
        {viewRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{viewRecord.name}</Descriptions.Item>
            <Descriptions.Item label="Contact">{viewRecord.email} {viewRecord.phone && `| ${viewRecord.phone}`}</Descriptions.Item>
            <Descriptions.Item label="Subject">{viewRecord.subject || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Message">
              <div style={{ whiteSpace: 'pre-wrap' }}>{viewRecord.message}</div>
            </Descriptions.Item>
            <Descriptions.Item label="Status">{viewRecord.status}</Descriptions.Item>
            <Descriptions.Item label="Submitted At">
              {viewRecord.createdAt ? dayjs(viewRecord.createdAt).format('DD MMM YYYY, hh:mm A') : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
