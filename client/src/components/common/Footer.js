import React from 'react';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '16px' }}>
      © {new Date().getFullYear()} Your Company Name
    </footer>
  );
};

// নিশ্চিত করুন default export করা হয়েছে
export default Footer;