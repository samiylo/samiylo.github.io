import React from 'react';
import { TABS } from '../constants/tabs';
import '../styles/mobileStyles.css';

const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <div className="mobile-bottom-nav">
      {TABS.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <div
            key={tab.id}
            className={`mobile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="mobile-nav-icon">
              <IconComponent size={20} />
            </div>
            <div className="mobile-nav-label">{tab.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;

