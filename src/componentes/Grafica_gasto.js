import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'tailwindcss/tailwind.css';

const options = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 6 Months', value: '6months' },
  { label: 'This Year', value: 'year' },
];

const IncomeChart = () => {
  const [date, setDate] = useState('today');
  const [data, setData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/gh/swindon/fake-api@master/tailwindAlpineJsChartJsEx1.json')
      .then((res) => res.json())
      .then((res) => setData(res.dates));
  }, []);

  useEffect(() => {
    if (data) {
      renderChart();
    }
  }, [data, date]);

  const renderChart = () => {
    const ctx = document.getElementById('chart').getContext('2d');
    if (Chart.instances[0]) {
      Chart.instances[0].destroy();
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data[date].data.labels,
        datasets: [
          {
            label: 'Income',
            backgroundColor: 'rgba(102, 126, 234, 0.25)',
            borderColor: 'rgba(102, 126, 234, 1)',
            pointBackgroundColor: 'rgba(102, 126, 234, 1)',
            data: data[date].data.income,
          },
          {
            label: 'Expenses',
            backgroundColor: 'rgba(237, 100, 166, 0.25)',
            borderColor: 'rgba(237, 100, 166, 1)',
            pointBackgroundColor: 'rgba(237, 100, 166, 1)',
            data: data[date].data.expenses,
          },
        ],
      },
      options: {
        scales: {
          y: {
            grid: {
              display: false,
            },
            ticks: {
              callback: function (value) {
                return value > 1000 ? (value < 1000000 ? value / 1000 + 'K' : value / 1000000 + 'M') : value;
              },
            },
          },
        },
      },
    });
  };

  return (
    <div className="bg-white text-gray-900 rounded shadow-xl py-5 px-5 w-full">
      <div className="flex flex-wrap items-end">
        <div className="flex-1">
          <h3 className="text-lg font-semibold leading-tight">Income</h3>
        </div>
        <div className="relative" onClick={() => setShowDropdown(!showDropdown)}>
          <button className="text-xs hover:text-gray-600 h-6 focus:outline-none">
            <span>{options[selectedOption].label}</span>
            <i className="ml-1 mdi mdi-chevron-down"></i>
          </button>
          {showDropdown && (
            <div className="bg-white shadow-lg rounded text-sm absolute top-auto right-0 min-w-full w-32 z-30 mt-1 -mr-3">
              <ul className="list-reset text-xs">
                {options.map((item, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-100 cursor-pointer ${index === selectedOption ? 'text-gray-900' : ''}`}
                    onClick={() => {
                      setSelectedOption(index);
                      setDate(item.value);
                      setShowDropdown(false);
                    }}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-end mb-5">
        <h4 className="text-2xl lg:text-3xl text-gray-900 font-semibold leading-tight inline-block mr-2">
          {data ? `$${data[date].total.toLocaleString()}` : 0}
        </h4>
        <span className={`inline-block ${data && data[date].upDown < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {data && (data[date].upDown < 0 ? '▼' : '▲')} {data ? data[date].upDown : 0}%
        </span>
      </div>
      <div>
        <canvas id="chart" className="w-full"></canvas>
      </div>
    </div>
  );
};

export default IncomeChart;
