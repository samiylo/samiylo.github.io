import React from 'react';
import { BarChart, CheckCircle, Lightbulb } from 'react-bootstrap-icons';
import '../../styles/mobileStyles.css';

const OverviewTab = ({ executiveSummary, recommendations }) => {
  return (
    <>
      <div className="mobile-card-compact">
        <div className="mobile-card-title-compact">
          <BarChart size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Market Summary
        </div>
        <div className="mobile-card-content-compact">
          <div className="mobile-insight-box">
            <div className="mobile-insight-title">Market State</div>
            <div className="mobile-insight-text">{executiveSummary.market_state}</div>
          </div>
          <div style={{ marginTop: '12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>
              Primary Bias
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>
              {executiveSummary.primary_bias}
            </div>
          </div>
          <div className="mobile-insight-box">
            <div className="mobile-insight-title">
              <Lightbulb size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Key Insight
            </div>
            <div className="mobile-insight-text">{executiveSummary.key_insight}</div>
          </div>
        </div>
      </div>

      <div className="mobile-card-compact">
        <div className="mobile-card-title-compact">
          <CheckCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Primary Recommendation
        </div>
        <div className="mobile-card-content-compact">
          <div className="mobile-insight-box">
            <div className="mobile-insight-title">{recommendations.primary_action}</div>
            <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '6px' }}>
                <strong>Setup:</strong> {recommendations.primary_setup.name}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>Condition:</strong> {recommendations.primary_setup.condition}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>Action:</strong> {recommendations.primary_setup.action}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>Target:</strong> {recommendations.primary_setup.target}
              </div>
              <div>
                <strong>Probability:</strong> {recommendations.primary_setup.probability}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;

