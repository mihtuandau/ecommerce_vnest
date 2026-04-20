import { Card, Row, Col } from 'antd';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportCharts = ({ revenueChartData, ordersChartData }) => {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} lg={16}>
        <Card
          title="Biểu đồ doanh thu"
          bordered={false}
          className="shadow-sm"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#1890ff" name="Doanh thu" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card
          title="Đơn hàng theo trạng thái"
          bordered={false}
          className="shadow-sm"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ordersChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default ReportCharts;






