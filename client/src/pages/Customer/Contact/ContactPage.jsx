import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd'; // Đã thêm Row, Col
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import PageTitle from '../../../components/common/PageTitle';
import { notify } from '../../../utils/notification';

const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    setTimeout(() => {
      notify.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb items={[
            { label: 'Liên hệ' }
          ]} />

          <PageTitle
            subtitle="Kết nối"
            title="LIÊN HỆ"
            description="Chúng tôi luôn sẵn lòng hỗ trợ bạn"
            className="mt-6 mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
            <div className="border border-gray-200 p-6 hover:border-gray-900 transition-colors">
              <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                <PhoneOutlined className="text-gray-900 text-lg" />
              </div>
              <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Điện Thoại</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">Liên hệ chúng tôi qua:</p>
              <a href="tel:+84325586629" className="text-gray-900 hover:text-gray-600 block mb-1 transition-colors">
                +84 325 586 629
              </a>
              <a href="tel:+84975356982" className="text-gray-900 hover:text-gray-600 block transition-colors">
                +84 975 356 982
              </a>
            </div>

            <div className="border border-gray-200 p-6 hover:border-gray-900 transition-colors">
              <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                <MailOutlined className="text-gray-900 text-lg" />
              </div>
              <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Email</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">Gửi email cho chúng tôi:</p>
              <a href="mailto:dautuan032004@gmail.com" className="text-gray-900 hover:text-gray-600 block mb-1 transition-colors">
                dautuan032004 @gmail.com
              </a>
              <a href="mailto:dauminhtuan.mail1@gmail.com" className="text-gray-900 hover:text-gray-600 block transition-colors">
                dauminhtuan.mail1 @gmail.com
              </a>
            </div>

            <div className="border border-gray-200 p-6 hover:border-gray-900 transition-colors">
              <div className="w-12 h-12 border border-gray-900 flex items-center justify-center mb-5 md:mb-6">
                <EnvironmentOutlined className="text-gray-900 text-lg" />
              </div>
              <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Địa Chỉ</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                109/47 Đường số 8,<br />
                Phường Linh Xuân, Thành phố Hồ Chí Minh<br />
                Việt Nam
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20">
            <div className="lg:col-span-2 border border-gray-200 p-6 md:p-8">
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
            </div>

            <div className="space-y-6">
              
              <div className="border border-gray-200 p-6 hover:border-gray-900 transition-colors">
                <h3 className="text-base md:text-lg font-normal text-gray-900 mb-2 md:mb-3">Kết Nối Với Chúng Tôi</h3>
                <p className="mb-5 md:mb-6 text-xs md:text-sm text-gray-600 leading-relaxed">
                  Theo dõi chúng tôi trên các nền tảng mạng xã hội
                </p>
                <div className="flex gap-2.5 md:gap-3">
                  <a 
                    href="https://www.facebook.com/TUANDEPTRAI7777777" 
                    className="w-12 h-12 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaFacebookF className="text-gray-900 group-hover:text-white transition-colors" />
                  </a>
                  <a 
                    href="https://www.instagram.com/mih_tuandau/" 
                    className="w-12 h-12 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaInstagram className="text-gray-900 group-hover:text-white transition-colors" />
                  </a>
                  <a 
                    href="https://x.com/dauminhtuan2k4" 
                    className="w-12 h-12 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaTwitter className="text-gray-900 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>

              <div className="border border-gray-200 p-6">
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
              </div>
            </div>
          </div>

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

export default ContactPage;