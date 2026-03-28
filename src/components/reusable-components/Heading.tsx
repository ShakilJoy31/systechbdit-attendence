import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({
  level = 1,
  children,
  className = '',
  ...props
}) => {
  
  
  const sizeClasses = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-semibold',
    3: 'text-2xl font-medium',
    4: 'text-xl font-normal',
    5: 'text-lg font-light',
    6: 'text-base font-thin'
  };
  
  return (
    <h1
      className={`${sizeClasses[level]} ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
};

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Heading;