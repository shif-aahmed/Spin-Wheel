import React from 'react';
import './WheelCenterImage.css'; // optional for custom styling

const WheelCenterImage = ({ src, alt = 'Center Image' }) => {
  return (
    <div className="wheel-center-image">
      <img src={src} alt={alt} />
    </div>
  );
};

export default WheelCenterImage;
