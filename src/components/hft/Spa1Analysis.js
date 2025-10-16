import React, { useState, useEffect } from 'react';
import './data/spa1-data-injest.json';

const Spa1Analysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Import the JSON data
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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="alert alert-danger" role="alert">
        Failed to load analysis data. Please try again later.
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
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getStrengthColor = (strength) => {
    switch (strength.toLowerCase()) {
      case 'strong': return 'badge bg-danger';
      case 'medium': return 'badge bg-warning';
      case 'weak': return 'badge bg-secondary';
      default: return 'badge bg-info';
    }
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <div className="container">
        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center">
              <h1 className="display-4 neon mb-3">
                {analysis_metadata.ticker} Trading Analysis
              </h1>
              <h2 className="h4 text-light mb-2">{analysis_metadata.full_name}</h2>
              <div className="d-flex justify-content-center align-items-center gap-4 text-light">
                <span>Current Price: <span className="neon">{formatCurrency(analysis_metadata.current_price)}</span></span>
                <span>Confidence: <span className={getConfidenceColor(analysis_metadata.confidence_level)}>{analysis_metadata.confidence_level}%</span></span>
                <span>Analysis Date: {analysis_metadata.analysis_date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card bg-dark border-secondary">
              <div className="card-header bg-primary">
                <h3 className="card-title text-white mb-0">Executive Summary</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-light"><strong>Market State:</strong> {executive_summary.market_state}</p>
                    <p className="text-light"><strong>Current Position:</strong> {executive_summary.current_position}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-light"><strong>Primary Bias:</strong> {executive_summary.primary_bias}</p>
                    <p className="text-light"><strong>Key Insight:</strong> {executive_summary.key_insight}</p>
                  </div>
                </div>
                <div className="alert alert-info mt-3">
                  <h5 className="alert-heading">Primary Recommendation</h5>
                  <p className="mb-0">{executive_summary.primary_recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs bg-dark border-secondary">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'analysis', label: 'Chart Analysis' },
                { id: 'levels', label: 'Support/Resistance' },
                { id: 'strategies', label: 'Options Strategies' },
                { id: 'risk', label: 'Risk Management' },
                { id: 'signals', label: 'Entry/Exit Signals' },
                { id: 'decision', label: 'Decision Matrix' },
                { id: 'recommendations', label: 'Recommendations' }
              ].map(tab => (
                <li className="nav-item" key={tab.id}>
                  <button
                    className={`nav-link ${activeTab === tab.id ? 'active bg-primary text-white' : 'text-light'}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            {activeTab === 'overview' && (
              <div className="row">
                {/* Mathematical Calculations */}
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary h-100">
                    <div className="card-header bg-success">
                      <h4 className="card-title text-white mb-0">Trading Range</h4>
                    </div>
                    <div className="card-body">
                      <div className="row text-center">
                        <div className="col-4">
                          <div className="text-light">
                            <small>Upper Bound</small>
                            <div className="h5 neon">{formatCurrency(mathematical_calculations.trading_range.upper_bound)}</div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="text-light">
                            <small>Lower Bound</small>
                            <div className="h5 neon">{formatCurrency(mathematical_calculations.trading_range.lower_bound)}</div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="text-light">
                            <small>Range Width</small>
                            <div className="h5 neon">{formatCurrency(mathematical_calculations.trading_range.range_width)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="progress bg-dark">
                          <div 
                            className="progress-bar bg-gradient" 
                            style={{ 
                              width: `${mathematical_calculations.current_position.position_in_range_percent}%`,
                              background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)'
                            }}
                          ></div>
                        </div>
                        <small className="text-light">
                          Current Position: {mathematical_calculations.current_position.position_in_range_percent}% of range
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Volatility Analysis */}
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary h-100">
                    <div className="card-header bg-warning">
                      <h4 className="card-title text-white mb-0">Volatility Analysis</h4>
                    </div>
                    <div className="card-body">
                      <div className="row text-center mb-3">
                        <div className="col-6">
                          <div className="text-light">
                            <small>ATR (14)</small>
                            <div className="h5 neon">{formatCurrency(volatility_analysis.atr_14.value_dollars)}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-light">
                            <small>Volatility Regime</small>
                            <div className="h6 text-warning">{volatility_analysis.volatility_regime.classification}</div>
                          </div>
                        </div>
                      </div>
                      <div className="alert alert-warning">
                        <small><strong>Stop Distance:</strong> {formatCurrency(volatility_analysis.stop_loss_parameters.stop_distance_dollars)} ({formatPercent(volatility_analysis.stop_loss_parameters.stop_distance_percent)})</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Probability Assessment */}
                <div className="col-12 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-info">
                      <h4 className="card-title text-white mb-0">Probability Assessment</h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {probability_assessment.scenarios.map((scenario, index) => (
                          <div className="col-md-4 mb-3" key={index}>
                            <div className="card bg-secondary">
                              <div className="card-body text-center">
                                <h6 className="card-title text-white">{scenario.scenario}</h6>
                                <div className="h4 neon">{scenario.probability_percent}%</div>
                                <small className="text-light">{scenario.price_range || scenario.price_target}</small>
                                <div className="progress mt-2 bg-dark">
                                  <div 
                                    className="progress-bar" 
                                    style={{ 
                                      width: `${scenario.probability_percent}%`,
                                      backgroundColor: index === 0 ? '#28a745' : index === 1 ? '#ffc107' : '#dc3545'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-primary">
                      <h4 className="card-title text-white mb-0">4H Chart Analysis</h4>
                    </div>
                    <div className="card-body">
                      <p className="text-light"><strong>Pattern:</strong> {chart_analysis['4h_chart'].pattern}</p>
                      <p className="text-light"><strong>Trend:</strong> {chart_analysis['4h_chart'].trend}</p>
                      <p className="text-light"><strong>Volume:</strong> {chart_analysis['4h_chart'].volume.toLocaleString()}</p>
                      <p className="text-light"><strong>Volume Trend:</strong> {chart_analysis['4h_chart'].volume_trend}</p>
                      <ul className="text-light">
                        {chart_analysis['4h_chart'].observations.map((obs, index) => (
                          <li key={index}>{obs}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-success">
                      <h4 className="card-title text-white mb-0">15M Chart Analysis</h4>
                    </div>
                    <div className="card-body">
                      <p className="text-light"><strong>Pattern:</strong> {chart_analysis['15m_chart'].pattern}</p>
                      <p className="text-light"><strong>Trend:</strong> {chart_analysis['15m_chart'].trend}</p>
                      <p className="text-light"><strong>Volume:</strong> {chart_analysis['15m_chart'].volume.toLocaleString()}</p>
                      <p className="text-light"><strong>Volume Trend:</strong> {chart_analysis['15m_chart'].volume_trend}</p>
                      <ul className="text-light">
                        {chart_analysis['15m_chart'].observations.map((obs, index) => (
                          <li key={index}>{obs}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'levels' && (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-danger">
                      <h4 className="card-title text-white mb-0">Support Levels</h4>
                    </div>
                    <div className="card-body">
                      {support_resistance.support_levels.map((level, index) => (
                        <div key={index} className="mb-3 p-3 bg-secondary rounded">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <span className="h5 neon">{formatCurrency(level.price)}</span>
                              <span className={`badge ms-2 ${getStrengthColor(level.strength)}`}>
                                {level.strength}
                              </span>
                            </div>
                            <small className="text-light">{level.level}</small>
                          </div>
                          <p className="text-light mb-1">{level.description}</p>
                          <small className="text-muted">
                            Touches: {level.validation.touch_count} | 
                            Period: {level.validation.time_period_days} days
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-success">
                      <h4 className="card-title text-white mb-0">Resistance Levels</h4>
                    </div>
                    <div className="card-body">
                      {support_resistance.resistance_levels.map((level, index) => (
                        <div key={index} className="mb-3 p-3 bg-secondary rounded">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <span className="h5 neon">{formatCurrency(level.price)}</span>
                              <span className={`badge ms-2 ${getStrengthColor(level.strength)}`}>
                                {level.strength}
                              </span>
                            </div>
                            <small className="text-light">{level.level}</small>
                          </div>
                          <p className="text-light mb-1">{level.description}</p>
                          <small className="text-muted">
                            Touches: {level.validation.touch_count} | 
                            Period: {level.validation.time_period_days} days
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'strategies' && (
              <div className="row">
                {options_strategies?.map((strategy, index) => (
                  <div key={index} className="col-md-4 mb-4">
                    <div className="card bg-dark border-secondary h-100">
                      <div className={`card-header ${strategy.priority === 'PRIMARY' ? 'bg-danger' : strategy.priority === 'RECOMMENDED' ? 'bg-success' : 'bg-warning'}`}>
                        <h5 className="card-title text-white mb-0">{strategy.name}</h5>
                        <small className="text-white">{strategy.type}</small>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <h6 className="text-light">Strategy Details:</h6>
                          <ul className="text-light small">
                            {strategy.legs?.map((leg, legIndex) => (
                              <li key={legIndex}>
                                <strong>{leg.action || 'N/A'}</strong> {formatCurrency(leg.strike)} {leg.option_type || 'N/A'} {leg.position || 'N/A'}
                              </li>
                            )) || <li>No strategy details available</li>}
                          </ul>
                        </div>
                        {strategy.targets && (
                          <div className="mb-3">
                            <h6 className="text-light">Targets:</h6>
                            <p className="text-light small">
                              Primary: {formatCurrency(strategy.targets.primary_target || strategy.targets.primary_target_low)} - {formatCurrency(strategy.targets.primary_target_high || strategy.targets.primary_target)}
                            </p>
                          </div>
                        )}
                        {strategy.stops && (
                          <div className="mb-3">
                            <h6 className="text-light">Stop Loss:</h6>
                            <p className="text-light small">{formatCurrency(strategy.stops.stop_loss)}</p>
                          </div>
                        )}
                        <div className="row text-center">
                          <div className="col-6">
                            <small className="text-light">Success Rate</small>
                            <div className="h6 neon">{strategy.expected_success_rate}%</div>
                          </div>
                          <div className="col-6">
                            <small className="text-light">R/R Ratio</small>
                            <div className="h6 neon">{strategy.risk_reward_ratio}</div>
                          </div>
                        </div>
                        {strategy.notes && (
                          <div className="alert alert-info mt-2">
                            <small>{strategy.notes}</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )) || <div className="col-12"><div className="alert alert-info">No options strategies available</div></div>}
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-warning">
                      <h4 className="card-title text-white mb-0">Kelly Criterion</h4>
                    </div>
                    <div className="card-body">
                      <div className="row text-center mb-3">
                        <div className="col-6">
                          <div className="text-light">
                            <small>Win Rate</small>
                            <div className="h5 neon">{formatPercent(risk_management.kelly_criterion.win_rate * 100)}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-light">
                            <small>Loss Rate</small>
                            <div className="h5 neon">{formatPercent(risk_management.kelly_criterion.loss_rate * 100)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="alert alert-success">
                        <h6 className="alert-heading">Recommended Position Size</h6>
                        <p className="mb-0">{formatPercent(risk_management.kelly_criterion.recommended_position_size_percent * 100)} of options capital</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-info">
                      <h4 className="card-title text-white mb-0">Position Sizing</h4>
                    </div>
                    <div className="card-body">
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
              </div>
            )}

            {activeTab === 'signals' && (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-success">
                      <h4 className="card-title text-white mb-0">Entry Signals</h4>
                    </div>
                    <div className="card-body">
                      {entry_exit_signals.entry_signals?.map((signal, index) => (
                        <div key={index} className="mb-3 p-3 bg-secondary rounded">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="text-white mb-0">{signal.name}</h6>
                            <span className="badge bg-primary">{signal.success_rate}%</span>
                          </div>
                          <p className="text-light small mb-2"><strong>Trigger:</strong> {signal.trigger || 'N/A'}</p>
                          <div className="text-light small">
                            <strong>Confirmation Requirements:</strong>
                            <ul className="mb-0">
                              {signal.confirmation_requirements?.map((req, reqIndex) => (
                                <li key={reqIndex}>{req}</li>
                              )) || <li>No requirements specified</li>}
                            </ul>
                          </div>
                          {signal.notes && (
                            <div className="alert alert-warning mt-2">
                              <small>{signal.notes}</small>
                            </div>
                          )}
                        </div>
                      )) || <div className="text-light">No entry signals available</div>}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-danger">
                      <h4 className="card-title text-white mb-0">Exit Criteria</h4>
                    </div>
                    <div className="card-body">
                      <div className="mb-4">
                        <h6 className="text-light">Profit Targets</h6>
                        {entry_exit_signals.exit_criteria.profit_targets?.map((target, index) => (
                          <div key={index} className="mb-2 p-2 bg-success rounded">
                            <div className="d-flex justify-content-between">
                              <span className="text-white">{target.target_type || 'N/A'}</span>
                              <span className="neon">{formatCurrency(target.price)}</span>
                            </div>
                            <small className="text-light">{target.allocation || 'N/A'}</small>
                          </div>
                        )) || <div className="text-light">No profit targets available</div>}
                      </div>
                      <div>
                        <h6 className="text-light">Stop Losses</h6>
                        {entry_exit_signals.exit_criteria.stop_losses?.map((stop, index) => (
                          <div key={index} className="mb-2 p-2 bg-danger rounded">
                            <div className="d-flex justify-content-between">
                              <span className="text-white">{stop.strategy || 'N/A'}</span>
                              <span className="neon">{formatCurrency(stop.stop_price)}</span>
                            </div>
                            <small className="text-light">{stop.reasoning || 'N/A'}</small>
                          </div>
                        )) || <div className="text-light">No stop losses available</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'decision' && (
              <div className="row">
                <div className="col-12 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-info">
                      <h4 className="card-title text-white mb-0">Decision Matrix</h4>
                    </div>
                    <div className="card-body">
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <h5 className="text-light">Total Score: <span className="neon">{decision_matrix.total_score}</span> / {decision_matrix.max_score}</h5>
                          <div className="progress bg-dark mb-3">
                            <div 
                              className="progress-bar bg-gradient" 
                              style={{ 
                                width: `${(decision_matrix.total_score / decision_matrix.max_score) * 100}%`,
                                background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)'
                              }}
                            ></div>
                          </div>
                          <div className={`alert ${decision_matrix.rating === 'MODERATE OPPORTUNITY' ? 'alert-warning' : 'alert-info'}`}>
                            <h6 className="alert-heading">{decision_matrix.rating}</h6>
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
                                <td>{factor.factor}</td>
                                <td>{factor.weight_percent}%</td>
                                <td>
                                  <span className={`badge ${factor.score >= 7 ? 'bg-success' : factor.score >= 5 ? 'bg-warning' : 'bg-danger'}`}>
                                    {factor.score}/10
                                  </span>
                                </td>
                                <td>{factor.weighted_score.toFixed(2)}</td>
                                <td className="text-light">{factor.assessment}</td>
                              </tr>
                            )) || <tr><td colSpan="5" className="text-center text-light">No decision factors available</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-primary">
                      <h4 className="card-title text-white mb-0">Primary Action</h4>
                    </div>
                    <div className="card-body">
                      <div className="alert alert-warning">
                        <h5 className="alert-heading">{recommendations.primary_action}</h5>
                      </div>
                      <div className="card bg-secondary">
                        <div className="card-body">
                          <h6 className="text-white">{recommendations.primary_setup.name}</h6>
                          <p className="text-light small mb-1"><strong>Condition:</strong> {recommendations.primary_setup.condition}</p>
                          <p className="text-light small mb-1"><strong>Action:</strong> {recommendations.primary_setup.action}</p>
                          <p className="text-light small mb-1"><strong>Target:</strong> {recommendations.primary_setup.target}</p>
                          <p className="text-light small mb-1"><strong>Risk:</strong> {recommendations.primary_setup.risk}</p>
                          <p className="text-light small mb-0"><strong>Probability:</strong> {recommendations.primary_setup.probability}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-success">
                      <h4 className="card-title text-white mb-0">Alternative Setup</h4>
                    </div>
                    <div className="card-body">
                      <div className="card bg-secondary">
                        <div className="card-body">
                          <h6 className="text-white">{recommendations.alternative_setup.name}</h6>
                          <p className="text-light small mb-1"><strong>Condition:</strong> {recommendations.alternative_setup.condition}</p>
                          <p className="text-light small mb-1"><strong>Action:</strong> {recommendations.alternative_setup.action}</p>
                          <p className="text-light small mb-1"><strong>Target:</strong> {recommendations.alternative_setup.target}</p>
                          <p className="text-light small mb-0"><strong>Stop:</strong> {recommendations.alternative_setup.stop}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 mb-4">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-danger">
                      <h4 className="card-title text-white mb-0">Key Takeaways</h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {key_takeaways.map((takeaway, index) => (
                          <div key={index} className="col-md-6 mb-3">
                            <div className="card bg-secondary">
                              <div className="card-body">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="badge bg-primary me-2">{takeaway.number}</span>
                                  <span className="text-warning">{takeaway.category}</span>
                                </div>
                                <p className="text-light mb-0">{takeaway.takeaway}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card bg-dark border-secondary">
                    <div className="card-header bg-info">
                      <h4 className="card-title text-white mb-0">Next Steps</h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="text-light">Immediate Actions</h6>
                          <ul className="text-light">
                            {next_steps.immediate_actions.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-light">Monitoring Schedule</h6>
                          {Object.entries(next_steps.monitoring_schedule).map(([key, schedule]) => (
                            <div key={key} className="mb-2 p-2 bg-secondary rounded">
                              <div className="d-flex justify-content-between">
                                <span className="text-white">{schedule.time}</span>
                                <span className={`badge ${schedule.priority === 'High' ? 'bg-danger' : 'bg-warning'}`}>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spa1Analysis;
