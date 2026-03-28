import React from 'react';
import PropTypes from 'prop-types';

const Paragraph = ({
  children,
  size = 'medium',
  weight = 'normal',
  // color = 'default',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold'
  };
  
  return (
    <p
      className={`
        ${sizeClasses[size]}
        ${weightClasses[weight]}
        ${className}
      `}
      {...props}
    >
      {children}
    </p>
  );
};

Paragraph.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  weight: PropTypes.oneOf(['light', 'normal', 'medium', 'bold']),
  color: PropTypes.oneOf(['default', 'muted', 'primary', 'danger', 'success']),
  className: PropTypes.string
};

export default Paragraph;