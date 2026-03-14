import React, { useEffect, useRef } from 'react';
import '../styles/mobileStyles.css';

const TickerSelector = ({ ticker, selectedFile, dataFiles, onFileChange }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && selectorRef.current && !selectorRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleFileSelect = (fileName) => {
    onFileChange(fileName);
    setDropdownOpen(false);
  };

  return (
    <div className="mobile-ticker-selector" ref={selectorRef}>
      <div className="mobile-ticker-display" onClick={toggleDropdown}>
        {ticker}
        <span className={`mobile-ticker-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
      </div>
      {dropdownOpen && (
        <div className="mobile-dropdown-menu">
          {dataFiles.map((file) => (
            <div
              key={file.name}
              className={`mobile-dropdown-item ${selectedFile === file.name ? 'active' : ''}`}
              onClick={() => handleFileSelect(file.name)}
            >
              {file.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TickerSelector;

