import React from 'react';
import { Rulers, Dice6 } from 'react-bootstrap-icons';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/mobileStyles.css';

const AnalysisTab = ({ mathematicalCalculations, volatilityAnalysis, probabilityAssessment }) => {
  return (
    <>
      <div className="mobile-card-compact">
        <div className="mobile-card-title-compact">
          <Rulers size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Trading Range
        </div>
        <div className="mobile-card-content-compact">
          <div className="mobile-stat-grid">
            <div className="mobile-stat-compact">
              <div className="mobile-stat-label-compact">Upper</div>
              <div className="mobile-stat-value-compact">
                {formatCurrency(mathematicalCalculations.trading_range.upper_bound)}
              </div>
            </div>
            <div className="mobile-stat-compact">
              <div className="mobile-stat-label-compact">Lower</div>
              <div className="mobile-stat-value-compact">
                {formatCurrency(mathematicalCalculations.trading_range.lower_bound)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '16px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>
              Current Position
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
              {mathematicalCalculations.current_position.position_in_range_percent.toFixed(1)}%
            </div>
            <div className="mobile-progress-compact">
              <div 
                className="mobile-progress-fill-compact"
                style={{ width: `${mathematicalCalculations.current_position.position_in_range_percent}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>
              ATR (14)
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
              {formatCurrency(volatilityAnalysis.atr_14.value_dollars)}
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-card-compact">
        <div className="mobile-card-title-compact">
          <Dice6 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Probability Scenarios
        </div>
        <div className="mobile-card-content-compact">
          {probabilityAssessment.scenarios.map((scenario, index) => (
            <div key={index} className="mobile-strategy-compact" style={{ marginBottom: '10px' }}>
              <div className="mobile-strategy-header-compact">
                <div className="mobile-strategy-name-compact">{scenario.scenario}</div>
                <span className="mobile-badge-small mobile-badge-primary">
                  {scenario.probability_percent}%
                </span>
              </div>
              <div className="mobile-progress-compact">
                <div 
                  className="mobile-progress-fill-compact"
                  style={{ width: `${scenario.probability_percent}%` }}
                ></div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                {scenario.price_range || scenario.price_target}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AnalysisTab;

