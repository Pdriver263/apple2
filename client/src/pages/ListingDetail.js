// src/pages/ListingDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin } from 'antd';
import api from '../services/api';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <Spin size="large" />;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card title={listing?.title} bordered={false}>
        <img 
          src={listing?.images[0]} 
          alt={listing?.title} 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
        />
        <p>Price: ${listing?.price} per night</p>
        <p>Location: {listing?.location}</p>
      </Card>
    </div>
  );
};

export default ListingDetail;