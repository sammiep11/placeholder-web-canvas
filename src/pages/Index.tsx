
import React from 'react';
import Header from '../components/Header';
import Profile from './Profile';

const Index = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto">
        <Profile />
      </div>
    </div>
  );
};

export default Index;
