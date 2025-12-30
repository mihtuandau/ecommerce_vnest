import React, { useState } from 'react';
import { Card, Form, Input, Button, Row, Col, Space } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { notify } from '../../../utils/notification';

const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      notify.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          <Breadcrumb items={[
            { label: 'Liên hệ' }
          ]} />

          <h1 className="text-3xl font-bold text-gray-900 pt-4 pb-4">LIÊN HỆ</h1>

          {/* Contact Info Cards */}
          <Row gutter={[24, 24]} className="mb-16 md:mb-20">
            <Col xs={24} sm={12} lg={8}>
              <Card hoverable className="h-full">
                <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                  <PhoneOutlined className="text-gray-900 text-lg" />
                </div>
                <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Điện Thoại</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-3">Liên hệ chúng tôi qua:</p>
                <a href="tel:+84123456789" className="text-gray-900 hover:text-gray-600 block mb-1 transition-colors">
                  +84 123 456 789
                </a>
                <a href="tel:+84987654321" className="text-gray-900 hover:text-gray-600 block transition-colors">
                  +84 987 654 321
                </a>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card hoverable className="h-full">
                <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                  <MailOutlined className="text-gray-900 text-lg" />
                </div>
                <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Email</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-3">Gửi email cho chúng tôi:</p>
                <a href="mailto:support@minhtuanstore.com" className="text-gray-900 hover:text-gray-600 block mb-1 transition-colors">
                  support@minhtuanstore.com
                </a>
                <a href="mailto:info@minhtuanstore.com" className="text-gray-900 hover:text-gray-600 block transition-colors">
                  info@minhtuanstore.com
                </a>
              </Card>
            </Col>

            <Col xs={24} sm={24} lg={8}>
              <Card hoverable className="h-full">
                <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                  <EnvironmentOutlined className="text-gray-900 text-lg" />
                </div>
                <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Địa Chỉ</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  123 Nguyễn Văn Linh,<br />
                  Quận 7, TP. Hồ Chí Minh,<br />
                  Việt Nam
                </p>
              </Card>
            </Col>
          </Row>

          {/* Contact Form & Info */}
          <Row gutter={[48, 48]} className="mb-16 md:mb-20">
            {/* Contact Form */}
            <Col xs={24} lg={16}>
              <Card bordered={false} className="shadow-sm">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                  Gửi Tin Nhắn Cho Chúng Tôi
                </h2>
                
                <Form
                  form={form}
                  onFinish={handleSubmit}
                  layout="vertical"
                  size="large"
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                      >
                        <Input placeholder="Nguyễn Văn A" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email!' },
                          { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                      >
                        <Input placeholder="example@email.com" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Số điện thoại"
                        name="phone"
                      >
                        <Input placeholder="0123456789" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Chủ đề"
                        name="subject"
                        rules={[{ required: true, message: 'Vui lòng nhập chủ đề!' }]}
                      >
                        <Input placeholder="Hỗ trợ đơn hàng" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Nội dung"
                    name="message"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SendOutlined />}
                      style={{ backgroundColor: '#00a85a', borderColor: '#00a85a' }}
                    >
                      Gửi Tin Nhắn
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* Additional Info */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" size="large" className="w-full">
                {/* Working Hours */}
                <Card bordered={false} className="shadow-sm">
                  <div className="flex items-center gap-3 mb-5 md:mb-6">
                    <div className="w-10 h-10 border border-[#00a85a] flex items-center justify-center">
                      <ClockCircleOutlined className="text-[#00a85a] text-base" />
                    </div>
                    <h3 className="text-base md:text-lg font-normal text-gray-900">Giờ Làm Việc</h3>
                  </div>
                  <div className="space-y-2.5 md:space-y-3 text-xs md:text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Thứ 2 - Thứ 6:</span>
                      <span className="text-gray-900">8:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thứ 7:</span>
                      <span className="text-gray-900">8:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chủ nhật:</span>
                      <span className="text-gray-900">9:00 - 17:00</span>
                    </div>
                  </div>
                </Card>

                {/* Social Media */}
                <Card bordered={false} className="shadow-sm">
                  <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Kết Nối Với Chúng Tôi</h3>
                  <p className="mb-5 md:mb-6 text-xs md:text-sm text-gray-600 leading-relaxed">Theo dõi chúng tôi trên các nền tảng mạng xã hội</p>
                  <div className="flex gap-2.5 md:gap-3">
                    <a 
                      href="#" 
                      className="w-12 h-12 border border-gray-300 hover:border-[#00a85a] hover:bg-[#00a85a] flex items-center justify-center transition-all duration-300 group"
                    >
                      <FaFacebookF className="text-gray-900 group-hover:text-white transition-colors" />
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 border border-gray-300 hover:border-[#00a85a] hover:bg-[#00a85a] flex items-center justify-center transition-all duration-300 group"
                    >
                      <FaInstagram className="text-gray-900 group-hover:text-white transition-colors" />
                    </a>
                    <a 
                      href="#" 
                      className="w-12 h-12 border border-gray-300 hover:border-[#00a85a] hover:bg-[#00a85a] flex items-center justify-center transition-all duration-300 group"
                    >
                      <FaTwitter className="text-gray-900 group-hover:text-white transition-colors" />
                    </a>
                  </div>
                </Card>

                {/* FAQ Link */}
                <Card bordered={false} className="shadow-sm">
                  <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2">Có Câu Hỏi?</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                    Xem các câu hỏi thường gặp hoặc trò chuyện trực tiếp với chúng tôi
                  </p>
                  <a 
                    href="#" 
                    className="text-gray-900 hover:text-gray-600 text-xs md:text-sm inline-flex items-center gap-2 transition-colors"
                  >
                    Xem FAQ
                    <span>→</span>
                  </a>
                </Card>
              </Space>
            </Col>
          </Row>

          {/* Map Section */}
          <div className="border-t border-gray-200 pt-16 md:pt-20 pb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
              Vị Trí Của Chúng Tôi
            </h2>
            <div className="bg-gray-100 overflow-hidden">
              <div className="h-[350px] md:h-[450px] lg:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2045.7779759982486!2d106.77527522956257!3d10.880097390426545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d88434bd9e2f%3A0xbeb0f3f0acf1059d!2zMTA5LzQ3LzNBIMSQLiBT4buRIDgsIExpbmggWHXDom4sIFRo4bunIMSQ4bupYywgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1765561169869!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Store Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage