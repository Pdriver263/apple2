import { useState } from 'react';
import axios from 'axios';

const BkashPayment = ({ listingId, totalAmount, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/payments/bkash', {
        listingId,
        totalAmount,
        phone
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
    <div>
      <input
        type="text"
        placeholder="bKash phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : `Pay via bKash ($${totalAmount})`}
      </button>
    </div>
  );
};

export default BkashPayment;