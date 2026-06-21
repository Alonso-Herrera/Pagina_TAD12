// ============================================
// TAD 12 - SCRIPT PRINCIPAL v2.0
// ============================================

// ============================================
// DATOS HISTÓRICOS
// ============================================
const DATA = {
  years: ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'],
  toFem:  [46.75, 47.78, 48.94, 48.86, 48.94, 49.27, 48.60, 48.12, 47.01, 45.70, 38.07, 39.99, 44.36, 45.86, 45.74, 46.74],
  toMas:  [73.44, 74.34, 74.60, 74.18, 74.18, 74.20, 73.30, 72.83, 72.22, 70.68, 63.79, 67.18, 69.63, 70.37, 70.07, 71.43],
  tgpFem: [52.10, 53.20, 54.10, 53.90, 54.00, 54.30, 53.70, 53.20, 52.10, 50.80, 43.50, 45.60, 49.80, 51.20, 51.10, 52.00],
  tgpMas: [75.80, 76.50, 76.90, 76.60, 76.60, 76.70, 75.80, 75.30, 74.70, 73.10, 66.90, 70.20, 72.50, 73.10, 72.80, 73.90],
  tdNac:  [11.80, 10.80, 10.40, 9.70, 9.10, 8.90, 9.20, 9.40, 9.70, 10.50, 15.90, 13.20, 11.20, 10.20, 9.80, 5.60],
  tdFem:  [14.20, 13.00, 12.50, 11.90, 11.20, 11.00, 11.40, 11.60, 11.90, 12.80, 19.20, 16.20, 13.80, 12.50, 12.00, 7.20],
  tdMas:  [9.80,  8.90,  8.70,  8.10,  7.50,  7.30,  7.60,  7.80,  8.10,  8.80, 13.20, 10.80,  9.20,  8.50,  8.20,  4.40],
};

// Calcular brecha
DATA.brecha = DATA.toMas.map((m, i) => parseFloat((m - DATA.toFem[i]).toFixed(2)));

// ============================================
// NAVEGACIÓN SPA
// ============================================
let currentPage = 0;
const pages = [
  'page-inicio', 'page-exploratorio', 'page-indicadores',
  'page-genero', 'page-tendencias', 'page-powerbi',
  'page-descargas', 'page-colaboradores'
];
const pageMap = {
  'inicio':        'page-inicio',
  'exploratorio':  'page-exploratorio',
  'indicadores':   'page-indicadores',
  'genero':        'page-genero',
  'tendencias':    'page-tendencias',
  'powerbi':       'page-powerbi',
  'descargables':  'page-descargas',
  'colaboradores': 'page-colaboradores'
};

function showPage(pageId) {
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('page-visible');
      el.style.display = 'none';
    }
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.style.display = 'block';
    void target.offsetWidth;
    target.classList.add('page-visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function navigateTo(pageKeyOrId) {
  let pageId = pageMap[pageKeyOrId] || pageKeyOrId;
  showPage(pageId);
  const index = pages.indexOf(pageId);
  if (index !== -1) currentPage = index;
  updateNavActive(pageId);
  updateArrows();
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) mobileNav.classList.remove('active');
}

function navigatePrev() {
  if (currentPage > 0) {
    currentPage--;
    showPage(pages[currentPage]);
    updateNavActive(pages[currentPage]);
    updateArrows();
  }
}

function navigateNext() {
  if (currentPage < pages.length - 1) {
    currentPage++;
    showPage(pages[currentPage]);
    updateNavActive(pages[currentPage]);
    updateArrows();
  }
}

function updateNavActive(pageId) {
  const pageKey = Object.keys(pageMap).find(k => pageMap[k] === pageId);
  document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageKey) {
      link.classList.add('active');
    }
  });
}

function updateArrows() {
  const prev = document.getElementById('prevBtnSide');
  const next = document.getElementById('nextBtnSide');
  if (prev) prev.disabled = currentPage === 0;
  if (next) next.disabled = currentPage === pages.length - 1;
}

// ============================================
// MENÚ MOBILE
// ============================================
function toggleMobileMenu() {
  const menu = document.getElementById('mobileNav');
  const toggle = document.getElementById('menuToggle');
  if (menu) {
    const isOpen = menu.classList.toggle('active');
    if (toggle) toggle.setAttribute('aria-expanded', isOpen);
  }
}

