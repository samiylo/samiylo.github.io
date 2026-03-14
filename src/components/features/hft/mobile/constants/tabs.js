import { 
  BarChart, 
  Bullseye, 
  Briefcase, 
  GraphUpArrow, 
  Lightbulb 
} from 'react-bootstrap-icons';

export const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart },
  { id: 'levels', label: 'Levels', icon: Bullseye },
  { id: 'strategies', label: 'Strategies', icon: Briefcase },
  { id: 'analysis', label: 'Analysis', icon: GraphUpArrow },
  { id: 'insights', label: 'Insights', icon: Lightbulb }
];

export const DATA_FILES = [
  { name: 'spa1-data-injest.json', label: 'SPY 2025-11-19' },
  { name: 'spa1-data-injest2.json', label: 'TSLA 2025-11-19' }
];

