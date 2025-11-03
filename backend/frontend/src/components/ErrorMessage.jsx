import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

/**
 * A reusable error message component
 * @param {object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {function} props.onRetry - Optional retry function
 * @param {function} props.onDismiss - Optional dismiss function
 * @param {string} props.variant - Error variant ('error', 'warning', or 'info')
 * @returns {JSX.Element} Error message component
 */
const ErrorMessage = ({ 
  message, 
  onRetry = null, 
  onDismiss = null, 
  variant = 'error'
}) => {
  if (!message) return null;
  
  // Set styles based on variant
  const bgColors = {
    error: '#fff0f0',
    warning: '#fff8e6',
    info: '#e6f7ff'
  };
  
  const borderColors = {
    error: '#ffcccb',
    warning: '#ffe3a0',
    info: '#91caff'
  };
  
  const textColors = {
    error: '#d8000c',
    warning: '#9a6700',
    info: '#0958d9'
  };
  
  const iconColors = {
    error: '#d8000c',
    warning: '#d89614',
    info: '#0958d9'
  };
  
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: bgColors[variant],
        border: `1px solid ${borderColors[variant]}`,
        borderRadius: '6px',
        marginBottom: '16px',
        color: textColors[variant]
      }}
    >
      <AlertCircle 
        size={20} 
        style={{ 
          marginRight: '12px',
          color: iconColors[variant]
        }} 
      />
      
      <div style={{ flexGrow: 1 }}>
        {message}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              color: textColors[variant],
              marginRight: '8px',
              fontSize: '14px'
            }}
          >
            <RefreshCw size={14} style={{ marginRight: '4px' }} />
            Retry
          </button>
        )}
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: textColors[variant],
              opacity: 0.7
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 