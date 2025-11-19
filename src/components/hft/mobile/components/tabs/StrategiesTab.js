import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/mobileStyles.css';

const StrategiesTab = ({ optionsStrategies }) => {
  const filteredStrategies = optionsStrategies?.filter(
    s => s.priority !== 'TERTIARY - NOT RECOMMENDED'
  ) || [];

  const getPriorityBadgeClass = (priority) => {
    if (priority === 'PRIMARY') return 'mobile-badge-danger';
    if (priority === 'SECONDARY') return 'mobile-badge-warning';
    return 'mobile-badge-success';
  };

  const formatTarget = (targets) => {
    if (targets.primary) return formatCurrency(targets.primary);
    if (targets.primary_low && targets.primary_high) {
      return `${formatCurrency(targets.primary_low)} - ${formatCurrency(targets.primary_high)}`;
    }
    if (targets.primary_low) return formatCurrency(targets.primary_low);
    return 'N/A';
  };

  return (
    <>
      {filteredStrategies.map((strategy, index) => (
        <div key={index} className="mobile-strategy-compact">
          <div className="mobile-strategy-header-compact">
            <div className="mobile-strategy-name-compact">{strategy.name}</div>
            <span className={`mobile-badge-small ${getPriorityBadgeClass(strategy.priority)}`}>
              {strategy.priority}
            </span>
          </div>
          {strategy.legs && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999', lineHeight: '1.5' }}>
              {strategy.legs.map((leg, legIndex) => (
                <div key={legIndex} style={{ marginBottom: '4px' }}>
                  <strong>{leg.action}</strong> {formatCurrency(leg.strike)} {leg.type}
                </div>
              ))}
            </div>
          )}
          {strategy.targets && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              <strong>Target:</strong> {formatTarget(strategy.targets)}
            </div>
          )}
          {strategy.risk_reward_ratio && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
              <strong>R/R:</strong> {strategy.risk_reward_ratio}:1
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default StrategiesTab;

