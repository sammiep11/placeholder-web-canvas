
import React from 'react';

const ProfileBlurbs = () => {
  return (
    <div className="mb-4">
      <div className="spacehey-section-header mb-1">
        Party Details
      </div>
      <div className="px-2 py-1">
        <h3 className="font-bold text-red-600">When:</h3>
        <p className="mb-3">November 7th, 2025 @ 8pm</p>
        
        <h3 className="font-bold text-red-600">Where:</h3>
        <p className="mb-3">Casa de Jonny & Haneda <br />869 Berryessa Ave, Milpitas</p>

        <h3 className="font-bold text-red-600">Theme:</h3>
        <p>2000s - we're throwing it way back to party like Jonny hasn't completely aged out of his prime
          <br />Wear your Y2K best</p>
      </div>
    </div>
  );
};

export default ProfileBlurbs;
