import React, { useState, useEffect, useRef } from 'react';
import Header from './mobile/components/Header';
import BottomNav from './mobile/components/BottomNav';
import TabContent from './mobile/components/TabContent';
import LoadingState from './mobile/components/LoadingState';
import SkeletonLoader from './mobile/components/SkeletonLoader';
import ErrorState from './mobile/components/ErrorState';
import { useSwipe } from './mobile/hooks/useSwipe';
import { TABS } from './mobile/constants/tabs';
import './mobile/styles/mobileStyles.css';

const Spa1AnalysisMobile = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataFile, setSelectedDataFile] = useState('spa1-data-injest.json');
  const [activeTab, setActiveTab] = useState('overview');
  const [tabDirection, setTabDirection] = useState('forward');
  const [previousTab, setPreviousTab] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    import(`./data/${selectedDataFile}`)
      .then(data => {
        setAnalysisData(data.default);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading analysis data:', error);
        setIsLoading(false);
      });
  }, [selectedDataFile]);

  const handleDataFileChange = (fileName) => {
    setSelectedDataFile(fileName);
  };

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    const newIndex = TABS.findIndex(t => t.id === newTab);
    setTabDirection(newIndex > currentIndex ? 'forward' : 'backward');
    setPreviousTab(activeTab);
    setActiveTab(newTab);
  };

  const handleSwipeLeft = () => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    if (currentIndex < TABS.length - 1) {
      handleTabChange(TABS[currentIndex + 1].id);
    }
  };

  const handleSwipeRight = () => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      handleTabChange(TABS[currentIndex - 1].id);
    }
  };

  const swipeRef = useSwipe(handleSwipeLeft, handleSwipeRight);

  const handleRetry = () => {
    setIsLoading(true);
    import(`./data/${selectedDataFile}`)
      .then(data => {
        setAnalysisData(data.default);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading analysis data:', error);
        setIsLoading(false);
      });
  };

  if (isLoading && !analysisData) {
    return <LoadingState />;
  }

  if (!analysisData && !isLoading) {
    return <ErrorState onRetry={handleRetry} />;
  }

  const { analysis_metadata } = analysisData;

  return (
    <div className="mobile-app-container" ref={swipeRef}>
      <Header
        analysisMetadata={analysis_metadata}
        selectedDataFile={selectedDataFile}
        onDataFileChange={handleDataFileChange}
      />
      <div className="mobile-content-area">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <TabContent 
            activeTab={activeTab} 
            analysisData={analysisData}
            direction={tabDirection}
          />
        )}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Spa1AnalysisMobile;
