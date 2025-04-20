import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Ticket as Cricket, ChevronLeft, BarChart2 } from 'lucide-react';
import useGameStore from '../../store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentMatch } = useGameStore();
  
  const showBackButton = location.pathname !== '/' && location.pathname !== '/mode-selection';
  const showScorecard = currentMatch && 
    currentMatch.inProgress && 
    location.pathname !== '/scorecard' &&
    location.pathname !== '/mode-selection' &&
    location.pathname !== '/team-setup' &&
    location.pathname !== '/game-setup' &&
    location.pathname !== '/coin-toss';
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleScorecard = () => {
    navigate('/scorecard');
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-surface-light">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton && (
              <button 
                onClick={handleBack}
                className="mr-2 p-2 rounded-full hover:bg-surface-light transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            <div className="flex items-center">
              <Cricket size={28} className="text-primary mr-2" />
              <h1 className="text-xl font-bold">Cricket Scorer</h1>
            </div>
          </div>
          
          {showScorecard && (
            <button 
              onClick={handleScorecard}
              className="p-2 rounded-full hover:bg-surface-light transition-colors"
              aria-label="View scorecard"
            >
              <BarChart2 size={24} />
            </button>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;