import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ listingId, totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Stripe টোকেন তৈরি করুন
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        throw error;
      }

      // ব্যাকএন্ডে পেমেন্ট প্রসেস করুন
      const { data } = await axios.post('/api/payments/stripe', {
        listingId,
        totalAmount,
        token: paymentMethod
      });

      onSuccess(data.bookingId);
    } catch (err) {
      console.error(err);
      alert('Payment failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $${totalAmount}`}
      </button>
    </form>
  );
};

export default PaymentForm;