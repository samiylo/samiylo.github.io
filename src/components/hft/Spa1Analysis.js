import React, { useState, useEffect } from 'react';
import './data/spa1-data-injest.json';

const Spa1Analysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
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

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-light">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="container-fluid py-5" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}>
        <div className="alert alert-danger" role="alert">
          Failed to load analysis data. Please try again later.
        </div>
      </div>
    );
  }

  const { analysis_metadata, executive_summary, chart_analysis, support_resistance, 
          mathematical_calculations, volatility_analysis, probability_assessment, 
          options_strategies, risk_management, entry_exit_signals, decision_matrix, 
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
    switch (strength.toLowerCase()) {
      case 'strong': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'weak': return '#6c757d';
      default: return '#17a2b8';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'PRIMARY': return 'linear-gradient(135deg, #dc3545, #c82333)';
      case 'RECOMMENDED': return 'linear-gradient(135deg, #28a745, #218838)';
      case 'SECONDARY': return 'linear-gradient(135deg, #ffc107, #e0a800)';
      default: return 'linear-gradient(135deg, #17a2b8, #138496)';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .glass-card {
            background: rgba(26, 26, 46, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
          }
          
          .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
            border-color: rgba(170, 54, 124, 0.3);
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #AA367C 0%, #4A2FBD 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .stat-card {
            background: linear-gradient(135deg, rgba(170, 54, 124, 0.1) 0%, rgba(74, 47, 189, 0.1) 100%);
            border: 1px solid rgba(170, 54, 124, 0.2);
            border-radius: 16px;
            padding: 20px;
            transition: all 0.3s ease;
          }
          
          .stat-card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 24px rgba(170, 54, 124, 0.3);
          }
          
          .progress-modern {
            height: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
          }
          
          .progress-modern::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: shimmer 2s infinite;
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .tab-button {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #e0e6ed;
            padding: 12px 24px;
            border-radius: 12px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .tab-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
          }
          
          .tab-button:hover::before {
            left: 100%;
          }
          
          .tab-button.active {
            background: linear-gradient(135deg, rgba(170, 54, 124, 0.3), rgba(74, 47, 189, 0.3));
            border-color: rgba(170, 54, 124, 0.5);
            color: #fff;
            box-shadow: 0 4px 15px rgba(170, 54, 124, 0.3);
          }
          
          .badge-modern {
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            display: inline-block;
          }
          
          .level-card {
            background: rgba(255, 255, 255, 0.03);
            border-left: 4px solid;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
          }
          
          .level-card:hover {
            background: rgba(255, 255, 255, 0.06);
            transform: translateX(5px);
          }
          
          .strategy-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            height: 100%;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .strategy-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--priority-gradient);
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }
          
          .strategy-card:hover::before {
            transform: scaleX(1);
          }
          
          .strategy-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
            border-color: rgba(170, 54, 124, 0.3);
          }
          
          .metric-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: linear-gradient(135deg, rgba(170, 54, 124, 0.2), rgba(74, 47, 189, 0.2));
            border: 3px solid rgba(170, 54, 124, 0.3);
            position: relative;
          }
          
          .metric-circle::after {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: 50%;
            padding: 3px;
            background: linear-gradient(135deg, #AA367C, #4A2FBD);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .metric-circle:hover::after {
            opacity: 1;
          }
        `}
      </style>
      
      <div className="container-fluid py-5" style={{ 
        backgroundColor: '#0a0a0a', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        paddingTop: '100px'
      }}>
        <div className="container">
          {/* Enhanced Header Section */}
          <div className="row mb-5" style={{ animation: 'fadeInUp 0.8s ease' }}>
            <div className="col-12">
              <div className="text-center mb-4">
                <div className="d-inline-block mb-3">
                  <span className="badge-modern" style={{ 
                    background: 'linear-gradient(135deg, #AA367C, #4A2FBD)',
                    color: '#fff'
                  }}>
                    {analysis_metadata.analysis_date}
                  </span>
                </div>
                <h1 className="display-3 mb-3 gradient-text" style={{
                  fontWeight: '700',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  {analysis_metadata.ticker} Analysis
                </h1>
                <p className="h5 text-light mb-4" style={{ 
                  fontWeight: '300',
                  letterSpacing: '1px',
                  opacity: 0.9
                }}>
                  {analysis_metadata.full_name}
                </p>
                
                {/* Key Metrics Row */}
                <div className="row g-4 mt-4">
                  <div className="col-md-4">
                    <div className="stat-card text-center">
                      <div className="text-muted small mb-2">Current Price</div>
                      <div className="h3 text-white mb-0" style={{ fontWeight: '600' }}>
                        {formatCurrency(analysis_metadata.current_price)}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card text-center">
                      <div className="text-muted small mb-2">Confidence Level</div>
                      <div className="h3 mb-0" style={{ 
                        fontWeight: '600',
                        color: getConfidenceColor(analysis_metadata.confidence_level)
                      }}>
                        {analysis_metadata.confidence_level}%
                      </div>
                      <div className="progress-modern mt-2">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${analysis_metadata.confidence_level}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${getConfidenceColor(analysis_metadata.confidence_level)}, ${getConfidenceColor(analysis_metadata.confidence_level)}dd)`,
                            borderRadius: '10px',
                            transition: 'width 1s ease-in-out'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card text-center">
                      <div className="text-muted small mb-2">Quality Rating</div>
                      <div className="h3 text-white mb-0" style={{ fontWeight: '600' }}>
                        {analysis_metadata.analysis_quality}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary - Enhanced */}
          <div className="row mb-5" style={{ animation: 'fadeInUp 1s ease' }}>
            <div className="col-12">
              <div className="glass-card p-4">
                <h3 className="text-white mb-4" style={{ fontWeight: '600', fontSize: '1.5rem' }}>
                  📊 Executive Summary
                </h3>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3" style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <h6 className="text-white mb-2" style={{ fontWeight: '600' }}>Market State</h6>
                      <p className="text-light mb-0">{executive_summary.market_state}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3" style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <h6 className="text-white mb-2" style={{ fontWeight: '600' }}>Primary Bias</h6>
                      <p className="text-light mb-0">{executive_summary.primary_bias}</p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-4" style={{
                      background: 'linear-gradient(135deg, rgba(170, 54, 124, 0.15), rgba(74, 47, 189, 0.15))',
                      borderRadius: '12px',
                      border: '1px solid rgba(170, 54, 124, 0.3)'
                    }}>
                      <h5 className="text-white mb-3" style={{ fontWeight: '600' }}>
                        💡 Primary Recommendation
                      </h5>
                      <p className="text-light mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {executive_summary.primary_recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Enhanced */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-center flex-wrap gap-2">
                {[
                  { id: 'overview', label: '📈 Overview', icon: '📈' },
                  { id: 'analysis', label: '📊 Chart Analysis', icon: '📊' },
                  { id: 'levels', label: '🎯 Support/Resistance', icon: '🎯' },
                  { id: 'strategies', label: '💼 Options Strategies', icon: '💼' },
                  { id: 'risk', label: '🛡️ Risk Management', icon: '🛡️' },
                  { id: 'signals', label: '⚡ Entry/Exit Signals', icon: '⚡' },
                  { id: 'decision', label: '🎲 Decision Matrix', icon: '🎲' },
                  { id: 'recommendations', label: '✅ Recommendations', icon: '✅' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="row">
            <div className="col-12">
              {activeTab === 'overview' && (
                <div className="row g-4" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  {/* Trading Range */}
                  <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>📏 Trading Range</h4>
                      <div className="row text-center mb-4">
                        <div className="col-4">
                          <div className="text-muted small mb-2">Upper</div>
                          <div className="h5 text-white">{formatCurrency(mathematical_calculations.trading_range.upper_bound)}</div>
                        </div>
                        <div className="col-4">
                          <div className="text-muted small mb-2">Lower</div>
                          <div className="h5 text-white">{formatCurrency(mathematical_calculations.trading_range.lower_bound)}</div>
                        </div>
                        <div className="col-4">
                          <div className="text-muted small mb-2">Width</div>
                          <div className="h5 text-white">{formatCurrency(mathematical_calculations.trading_range.range_width)}</div>
                        </div>
                      </div>
                      <div className="progress-modern">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${mathematical_calculations.current_position.position_in_range_percent}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #AA367C, #4A2FBD)',
                            borderRadius: '10px',
                            transition: 'width 1s ease-in-out'
                          }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <small className="text-muted">Lower Bound</small>
                        <small className="text-light fw-bold">
                          Current: {mathematical_calculations.current_position.position_in_range_percent}%
                        </small>
                        <small className="text-muted">Upper Bound</small>
                      </div>
                    </div>
                  </div>

                  {/* Volatility Analysis */}
                  <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>📉 Volatility Analysis</h4>
                      <div className="row text-center mb-3">
                        <div className="col-6">
                          <div className="text-muted small mb-2">ATR (14)</div>
                          <div className="h5 text-white">{formatCurrency(volatility_analysis.atr_14.value_dollars)}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted small mb-2">Regime</div>
                          <div className="h6" style={{ color: '#ffc107' }}>
                            {volatility_analysis.volatility_regime.classification}
                          </div>
                        </div>
                      </div>
                      <div className="p-3" style={{
                        background: 'rgba(255, 193, 7, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 193, 7, 0.3)'
                      }}>
                        <small className="text-light">
                          <strong>Stop Distance:</strong> {formatCurrency(volatility_analysis.stop_loss_parameters.stop_distance_dollars)} 
                          ({formatPercent(volatility_analysis.stop_loss_parameters.stop_distance_percent)})
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Probability Assessment */}
                  <div className="col-12">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>🎯 Probability Assessment</h4>
                      <div className="row g-3">
                        {probability_assessment.scenarios.map((scenario, index) => (
                          <div className="col-md-4" key={index}>
                            <div className="p-3 h-100" style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                              <h6 className="text-white mb-2">{scenario.scenario}</h6>
                              <div className="d-flex align-items-center mb-2">
                                <div className="h4 mb-0 me-2" style={{ 
                                  color: index === 0 ? '#28a745' : index === 1 ? '#ffc107' : '#dc3545'
                                }}>
                                  {scenario.probability_percent}%
                                </div>
                              </div>
                              <div className="progress-modern">
                                <div 
                                  className="progress-bar" 
                                  style={{ 
                                    width: `${scenario.probability_percent}%`,
                                    height: '100%',
                                    background: index === 0 
                                      ? 'linear-gradient(90deg, #28a745, #20c997)' 
                                      : index === 1 
                                      ? 'linear-gradient(90deg, #ffc107, #ff9800)' 
                                      : 'linear-gradient(90deg, #dc3545, #c82333)',
                                    borderRadius: '10px'
                                  }}
                                ></div>
                              </div>
                              <small className="text-muted d-block mt-2">
                                {scenario.price_range || scenario.price_target}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="row g-4" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>📊 4H Chart Analysis</h4>
                      <div className="mb-3">
                        <span className="badge-modern me-2" style={{ background: 'rgba(23, 162, 184, 0.3)', color: '#fff' }}>
                          {chart_analysis['4h_chart'].pattern}
                        </span>
                        <span className="badge-modern" style={{ background: 'rgba(23, 162, 184, 0.3)', color: '#fff' }}>
                          {chart_analysis['4h_chart'].trend}
                        </span>
                      </div>
                      <p className="text-light mb-2"><strong>Volume:</strong> {chart_analysis['4h_chart'].volume.toLocaleString()}</p>
                      <p className="text-light mb-3"><strong>Volume Trend:</strong> {chart_analysis['4h_chart'].volume_trend}</p>
                      <div>
                        <strong className="text-white">Observations:</strong>
                        <ul className="text-light mt-2">
                          {chart_analysis['4h_chart'].observations.map((obs, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{obs}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="glass-card p-4 h-100">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>📊 15M Chart Analysis</h4>
                      <div className="mb-3">
                        <span className="badge-modern me-2" style={{ background: 'rgba(40, 167, 69, 0.3)', color: '#fff' }}>
                          {chart_analysis['15m_chart'].pattern}
                        </span>
                        <span className="badge-modern" style={{ background: 'rgba(40, 167, 69, 0.3)', color: '#fff' }}>
                          {chart_analysis['15m_chart'].trend}
                        </span>
                      </div>
                      <p className="text-light mb-2"><strong>Volume:</strong> {chart_analysis['15m_chart'].volume.toLocaleString()}</p>
                      <p className="text-light mb-3"><strong>Volume Trend:</strong> {chart_analysis['15m_chart'].volume_trend}</p>
                      <div>
                        <strong className="text-white">Observations:</strong>
                        <ul className="text-light mt-2">
                          {chart_analysis['15m_chart'].observations.map((obs, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>{obs}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'levels' && (
                <div className="row g-4" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <div className="col-md-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>🛡️ Support Levels</h4>
                      {support_resistance.support_levels.map((level, index) => (
                        <div 
                          key={index} 
                          className="level-card"
                          style={{ borderLeftColor: getStrengthColor(level.strength) }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <span className="h5 text-white me-2">{formatCurrency(level.price)}</span>
                              <span className="badge-modern" style={{ 
                                background: getStrengthColor(level.strength),
                                color: '#fff'
                              }}>
                                {level.strength}
                              </span>
                            </div>
                            <small className="text-muted">{level.level}</small>
                          </div>
                          <p className="text-light mb-2">{level.description}</p>
                          <small className="text-muted">
                            Touches: {level.validation.touch_count} | 
                            Period: {level.validation.time_period_days} days
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>🚀 Resistance Levels</h4>
                      {support_resistance.resistance_levels.map((level, index) => (
                        <div 
                          key={index} 
                          className="level-card"
                          style={{ borderLeftColor: getStrengthColor(level.strength) }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <span className="h5 text-white me-2">{formatCurrency(level.price)}</span>
                              <span className="badge-modern" style={{ 
                                background: getStrengthColor(level.strength),
                                color: '#fff'
                              }}>
                                {level.strength}
                              </span>
                            </div>
                            <small className="text-muted">{level.level}</small>
                          </div>
                          <p className="text-light mb-2">{level.description}</p>
                          <small className="text-muted">
                            Touches: {level.validation.touch_count} | 
                            Period: {level.validation.time_period_days} days
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'strategies' && (
                <div className="row g-4" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  {options_strategies?.map((strategy, index) => (
                    <div key={index} className="col-md-4">
                      <div 
                        className="strategy-card"
                        style={{ '--priority-gradient': getPriorityColor(strategy.priority) }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="text-white mb-1" style={{ fontWeight: '600' }}>
                              {strategy.name}
                            </h5>
                            <span className="badge-modern" style={{ 
                              background: getPriorityColor(strategy.priority),
                              color: '#fff',
                              fontSize: '0.75rem'
                            }}>
                              {strategy.priority}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <h6 className="text-white small mb-2" style={{ fontWeight: '600' }}>Strategy Details:</h6>
                          <ul className="text-light small mb-0" style={{ paddingLeft: '20px' }}>
                            {strategy.legs?.map((leg, legIndex) => (
                              <li key={legIndex} style={{ marginBottom: '4px' }}>
                                <strong>{leg.action || 'N/A'}</strong> {formatCurrency(leg.strike)} {leg.option_type || 'N/A'}
                                {leg.expiration && <span className="text-muted"> ({leg.expiration})</span>}
                              </li>
                            )) || <li>No strategy details available</li>}
                          </ul>
                        </div>
                        {strategy.targets && (
                          <div className="mb-3">
                            <h6 className="text-white small mb-1" style={{ fontWeight: '600' }}>Targets:</h6>
                            <p className="text-light small mb-0">
                              {formatCurrency(strategy.targets.primary_target || strategy.targets.primary_target_low)} - 
                              {formatCurrency(strategy.targets.primary_target_high || strategy.targets.primary_target)}
                            </p>
                          </div>
                        )}
                        {strategy.stops && (
                          <div className="mb-3">
                            <h6 className="text-white small mb-1" style={{ fontWeight: '600' }}>Stop Loss:</h6>
                            <p className="text-light small mb-0">{formatCurrency(strategy.stops.stop_loss)}</p>
                          </div>
                        )}
                        <div className="row text-center mt-3 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <div className="col-6">
                            <small className="text-muted d-block">Success Rate</small>
                            <div className="h6 text-white mt-1">
                              {strategy.expected_success_rate ? `${strategy.expected_success_rate}%` : 'N/A'}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">R/R Ratio</small>
                            <div className="h6 text-white mt-1">
                              {strategy.risk_reward_ratio ? strategy.risk_reward_ratio : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || <div className="col-12"><div className="alert alert-info">No options strategies available</div></div>}
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="row g-4" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <div className="col-md-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>📊 Kelly Criterion</h4>
                      <div className="row text-center mb-4">
                        <div className="col-6">
                          <div className="text-muted small mb-2">Win Rate</div>
                          <div className="h5 text-white">{formatPercent(risk_management.kelly_criterion.win_rate * 100)}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted small mb-2">Loss Rate</div>
                          <div className="h5 text-white">{formatPercent(risk_management.kelly_criterion.loss_rate * 100)}</div>
                        </div>
                      </div>
                      <div className="p-3" style={{
                        background: 'rgba(40, 167, 69, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(40, 167, 69, 0.3)'
                      }}>
                        <h6 className="text-white mb-2">Recommended Position Size</h6>
                        <p className="text-light mb-0">
                          {formatPercent(risk_management.kelly_criterion.recommended_position_size_percent * 100)} of options capital
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>💰 Position Sizing</h4>
                      <div className="table-responsive">
                        <table className="table table-dark table-sm">
                          <thead>
                            <tr>
                              <th>Account Size</th>
                              <th>Allocation</th>
                              <th>Max Risk</th>
                            </tr>
                          </thead>
                          <tbody>
                            {risk_management.position_sizing_table.map((size, index) => (
                              <tr key={index}>
                                <td>${size.account_size.toLocaleString()}</td>
                                <td>${size.position_allocation_dollars.toLocaleString()}</td>
                                <td>${size.max_dollar_risk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'signals' && (
                <div className="row g-4" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <div className="col-md-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>⚡ Entry Signals</h4>
                      {entry_exit_signals.entry_signals?.map((signal, index) => (
                        <div key={index} className="mb-3 p-3" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="text-white mb-0">{signal.name}</h6>
                            <span className="badge-modern" style={{ 
                              background: 'rgba(23, 162, 184, 0.3)',
                              color: '#fff'
                            }}>
                              {signal.success_rate}%
                            </span>
                          </div>
                          <p className="text-light small mb-2"><strong>Trigger:</strong> {signal.trigger || 'N/A'}</p>
                          <div className="text-light small">
                            <strong>Confirmation Requirements:</strong>
                            <ul className="mb-0 mt-2" style={{ paddingLeft: '20px' }}>
                              {signal.confirmation_requirements?.map((req, reqIndex) => (
                                <li key={reqIndex}>{req}</li>
                              )) || <li>No requirements specified</li>}
                            </ul>
                          </div>
                        </div>
                      )) || <div className="text-light">No entry signals available</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>🎯 Exit Criteria</h4>
                      <div className="mb-4">
                        <h6 className="text-light mb-3">Profit Targets</h6>
                        {entry_exit_signals.exit_criteria.profit_targets?.map((target, index) => (
                          <div key={index} className="mb-2 p-2" style={{
                            background: 'rgba(40, 167, 69, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(40, 167, 69, 0.3)'
                          }}>
                            <div className="d-flex justify-content-between">
                              <span className="text-white">{target.target_type || 'N/A'}</span>
                              <span className="text-white fw-bold">{formatCurrency(target.price)}</span>
                            </div>
                            <small className="text-light">{target.allocation || 'N/A'}</small>
                          </div>
                        )) || <div className="text-light">No profit targets available</div>}
                      </div>
                      <div>
                        <h6 className="text-light mb-3">Stop Losses</h6>
                        {entry_exit_signals.exit_criteria.stop_losses?.map((stop, index) => (
                          <div key={index} className="mb-2 p-2" style={{
                            background: 'rgba(220, 53, 69, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(220, 53, 69, 0.3)'
                          }}>
                            <div className="d-flex justify-content-between">
                              <span className="text-white">{stop.strategy || 'N/A'}</span>
                              <span className="text-white fw-bold">{formatCurrency(stop.stop_price)}</span>
                            </div>
                            <small className="text-light">{stop.reasoning || 'N/A'}</small>
                          </div>
                        )) || <div className="text-light">No stop losses available</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'decision' && (
                <div className="row" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <div className="col-12">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>🎲 Decision Matrix</h4>
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <h5 className="text-light">
                            Total Score: <span className="text-white">{decision_matrix.total_score}</span> / {decision_matrix.max_score}
                          </h5>
                          <div className="progress-modern mt-3">
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${(decision_matrix.total_score / decision_matrix.max_score) * 100}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #AA367C, #4A2FBD)',
                                borderRadius: '10px'
                              }}
                            ></div>
                          </div>
                          <div className={`alert mt-3 ${decision_matrix.rating === 'MODERATE OPPORTUNITY' ? 'alert-warning' : 'alert-info'}`}>
                            <h6 className="alert-heading mb-0">{decision_matrix.rating}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-dark">
                          <thead>
                            <tr>
                              <th>Factor</th>
                              <th>Weight</th>
                              <th>Score</th>
                              <th>Weighted Score</th>
                              <th>Assessment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {decision_matrix.factors?.map((factor, index) => (
                              <tr key={index}>
                                <td className="text-white">{factor.factor}</td>
                                <td>{factor.weight_percent}%</td>
                                <td>
                                  <span className="badge-modern" style={{ 
                                    background: factor.score >= 7 
                                      ? 'rgba(40, 167, 69, 0.3)' 
                                      : factor.score >= 5 
                                      ? 'rgba(255, 193, 7, 0.3)' 
                                      : 'rgba(220, 53, 69, 0.3)',
                                    color: '#fff'
                                  }}>
                                    {factor.score}/10
                                  </span>
                                </td>
                                <td className="text-white">{factor.weighted_score.toFixed(2)}</td>
                                <td className="text-light">{factor.assessment}</td>
                              </tr>
                            )) || <tr><td colSpan="5" className="text-center text-light">No decision factors available</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="row g-4" style={{ animation: 'fadeInUp 0.5s ease' }}>
                  <div className="col-md-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>✅ Primary Action</h4>
                      <div className="alert alert-warning mb-3">
                        <h5 className="alert-heading mb-0">{recommendations.primary_action}</h5>
                      </div>
                      <div className="p-3" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px'
                      }}>
                        <h6 className="text-white mb-2">{recommendations.primary_setup.name}</h6>
                        <p className="text-light small mb-1"><strong>Condition:</strong> {recommendations.primary_setup.condition}</p>
                        <p className="text-light small mb-1"><strong>Action:</strong> {recommendations.primary_setup.action}</p>
                        <p className="text-light small mb-1"><strong>Target:</strong> {recommendations.primary_setup.target}</p>
                        <p className="text-light small mb-1"><strong>Risk:</strong> {recommendations.primary_setup.risk}</p>
                        <p className="text-light small mb-0"><strong>Probability:</strong> {recommendations.primary_setup.probability}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>🔄 Alternative Setup</h4>
                      <div className="p-3" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px'
                      }}>
                        <h6 className="text-white mb-2">{recommendations.alternative_setup.name}</h6>
                        <p className="text-light small mb-1"><strong>Condition:</strong> {recommendations.alternative_setup.condition}</p>
                        <p className="text-light small mb-1"><strong>Action:</strong> {recommendations.alternative_setup.action}</p>
                        <p className="text-light small mb-1"><strong>Target:</strong> {recommendations.alternative_setup.target}</p>
                        <p className="text-light small mb-0"><strong>Stop:</strong> {recommendations.alternative_setup.stop}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>💡 Key Takeaways</h4>
                      <div className="row g-3">
                        {key_takeaways.map((takeaway, index) => (
                          <div key={index} className="col-md-6">
                            <div className="p-3 h-100" style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                              <div className="d-flex align-items-center mb-2">
                                <span className="badge-modern me-2" style={{ 
                                  background: 'linear-gradient(135deg, #AA367C, #4A2FBD)',
                                  color: '#fff'
                                }}>
                                  {takeaway.number}
                                </span>
                                <span className="text-warning small">{takeaway.category}</span>
                              </div>
                              <p className="text-light mb-0 small">{takeaway.takeaway}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="glass-card p-4">
                      <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>📅 Next Steps</h4>
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="text-light mb-3">Immediate Actions</h6>
                          <ul className="text-light">
                            {next_steps.immediate_actions.map((action, index) => (
                              <li key={index} style={{ marginBottom: '8px' }}>{action}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-light mb-3">Monitoring Schedule</h6>
                          {Object.entries(next_steps.monitoring_schedule).map(([key, schedule]) => (
                            <div key={key} className="mb-2 p-2" style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px'
                            }}>
                              <div className="d-flex justify-content-between">
                                <span className="text-white">{schedule.time}</span>
                                <span className="badge-modern" style={{ 
                                  background: schedule.priority === 'High' 
                                    ? 'rgba(220, 53, 69, 0.3)' 
                                    : 'rgba(255, 193, 7, 0.3)',
                                  color: '#fff'
                                }}>
                                  {schedule.priority}
                                </span>
                              </div>
                              <small className="text-light">{schedule.focus}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Spa1Analysis;
