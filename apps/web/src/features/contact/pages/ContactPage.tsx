import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Input } from 'antd';
import {
  PhoneOutlined,
  WhatsAppOutlined,
  MailOutlined,
  InstagramOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useBusinessSettingsContext } from '@/contexts/BusinessSettingsContext';
import { createWhatsAppUrl } from '@/lib/whatsapp';

import { apiClient } from '@/lib/apiClient';

const { TextArea } = Input;

export default function ContactPage() {
  const { phone, whatsapp, email, address, instagramUrl } = useBusinessSettingsContext();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await apiClient.post('/ContactEnquiry/CreateContactEnquiry', values);
      toast.success('Thank you! Your message has been sent successfully.');
      form.resetFields();
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Grandma's Ladle</title>
        <meta name="description" content="Get in touch with Grandma's Ladle for orders, feedback, corporate enquiries, or festive requirements." />
      </Helmet>

      <SectionContainer bgColor="cream">
        <SectionHeading
          title="WE'D LOVE TO HEAR FROM YOU."
          subtitle="For orders, feedback, corporate enquiries, festive requirements or simply to say hello, get in touch."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#B8925A] p-3 rounded-full text-white mt-1">
                <PhoneOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C4A3B] mb-1">Call Us</h3>
                <a href={`tel:${phone}`} className="text-gray-700 hover:text-[#B85C3E] transition-colors">{phone}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#2C4A3B] p-3 rounded-full text-white mt-1">
                <WhatsAppOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C4A3B] mb-1">WhatsApp Us</h3>
                <a href={createWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#B85C3E] transition-colors">{whatsapp}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#B85C3E] p-3 rounded-full text-white mt-1">
                <MailOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C4A3B] mb-1">Email Us</h3>
                <a href={`mailto:${email}`} className="text-gray-700 hover:text-[#B85C3E] transition-colors">{email}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#E1306C] p-3 rounded-full text-white mt-1">
                <InstagramOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C4A3B] mb-1">Follow Us</h3>
                <a href={instagramUrl || 'https://instagram.com/'} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#B85C3E] transition-colors">Grandmas Ladle</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#3E2C22] p-3 rounded-full text-white mt-1">
                <EnvironmentOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C4A3B] mb-1">Visit Us</h3>
                <p className="text-gray-700 whitespace-pre-line">{address}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#FAF4E6]">
            <h3 className="text-2xl font-bold text-[#2C4A3B] mb-6">Send a Message</h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="name"
                label={<span className="text-[#3E2C22] font-medium">Name</span>}
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input size="large" placeholder="Your Name" />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-[#3E2C22] font-medium">Email</span>}
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input size="large" placeholder="your.email@example.com" />
              </Form.Item>

              <Form.Item
                name="phone"
                label={<span className="text-[#3E2C22] font-medium">Phone Number (Optional)</span>}
              >
                <Input size="large" placeholder="Your Phone Number" />
              </Form.Item>

              <Form.Item
                name="subject"
                label={<span className="text-[#3E2C22] font-medium">Subject (Optional)</span>}
              >
                <Input size="large" placeholder="What is this regarding?" />
              </Form.Item>

              <Form.Item
                name="message"
                label={<span className="text-[#3E2C22] font-medium">Message</span>}
                rules={[{ required: true, message: 'Please enter your message' }]}
              >
                <TextArea rows={4} size="large" placeholder="How can we help you?" />
              </Form.Item>

              <Form.Item className="mb-0 mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#2C4A3B] text-[#FAF4E6] py-3 px-6 rounded font-semibold hover:bg-[#1f3429] transition-colors"
                >
                  Send Message
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
