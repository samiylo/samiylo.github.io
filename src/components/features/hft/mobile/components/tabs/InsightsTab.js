import React from 'react';
import { Lightbulb, Calendar } from 'react-bootstrap-icons';
import '../../styles/mobileStyles.css';

const InsightsTab = ({ keyTakeaways, nextSteps }) => {
  return (
    <>
      <div className="mobile-card-compact">
        <div className="mobile-card-title-compact">
          <Lightbulb size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Key Takeaways
        </div>
        <div className="mobile-card-content-compact">
          {keyTakeaways.map((takeaway, index) => (
            <div key={index} className="mobile-takeaway-item">
              <div className="mobile-takeaway-number">{takeaway.number}</div>
              <div className="mobile-takeaway-content">
                <div className="mobile-takeaway-category">{takeaway.category}</div>
                <div className="mobile-takeaway-text">{takeaway.takeaway}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-card-compact">
        <div className="mobile-card-title-compact">
          <Calendar size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Next Steps
        </div>
        <div className="mobile-card-content-compact">
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px', textTransform: 'uppercase' }}>
            Immediate Actions
          </div>
          {nextSteps.immediate_actions.map((action, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '10px 0',
                fontSize: '13px',
                color: '#ddd',
                lineHeight: '1.5',
                borderBottom: index < nextSteps.immediate_actions.length - 1 
                  ? '1px solid rgba(255,255,255,0.05)' 
                  : 'none'
              }}
            >
              • {action}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InsightsTab;

