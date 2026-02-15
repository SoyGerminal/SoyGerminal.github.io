// ================================================================
// WHEN DATA TELLS US A STORY — Main Script
// GSAP ScrollTrigger + ApexCharts + KPI Counters
// ================================================================

(function() {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    // ============================================================
    // SHARED CHART CONFIG
    // ============================================================
    const chartColors = {
        blue: '#5eb0ff',
        purple: '#af52de',
        red: '#ff3b30',
        orange: '#ff9500',
        green: '#34c759',
        indigo: '#5856d6',
        cyan: '#0071e3',
        gray: '#86868b',
        male: '#0071e3',
        female: '#ff6b6b'
    };

    function getBaseChartConfig(overrides = {}) {
        const { chart, grid, xaxis, yaxis, tooltip, legend, dataLabels, ...rest } = overrides;
        return Object.assign({
            chart: Object.assign({
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                toolbar: { show: false },
                animations: { enabled: true, easing: 'easeinout', speed: 800 },
                background: 'transparent'
            }, chart || {}),
            grid: Object.assign({
                borderColor: 'rgba(255,255,255,0.04)',
                strokeDashArray: 4
            }, grid || {}),
            xaxis: Object.assign({
                labels: { style: { colors: '#888', fontSize: '10px' } },
                axisBorder: { show: false },
                axisTicks: { show: false }
            }, xaxis || {}),
            yaxis: Object.assign({
                labels: { style: { colors: '#888', fontSize: '10px' } }
            }, yaxis || {}),
            tooltip: Object.assign({
                theme: 'dark',
                style: { fontSize: '12px' }
            }, tooltip || {}),
            legend: Object.assign({
                labels: { colors: '#888' }
            }, legend || {}),
            dataLabels: Object.assign({
                enabled: false
            }, dataLabels || {})
        }, rest);
    }

    // Chart registry to prevent double initialization
    const chartRegistry = new Set();

    function renderChart(selector, options) {
        if (chartRegistry.has(selector)) return;
        const el = document.querySelector(selector);
        if (!el) return;
        chartRegistry.add(selector);
        const chart = new ApexCharts(el, options);
        chart.render();
    }

    // ============================================================
    // HERO ANIMATION
    // ============================================================
    function initHero() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.hero__tagline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
          .fromTo('.hero__name', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.6)
          .fromTo('.hero__subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 1.0)
          .fromTo('.hero__stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 1.3)
          .fromTo('.hero__scroll-cue', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.8);

        // Hero stat counters
        document.querySelectorAll('.hero__stat-value').forEach(el => {
            const target = parseInt(el.dataset.count) || 0;
            gsap.to({ val: 0 }, {
                val: target,
                duration: 2,
                delay: 1.5,
                ease: 'power2.out',
                onUpdate: function() {
                    el.textContent = Math.round(this.targets()[0].val);
                }
            });
        });

        // Parallax on hero bg
        gsap.to('.hero__bg', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // ============================================================
    // NAVIGATION PROGRESS
    // ============================================================
    function initNavProgress() {
        const nav = document.querySelector('.nav-progress');
        const dots = document.querySelectorAll('.nav-dot');

        // Show nav after scrolling past hero
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'bottom 80%',
            onEnter: () => nav.classList.add('visible'),
            onLeaveBack: () => nav.classList.remove('visible')
        });

        // Update active dot per chapter
        document.querySelectorAll('[data-chapter]').forEach(section => {
            const chapterNum = section.dataset.chapter;

            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => setActiveDot(chapterNum, section),
                onEnterBack: () => setActiveDot(chapterNum, section)
            });
        });

        function setActiveDot(num, section) {
            dots.forEach(d => d.classList.remove('active'));
            const activeDot = document.querySelector(`.nav-dot[data-chapter="${num}"]`);
            if (activeDot) activeDot.classList.add('active');

            // Update CSS variable for accent color
            const accent = section.dataset.accent;
            if (accent) {
                document.documentElement.style.setProperty('--chapter-accent', accent);
            }
        }

        // Smooth scroll on dot click
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const href = dot.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================================
    // CHAPTER REVEAL ANIMATIONS
    // ============================================================
    function initChapterAnimations() {
        const revealSelectors = [
            '.chapter__header',
            '.chapter__image-placeholder',
            '.chapter__kpis',
            '.chapter__narrative',
            '.chapter__charts',
            '.chapter__context',
            '.chapter__comparison',
            '.chapter__footnotes',
            '.chapter__dive-deep',
            '.chapter__timeline-personal',
            '.chapter__subsection',
            '.closing__skills',
            '.closing__competencies',
            '.closing__projects',
            '.closing__education',
            '.closing__contact'
        ];

        revealSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        once: true
                    }
                });
            });
        });

        // Stagger KPI cards within each chapter
        document.querySelectorAll('.chapter__kpis').forEach(kpiGrid => {
            const cards = kpiGrid.querySelectorAll('.kpi-card');
            gsap.fromTo(cards,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: kpiGrid,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });
    }

    // ============================================================
    // KPI COUNTER ANIMATIONS
    // ============================================================
    function initKPICounters() {
        document.querySelectorAll('.kpi-card').forEach(card => {
            const valueEl = card.querySelector('.kpi-card__value');
            if (!valueEl) return;

            const rawValue = parseFloat(card.dataset.value) || 0;
            const suffix = card.dataset.suffix || '';
            const noDecimal = card.dataset.noDecimal === 'true';

            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    const startVal = 0;
                    gsap.to({ val: startVal }, {
                        val: rawValue,
                        duration: 1.5,
                        ease: 'power2.out',
                        onUpdate: function() {
                            const current = this.targets()[0].val;
                            let display;
                            if (noDecimal) {
                                display = Math.round(current).toString();
                            } else if (Math.abs(rawValue) >= 100) {
                                display = Math.round(current).toLocaleString();
                            } else if (Math.abs(rawValue) >= 10) {
                                display = current.toFixed(1);
                            } else {
                                display = current.toFixed(1);
                            }
                            valueEl.textContent = display + suffix;
                        }
                    });
                }
            });
        });
    }

    // ============================================================
    // COMPETENCY BARS ANIMATION
    // ============================================================
    function initCompetencyBars() {
        const bars = document.querySelectorAll('.competency-bar__fill');
        bars.forEach(bar => {
            ScrollTrigger.create({
                trigger: bar,
                start: 'top 90%',
                once: true,
                onEnter: () => {
                    bar.style.width = bar.style.getPropertyValue('--width');
                }
            });
        });
    }

    // ============================================================
    // CHARTS — Chapter 1: Birth (1978)
    // ============================================================
    function initChapter1Charts() {
        // Population evolution
        renderChart('#chart-population', getBaseChartConfig({
            series: [{ name: 'Population (M)', data: [33.8, 35.5, 37.4, 38.4, 39.0, 39.4, 40.5, 43.4, 46.6, 46.4, 47.4, 48.2] }],
            chart: { type: 'area', height: 220 },
            colors: [chartColors.blue],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] } },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: { categories: ['1970','1975','1980','1985','1990','1995','2000','2005','2010','2015','2020','2024'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 30, max: 50, labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v.toFixed(0) + 'M' } },
            tooltip: { theme: 'dark', y: { formatter: v => v + ' million' } },
            annotations: { xaxis: [{ x: '1980', borderColor: chartColors.purple, strokeDashArray: 4, label: { borderColor: chartColors.purple, style: { color: '#fff', background: chartColors.purple, fontSize: '10px' }, text: '1978' } }] }
        }));

        // Price comparison
        renderChart('#chart-prices', getBaseChartConfig({
            series: [{ name: 'Multiplier', data: [7.9, 35.6, 5.6, 12.0, 15.8, 28.3] }],
            chart: { type: 'bar', height: 220 },
            plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '60%', distributed: true } },
            colors: [chartColors.cyan, chartColors.green, chartColors.purple, chartColors.orange, chartColors.red, chartColors.indigo],
            xaxis: { categories: ['Gasoline','Bread','Milk','Coffee','Cinema','Rent'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { labels: { style: { colors: '#f0f0f0', fontSize: '12px' } } },
            dataLabels: { enabled: true, formatter: v => 'x' + v.toFixed(1), style: { fontSize: '11px', fontWeight: 600, colors: ['#fff'] }, offsetX: -10 },
            legend: { show: false },
            tooltip: { theme: 'dark', y: { formatter: v => 'x' + v + ' more expensive' } }
        }));
    }

    // ============================================================
    // CHARTS — Chapter 2: Education (1983-1992)
    // ============================================================
    function initChapter2Charts() {
        renderChart('#chart-students', getBaseChartConfig({
            series: [
                { name: 'EGB', data: [5.6, 5.65, 5.7, 5.75, 5.78, 5.8, 5.75, 5.68, 5.6, 5.5] },
                { name: 'BUP/COU', data: [1.1, 1.15, 1.2, 1.28, 1.35, 1.4, 1.48, 1.52, 1.55, 1.58] },
                { name: 'FP', data: [0.65, 0.68, 0.71, 0.75, 0.78, 0.8, 0.82, 0.85, 0.87, 0.88] }
            ],
            chart: { type: 'area', height: 220, stacked: true },
            colors: [chartColors.cyan, chartColors.purple, chartColors.orange],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1 } },
            stroke: { curve: 'smooth', width: 2 },
            xaxis: { categories: ['1983','1984','1985','1986','1987','1988','1989','1990','1991','1992'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v.toFixed(1) + 'M' } },
            legend: { position: 'bottom' },
            tooltip: { theme: 'dark', y: { formatter: v => v + 'M students' } }
        }));

        renderChart('#chart-dropout', getBaseChartConfig({
            series: [
                { name: 'Spain', data: [42, 40, 38, 36, 34, 33] },
                { name: 'EU Average', data: [25, 24, 23, 22, 21, 20] }
            ],
            chart: { type: 'line', height: 220 },
            colors: [chartColors.red, chartColors.green],
            stroke: { curve: 'smooth', width: 3 },
            markers: { size: 5, hover: { size: 7 } },
            xaxis: { categories: ['1983','1985','1987','1989','1991','1992'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 15, max: 45, labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v + '%' } },
            legend: { position: 'bottom' },
            tooltip: { theme: 'dark', y: { formatter: v => v + '% dropout' } },
            annotations: { yaxis: [{ y: 20, borderColor: chartColors.green, strokeDashArray: 4, label: { borderColor: chartColors.green, style: { color: '#fff', background: chartColors.green, fontSize: '9px' }, text: 'EU Target' } }] }
        }));
    }

    // ============================================================
    // CHARTS — Chapter 3: Adolescence (1992-1997)
    // ============================================================
    function initChapter3Charts() {
        const years92_97 = ['1992','1993','1994','1995','1996','1997'];

        renderChart('#chart-alcohol', getBaseChartConfig({
            series: [{ name: 'Male', data: [58,60,62,63,65,67] }, { name: 'Female', data: [46,48,49,50,52,54] }],
            chart: { type: 'line', height: 200 },
            colors: [chartColors.male, chartColors.female],
            stroke: { curve: 'smooth', width: 3 },
            markers: { size: 4 },
            xaxis: { categories: years92_97, labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 40, max: 70, labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v + '%' } },
            legend: { show: false },
            tooltip: { theme: 'dark', y: { formatter: v => v + '%' } }
        }));

        renderChart('#chart-cannabis', getBaseChartConfig({
            series: [{ name: 'Male', data: [16,18,20,22,25,28] }, { name: 'Female', data: [8,10,12,14,16,17] }],
            chart: { type: 'area', height: 200 },
            colors: [chartColors.male, chartColors.female],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
            stroke: { curve: 'smooth', width: 2 },
            xaxis: { categories: years92_97, labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 0, max: 35, labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v + '%' } },
            legend: { show: false },
            tooltip: { theme: 'dark', y: { formatter: v => v + '%' } }
        }));

        renderChart('#chart-hard-drugs', getBaseChartConfig({
            series: [{ name: 'Heroin', data: [0.8,0.7,0.6,0.5,0.4,0.3] }, { name: 'Cocaine', data: [1.8,2.0,2.2,2.5,2.8,3.2] }],
            chart: { type: 'line', height: 180 },
            colors: [chartColors.red, chartColors.orange],
            stroke: { curve: 'smooth', width: 3 },
            markers: { size: 5 },
            xaxis: { categories: years92_97, labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 0, max: 4, labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v.toFixed(1) + '%' } },
            legend: { position: 'top', horizontalAlign: 'right' },
            tooltip: { theme: 'dark', y: { formatter: v => v + '% annual use' } },
            annotations: { points: [{ x: '1992', y: 0.8, marker: { size: 6, fillColor: chartColors.red, strokeColor: '#fff' }, label: { text: 'Heroin peak', style: { background: chartColors.red, color: '#fff', fontSize: '9px' } } }] }
        }));

        renderChart('#chart-hiv-cases', getBaseChartConfig({
            series: [{ name: 'New AIDS Cases', data: [7254,7330,7053,6492,5542,4455] }],
            chart: { type: 'bar', height: 200 },
            colors: [chartColors.red],
            plotOptions: { bar: { borderRadius: 6, columnWidth: '60%' } },
            xaxis: { categories: years92_97, labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => (v/1000).toFixed(1) + 'K' } },
            tooltip: { theme: 'dark', y: { formatter: v => v.toLocaleString() + ' cases' } },
            annotations: { xaxis: [{ x: '1996', borderColor: chartColors.green, strokeDashArray: 0, label: { text: 'Antiretrovirals', style: { background: chartColors.green, color: '#fff', fontSize: '9px' } } }] }
        }));

        renderChart('#chart-aids-deaths', getBaseChartConfig({
            series: [{ name: 'Male', data: [3190,3856,4294,4806,4134,2294] }, { name: 'Female', data: [562,680,758,848,729,405] }],
            chart: { type: 'area', height: 200, stacked: true },
            colors: [chartColors.male, chartColors.female],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.2 } },
            stroke: { curve: 'smooth', width: 2 },
            xaxis: { categories: years92_97, labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => (v/1000).toFixed(1) + 'K' } },
            legend: { position: 'top', horizontalAlign: 'right' },
            tooltip: { theme: 'dark', y: { formatter: v => v.toLocaleString() + ' deaths' } }
        }));

        renderChart('#chart-mortality-causes', getBaseChartConfig({
            series: [39, 14, 16, 9, 22],
            chart: { type: 'donut', height: 230 },
            labels: ['Traffic', 'Drugs', 'AIDS', 'Suicide', 'Other'],
            colors: [chartColors.orange, chartColors.red, chartColors.purple, chartColors.indigo, chartColors.gray],
            plotOptions: { pie: { donut: { size: '60%', labels: { show: true, total: { show: true, label: 'Total', color: '#888', formatter: () => '4,450' } } } } },
            dataLabels: { enabled: true, formatter: v => v.toFixed(0) + '%', style: { fontSize: '11px', fontWeight: 600 } },
            legend: { position: 'bottom' },
            tooltip: { y: { formatter: v => v + '% of youth deaths' } }
        }));

        renderChart('#chart-mortality-sex', getBaseChartConfig({
            series: [{ name: 'Male', data: [120, 112, 98] }, { name: 'Female', data: [34, 32, 28] }],
            chart: { type: 'bar', height: 230 },
            colors: [chartColors.male, chartColors.female],
            plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 6 } },
            xaxis: { categories: ['1992','1994','1996'], labels: { style: { colors: '#888', fontSize: '11px' } } },
            yaxis: { labels: { style: { colors: '#888', fontSize: '10px' } } },
            legend: { position: 'top', horizontalAlign: 'right' },
            tooltip: { theme: 'dark', y: { formatter: v => v + ' per 100K' } }
        }));
    }

    // ============================================================
    // CHARTS — Chapter 4: University (1997-2002)
    // ============================================================
    function initChapter4Charts() {
        renderChart('#chart-internet', getBaseChartConfig({
            series: [{ name: 'Internet Users (%)', data: [1, 3, 7, 12, 16, 20] }],
            chart: { type: 'area', height: 220 },
            colors: [chartColors.indigo],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05 } },
            stroke: { curve: 'smooth', width: 3 },
            markers: { size: 5 },
            xaxis: { categories: ['1997','1998','1999','2000','2001','2002'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 0, max: 25, labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v + '%' } },
            tooltip: { theme: 'dark', y: { formatter: v => v + '% of population' } }
        }));

        renderChart('#chart-gdp-late90s', getBaseChartConfig({
            series: [{ name: 'GDP Growth', data: [3.9, 4.5, 4.7, 5.0, 3.7, 2.7] }],
            chart: { type: 'bar', height: 220 },
            colors: [chartColors.indigo],
            plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
            xaxis: { categories: ['1997','1998','1999','2000','2001','2002'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 0, max: 6, labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v + '%' } },
            dataLabels: { enabled: true, formatter: v => v + '%', style: { fontSize: '11px', colors: ['#fff'] } },
            tooltip: { theme: 'dark', y: { formatter: v => v + '% growth' } }
        }));
    }

    // ============================================================
    // CHARTS — Chapter 5: Designer (2002-2013)
    // ============================================================
    function initChapter5Charts() {
        renderChart('#chart-housing', getBaseChartConfig({
            series: [{ name: 'Price Index', data: [100, 140, 180, 197, 185, 155, 120] }],
            chart: { type: 'area', height: 220 },
            colors: [chartColors.green],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
            stroke: { curve: 'smooth', width: 3 },
            markers: { size: 4 },
            xaxis: { categories: ['2002','2004','2006','2007','2008','2010','2013'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 80, max: 210, labels: { style: { colors: '#888', fontSize: '10px' } } },
            tooltip: { theme: 'dark', y: { formatter: v => 'Index: ' + v } },
            annotations: { xaxis: [{ x: '2007', borderColor: chartColors.red, strokeDashArray: 4, label: { text: 'Bubble Peak', style: { background: chartColors.red, color: '#fff', fontSize: '9px' } } }] }
        }));

        renderChart('#chart-unemployment-2000s', getBaseChartConfig({
            series: [{ name: 'Unemployment', data: [11.5, 10.6, 8.5, 8.3, 11.3, 18.0, 20.1, 21.6, 25.0, 26.1] }],
            chart: { type: 'line', height: 220 },
            colors: [chartColors.red],
            stroke: { curve: 'smooth', width: 3 },
            markers: { size: 4 },
            xaxis: { categories: ['2002','2004','2006','2007','2008','2009','2010','2011','2012','2013'], labels: { style: { colors: '#888', fontSize: '10px' }, rotate: -45 } },
            yaxis: { min: 5, max: 30, labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v + '%' } },
            tooltip: { theme: 'dark', y: { formatter: v => v + '%' } },
            annotations: { xaxis: [{ x: '2008', borderColor: chartColors.orange, strokeDashArray: 4, label: { text: 'Crisis', style: { background: chartColors.orange, color: '#fff', fontSize: '9px' } } }] }
        }));
    }

    // ============================================================
    // CHARTS — Chapter 6: Entrepreneur (2013-2022)
    // ============================================================
    function initChapter6Charts() {
        renderChart('#chart-gdp-2010s', getBaseChartConfig({
            series: [{ name: 'GDP Growth', data: [-1.4, 1.4, 3.8, 3.0, 2.9, 2.3, 2.0, -11.3, 5.5, 5.8] }],
            chart: { type: 'bar', height: 220 },
            colors: ['#34c759'],
            plotOptions: {
                bar: {
                    borderRadius: 4, columnWidth: '60%',
                    colors: {
                        ranges: [{ from: -20, to: 0, color: chartColors.red }]
                    }
                }
            },
            xaxis: { categories: ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022'], labels: { style: { colors: '#888', fontSize: '10px' }, rotate: -45 } },
            yaxis: { labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => v + '%' } },
            tooltip: { theme: 'dark', y: { formatter: v => v + '% growth' } },
            annotations: { xaxis: [{ x: '2020', borderColor: chartColors.red, strokeDashArray: 0, label: { text: 'COVID', style: { background: chartColors.red, color: '#fff', fontSize: '9px' } } }] }
        }));

        renderChart('#chart-ecommerce', getBaseChartConfig({
            series: [{ name: 'E-Commerce Revenue (€B)', data: [14, 17, 20, 25, 30, 36, 40, 52, 58, 63] }],
            chart: { type: 'area', height: 220 },
            colors: [chartColors.orange],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
            stroke: { curve: 'smooth', width: 3 },
            xaxis: { categories: ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022'], labels: { style: { colors: '#888', fontSize: '10px' }, rotate: -45 } },
            yaxis: { labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => '€' + v + 'B' } },
            tooltip: { theme: 'dark', y: { formatter: v => '€' + v + ' billion' } }
        }));
    }

    // ============================================================
    // CHARTS — Chapter 7: Reinvention (2023-present)
    // ============================================================
    function initChapter7Charts() {
        renderChart('#chart-ai-investment', getBaseChartConfig({
            series: [{ name: 'AI Investment ($B)', data: [40, 70, 100, 150, 200, 280] }],
            chart: { type: 'bar', height: 220 },
            colors: [chartColors.cyan],
            plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
            xaxis: { categories: ['2020','2021','2022','2023','2024','2025'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { labels: { style: { colors: '#888', fontSize: '10px' }, formatter: v => '$' + v + 'B' } },
            dataLabels: { enabled: true, formatter: v => '$' + v + 'B', style: { fontSize: '10px', colors: ['#fff'] } },
            tooltip: { theme: 'dark', y: { formatter: v => '$' + v + ' billion' } }
        }));

        renderChart('#chart-ds-demand', getBaseChartConfig({
            series: [{ name: 'Demand Index', data: [100, 125, 155, 190, 230, 270] }],
            chart: { type: 'area', height: 220 },
            colors: [chartColors.cyan],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05 } },
            stroke: { curve: 'smooth', width: 3 },
            markers: { size: 5 },
            xaxis: { categories: ['2020','2021','2022','2023','2024','2025'], labels: { style: { colors: '#888', fontSize: '10px' } } },
            yaxis: { min: 50, max: 300, labels: { style: { colors: '#888', fontSize: '10px' } } },
            tooltip: { theme: 'dark', y: { formatter: v => 'Index: ' + v } },
            annotations: { xaxis: [{ x: '2023', borderColor: chartColors.purple, strokeDashArray: 4, label: { text: 'ChatGPT', style: { background: chartColors.purple, color: '#fff', fontSize: '9px' } } }] }
        }));
    }

    // ============================================================
    // CHARTS — Chapter 8: Skills Radar (ApexCharts replaces Chart.js)
    // ============================================================
    function initChapter8Charts() {
        renderChart('#chart-skills-radar', {
            series: [
                { name: 'Current Level', data: [70, 65, 75, 85, 80, 85] },
                { name: '2026 Target', data: [90, 85, 90, 90, 85, 85] }
            ],
            chart: {
                type: 'radar',
                height: 320,
                fontFamily: "'Inter', sans-serif",
                toolbar: { show: false },
                background: 'transparent'
            },
            colors: [chartColors.cyan, chartColors.green],
            stroke: { width: 2 },
            fill: { opacity: [0.3, 0.1] },
            markers: { size: 3 },
            xaxis: {
                categories: ['Python', 'SQL', 'Data Viz', 'Excel/Analytics', 'Web Dev', 'Design Tools'],
                labels: { style: { colors: '#888', fontSize: '11px' } }
            },
            yaxis: {
                show: false,
                min: 0,
                max: 100,
                tickAmount: 5
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors: 'rgba(255,255,255,0.06)',
                        connectorColors: 'rgba(255,255,255,0.06)',
                        fill: { colors: ['transparent'] }
                    }
                }
            },
            legend: {
                position: 'bottom',
                labels: { colors: '#888' },
                markers: { radius: 12 }
            },
            tooltip: {
                theme: 'dark',
                y: { formatter: v => v + '%' }
            }
        });
    }

    // ============================================================
    // LAZY CHART LOADING
    // ============================================================
    function initLazyCharts() {
        const chapterChartMap = {
            'chapter-1': initChapter1Charts,
            'chapter-2': initChapter2Charts,
            'chapter-3': initChapter3Charts,
            'chapter-4': initChapter4Charts,
            'chapter-5': initChapter5Charts,
            'chapter-6': initChapter6Charts,
            'chapter-7': initChapter7Charts,
            'chapter-8': initChapter8Charts
        };

        Object.entries(chapterChartMap).forEach(([id, initFn]) => {
            const section = document.getElementById(id);
            if (!section) return;

            ScrollTrigger.create({
                trigger: section,
                start: 'top 90%',
                once: true,
                onEnter: () => {
                    setTimeout(initFn, 100);
                }
            });
        });
    }

    // ============================================================
    // IMAGE PLACEHOLDER PARALLAX
    // ============================================================
    function initParallax() {
        document.querySelectorAll('.chapter__image-placeholder').forEach(placeholder => {
            gsap.to(placeholder, {
                yPercent: -8,
                ease: 'none',
                scrollTrigger: {
                    trigger: placeholder,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // ============================================================
    // CONSOLE SIGNATURE
    // ============================================================
    function logSignature() {
        console.log(
            '%cWhen Data Tells Us a Story %c\n\nThanks for exploring my portfolio.\nContact: germinalbarrena@gmail.com',
            'font-size: 18px; font-weight: 600; color: #c77dff;',
            'font-size: 12px; color: #888;'
        );
    }

    // ============================================================
    // INIT
    // ============================================================
    document.addEventListener('DOMContentLoaded', function() {
        initHero();
        initNavProgress();
        initChapterAnimations();
        initKPICounters();
        initCompetencyBars();
        initLazyCharts();
        initParallax();
        logSignature();
    });

})();
