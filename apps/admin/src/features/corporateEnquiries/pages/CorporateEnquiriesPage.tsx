import React, { useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Modal, Descriptions } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import dayjs from 'dayjs';

export default function CorporateEnquiryPage() {
  const queryClient = useQueryClient();
  const [viewRecord, setViewRecord] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['CorporateEnquiry'],
    queryFn: () => apiClient.get('/CorporateEnquiry/GetCorporateEnquirys').then((res) => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/CorporateEnquiry/DeleteCorporateEnquiry/${id}`),
    onSuccess: () => {
      message.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['CorporateEnquiry'] });
    },
    onError: () => message.error('Failed to delete'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; status: string }) => apiClient.put(`/CorporateEnquiry/UpdateCorporateEnquiry/${data.id}`, { status: data.status }),
    onSuccess: () => {
      message.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['CorporateEnquiry'] });
    },
    onError: () => message.error('Failed to update status'),
  });

  const columns = [
    { title: 'Company', dataIndex: 'company', key: 'company' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'People', dataIndex: 'numberOfPeople', key: 'numberOfPeople' },
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
          <option value="Confirmed">Confirmed</option>
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
    <div style={{ padding: '24px 16px', overflowX: 'hidden', width: '100%' }}>
      <h2 style={{ marginBottom: 16 }}>Corporate Enquiries</h2>
      <Table scroll={{ x: 'max-content' }} columns={columns} dataSource={data || []} rowKey="id" loading={isLoading} />

      <Modal
        title="Enquiry Details"
        open={!!viewRecord}
        onCancel={() => setViewRecord(null)}
        footer={[
          <Button key="close" onClick={() => setViewRecord(null)}>Close</Button>
        ]}
        width={700}
      >
        {viewRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Company">{viewRecord.company}</Descriptions.Item>
            <Descriptions.Item label="Name">{viewRecord.name} {viewRecord.designation && `(${viewRecord.designation})`}</Descriptions.Item>
            <Descriptions.Item label="Contact">{viewRecord.email} | {viewRecord.phone}</Descriptions.Item>
            <Descriptions.Item label="Number of People">{viewRecord.numberOfPeople}</Descriptions.Item>
            <Descriptions.Item label="Date Required">
              {viewRecord.dateRequired ? dayjs(viewRecord.dateRequired).format('DD MMM YYYY') : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Preferred Delivery/Pickup Time">
              {viewRecord.preferredDeliveryPickupTime || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Items Interested In">
              {viewRecord.itemsInterestedIn || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Budget per Person">
              {viewRecord.budgetPerPerson ? `₹${viewRecord.budgetPerPerson}` : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Special Requirements">
              {viewRecord.specialRequirements || 'N/A'}
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
