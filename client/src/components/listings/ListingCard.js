// src/components/listings/ListingCard.js
import React, { useState } from 'react';
import { Card, Rate } from 'antd';
import { EnvironmentOutlined, UserOutlined } from '@ant-design/icons';

const ListingCard = ({ listing }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback image URL
  const getSafeImageUrl = () => {
    if (imageError || !listing.images || listing.images.length === 0) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+';
    }
    return listing.images[0];
  };

  return (
    <Card
      hoverable
      style={{ width: 300, margin: '16px' }}
      cover={
        <div style={{ height: '200px', overflow: 'hidden' }}>
          <img 
            alt={listing.title}
            src={getSafeImageUrl()}
            onError={handleImageError}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </div>
      }
    >
      <div style={{ minHeight: '120px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#333'
        }}>
          {listing.title}
        </h3>
        
        <div style={{ marginBottom: '8px' }}>
          <Rate 
            disabled 
            defaultValue={listing.rating || 4.5} 
            style={{ fontSize: '14px' }} 
          />
          <span style={{ marginLeft: '8px', color: '#666', fontSize: '12px' }}>
            ({listing.reviews || 0} reviews)
          </span>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '8px',
          color: '#666',
          fontSize: '12px'
        }}>
          <EnvironmentOutlined style={{ marginRight: '4px' }} />
          <span>
            {listing.location?.city || 'Unknown Location'}
            {listing.location?.area && `, ${listing.location.area}`}
          </span>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '12px',
          color: '#666',
          fontSize: '12px'
        }}>
          <UserOutlined style={{ marginRight: '4px' }} />
          <span>{listing.guests || 1} guests • {listing.bedrooms || 1} bedrooms • {listing.bathrooms || 1} bathrooms</span>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '12px'
        }}>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#1890ff' 
          }}>
            ${listing.price || 0}
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 'normal', 
              color: '#666' 
            }}>
              /night
            </span>
          </span>
        </div>

        {listing.amenities && listing.amenities.length > 0 && (
          <div style={{ 
            marginTop: '8px',
            fontSize: '11px',
            color: '#888'
          }}>
            {listing.amenities.slice(0, 3).join(' • ')}
            {listing.amenities.length > 3 && ' • ...'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ListingCard;