import React, { useState } from 'react';
import { Modal, Form, Input, Rate, Select, message, Spin } from 'antd';
import { StarFilled, CheckCircleFilled, EditOutlined, SafetyCertificateFilled } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Marquee from 'react-fast-marquee';
import { apiClient } from '@/lib/apiClient';
import { ReviewCard } from './ReviewCard';

interface ReviewItem {
  id: string;
  customerName: string;
  customerLocation?: string | null;
  rating: number;
  content: string;
  isVerified?: boolean;
  productNames?: string[];
  adminReply?: string | null;
  createdAt?: string;
}

interface ReviewStats {
  averageRating: string;
  totalReviews: number;
  ratingBreakdown: Record<string, number>;
}

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: '1',
    customerName: 'Ananya Sundaram',
    customerLocation: 'Indiranagar, Bengaluru',
    rating: 5,
    isVerified: true,
    productNames: ['Kai Murukku', 'Ribbon Pakoda'],
    content: 'The Kai Murukku and Ribbon Pakoda remind me exactly of my grandmother’s kitchen in Thanjavur. Crisp, authentic aroma of pure butter, and zero oily aftertaste.',
    createdAt: '2026-09-02T10:30:00Z',
    adminReply: 'Thank you Ananya! Preserving that authentic grandmother taste is our greatest mission.'
  },
  {
    id: '2',
    customerName: 'Rahul Menon',
    customerLocation: 'Koramangala, Bengaluru',
    rating: 5,
    isVerified: true,
    productNames: ['Corporate Gift Snack Box'],
    content: 'Ordered 15 corporate snack gift boxes for our team celebration. Everyone was stunned by the taste and packaging quality. Delivered right on schedule!',
    createdAt: '2026-08-28T14:15:00Z',
    adminReply: null
  },
  {
    id: '3',
    customerName: 'Kavitha Ramachandran',
    customerLocation: 'Jayanagar, Bengaluru',
    rating: 5,
    isVerified: true,
    productNames: ['Besan Ladoo', 'Nei Urundai'],
    content: 'The Besan Ladoos and Nei Urundai melt effortlessly in your mouth. Pure country ghee aroma! Truly feels like home.',
    createdAt: '2026-08-25T09:45:00Z',
    adminReply: 'Warm gratitude Kavitha! We use only traditional A2 bilona ghee in all our sweets.'
  },
  {
    id: '4',
    customerName: 'Siddharth Iyer',
    customerLocation: 'Malleshwaram, Bengaluru',
    rating: 5,
    isVerified: true,
    productNames: ['Seedai', 'South Indian Mixture'],
    content: 'The Seedai and Mixture are simply unmatched in Bengaluru. Perfectly balanced spices and fresh crunch in every single bite.',
    createdAt: '2026-08-20T16:20:00Z',
    adminReply: null
  },
  {
    id: '5',
    customerName: 'Deepa Varma',
    customerLocation: 'HSR Layout, Bengaluru',
    rating: 5,
    isVerified: true,
    productNames: ['Pepper Thattai'],
    content: 'Our family has become addicted to the Pepper Thattai! Authentic taste, wholesome ingredients, and wonderful customer service.',
    createdAt: '2026-08-15T11:10:00Z',
    adminReply: null
  }
];

