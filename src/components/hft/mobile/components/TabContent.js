import React from 'react';
import OverviewTab from './tabs/OverviewTab';
import LevelsTab from './tabs/LevelsTab';
import StrategiesTab from './tabs/StrategiesTab';
import AnalysisTab from './tabs/AnalysisTab';
import InsightsTab from './tabs/InsightsTab';

const TabContent = ({ activeTab, analysisData }) => {
  const {
    executive_summary,
    support_resistance,
    mathematical_calculations,
    options_strategies,
    volatility_analysis,
    probability_assessment,
    recommendations,
    key_takeaways,
    next_steps
  } = analysisData;

  switch (activeTab) {
    case 'overview':
      return (
        <OverviewTab 
          executiveSummary={executive_summary}
          recommendations={recommendations}
        />
      );
    case 'levels':
      return <LevelsTab supportResistance={support_resistance} />;
    case 'strategies':
      return <StrategiesTab optionsStrategies={options_strategies} />;
    case 'analysis':
      return (
        <AnalysisTab 
          mathematicalCalculations={mathematical_calculations}
          volatilityAnalysis={volatility_analysis}
          probabilityAssessment={probability_assessment}
        />
      );
    case 'insights':
      return (
        <InsightsTab 
          keyTakeaways={key_takeaways}
          nextSteps={next_steps}
        />
      );
    default:
      return null;
  }
};

export default TabContent;

