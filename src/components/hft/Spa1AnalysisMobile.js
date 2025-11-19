import React, { useState, useEffect } from 'react';
import './data/spa1-data-injest.json';

const Spa1AnalysisMobile = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataFile, setSelectedDataFile] = useState('spa1-data-injest.json');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const dataFiles = [
    { name: 'spa1-data-injest.json', label: 'TSLA 2025-11-13' },
    { name: 'spa1-data-injest2.json', label: 'TSLA 2025-11-19' }
  ];

  useEffect(() => {
    setIsLoading(true);
    import(`./data/${selectedDataFile}`)
      .then(data => {
        setAnalysisData(data.default);
        setIsLoading(false);
        setDropdownOpen(false);
      })
      .catch(error => {
        console.error('Error loading analysis data:', error);
        setIsLoading(false);
        setDropdownOpen(false);
      });
  }, [selectedDataFile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.mobile-dropdown')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const handleDataFileChange = (fileName) => {
    setSelectedDataFile(fileName);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
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
  
  // const formatPercent = (value) => {
  //   if (value === undefined || value === null || isNaN(value)) return '0.00%';
  //   return `${Number(value).toFixed(2)}%`;
  // };

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'levels', label: 'Levels', icon: '🎯' },
    { id: 'strategies', label: 'Strategies', icon: '💼' },
    { id: 'analysis', label: 'Analysis', icon: '📈' },
    { id: 'insights', label: 'Insights', icon: '💡' }
  ];

  return (
    <>
      <style>
        {`
          * {
            -webkit-tap-highlight-color: transparent;
          }

          .mobile-app-container {
            min-height: 100vh;
            background: #0a0a0a;
            position: relative;
            padding-bottom: 80px;
            overflow-x: hidden;
          }

          .mobile-sticky-header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 16px;
          }

          .mobile-header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .mobile-date-badge {
            background: linear-gradient(135deg, #AA367C, #4A2FBD);
            color: #fff;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }

          .mobile-ticker-selector {
            position: relative;
            display: inline-block;
          }

          .mobile-ticker-display {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .mobile-ticker-arrow {
            font-size: 14px;
            transition: transform 0.2s ease;
            color: #B8B8B8;
          }

          .mobile-ticker-arrow.open {
            transform: rotate(180deg);
          }

          .mobile-dropdown-menu {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: rgba(26, 26, 46, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 6px 0;
            min-width: 160px;
            z-index: 1000;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.2s ease;
          }

          .mobile-dropdown-item {
            padding: 10px 16px;
            color: #fff;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.15s ease;
          }

          .mobile-dropdown-item:active {
            background: rgba(170, 54, 124, 0.3);
          }

          .mobile-dropdown-item.active {
            background: rgba(170, 54, 124, 0.2);
            color: #AA367C;
            font-weight: 600;
          }

          .mobile-header-name {
            font-size: 12px;
            color: #B8B8B8;
            margin-bottom: 12px;
          }

          .mobile-metrics-compact {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }

          .mobile-metric-compact {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 10px 8px;
            text-align: center;
          }

          .mobile-metric-label-compact {
            font-size: 10px;
            color: #888;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .mobile-metric-value-compact {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
          }

          .mobile-content-area {
            padding: 16px;
            animation: slideIn 0.3s ease;
          }

          .mobile-section {
            margin-bottom: 20px;
          }

          .mobile-card-compact {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 12px;
          }

          .mobile-card-title-compact {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .mobile-card-content-compact {
            color: #B8B8B8;
            font-size: 14px;
            line-height: 1.6;
          }

          .mobile-insight-box {
            background: linear-gradient(135deg, rgba(170, 54, 124, 0.12), rgba(74, 47, 189, 0.12));
            border-left: 3px solid #AA367C;
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 12px;
          }

          .mobile-insight-title {
            font-size: 13px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 6px;
          }

          .mobile-insight-text {
            font-size: 13px;
            color: #ddd;
            line-height: 1.6;
          }

          .mobile-badge-small {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
            margin-right: 6px;
          }

          .mobile-badge-primary {
            background: rgba(170, 54, 124, 0.25);
            color: #AA367C;
            border: 1px solid rgba(170, 54, 124, 0.4);
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

          .mobile-level-compact {
            background: rgba(255, 255, 255, 0.02);
            border-left: 3px solid;
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 8px;
          }

          .mobile-level-price-compact {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .mobile-level-desc-compact {
            font-size: 12px;
            color: #999;
            line-height: 1.5;
          }

          .mobile-strategy-compact {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 10px;
          }

          .mobile-strategy-header-compact {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }

          .mobile-strategy-name-compact {
            font-size: 15px;
            font-weight: 600;
            color: #fff;
            flex: 1;
          }

          .mobile-progress-compact {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            overflow: hidden;
            margin: 8px 0;
          }

          .mobile-progress-fill-compact {
            height: 100%;
            background: linear-gradient(90deg, #AA367C, #4A2FBD);
            border-radius: 6px;
            transition: width 0.4s ease;
          }

          .mobile-stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 12px 0;
          }

          .mobile-stat-compact {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 10px;
            padding: 12px;
            text-align: center;
          }

          .mobile-stat-label-compact {
            font-size: 10px;
            color: #888;
            margin-bottom: 4px;
            text-transform: uppercase;
          }

          .mobile-stat-value-compact {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
          }

          .mobile-takeaway-item {
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            gap: 10px;
          }

          .mobile-takeaway-item:last-child {
            border-bottom: none;
          }

          .mobile-takeaway-number {
            font-size: 11px;
            font-weight: 600;
            color: #AA367C;
            background: rgba(170, 54, 124, 0.15);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .mobile-takeaway-content {
            flex: 1;
          }

          .mobile-takeaway-category {
            font-size: 11px;
            color: #888;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .mobile-takeaway-text {
            font-size: 13px;
            color: #ddd;
            line-height: 1.5;
          }

          .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(26, 26, 46, 0.98);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 0 max(8px, env(safe-area-inset-bottom));
            z-index: 100;
            display: flex;
            justify-content: space-around;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
          }

          .mobile-nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 6px 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-tap-highlight-color: transparent;
          }

          .mobile-nav-item:active {
            transform: scale(0.95);
          }

          .mobile-nav-icon {
            font-size: 20px;
            margin-bottom: 4px;
            transition: transform 0.2s ease;
          }

          .mobile-nav-label {
            font-size: 11px;
            color: #888;
            font-weight: 500;
            transition: color 0.2s ease;
          }

          .mobile-nav-item.active .mobile-nav-icon {
            transform: scale(1.1);
          }

          .mobile-nav-item.active .mobile-nav-label {
            color: #AA367C;
            font-weight: 600;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
          }

          .mobile-empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #888;
            font-size: 14px;
          }
        `}
      </style>

      <div className="mobile-app-container">
        {/* Sticky Header */}
        <div className="mobile-sticky-header">
          <div className="mobile-header-top">
            <div className="mobile-date-badge">{analysis_metadata.analysis_date}</div>
            <div className="mobile-ticker-selector">
              <div className="mobile-ticker-display" onClick={toggleDropdown}>
                {analysis_metadata.ticker}
                <span className={`mobile-ticker-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
              </div>
              {dropdownOpen && (
                <div className="mobile-dropdown-menu">
                  {dataFiles.map((file) => (
                    <div
                      key={file.name}
                      className={`mobile-dropdown-item ${selectedDataFile === file.name ? 'active' : ''}`}
                      onClick={() => handleDataFileChange(file.name)}
                    >
                      {file.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mobile-header-name">{analysis_metadata.full_name}</div>
          <div className="mobile-metrics-compact">
            <div className="mobile-metric-compact">
              <div className="mobile-metric-label-compact">Price</div>
              <div className="mobile-metric-value-compact">{formatCurrency(analysis_metadata.current_price)}</div>
            </div>
            <div className="mobile-metric-compact">
              <div className="mobile-metric-label-compact">Confidence</div>
              <div className="mobile-metric-value-compact" style={{ color: getConfidenceColor(analysis_metadata.confidence_level) }}>
                {analysis_metadata.confidence_level}%
              </div>
            </div>
            <div className="mobile-metric-compact">
              <div className="mobile-metric-label-compact">Quality</div>
              <div className="mobile-metric-value-compact">{analysis_metadata.analysis_quality}</div>
            </div>
          </div>
        </div>

        {/* Content Area - Tab Based */}
        <div className="mobile-content-area">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="mobile-card-compact">
                <div className="mobile-card-title-compact">📊 Market Summary</div>
                <div className="mobile-card-content-compact">
                  <div className="mobile-insight-box">
                    <div className="mobile-insight-title">Market State</div>
                    <div className="mobile-insight-text">{executive_summary.market_state}</div>
                  </div>
                  <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>Primary Bias</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{executive_summary.primary_bias}</div>
                  </div>
                  <div className="mobile-insight-box">
                    <div className="mobile-insight-title">💡 Key Insight</div>
                    <div className="mobile-insight-text">{executive_summary.key_insight}</div>
                  </div>
                </div>
              </div>

              <div className="mobile-card-compact">
                <div className="mobile-card-title-compact">✅ Primary Recommendation</div>
                <div className="mobile-card-content-compact">
                  <div className="mobile-insight-box">
                    <div className="mobile-insight-title">{recommendations.primary_action}</div>
                    <div style={{ marginTop: '10px', fontSize: '13px', lineHeight: '1.6' }}>
                      <div style={{ marginBottom: '6px' }}><strong>Setup:</strong> {recommendations.primary_setup.name}</div>
                      <div style={{ marginBottom: '6px' }}><strong>Condition:</strong> {recommendations.primary_setup.condition}</div>
                      <div style={{ marginBottom: '6px' }}><strong>Action:</strong> {recommendations.primary_setup.action}</div>
                      <div style={{ marginBottom: '6px' }}><strong>Target:</strong> {recommendations.primary_setup.target}</div>
                      <div><strong>Probability:</strong> {recommendations.primary_setup.probability}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Levels Tab */}
          {activeTab === 'levels' && (
            <>
              <div className="mobile-card-compact">
                <div className="mobile-card-title-compact">🛡️ Support Levels</div>
                <div className="mobile-card-content-compact">
                  {support_resistance.support_levels.slice(0, 3).map((level, index) => (
                    <div 
                      key={index}
                      className="mobile-level-compact"
                      style={{ borderLeftColor: getStrengthColor(level.strength) }}
                    >
                      <div className="mobile-level-price-compact">
                        {formatCurrency(level.price)}
                        <span className="mobile-badge-small" style={{ 
                          background: getStrengthColor(level.strength) + '30',
                          color: getStrengthColor(level.strength),
                          border: `1px solid ${getStrengthColor(level.strength)}50`
                        }}>
                          {level.strength}
                        </span>
                      </div>
                      <div className="mobile-level-desc-compact">{level.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mobile-card-compact">
                <div className="mobile-card-title-compact">🚀 Resistance Levels</div>
                <div className="mobile-card-content-compact">
                  {support_resistance.resistance_levels.slice(0, 3).map((level, index) => (
                    <div 
                      key={index}
                      className="mobile-level-compact"
                      style={{ borderLeftColor: getStrengthColor(level.strength) }}
                    >
                      <div className="mobile-level-price-compact">
                        {formatCurrency(level.price)}
                        <span className="mobile-badge-small" style={{ 
                          background: getStrengthColor(level.strength) + '30',
                          color: getStrengthColor(level.strength),
                          border: `1px solid ${getStrengthColor(level.strength)}50`
                        }}>
                          {level.strength}
                        </span>
                      </div>
                      <div className="mobile-level-desc-compact">{level.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Strategies Tab */}
          {activeTab === 'strategies' && (
            <>
              {options_strategies?.filter(s => s.priority !== 'TERTIARY - NOT RECOMMENDED').map((strategy, index) => (
                <div key={index} className="mobile-strategy-compact">
                  <div className="mobile-strategy-header-compact">
                    <div className="mobile-strategy-name-compact">{strategy.name}</div>
                    <span className={`mobile-badge-small ${
                      strategy.priority === 'PRIMARY' ? 'mobile-badge-danger' :
                      strategy.priority === 'SECONDARY' ? 'mobile-badge-warning' :
                      'mobile-badge-success'
                    }`}>
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
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                      <strong>R/R:</strong> {strategy.risk_reward_ratio}:1
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <>
              <div className="mobile-card-compact">
                <div className="mobile-card-title-compact">📏 Trading Range</div>
                <div className="mobile-card-content-compact">
                  <div className="mobile-stat-grid">
                    <div className="mobile-stat-compact">
                      <div className="mobile-stat-label-compact">Upper</div>
                      <div className="mobile-stat-value-compact">
                        {formatCurrency(mathematical_calculations.trading_range.upper_bound)}
                      </div>
                    </div>
                    <div className="mobile-stat-compact">
                      <div className="mobile-stat-label-compact">Lower</div>
                      <div className="mobile-stat-value-compact">
                        {formatCurrency(mathematical_calculations.trading_range.lower_bound)}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>Current Position</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                      {mathematical_calculations.current_position.position_in_range_percent.toFixed(1)}%
                    </div>
                    <div className="mobile-progress-compact">
                      <div 
                        className="mobile-progress-fill-compact"
                        style={{ width: `${mathematical_calculations.current_position.position_in_range_percent}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>ATR (14)</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                      {formatCurrency(volatility_analysis.atr_14.value_dollars)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mobile-card-compact">
                <div className="mobile-card-title-compact">🎲 Probability Scenarios</div>
                <div className="mobile-card-content-compact">
                  {probability_assessment.scenarios.map((scenario, index) => (
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
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <>
              <div className="mobile-card-compact">
                <div className="mobile-card-title-compact">💡 Key Takeaways</div>
                <div className="mobile-card-content-compact">
                  {key_takeaways.map((takeaway, index) => (
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
                <div className="mobile-card-title-compact">📅 Next Steps</div>
                <div className="mobile-card-content-compact">
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '12px', textTransform: 'uppercase' }}>Immediate Actions</div>
                  {next_steps.immediate_actions.map((action, index) => (
                    <div key={index} style={{ 
                      padding: '10px 0',
                      fontSize: '13px',
                      color: '#ddd',
                      lineHeight: '1.5',
                      borderBottom: index < next_steps.immediate_actions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                    }}>
                      • {action}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="mobile-bottom-nav">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`mobile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="mobile-nav-icon">{tab.icon}</div>
              <div className="mobile-nav-label">{tab.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Spa1AnalysisMobile;

