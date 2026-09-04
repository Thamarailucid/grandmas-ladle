import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Input, InputNumber, DatePicker, Select, Button, message } from 'antd';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { createWhatsAppUrl } from '@/lib/whatsapp';
import { apiClient } from '@/lib/apiClient';

const { TextArea } = Input;

export default function CorporatePage() {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const payload = { ...values };
      if (payload.dateRequired) {
        payload.dateRequired = payload.dateRequired.format('YYYY-MM-DD');
      }
      await apiClient.post('/CorporateEnquiry/CreateCorporateEnquiry', payload);
      message.success('Quote request sent successfully! We will get back to you soon.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send quote request. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Corporate & Bulk Orders | Grandma's Ladle</title>
        <meta name="description" content="Bring something familiar, wholesome and memorable to your next meeting, team celebration or office gathering." />
      </Helmet>
      
      <SectionContainer bgColor="cream">
        <SectionHeading 
          title="TRADITIONAL SNACKS FOR YOUR WORKPLACE" 
          centered 
        />
        <div className="max-w-3xl mx-auto text-center mb-12 text-lg text-[#3E2C22]">
          Bring something familiar, wholesome and memorable to your next meeting, team celebration or office gathering.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold text-[#2C4A3B] mb-6">We can cater for</h3>
            <ul className="list-disc pl-6 mb-8 text-[#3E2C22] space-y-2">
              <li>Team lunches</li>
              <li>Office meetings</li>
              <li>Corporate events</li>
              <li>Festive celebrations</li>
              <li>Client gifting</li>
              <li>Employee welcome kits</li>
              <li>Offsite gatherings</li>
              <li>Custom corporate packages</li>
            </ul>

            <h3 className="text-2xl font-bold text-[#2C4A3B] mb-6">How it works</h3>
            <ol className="list-decimal pl-6 text-[#3E2C22] space-y-3">
              <li>Submit your requirements using the form.</li>
              <li>We will get in touch to discuss the menu and options.</li>
              <li>Receive a customized quote and tasting samples (on request).</li>
              <li>Confirm your order and delivery details.</li>
              <li>Enjoy wholesome traditional snacks at your workplace.</li>
            </ol>

            <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-lg font-bold text-[#2C4A3B] mb-2">Prefer WhatsApp?</h4>
              <p className="mb-4 text-gray-600">Send us your requirements directly.</p>
              <BrandButton 
                variant="primary" 
                href={createWhatsAppUrl("Hi, I would like to inquire about corporate orders.")}
              >
                WHATSAPP US
              </BrandButton>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-[#2C4A3B] mb-6">Request a Quote</h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                <Input placeholder="Your Name" />
              </Form.Item>
              <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Please enter company name' }]}>
                <Input placeholder="Company Name" />
              </Form.Item>
              <Form.Item name="designation" label="Designation">
                <Input placeholder="Your Designation" />
              </Form.Item>
              <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
                <Input placeholder="Phone Number" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                <Input placeholder="Email Address" />
              </Form.Item>
              <Form.Item name="numberOfPeople" label="Number of people" rules={[{ required: true, message: 'Please enter number of people' }]}>
                <InputNumber min={1} className="w-full" placeholder="e.g. 50" />
              </Form.Item>
              <Form.Item name="dateRequired" label="Date required" rules={[{ required: true, message: 'Please select date' }]}>
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item name="preferredDeliveryPickupTime" label="Preferred delivery/pickup time">
                <Input placeholder="e.g. 10:00 AM" />
              </Form.Item>
              <Form.Item name="itemsInterestedIn" label="Items interested in">
                <TextArea rows={3} placeholder="e.g. Sundal, Mini Murukku" />
              </Form.Item>
              <Form.Item name="budgetPerPerson" label="Budget per person">
                <InputNumber min={0} className="w-full" placeholder="e.g. 200" prefix="₹" />
              </Form.Item>
              <Form.Item name="specialRequirements" label="Special requirements">
                <TextArea rows={3} placeholder="Any dietary requirements or special instructions?" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full bg-[#B85C3E] hover:bg-[#a04e33] border-none h-10 text-white font-bold">
                  REQUEST A QUOTE
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