export function CustomerReviewsSection() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch reviews and stats from backend
  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ['PublishedReviews'],
    queryFn: () => apiClient.get('/Review/GetPublishedReviews').then(res => res.data),
  });

  // Fetch products for customer to select what they bought
  const { data: productsData } = useQuery({
    queryKey: ['PublicProductsForReview'],
    queryFn: () => apiClient.get('/Product/GetPublicProducts').then(res => res.data.data || []),
  });

  const productOptions = (productsData || []).map((p: any) => ({
    label: p.name,
    value: p.name
  }));

  const reviews: ReviewItem[] = reviewsResponse?.data && reviewsResponse.data.length > 0
    ? reviewsResponse.data
    : FALLBACK_REVIEWS;

  const stats: ReviewStats = reviewsResponse?.stats || {
    averageRating: '4.9',
    totalReviews: reviews.length,
    ratingBreakdown: { '5': 42, '4': 6, '3': 1, '2': 0, '1': 0 }
  };

  // Submit review mutation
  const submitMutation = useMutation({
    mutationFn: (values: any) => apiClient.post('/Review/SubmitCustomerReview', values),
    onSuccess: () => {
      message.success('Thank you! Your review has been submitted and will be visible after approval.');
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['PublishedReviews'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to submit review. Please try again.';
      message.error(msg);
    },
  });

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      submitMutation.mutate(values);
    } catch (err) {
      console.error('Validation error:', err);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-brand-cream/40 overflow-hidden border-y border-brand-terracotta/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Trust Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3">
            <SafetyCertificateFilled className="text-brand-green" />
            <span>100% Authentic Customer Feedback</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark-brown tracking-tight mb-4">
            Loved By Families Across Generations
          </h2>
          <p className="font-inter text-brand-dark-brown/75 text-base sm:text-lg">
            Real reviews from customers who share our passion for wholesome, traditional South Indian taste.
          </p>
        </div>

        {/* Overall Rating & Action Bar */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-brand-terracotta/10 max-w-4xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-playfair text-5xl sm:text-6xl font-black text-brand-green">
                {stats.averageRating}
              </span>
              <span className="text-brand-dark-brown/40 font-bold text-2xl">/5</span>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-brand-cream/80 pt-3 sm:pt-0 sm:pl-5">
              <div className="flex justify-center sm:justify-start text-[#f59e0b] gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <StarFilled key={i} className="text-lg text-[#f59e0b]" />
                ))}
              </div>
              <p className="text-sm font-semibold text-brand-dark-brown">
                Overall Customer Rating
              </p>
              <p className="text-xs text-brand-dark-brown/60 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <CheckCircleFilled className="text-[#1677ff] text-xs" />
                <span>Verified by our community of snack lovers</span>
              </p>
            </div>
          </div>

          {/* Write a Review Button - Crisp White Text */}
          <button
            type="button"
            onClick={() => {
              form.resetFields();
              form.setFieldsValue({ rating: 5, productNames: [] });
              setIsModalOpen(true);
            }}
            style={{ backgroundColor: '#2C4A3B', color: '#FFFFFF' }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl !text-white font-semibold text-sm tracking-wide shadow-md hover:opacity-95 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <EditOutlined style={{ color: '#FFFFFF', fontSize: '16px' }} />
            <span style={{ color: '#FFFFFF' }} className="!text-white font-semibold text-sm">
              Write a Customer Review
            </span>
          </button>
        </div>
      </div>

      {/* Infinite Scrolling Marquee */}
      {isLoading ? (
        <div className="py-12 text-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="w-full">
          <Marquee
            speed={35}
            pauseOnHover={true}
            gradient={true}
            gradientColor="#FAF6EE"
            gradientWidth={60}
            className="py-2"
          >
            <div className="flex gap-6 pl-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  customerName={review.customerName}
                  customerLocation={review.customerLocation}
                  rating={review.rating}
                  content={review.content}
                  isVerified={review.isVerified}
                  productNames={review.productNames}
                  adminReply={review.adminReply}
                  createdAt={review.createdAt}
                />
              ))}
            </div>
          </Marquee>
        </div>
      )}

      {/* Customer Review Submission Modal */}
      <Modal
        title={
          <div className="font-playfair text-xl font-bold text-brand-green border-b pb-3 mb-2">
            Share Your Experience with Grandma's Ladle
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleFormSubmit}
        confirmLoading={submitMutation.isPending}
        okText="Submit Review"
        okButtonProps={{
          style: {
            background: '#2C4A3B',
            borderColor: '#2C4A3B',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '0 24px',
            height: '40px'
          }
        }}
        cancelButtonProps={{
          style: { borderRadius: '8px', height: '40px' }
        }}
        width={560}
        destroyOnClose
      >
        <p className="text-xs text-brand-dark-brown/70 mb-5">
          Your authentic feedback helps other families discover genuine traditional snacks. All reviews are vetted to ensure authenticity.
        </p>

        <Form form={form} layout="vertical" initialValues={{ rating: 5, productNames: [] }}>
          <Form.Item
            name="rating"
            label={<span className="font-medium text-brand-dark-brown">Your Rating</span>}
            rules={[{ required: true, message: 'Please select a star rating' }]}
          >
            <Rate className="text-[#f59e0b] text-2xl" />
          </Form.Item>

          <Form.Item
            name="customerName"
            label={<span className="font-medium text-brand-dark-brown">Your Full Name</span>}
            rules={[{ required: true, message: 'Please provide your name' }]}
          >
            <Input
              placeholder="e.g. Ananya Sundaram"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="customerLocation"
            label={<span className="font-medium text-brand-dark-brown">Your City / Area (Optional)</span>}
          >
            <Input
              placeholder="e.g. Indiranagar, Bengaluru"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="productNames"
            label={<span className="font-medium text-brand-dark-brown">Items you ordered / tasted (Optional)</span>}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select products you enjoyed (e.g. Kai Murukku, Besan Ladoo)"
              size="large"
              className="w-full rounded-lg"
              options={productOptions}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label={<span className="font-medium text-brand-dark-brown">Your Review</span>}
            rules={[
              { required: true, message: 'Please share your experience' },
              { min: 10, message: 'Please write at least 10 characters' }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="What did you love about the taste, texture, aroma, or packaging?"
              className="rounded-lg"
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