document.addEventListener('click', function (e) {
  const menu = document.getElementById('mobileNav');
  const toggle = document.getElementById('menuToggle');
  if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// ============================================
// EQUIPO
// ============================================
function showGrupo(grupo) {
  const g1 = document.getElementById('grupo1-tab');
  const g2 = document.getElementById('grupo2-tab');
  const b1 = document.getElementById('btn-grupo1');
  const b2 = document.getElementById('btn-grupo2');
  if (grupo === 'grupo1') {
    if (g1) g1.style.display = 'block';
    if (g2) g2.style.display = 'none';
    if (b1) b1.classList.add('tab-active');
    if (b2) b2.classList.remove('tab-active');
  } else {
    if (g1) g1.style.display = 'none';
    if (g2) g2.style.display = 'block';
    if (b1) b1.classList.remove('tab-active');
    if (b2) b2.classList.add('tab-active');
  }
}

// ============================================
// POWER BI FALLBACK
// ============================================
function showPbiError() {
  const fallback = document.getElementById('pbiFallback');
  const loading = document.getElementById('pbiLoading');
  if (loading) loading.style.display = 'none';
  if (fallback) fallback.style.display = 'block';
}

// ============================================
// GRÁFICOS
// ============================================
let chartInstances = {};

const COLORS = {
  navy:        '#001F3F',
  navyAlpha:   'rgba(0, 31, 63, 0.08)',
  pink:        '#E8537A',
  pinkAlpha:   'rgba(232, 83, 122, 0.08)',
  teal:        '#0D9488',
  tealAlpha:   'rgba(13, 148, 136, 0.08)',
  amber:       '#F59E0B',
  amberAlpha:  'rgba(245, 158, 11, 0.08)',
  white:       '#FFFFFF',
};

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 12, weight: '600' }, padding: 14, usePointStyle: true, pointStyle: 'circle' }
    },
    tooltip: {
      backgroundColor: 'rgba(0,31,63,0.92)',
      titleFont: { size: 13, weight: '700' },
      bodyFont: { size: 12 },
      padding: 12,
      cornerRadius: 8,
    }
  },
  scales: {
    y: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: { font: { size: 11 }, callback: v => v + '%' },
    },
    x: {
      grid: { color: 'rgba(0,0,0,0.03)' },
      ticks: { font: { size: 11 } }
    }
  }
};

function makeDataset(label, data, color, colorAlpha) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: colorAlpha,
    borderWidth: 2.5,
    tension: 0.4,
    fill: true,
    pointRadius: 4,
    pointBackgroundColor: color,
    pointBorderColor: COLORS.white,
    pointBorderWidth: 2,
    pointHoverRadius: 7,
  };
}

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

// --- Gráfico 1: Ocupación por género (página Indicadores) ---
function initOcupacionChart() {
  const canvas = document.getElementById('ocupacionChart');
  if (!canvas) return;
  destroyChart('ocupacion');
  chartInstances.ocupacion = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: DATA.years,
      datasets: [
        makeDataset('Ocupación Femenina (%)', DATA.toFem, COLORS.pink, COLORS.pinkAlpha),
        makeDataset('Ocupación Masculina (%)', DATA.toMas, COLORS.navy, COLORS.navyAlpha),
      ]
    },
    options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 30, max: 85 } } }
  });
}

// --- Gráfico 2: Desocupación nacional ---
function initDesocupacionChart() {
  const canvas = document.getElementById('desocupacionChart');
  if (!canvas) return;
  destroyChart('desocupacion');
  chartInstances.desocupacion = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: DATA.years,
      datasets: [{
        label: 'Tasa de Desocupación (%)',
        data: DATA.tdNac,
        backgroundColor: DATA.tdNac.map(v => v > 13 ? COLORS.pink : v > 10 ? COLORS.amber : COLORS.teal),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, legend: { display: false } },
      scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 0, max: 20 } }
    }
  });
}

// --- Gráfico 3: TGP vs TO comparativa 2025 ---
function initComparativaChart() {
  const canvas = document.getElementById('comparativaChart');
  if (!canvas) return;
  destroyChart('comparativa');
  chartInstances.comparativa = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['TGP Femenina', 'TGP Masculina', 'TO Femenina', 'TO Masculina'],
      datasets: [{
        label: 'Valor 2025 (%)',
        data: [52.00, 73.90, 46.74, 71.43],
        backgroundColor: [COLORS.pinkAlpha, COLORS.navyAlpha, COLORS.pink, COLORS.navy],
        borderColor: [COLORS.pink, COLORS.navy, COLORS.pink, COLORS.navy],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, legend: { display: false } },
      scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 0, max: 90 } }
    }
  });
}

// --- Gráfico 4: Brecha de género ---
function initBrechaChart() {
  const canvas = document.getElementById('brechaChart');
  if (!canvas) return;
  destroyChart('brecha');
  chartInstances.brecha = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: DATA.years,
      datasets: [{
        label: 'Brecha TO (pp)',
        data: DATA.brecha,
        backgroundColor: DATA.brecha.map(v => v > 26 ? COLORS.pink : COLORS.amber),
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, legend: { display: false } },
      scales: {
        y: { ...chartDefaults.scales.y, min: 20, max: 30, ticks: { callback: v => v + ' pp' } },
        x: chartDefaults.scales.x
      }
    }
  });
}

// --- Gráfico 5: Desocupación por género ---
function initDesocupacionGeneroChart() {
  const canvas = document.getElementById('desocupacionGeneroChart');
  if (!canvas) return;
  destroyChart('desocupacionGenero');
  chartInstances.desocupacionGenero = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: DATA.years,
      datasets: [
        makeDataset('TD Femenina (%)', DATA.tdFem, COLORS.pink, COLORS.pinkAlpha),
        makeDataset('TD Masculina (%)', DATA.tdMas, COLORS.navy, COLORS.navyAlpha),
      ]
    },
    options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 0, max: 25 } } }
  });
}

