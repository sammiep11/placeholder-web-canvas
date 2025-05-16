
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Frown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-is-mobile';

const Search = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="spacehey-panel max-w-md w-full">
          <div className="spacehey-panel-header">Search Results</div>
          
          <div className="p-4 sm:p-8 flex flex-col items-center text-center">
            <Frown className="text-blue-500 h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
            
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Sorry, you have no friends</h2>
            
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              Don't be so desperate to search for people on fake websites
            </p>
            
            <div className="spacehey-table w-full max-w-xs mb-4">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>Friends found:</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>Search complete:</td>
                    <td>Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <Link 
              to="/" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors touch-manipulation"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
