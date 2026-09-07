import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Form, Input, InputNumber, DatePicker, TimePicker, Button, message } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { SectionContainer } from '@/components/common/SectionContainer';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandButton } from '@/components/common/BrandButton';
import { createWhatsAppUrl } from '@/lib/whatsapp';
import { apiClient } from '@/lib/apiClient';
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function CorporatePage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isSubmittingRef = useRef(false);

  const onFinish = async (values: any) => {
    // Multi-click block: strictly drop any second click or duplicate trigger
    if (isSubmittingRef.current || submitting) {
      return;
    }
    isSubmittingRef.current = true;
    setSubmitting(true);

    try {
      const payload = { ...values };
      if (payload.dateRequired) {
        payload.dateRequired = payload.dateRequired.format('YYYY-MM-DD');
      }
      if (payload.preferredDeliveryPickupTime && typeof payload.preferredDeliveryPickupTime.format === 'function') {
        payload.preferredDeliveryPickupTime = payload.preferredDeliveryPickupTime.format('h:mm A');
      }
      await apiClient.post('/CorporateEnquiry/CreateCorporateEnquiry', payload);
      message.success('Quote request sent successfully! We will get back to you soon.');
      form.resetFields();
      setIsSubmitted(true);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to send quote request. Please try again.';
      message.error(errMsg);
    } finally {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Corporate & Bulk Orders | Grandma's Ladle</title>
        <meta name="description" content="Bring something familiar, wholesome and memorable to your next meeting, team celebration or office gathering. Authentic South Indian traditional catering in Bengaluru." />
        <link rel="canonical" href="https://grandma.novacodex.in/corporate" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Corporate & Bulk Orders | Grandma's Ladle" />
        <meta property="og:description" content="Wholesome and authentic traditional South Indian snacks and sweets for corporate events and team celebrations." />
        <meta property="og:url" content="https://grandma.novacodex.in/corporate" />
        <meta property="og:image" content="https://grandma.novacodex.in/logo.jpg" />
        <meta property="og:site_name" content="Grandma's Ladle" />
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
            {isSubmitted ? (
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 bg-[#2C4A3B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleFilled className="text-4xl text-[#2C4A3B]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2C4A3B] mb-2 font-serif">Quote Request Received!</h3>
                <p className="text-[#3E2C22] max-w-md mx-auto mb-6 text-base leading-relaxed">
                  Thank you! We have successfully received your corporate order enquiry. Our catering coordinator will review your requirements and reach out within 24 hours.
                </p>
                <Button 
                  type="primary"
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#2C4A3B] hover:bg-[#1f3429] h-11 px-6 rounded-lg font-semibold text-white shadow"
                >
                  Submit Another Enquiry
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[#2C4A3B] mb-6">Request a Quote</h3>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  disabled={submitting}
                >
                  <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                    <Input placeholder="Your Name" size="large" />
                  </Form.Item>
                  <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Please enter company name' }]}>
                    <Input placeholder="Company Name" size="large" />
                  </Form.Item>
                  <Form.Item name="designation" label="Designation">
                    <Input placeholder="Your Designation" size="large" />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
                    <Input placeholder="Phone Number" size="large" />
                  </Form.Item>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                    <Input placeholder="Email Address" size="large" />
                  </Form.Item>
                  <Form.Item name="numberOfPeople" label="Number of people" rules={[{ required: true, message: 'Please enter number of people' }]}>
                    <InputNumber min={1} className="w-full" placeholder="e.g. 50" size="large" />
                  </Form.Item>
                  <Form.Item 
                    name="dateRequired" 
                    label="Date required" 
                    rules={[
                      { required: true, message: 'Please select date required' },
                      {
                        validator: (_, value) => {
                          if (!value || value.isSame(dayjs(), 'day') || value.isAfter(dayjs(), 'day')) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Date cannot be in the past. Please select today or a future date.'));
                        }
                      }
                    ]}
                  >
                    <DatePicker 
                      className="w-full" 
                      size="large" 
                      format="DD MMM YYYY"
                      placeholder="Select date required"
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                  </Form.Item>
                  <Form.Item name="preferredDeliveryPickupTime" label="Preferred delivery/pickup time">
                    <TimePicker 
                      use12Hours 
                      format="h:mm A" 
                      minuteStep={15}
                      size="large"
                      className="w-full"
                      placeholder="Select preferred time (e.g. 10:30 AM)"
                      needConfirm={false}
                    />
                  </Form.Item>
                  <Form.Item name="itemsInterestedIn" label="Items interested in">
                    <TextArea rows={3} placeholder="e.g. Sundal, Mini Murukku, Modakam" />
                  </Form.Item>
                  <Form.Item name="budgetPerPerson" label="Budget per person">
                    <InputNumber min={0} className="w-full" placeholder="e.g. 200" prefix="₹" size="large" />
                  </Form.Item>
                  <Form.Item name="specialRequirements" label="Special requirements">
                    <TextArea rows={3} placeholder="Any dietary requirements or special instructions?" />
                  </Form.Item>
                  <Form.Item className="mb-2">
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={submitting}
                      disabled={submitting}
                      style={{ pointerEvents: submitting ? 'none' : 'auto' }}
                      className="w-full bg-[#B85C3E] hover:bg-[#a04e33] border-none h-12 text-white font-bold tracking-wide shadow-md text-base rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
                    >
                      {submitting ? 'SUBMITTING QUOTE REQUEST...' : 'REQUEST A QUOTE'}
                    </Button>
                  </Form.Item>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    We respect your privacy. Details provided are strictly used to coordinate your catering quote. Read our{' '}
                    <Link to="/privacy-policy" className="text-[#2C4A3B] underline hover:text-[#B85C3E] font-medium">
                      Privacy Policy
                    </Link>.
                  </p>
                </Form>
              </>
            )}
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
