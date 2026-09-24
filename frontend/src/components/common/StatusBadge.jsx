import React from 'react';
import { getStatusColor } from '../../utils/statusHelpers';

export const StatusBadge = ({ status }) => {
  return (
    <span className={getStatusColor(status)}>
      {status}
    </span>
  );
};
