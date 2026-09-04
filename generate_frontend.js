const fs = require('fs');
const path = require('path');

const generatePage = (entity, endpoint, title, cols) => {
  const code = `import React from 'react';
import { Table, Button, Popconfirm, message, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export default function ${entity}Page() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['${endpoint}'],
    queryFn: () => apiClient.get('/${endpoint}/Get${endpoint}s').then((res) => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(\`/${endpoint}/Delete${endpoint}/\${id}\`),
    onSuccess: () => {
      message.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['${endpoint}'] });
    },
    onError: () => message.error('Failed to delete'),
  });

  const columns = [
    ${cols},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure?"
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
      <h2 style={{ marginBottom: 16 }}>${title}</h2>
      <Table columns={columns} dataSource={data || []} rowKey="id" loading={isLoading} />
    </div>
  );
}
`;
  let folder = '';
  if (entity === 'ContactEnquiry') folder = 'contactEnquiries';
  if (entity === 'CorporateEnquiry') folder = 'corporateEnquiries';
  if (entity === 'Festival') folder = 'festivals';
  if (entity === 'Order') folder = 'orders';

  const p = path.join(__dirname, 'apps/admin/src/features', folder, 'pages', entity + 'sPage.tsx');
  fs.writeFileSync(p, code);
};

generatePage('ContactEnquiry', 'ContactEnquiry', 'Contact Enquiries', `
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Message', dataIndex: 'message', key: 'message' }
`);

generatePage('CorporateEnquiry', 'CorporateEnquiry', 'Corporate Enquiries', `
  { title: 'Company', dataIndex: 'company', key: 'company' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'People', dataIndex: 'numberOfPeople', key: 'numberOfPeople' }
`);

generatePage('Festival', 'Festival', 'Festivals', `
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
  { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
  { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (val: boolean) => val ? 'Yes' : 'No' }
`);

generatePage('Order', 'Order', 'Orders', `
  { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Phone', dataIndex: 'customerPhone', key: 'customerPhone' },
  { title: 'Type', dataIndex: 'orderType', key: 'orderType' },
  { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount' },
  { title: 'Status', dataIndex: 'status', key: 'status' }
`);

console.log('Frontend pages generated');