// --- Gráfico 6: Tendencias completas ---
function initTendenciasChart() {
  const canvas = document.getElementById('tendenciasChart');
  if (!canvas) return;
  destroyChart('tendencias');

  const tgpNac = DATA.tgpFem.map((f, i) => parseFloat(((f + DATA.tgpMas[i]) / 2).toFixed(2)));
  const toNac  = DATA.toFem.map((f, i)  => parseFloat(((f + DATA.toMas[i])  / 2).toFixed(2)));

  chartInstances.tendencias = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: DATA.years,
      datasets: [
        makeDataset('TGP Nacional (%)', tgpNac, COLORS.teal, COLORS.tealAlpha),
        makeDataset('TO Nacional (%)',  toNac,  COLORS.navy, COLORS.navyAlpha),
        makeDataset('TD Nacional (%)', DATA.tdNac, COLORS.pink, COLORS.pinkAlpha),
      ]
    },
    options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 0, max: 80 } } }
  });
}

// ============================================
// FILTROS DE GRÁFICOS
// ============================================
function filterChartByGender(gender, btn) {
  if (!chartInstances.ocupacion) return;
  chartInstances.ocupacion.data.datasets[0].hidden = (gender === 'masculino');
  chartInstances.ocupacion.data.datasets[1].hidden = (gender === 'femenino');
  chartInstances.ocupacion.update();
  if (btn) {
    btn.closest('.chart-filters').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

function filterTendencias(type, btn) {
  if (!chartInstances.tendencias) return;
  const ds = chartInstances.tendencias.data.datasets;
  if (type === 'todos') {
    ds.forEach(d => d.hidden = false);
  } else if (type === 'tgp') {
    ds[0].hidden = false; ds[1].hidden = true; ds[2].hidden = true;
  } else if (type === 'to') {
    ds[0].hidden = true; ds[1].hidden = false; ds[2].hidden = true;
  } else if (type === 'td') {
    ds[0].hidden = true; ds[1].hidden = true; ds[2].hidden = false;
  }
  chartInstances.tendencias.update();
  if (btn) {
    btn.closest('.chart-filters').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

// ============================================
// TABLA DE DATOS HISTÓRICOS
// ============================================
function buildDataTable() {
  const tbody = document.getElementById('dataTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  DATA.years.forEach((year, i) => {
    const brecha = DATA.brecha[i];
    const trend = i === 0 ? '—' : DATA.toFem[i] > DATA.toFem[i-1] ? '↑' : '↓';
    const trendColor = trend === '↑' ? '#27ae60' : trend === '↓' ? '#e74c3c' : '#999';
    const tdColor = DATA.tdNac[i] > 12 ? '#e74c3c' : DATA.tdNac[i] > 9 ? '#F59E0B' : '#27ae60';
    tbody.innerHTML += `
      <tr>
        <td><strong>${year}</strong></td>
        <td>${DATA.toFem[i].toFixed(2)}%</td>
        <td>${DATA.toMas[i].toFixed(2)}%</td>
        <td><span class="badge badge-amber">${brecha.toFixed(2)} pp</span></td>
        <td style="color:${tdColor};font-weight:600">${DATA.tdNac[i].toFixed(1)}%</td>
        <td style="color:${trendColor};font-size:1.1rem;font-weight:700">${trend}</td>
      </tr>`;
  });
}

// ============================================
// INICIALIZACIÓN
// ============================================
function initAllCharts() {
  if (typeof Chart === 'undefined') {
    setTimeout(initAllCharts, 400);
    return;
  }
  initOcupacionChart();
  initDesocupacionChart();
  initComparativaChart();
  initBrechaChart();
  initDesocupacionGeneroChart();
  initTendenciasChart();
  buildDataTable();
}

document.addEventListener('DOMContentLoaded', function () {
  // Mostrar primera página
  const firstPage = document.getElementById('page-inicio');
  if (firstPage) {
    firstPage.style.display = 'block';
    void firstPage.offsetWidth;
    firstPage.classList.add('page-visible');
  }
  updateArrows();

  // Nav links
  document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      const pageId = pageMap[page];
      if (pageId) navigateTo(pageId);
    });
  });

  // Logo
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', () => navigateTo('page-inicio'));

  // Menú móvil
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);

  // Sidebar links con scroll suave
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 90;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Highlight sidebar al scroll
  window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.pageYOffset >= sec.offsetTop - 130) {
        current = sec.getAttribute('id');
      }
    });
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  // Inicializar gráficos
  initAllCharts();
});

// ============================================
// EXPONER GLOBALES
// ============================================
window.navigateTo          = navigateTo;
window.navigatePrev        = navigatePrev;
window.navigateNext        = navigateNext;
window.toggleMobileMenu    = toggleMobileMenu;
window.showGrupo           = showGrupo;
window.filterChartByGender = filterChartByGender;
window.filterTendencias    = filterTendencias;
window.showPbiError        = showPbiError;
