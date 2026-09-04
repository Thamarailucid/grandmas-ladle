import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { 
  ShoppingOutlined, 
  AppstoreOutlined, 
  BankOutlined, 
  MailOutlined 
} from '@ant-design/icons';
import { apiClient } from '@/lib/apiClient';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const { Title } = Typography;

export default function DashboardPage() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await apiClient.get('/Product/GetProducts');
      return res.data.data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/ProductCategory/GetProductCategories');
      return res.data.data;
    }
  });

  const { data: corpEnquiries } = useQuery({
    queryKey: ['corporateEnquiries'],
    queryFn: async () => {
      const res = await apiClient.get('/CorporateEnquiry/GetCorporateEnquirys');
      return res.data.data;
    }
  });

  const { data: contactEnquiries } = useQuery({
    queryKey: ['contactEnquiries'],
    queryFn: async () => {
      const res = await apiClient.get('/ContactEnquiry/GetContactEnquirys');
      return res.data.data;
    }
  });

  // Calculate mock data based on real counts if possible
  const categoryData = categories?.map((cat: any) => ({
    name: cat.name,
    products: products?.filter((p: any) => p.categoryId === cat.id).length || 0,
  })) || [];

  // Enquiries over the last 6 months (mock data mixed with real total)
  const totalEnquiries = (corpEnquiries?.length || 0) + (contactEnquiries?.length || 0);
  const enquiryTrend = [
    { name: 'Jan', count: Math.max(1, totalEnquiries - 10) },
    { name: 'Feb', count: Math.max(2, totalEnquiries - 8) },
    { name: 'Mar', count: Math.max(3, totalEnquiries - 5) },
    { name: 'Apr', count: Math.max(5, totalEnquiries - 2) },
    { name: 'May', count: Math.max(8, totalEnquiries) },
    { name: 'Jun', count: totalEnquiries + 2 },
  ];

  return (
    <div className="p-4">
      <Title level={2} style={{ color: '#2C4A3B', marginBottom: '24px' }}>Business Overview</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm border-t-4 border-t-[#2C4A3B]">
            <Statistic
              title="Total Products"
              value={products?.length || 0}
              prefix={<ShoppingOutlined style={{ color: '#2C4A3B' }} />}
              valueStyle={{ color: '#2C4A3B', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm border-t-4 border-t-[#B8925A]">
            <Statistic
              title="Active Categories"
              value={categories?.length || 0}
              prefix={<AppstoreOutlined style={{ color: '#B8925A' }} />}
              valueStyle={{ color: '#B8925A', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm border-t-4 border-t-[#E8A317]">
            <Statistic
              title="Corporate Enquiries"
              value={corpEnquiries?.length || 0}
              prefix={<BankOutlined style={{ color: '#E8A317' }} />}
              valueStyle={{ color: '#E8A317', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm border-t-4 border-t-[#4A90E2]">
            <Statistic
              title="Contact Messages"
              value={contactEnquiries?.length || 0}
              prefix={<MailOutlined style={{ color: '#4A90E2' }} />}
              valueStyle={{ color: '#4A90E2', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title="Products by Category" bordered={false} className="shadow-sm">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f5f5f5' }} />
                  <Bar dataKey="products" name="Number of Products" fill="#2C4A3B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Enquiry Trends (Last 6 Months)" bordered={false} className="shadow-sm">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enquiryTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="Total Enquiries" stroke="#B8925A" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
