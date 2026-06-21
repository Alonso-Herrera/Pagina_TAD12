// ============================================
// TAD 12 - SCRIPT PRINCIPAL v3.0
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

DATA.brecha = DATA.toMas.map((m, i) => parseFloat((m - DATA.toFem[i]).toFixed(2)));

let currentPage = 0;
const pages = [
  'page-inicio', 'page-exploratorio', 'page-indicadores',
  'page-genero', 'page-tendencias', 'page-powerbi', 'page-equipo'
];
const pageMap = {
  'inicio':        'page-inicio',
  'exploratorio':  'page-exploratorio',
  'indicadores':   'page-indicadores',
  'genero':        'page-genero',
  'tendencias':    'page-tendencias',
  'powerbi':       'page-powerbi',
  'equipo':        'page-equipo'
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

function toggleMobileMenu() {
  const menu = document.getElementById('mobileNav');
  const toggle = document.getElementById('menuToggle');
  if (menu) {
    const isOpen = menu.classList.toggle('active');
    if (toggle) toggle.setAttribute('aria-expanded', isOpen);
  }
}

// GRÁFICOS
let chartInstances = {};
const COLORS = {
  navy: '#001F3F', navyAlpha: 'rgba(0, 31, 63, 0.08)',
  pink: '#E8537A', pinkAlpha: 'rgba(232, 83, 122, 0.08)',
  teal: '#0D9488', tealAlpha: 'rgba(13, 148, 136, 0.08)',
  white: '#FFFFFF',
};

const chartDefaults = {
  responsive: true, maintainAspectRatio: true,
  plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle' } } },
  scales: { y: { ticks: { callback: v => v + '%' } } }
};

function initAllCharts() {
  if (typeof Chart === 'undefined') return;
  
  // Ocupación
  const ctx1 = document.getElementById('ocupacionChart');
  if (ctx1) {
    chartInstances.ocupacion = new Chart(ctx1.getContext('2d'), {
      type: 'line',
      data: {
        labels: DATA.years,
        datasets: [
          { label: 'Femenino', data: DATA.toFem, borderColor: COLORS.pink, backgroundColor: COLORS.pinkAlpha, fill: true, tension: 0.4 },
          { label: 'Masculino', data: DATA.toMas, borderColor: COLORS.navy, backgroundColor: COLORS.navyAlpha, fill: true, tension: 0.4 }
        ]
      },
      options: chartDefaults
    });
  }

  // Desocupación
  const ctx2 = document.getElementById('desocupacionChart');
  if (ctx2) {
    chartInstances.desocupacion = new Chart(ctx2.getContext('2d'), {
      type: 'bar',
      data: {
        labels: DATA.years,
        datasets: [{ label: 'TD Nacional', data: DATA.tdNac, backgroundColor: COLORS.teal }]
      },
      options: chartDefaults
    });
  }

  // Comparativa
  const ctx3 = document.getElementById('comparativaChart');
  if (ctx3) {
    chartInstances.comparativa = new Chart(ctx3.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['TGP Fem', 'TGP Mas', 'TO Fem', 'TO Mas'],
        datasets: [{ label: '2025 (%)', data: [52.0, 73.9, 46.7, 71.4], backgroundColor: [COLORS.pinkAlpha, COLORS.navyAlpha, COLORS.pink, COLORS.navy] }]
      },
      options: chartDefaults
    });
  }

  // Brecha
  const ctx4 = document.getElementById('brechaChart');
  if (ctx4) {
    chartInstances.brecha = new Chart(ctx4.getContext('2d'), {
      type: 'bar',
      data: {
        labels: DATA.years,
        datasets: [{ label: 'Brecha (pp)', data: DATA.brecha, backgroundColor: COLORS.pink }]
      },
      options: { ...chartDefaults, scales: { y: { ticks: { callback: v => v + 'pp' } } } }
    });
  }

  // Desocupación Género
  const ctx5 = document.getElementById('desocupacionGeneroChart');
  if (ctx5) {
    chartInstances.desocupacionGenero = new Chart(ctx5.getContext('2d'), {
      type: 'line',
      data: {
        labels: DATA.years,
        datasets: [
          { label: 'TD Fem', data: DATA.tdFem, borderColor: COLORS.pink, tension: 0.4 },
          { label: 'TD Mas', data: DATA.tdMas, borderColor: COLORS.navy, tension: 0.4 }
        ]
      },
      options: chartDefaults
    });
  }

  // Tendencias
  const ctx6 = document.getElementById('tendenciasChart');
  if (ctx6) {
    const toNac = DATA.toFem.map((f, i) => (f + DATA.toMas[i]) / 2);
    const tgpNac = DATA.tgpFem.map((f, i) => (f + DATA.tgpMas[i]) / 2);
    chartInstances.tendencias = new Chart(ctx6.getContext('2d'), {
      type: 'line',
      data: {
        labels: DATA.years,
        datasets: [
          { label: 'TGP Nacional', data: tgpNac, borderColor: COLORS.teal, tension: 0.4 },
          { label: 'TO Nacional', data: toNac, borderColor: COLORS.navy, tension: 0.4 }
        ]
      },
      options: chartDefaults
    });
  }
}

function filterChartByGender(gender, btn) {
  if (!chartInstances.ocupacion) return;
  chartInstances.ocupacion.data.datasets[0].hidden = (gender === 'masculino');
  chartInstances.ocupacion.data.datasets[1].hidden = (gender === 'femenino');
  chartInstances.ocupacion.update();
  btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function filterTendencias(type, btn) {
  if (!chartInstances.tendencias) return;
  const ds = chartInstances.tendencias.data.datasets;
  if (type === 'todos') { ds[0].hidden = false; ds[1].hidden = false; }
  else if (type === 'tgp') { ds[0].hidden = false; ds[1].hidden = true; }
  else if (type === 'to') { ds[0].hidden = true; ds[1].hidden = false; }
  chartInstances.tendencias.update();
  btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  navigateTo('page-inicio');
  initAllCharts();
  document.getElementById('menuToggle').addEventListener('click', toggleMobileMenu);
});

window.navigateTo = navigateTo;
window.navigatePrev = navigatePrev;
window.navigateNext = navigateNext;
window.filterChartByGender = filterChartByGender;
window.filterTendencias = filterTendencias;
