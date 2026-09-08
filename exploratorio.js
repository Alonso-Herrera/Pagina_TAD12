/* Graficos y datos de la vista exploratoria. */
(function () {
  const years = DATA.years.map(Number);
  const colors = {
    primary: '#172554',
    purple: '#6d28d9',
    pink: '#db2777',
    secondary: '#d97706',
    teal: '#0f766e',
    muted: '#64748b'
  };
  const charts = {};
  const genderData = {
    tgpFem: [54.2, 55, 54.9, 54.8, 53.9, 54.6, 54.3, 53.5, 54.2, 52.3, 49.9, 50.7, 52, 52.1, 53, 52.9],
    tgpMas: [81.4, 82.5, 82, 80.9, 80.4, 80.3, 79.2, 78.7, 79.2, 77.1, 74.9, 74.4, 75.7, 75.7, 76, 76],
    toFem: [43.9, 45.5, 45.4, 45.8, 44.9, 45.9, 44.9, 44.4, 43.6, 41.2, 36, 38.6, 40.7, 41, 42.5, 43],
    toMas: [76.5, 78, 78, 78, 77, 77.2, 76.5, 76, 76, 75.5, 71.8, 72.8, 74.1, 74.1, 75, 75.5],
    tdFem: [19, 17.4, 17.3, 16.5, 16.7, 15.8, 17.3, 17, 19.6, 21.3, 28, 23.9, 21.8, 21.2, 19.8, 18.8],
    tdMas: [6, 5.5, 5, 4, 4.4, 3.9, 3.5, 3.7, 4, 2, 4.2, 2.1, 2.1, 2.1, 1.4, 0.7]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 450 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', align: 'start', labels: { usePointStyle: true, boxWidth: 9, padding: 16, font: { weight: '700' } } },
      tooltip: { padding: 10, cornerRadius: 6, displayColors: true }
    },
    scales: {
      y: { beginAtZero: false, grid: { color: 'rgba(11, 37, 69, 0.08)' }, ticks: { maxTicksLimit: 6, callback: value => `${value}%` } },
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8, autoSkip: true } }
    }
  };

  const cityData = {
    'Bogota D.C': { tgp: [67.52, 66.93, 69.49, 70.98, 70.59], to: [56.61, 59.29, 62.26, 64.09, 64.78], td: [16.16, 11.42, 10.4, 9.71, 8.24] },
    Medellin: { tgp: [60.92, 65.68, 65, 66.11, 66.63], to: [51.74, 58.6, 59.16, 60.43, 61.73], td: [15.08, 10.78, 8.99, 8.59, 7.36] },
    Cali: { tgp: [60.25, 66.94, 66.63, 64.55, 63.8], to: [51.48, 59.26, 59.33, 57.48, 58.22], td: [14.55, 11.47, 10.96, 10.96, 8.75] },
    Barranquilla: { tgp: [61.46, 64.85, 65.69, 64.18, 64.12], to: [52.53, 57.13, 58.85, 57.07, 57.84], td: [14.53, 11.91, 10.41, 11.08, 9.8] },
    Buenaventura: { tgp: [62.75, 61.41, 65.69, 63.2, 57.39], to: [43.12, 45.48, 49.52, 46.17, 43.7], td: [31.28, 25.94, 24.62, 26.95, 23.85] },
    Rionegro: { tgp: [63.67, 63.63, 66.04, 66.37, 66.47], to: [56.56, 58.85, 61.35, 61.86, 63.31], td: [11.17, 7.52, 7.1, 6.79, 4.75] }
  };
  const cityYears = [2021, 2022, 2023, 2024, 2025];
  let genderChart;

  function getCanvas(id) {
    return document.getElementById(id);
  }

  function draw(id, config) {
    const canvas = getCanvas(id);
    if (!canvas || typeof Chart === 'undefined') return;
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(canvas, config);
  }

  function dataset(label, values, color, fill, shouldFill = false) {
    return { label, data: values, borderColor: color, backgroundColor: fill || `${color}22`, borderWidth: 3, tension: 0.3, fill: shouldFill, pointRadius: 3, pointHoverRadius: 6, pointHitRadius: 14 };
  }

  function buildGenderChart(key) {
    const data = { tgp: [genderData.tgpFem, genderData.tgpMas, 'Tasa Global de Participacion'], to: [genderData.toFem, genderData.toMas, 'Tasa de Ocupacion'], td: [genderData.tdFem, genderData.tdMas, 'Tasa de Desocupacion'] }[key];
    if (!data) return;
    const title = document.getElementById('genderChartTitle');
    if (title) title.textContent = `${data[2]} por Genero 2010-2025`;
    if (genderChart) genderChart.destroy();
    genderChart = new Chart(getCanvas('chartGenero'), { type: 'line', data: { labels: years, datasets: [dataset('Femenino', data[0], colors.pink), dataset('Masculino', data[1], colors.purple)] }, options });
  }

  window.switchGender = function (key, button) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    if (button) button.classList.add('active');
    buildGenderChart(key);
  };

  window.updateCityChart = function () {
    const select = document.getElementById('citySelector');
    const selectedCity = select ? select.value.trim() : '';
    const normalizedCity = selectedCity.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const key = Object.keys(cityData).find(city => city.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === normalizedCity) || Object.keys(cityData)[0];
    const values = cityData[key];
    const title = document.getElementById('cityChartTitle');
    if (title) title.textContent = `Indicadores Laborales - ${key} (2021-2025)`;
    draw('chartCiudad', { type: 'line', data: { labels: cityYears, datasets: [dataset('TGP (%)', values.tgp, colors.purple), dataset('TO (%)', values.to, colors.pink), dataset('TD (%)', values.td, colors.teal)] }, options });
  };

  function initExploratoryCharts() {
    if (typeof Chart === 'undefined') return;
    const citySelector = document.getElementById('citySelector');
    if (citySelector) {
      const availableCities = new Set(Object.keys(cityData).map(city => city.normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
      Array.from(citySelector.options).forEach(option => {
        const normalizedOption = option.value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        option.hidden = !availableCities.has(normalizedOption);
      });
    }
    draw('chartNacional', { type: 'line', data: { labels: years, datasets: [dataset('TGP (%)', [67.67, 68.52, 68.29, 67.58, 66.93, 67.47, 66.79, 66.1, 66.41, 64.62, 62.43, 62.47, 63.81, 63.83, 64.37, 64.32], colors.purple), dataset('TO (%)', [60.08, 61.62, 61.5, 61.74, 60.88, 61.52, 60.71, 60.21, 59.78, 58.19, 53.74, 55.54, 57.25, 57.43, 58.5, 59.19], colors.pink), dataset('TD (%)', DATA.tdNac, colors.teal)] }, options });
    draw('chartPobreza', { type: 'line', data: { labels: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], datasets: [dataset('Tasa de pobreza (%)', [41.04, 38.72, 36.97, 36.76, 36.77, 35.85, 35.54, 36.46, 43.14, 39.67, 36.63, 34.62, 31.79, 28], colors.pink)] }, options });
    buildGenderChart('tgp');
    window.updateCityChart();
  }

  document.addEventListener('DOMContentLoaded', initExploratoryCharts);
}());
