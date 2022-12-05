import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
import GeneralReportDashboard from './GeneralReportDashboard';
import SpecificHandlerReportDashboard from './SpecificHandlerReportDashboard';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export default function ReportDashboard() {
  return (
    <>
      <GeneralReportDashboard />
      <SpecificHandlerReportDashboard />
    </>
  );
}
