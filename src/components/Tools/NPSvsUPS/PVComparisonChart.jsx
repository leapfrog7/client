import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
  ChartDataLabels
);

const PVComparisonChart = ({ nps, upsFull, upsReduced }) => {
  const data = {
    labels: ["NPS", "UPS (100% payout)", "UPS (40% payout )"],
    datasets: [
      {
        label: "PV (₹ Cr)",
        data: [nps / 10000000, upsFull / 10000000, upsReduced / 10000000],
        backgroundColor: ["#e28743", "#15803d", "#560CD0"],
        borderRadius: 6,
        barThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "start",
        color: "#fff",
        font: {
          weight: "normal",
          size: 10,
        },
        formatter: (value) => `₹${value.toFixed(2)} Cr`,
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw.toFixed(2)} Cr`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `₹${val} Cr`,
          font: { size: 12 },
        },
        title: {
          display: true,
          text: "Present Value (₹ in Crores)",
          font: { size: 14, weight: "bold" },
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { font: { size: 12 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="mt-6 bg-white p-4 rounded shadow-sm">
      <h4 className="font-semibold text-purple-800 mb-2 text-base sm:text-lg">
        📊 Comparative Present Value Chart
      </h4>
      <div className="h-[260px] sm:h-[300px] text-xs text-white">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
PVComparisonChart.propTypes = {
  nps: PropTypes.number.isRequired,
  upsFull: PropTypes.number.isRequired,
  upsReduced: PropTypes.number.isRequired,
};

export default PVComparisonChart;
