
import React from 'react';
import Header from '../components/Header';
import Profile from './Profile';
import BackToTop from '../components/BackToTop';
import { useIsMobile } from '@/hooks/use-is-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto">
        <Profile />
      </div>
      {isMobile && <BackToTop />}
    </div>
  );
};

export default Index;
