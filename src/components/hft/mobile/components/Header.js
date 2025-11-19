import React from 'react';
import TickerSelector from './TickerSelector';
import { formatCurrency, getConfidenceColor } from '../utils/formatters';
import { DATA_FILES } from '../constants/tabs';
import '../styles/mobileStyles.css';

const Header = ({ analysisMetadata, selectedDataFile, onDataFileChange }) => {
  return (
    <div className="mobile-sticky-header">
      <div className="mobile-header-top">
        <div className="mobile-date-badge">{analysisMetadata.analysis_date}</div>
        <TickerSelector
          ticker={analysisMetadata.ticker}
          selectedFile={selectedDataFile}
          dataFiles={DATA_FILES}
          onFileChange={onDataFileChange}
        />
      </div>
      <div className="mobile-header-name">{analysisMetadata.full_name}</div>
      <div className="mobile-metrics-compact">
        <div className="mobile-metric-compact">
          <div className="mobile-metric-label-compact">Price</div>
          <div className="mobile-metric-value-compact">
            {formatCurrency(analysisMetadata.current_price)}
          </div>
        </div>
        <div className="mobile-metric-compact">
          <div className="mobile-metric-label-compact">Confidence</div>
          <div 
            className="mobile-metric-value-compact" 
            style={{ color: getConfidenceColor(analysisMetadata.confidence_level) }}
          >
            {analysisMetadata.confidence_level}%
          </div>
        </div>
        <div className="mobile-metric-compact">
          <div className="mobile-metric-label-compact">Quality</div>
          <div className="mobile-metric-value-compact">{analysisMetadata.analysis_quality}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;

