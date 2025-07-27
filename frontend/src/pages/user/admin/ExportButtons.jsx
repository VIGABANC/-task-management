import React from 'react';
import { FiDownload } from 'react-icons/fi';

export default function ExportButtons({ onExport, disabledDay, disabledWeek, disabledMonth }) {
  return (
    <div className="export-group">
      <button onClick={() => onExport('day')} disabled={disabledDay}><FiDownload /> Jour</button>
      <button onClick={() => onExport('week')} disabled={disabledWeek}><FiDownload /> Semaine</button>
      <button onClick={() => onExport('month')} disabled={disabledMonth}><FiDownload /> Mois</button>
    </div>
  );
} 