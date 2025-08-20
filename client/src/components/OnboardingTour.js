// client/src/components/OnboardingTour.js
import { Steps, Button } from 'antd';

const OnboardingTour = ({ onComplete }) => {
  const steps = [
    {
      title: 'প্রোপার্টি খুঁজুন',
      content: 'আপনার পছন্দের স্থান এবং তারিখ সিলেক্ট করুন...',
    },
    // অন্যান্য স্টেপস
  ];

  return <Steps current={current} items={steps} />;
};