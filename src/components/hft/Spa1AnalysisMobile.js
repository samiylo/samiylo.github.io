import React, { useState, useEffect } from 'react';
import './data/spa1-data-injest.json';

const Spa1AnalysisMobile = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    recommendation: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import('./data/spa1-data-injest.json')
      .then(data => {
        setAnalysisData(data.default);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading analysis data:', error);
        setIsLoading(false);
      });
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#fff', marginTop: '20px' }}>Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="alert alert-danger" role="alert">
          Failed to load analysis data. Please try again later.
        </div>
      </div>
    );
  }
       //   options_strategies, risk_management, entry_exit_signals, decision_matrix, 
  const { analysis_metadata, executive_summary, support_resistance, 
          mathematical_calculations, options_strategies, volatility_analysis, probability_assessment, 
          recommendations, key_takeaways, next_steps } = analysisData;

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '$0.00';
    return `$${Number(value).toFixed(2)}`;
  };
  
  const formatPercent = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0.00%';
    return `${Number(value).toFixed(2)}%`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#28a745';
    if (confidence >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getStrengthColor = (strength) => {
    const strengthLower = strength?.toLowerCase() || '';
    if (strengthLower.includes('strong') || strengthLower.includes('extreme')) return '#28a745';
    if (strengthLower.includes('medium')) return '#ffc107';
    return '#6c757d';
  };

  return (
    <>
      <style>
        {`
          .mobile-analysis-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            padding: 20px 16px 100px 16px;
            max-width: 100%;
            margin: 0 auto;
          }

          .mobile-header {
            text-align: center;
            margin-bottom: 24px;
            padding-top: 20px;
          }

          .mobile-header-badge {
            display: inline-block;
            background: linear-gradient(135deg, #AA367C, #4A2FBD);
            color: #fff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
          }

          .mobile-header-title {
            font-size: 28px;
            font-weight: 700;
            color: #fff;
            margin: 8px 0;
            letter-spacing: 1px;
          }

          .mobile-header-subtitle {
            font-size: 14px;
            color: #B8B8B8;
            margin-bottom: 20px;
          }

          .mobile-metrics-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }

          .mobile-metric-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 16px 12px;
            text-align: center;
            backdrop-filter: blur(10px);
          }

          .mobile-metric-label {
            font-size: 11px;
            color: #B8B8B8;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .mobile-metric-value {
            font-size: 18px;
            font-weight: 700;
            color: #fff;
          }

          .mobile-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 16px;
            backdrop-filter: blur(20px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          }

          .mobile-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            cursor: pointer;
            user-select: none;
          }

          .mobile-card-title {
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .mobile-card-icon {
            font-size: 20px;
          }

          .mobile-expand-icon {
            font-size: 20px;
            color: #B8B8B8;
            transition: transform 0.3s ease;
          }

          .mobile-expand-icon.expanded {
            transform: rotate(180deg);
          }

          .mobile-card-content {
            color: #B8B8B8;
            font-size: 14px;
            line-height: 1.6;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            opacity: 0;
          }

          .mobile-card-content.expanded {
            max-height: 2000px;
            opacity: 1;
          }

          .mobile-highlight-box {
            background: linear-gradient(135deg, rgba(170, 54, 124, 0.15), rgba(74, 47, 189, 0.15));
            border: 1px solid rgba(170, 54, 124, 0.3);
            border-radius: 16px;
            padding: 16px;
            margin: 12px 0;
          }

          .mobile-highlight-title {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 8px;
          }

          .mobile-highlight-text {
            font-size: 14px;
            color: #fff;
            line-height: 1.6;
          }

          .mobile-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            margin: 4px 4px 4px 0;
          }

          .mobile-badge-primary {
            background: linear-gradient(135deg, #AA367C, #4A2FBD);
            color: #fff;
          }

          .mobile-badge-success {
            background: rgba(40, 167, 69, 0.2);
            color: #28a745;
            border: 1px solid rgba(40, 167, 69, 0.3);
          }

          .mobile-badge-warning {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
            border: 1px solid rgba(255, 193, 7, 0.3);
          }

          .mobile-badge-danger {
            background: rgba(220, 53, 69, 0.2);
            color: #dc3545;
            border: 1px solid rgba(220, 53, 69, 0.3);
          }

          .mobile-list-item {
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .mobile-list-item:last-child {
            border-bottom: none;
          }

          .mobile-list-label {
            font-size: 12px;
            color: #B8B8B8;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .mobile-list-value {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
          }

          .mobile-progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
            margin: 8px 0;
          }

          .mobile-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #AA367C, #4A2FBD);
            border-radius: 10px;
            transition: width 0.5s ease;
          }

          .mobile-strategy-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 12px;
          }

          .mobile-strategy-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .mobile-strategy-name {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
            flex: 1;
          }

          .mobile-two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 12px 0;
          }

          .mobile-stat-box {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 12px;
            text-align: center;
          }

          .mobile-stat-label {
            font-size: 11px;
            color: #B8B8B8;
            margin-bottom: 4px;
          }

          .mobile-stat-value {
            font-size: 18px;
            font-weight: 700;
            color: #fff;
          }

          .mobile-level-item {
            background: rgba(255, 255, 255, 0.03);
            border-left: 4px solid;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 8px;
          }

          .mobile-level-price {
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 4px;
          }

          .mobile-level-desc {
            font-size: 12px;
            color: #B8B8B8;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .mobile-card {
            animation: fadeIn 0.3s ease;
          }
        `}
      </style>

      <div className="mobile-analysis-container">
        {/* Header */}
        <div className="mobile-header">
          <div className="mobile-header-badge">
            {analysis_metadata.analysis_date}
          </div>
          <h1 className="mobile-header-title">
            {analysis_metadata.ticker}
          </h1>
          <p className="mobile-header-subtitle">
            {analysis_metadata.full_name}
          </p>

          {/* Key Metrics */}
          <div className="mobile-metrics-row">
            <div className="mobile-metric-card">
              <div className="mobile-metric-label">Price</div>
              <div className="mobile-metric-value">
                {formatCurrency(analysis_metadata.current_price)}
              </div>
            </div>
            <div className="mobile-metric-card">
              <div className="mobile-metric-label">Confidence</div>
              <div className="mobile-metric-value" style={{ color: getConfidenceColor(analysis_metadata.confidence_level) }}>
                {analysis_metadata.confidence_level}%
              </div>
            </div>
            <div className="mobile-metric-card">
              <div className="mobile-metric-label">Quality</div>
              <div className="mobile-metric-value">
                {analysis_metadata.analysis_quality}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mobile-card">
          <div 
            className="mobile-card-header"
            onClick={() => toggleSection('summary')}
          >
            <div className="mobile-card-title">
              <span className="mobile-card-icon">📊</span>
              Market Summary
            </div>
            <span className={`mobile-expand-icon ${expandedSections.summary ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.summary && (
            <div className="mobile-card-content expanded">
              <div className="mobile-highlight-box">
                <div className="mobile-highlight-title">Market State</div>
                <div className="mobile-highlight-text">{executive_summary.market_state}</div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div className="mobile-list-label">Primary Bias</div>
                <div className="mobile-list-value">{executive_summary.primary_bias}</div>
              </div>
              <div className="mobile-highlight-box" style={{ marginTop: '16px' }}>
                <div className="mobile-highlight-title">💡 Key Insight</div>
                <div className="mobile-highlight-text">{executive_summary.key_insight}</div>
              </div>
            </div>
          )}
        </div>

        {/* Primary Recommendation */}
        <div className="mobile-card">
          <div 
            className="mobile-card-header"
            onClick={() => toggleSection('recommendation')}
          >
            <div className="mobile-card-title">
              <span className="mobile-card-icon">✅</span>
              Primary Recommendation
            </div>
            <span className={`mobile-expand-icon ${expandedSections.recommendation ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.recommendation && (
            <div className="mobile-card-content expanded">
              <div className="mobile-highlight-box">
                <div className="mobile-highlight-title">{recommendations.primary_action}</div>
                <div className="mobile-highlight-text" style={{ marginTop: '12px' }}>
                  <strong>Setup:</strong> {recommendations.primary_setup.name}
                </div>
                <div className="mobile-highlight-text" style={{ marginTop: '8px' }}>
                  <strong>Condition:</strong> {recommendations.primary_setup.condition}
                </div>
                <div className="mobile-highlight-text" style={{ marginTop: '8px' }}>
                  <strong>Action:</strong> {recommendations.primary_setup.action}
                </div>
                <div className="mobile-highlight-text" style={{ marginTop: '8px' }}>
                  <strong>Target:</strong> {recommendations.primary_setup.target}
                </div>
                <div className="mobile-highlight-text" style={{ marginTop: '8px' }}>
                  <strong>Probability:</strong> {recommendations.primary_setup.probability}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trading Range & Volatility */}
        <div className="mobile-card">
          <div 
            className="mobile-card-header"
            onClick={() => toggleSection('range')}
          >
            <div className="mobile-card-title">
              <span className="mobile-card-icon">📏</span>
              Trading Range
            </div>
            <span className={`mobile-expand-icon ${expandedSections.range ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.range && (
            <div className="mobile-card-content expanded">
              <div className="mobile-two-col">
                <div className="mobile-stat-box">
                  <div className="mobile-stat-label">Upper</div>
                  <div className="mobile-stat-value">
                    {formatCurrency(mathematical_calculations.trading_range.upper_bound)}
                  </div>
                </div>
                <div className="mobile-stat-box">
                  <div className="mobile-stat-label">Lower</div>
                  <div className="mobile-stat-value">
                    {formatCurrency(mathematical_calculations.trading_range.lower_bound)}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div className="mobile-list-label">Current Position</div>
                <div className="mobile-list-value">
                  {mathematical_calculations.current_position.position_in_range_percent.toFixed(1)}%
                </div>
                <div className="mobile-progress-bar">
                  <div 
                    className="mobile-progress-fill"
                    style={{ width: `${mathematical_calculations.current_position.position_in_range_percent}%` }}
                  ></div>
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div className="mobile-list-label">ATR (14)</div>
                <div className="mobile-list-value">
                  {formatCurrency(volatility_analysis.atr_14.value_dollars)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support & Resistance */}
        <div className="mobile-card">
          <div 
            className="mobile-card-header"
            onClick={() => toggleSection('levels')}
          >
            <div className="mobile-card-title">
              <span className="mobile-card-icon">🎯</span>
              Support & Resistance
            </div>
            <span className={`mobile-expand-icon ${expandedSections.levels ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.levels && (
            <div className="mobile-card-content expanded">
              <div style={{ marginBottom: '20px' }}>
                <div className="mobile-list-label" style={{ marginBottom: '12px' }}>Support Levels</div>
                {support_resistance.support_levels.slice(0, 3).map((level, index) => (
                  <div 
                    key={index}
                    className="mobile-level-item"
                    style={{ borderLeftColor: getStrengthColor(level.strength) }}
                  >
                    <div className="mobile-level-price">
                      {formatCurrency(level.price)}
                      <span className="mobile-badge" style={{ 
                        marginLeft: '8px',
                        background: getStrengthColor(level.strength) + '40',
                        color: getStrengthColor(level.strength),
                        border: `1px solid ${getStrengthColor(level.strength)}80`
                      }}>
                        {level.strength}
                      </span>
                    </div>
                    <div className="mobile-level-desc">{level.description}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="mobile-list-label" style={{ marginBottom: '12px' }}>Resistance Levels</div>
                {support_resistance.resistance_levels.slice(0, 3).map((level, index) => (
                  <div 
                    key={index}
                    className="mobile-level-item"
                    style={{ borderLeftColor: getStrengthColor(level.strength) }}
                  >
                    <div className="mobile-level-price">
                      {formatCurrency(level.price)}
                      <span className="mobile-badge" style={{ 
                        marginLeft: '8px',
                        background: getStrengthColor(level.strength) + '40',
                        color: getStrengthColor(level.strength),
                        border: `1px solid ${getStrengthColor(level.strength)}80`
                      }}>
                        {level.strength}
                      </span>
                    </div>
                    <div className="mobile-level-desc">{level.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Probability Scenarios */}
        <div className="mobile-card">
          <div 
            className="mobile-card-header"
            onClick={() => toggleSection('probability')}
          >
            <div className="mobile-card-title">
              <span className="mobile-card-icon">🎲</span>
              Probability Scenarios
            </div>
            <span className={`mobile-expand-icon ${expandedSections.probability ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.probability && (
            <div className="mobile-card-content expanded">
              {probability_assessment.scenarios.map((scenario, index) => (
                <div key={index} className="mobile-strategy-card">
                  <div className="mobile-strategy-header">
                    <div className="mobile-strategy-name">{scenario.scenario}</div>
                    <span className="mobile-badge mobile-badge-primary">
                      {scenario.probability_percent}%
                    </span>
                  </div>
                  <div className="mobile-progress-bar">
                    <div 
                      className="mobile-progress-fill"
                      style={{ width: `${scenario.probability_percent}%` }}
                    ></div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#B8B8B8' }}>
                    {scenario.price_range || scenario.price_target}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Options Strategies */}
        <div className="mobile-card">
          <div 
            className="mobile-card-header"
            onClick={() => toggleSection('strategies')}
          >
            <div className="mobile-card-title">
              <span className="mobile-card-icon">💼</span>
              Options Strategies
            </div>
            <span className={`mobile-expand-icon ${expandedSections.strategies ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.strategies && (
            <div className="mobile-card-content expanded">
              {options_strategies?.filter(s => s.priority !== 'TERTIARY - NOT RECOMMENDED').map((strategy, index) => (
                <div key={index} className="mobile-strategy-card">
                  <div className="mobile-strategy-header">
                    <div className="mobile-strategy-name">{strategy.name}</div>
                    <span className={`mobile-badge ${
                      strategy.priority === 'PRIMARY' ? 'mobile-badge-danger' :
                      strategy.priority === 'SECONDARY' ? 'mobile-badge-warning' :
                      'mobile-badge-success'
                    }`}>
                      {strategy.priority}
                    </span>
                  </div>
                  {strategy.legs && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#B8B8B8' }}>
                      {strategy.legs.map((leg, legIndex) => (
                        <div key={legIndex} style={{ marginBottom: '4px' }}>
                          <strong>{leg.action}</strong> {formatCurrency(leg.strike)} {leg.type}
                        </div>
                      ))}
                    </div>
                  )}
                  {strategy.targets && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#B8B8B8' }}>
                      <strong>Target:</strong> {
                        strategy.targets.primary 
                          ? formatCurrency(strategy.targets.primary)
                          : strategy.targets.primary_low && strategy.targets.primary_high
                          ? `${formatCurrency(strategy.targets.primary_low)} - ${formatCurrency(strategy.targets.primary_high)}`
                          : strategy.targets.primary_low
                          ? formatCurrency(strategy.targets.primary_low)
                          : 'N/A'
                      }
                    </div>
                  )}
                  {strategy.risk_reward_ratio && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#B8B8B8' }}>
                      <strong>R/R:</strong> {strategy.risk_reward_ratio}:1
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Key Takeaways */}
        <div className="mobile-card">
          <div 
            className="mobile-card-header"
            onClick={() => toggleSection('takeaways')}
          >
            <div className="mobile-card-title">
              <span className="mobile-card-icon">💡</span>
              Key Takeaways
            </div>
            <span className={`mobile-expand-icon ${expandedSections.takeaways ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.takeaways && (
            <div className="mobile-card-content expanded">
              {key_takeaways.map((takeaway, index) => (
                <div key={index} className="mobile-list-item">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span className="mobile-badge mobile-badge-primary" style={{ marginTop: '2px' }}>
                      {takeaway.number}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#B8B8B8', marginBottom: '4px' }}>
                        {takeaway.category}
                      </div>
                      <div style={{ fontSize: '14px', color: '#fff', lineHeight: '1.5' }}>
                        {takeaway.takeaway}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="mobile-card">
          <div 
            className="mobile-card-header"
            onClick={() => toggleSection('nextSteps')}
          >
            <div className="mobile-card-title">
              <span className="mobile-card-icon">📅</span>
              Next Steps
            </div>
            <span className={`mobile-expand-icon ${expandedSections.nextSteps ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.nextSteps && (
            <div className="mobile-card-content expanded">
              <div style={{ marginBottom: '20px' }}>
                <div className="mobile-list-label" style={{ marginBottom: '12px' }}>Immediate Actions</div>
                {next_steps.immediate_actions.map((action, index) => (
                  <div key={index} style={{ 
                    padding: '8px 0',
                    fontSize: '14px',
                    color: '#B8B8B8',
                    borderBottom: index < next_steps.immediate_actions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}>
                    • {action}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ 
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          fontSize: '11px',
          color: '#B8B8B8',
          lineHeight: '1.6'
        }}>
          <strong>Disclaimer:</strong> This analysis is for informational purposes only and is not investment advice. 
          The analysis is not a guarantee of future performance.
        </div>
      </div>
    </>
  );
};

export default Spa1AnalysisMobile;

