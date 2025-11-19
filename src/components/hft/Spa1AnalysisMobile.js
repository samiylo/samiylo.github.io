import React, { useState, useEffect } from 'react';
import Header from './mobile/components/Header';
import BottomNav from './mobile/components/BottomNav';
import TabContent from './mobile/components/TabContent';
import LoadingState from './mobile/components/LoadingState';
import ErrorState from './mobile/components/ErrorState';
import './mobile/styles/mobileStyles.css';

const Spa1AnalysisMobile = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataFile, setSelectedDataFile] = useState('spa1-data-injest.json');
  const [activeTab, setActiveTab] = useState('overview');

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

  if (isLoading) {
    return <LoadingState />;
  }

  if (!analysisData) {
    return <ErrorState />;
  }

  const { analysis_metadata } = analysisData;

  return (
    <div className="mobile-app-container">
      <Header
        analysisMetadata={analysis_metadata}
        selectedDataFile={selectedDataFile}
        onDataFileChange={handleDataFileChange}
      />
      <div className="mobile-content-area">
        <TabContent activeTab={activeTab} analysisData={analysisData} />
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Spa1AnalysisMobile;
