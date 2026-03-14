import React from 'react';
import { Shield, Rocket } from 'react-bootstrap-icons';
import { formatCurrency, getStrengthColor } from '../../utils/formatters';
import '../../styles/mobileStyles.css';

const LevelsTab = ({ supportResistance }) => {
  return (
    <>
      <div className="mobile-card-compact">
        <div className="mobile-card-title-compact">
          <Shield size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Support Levels
        </div>
        <div className="mobile-card-content-compact">
          {supportResistance.support_levels.slice(0, 3).map((level, index) => (
            <div 
              key={index}
              className="mobile-level-compact"
              style={{ borderLeftColor: getStrengthColor(level.strength) }}
            >
              <div className="mobile-level-price-compact">
                {formatCurrency(level.price)}
                <span 
                  className="mobile-badge-small" 
                  style={{ 
                    background: getStrengthColor(level.strength) + '30',
                    color: getStrengthColor(level.strength),
                    border: `1px solid ${getStrengthColor(level.strength)}50`
                  }}
                >
                  {level.strength}
                </span>
              </div>
              <div className="mobile-level-desc-compact">{level.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-card-compact">
        <div className="mobile-card-title-compact">
          <Rocket size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Resistance Levels
        </div>
        <div className="mobile-card-content-compact">
          {supportResistance.resistance_levels.slice(0, 3).map((level, index) => (
            <div 
              key={index}
              className="mobile-level-compact"
              style={{ borderLeftColor: getStrengthColor(level.strength) }}
            >
              <div className="mobile-level-price-compact">
                {formatCurrency(level.price)}
                <span 
                  className="mobile-badge-small" 
                  style={{ 
                    background: getStrengthColor(level.strength) + '30',
                    color: getStrengthColor(level.strength),
                    border: `1px solid ${getStrengthColor(level.strength)}50`
                  }}
                >
                  {level.strength}
                </span>
              </div>
              <div className="mobile-level-desc-compact">{level.description}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LevelsTab;

