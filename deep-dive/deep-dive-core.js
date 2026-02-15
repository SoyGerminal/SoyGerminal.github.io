// ================================================================
// DEEP DIVE — Shared JS Engine
// Scope toggle, chart utilities, animations
// ================================================================

const DiveDeep = (function() {
    'use strict';

    // --- State ---
    let currentScope = 'all';
    let chartInstances = {};
    let chartDataMap = {};
    let config = {};

    // --- Country Colors ---
    const countryColors = {
        ES: '#ff3b30',
        FR: '#0071e3',
        DE: '#ff9500',
        UK: '#5856d6',
        IT: '#34c759',
        US: '#c77dff',
        JP: '#ff6b6b',
        PT: '#5eb0ff',
        GR: '#86868b',
        World: '#888'
    };

    const countryNames = {
        ES: 'Spain',
        FR: 'France',
        DE: 'Germany',
        UK: 'United Kingdom',
        IT: 'Italy',
        US: 'United States',
        JP: 'Japan',
        PT: 'Portugal',
        GR: 'Greece',
        World: 'World'
    };

    const scopeCountries = {
        spain: ['ES'],
        europe: ['ES', 'FR', 'DE', 'UK', 'IT'],
        world: ['ES', 'FR', 'DE', 'UK', 'IT', 'US', 'JP'],
        all: ['ES', 'FR', 'DE', 'UK', 'IT', 'US', 'JP', 'World']
    };

    // --- Base chart config (same as main site but with toolbar visible) ---
    function getBaseChartConfig(overrides) {
        overrides = overrides || {};
        var chartOpts = overrides.chart || {};
        var gridOpts = overrides.grid || {};
        var xaxisOpts = overrides.xaxis || {};
        var yaxisOpts = overrides.yaxis || {};
        var tooltipOpts = overrides.tooltip || {};
        var legendOpts = overrides.legend || {};
        var dataLabelsOpts = overrides.dataLabels || {};

        // Remove known keys so rest can be spread
        var rest = {};
        Object.keys(overrides).forEach(function(k) {
            if (!['chart','grid','xaxis','yaxis','tooltip','legend','dataLabels'].includes(k)) {
                rest[k] = overrides[k];
            }
        });

        var base = {
            chart: Object.assign({
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    },
                    export: {
                        csv: { filename: 'deep-dive-data' },
                        svg: { filename: 'deep-dive-chart' },
                        png: { filename: 'deep-dive-chart' }
                    }
                },
                animations: { enabled: true, easing: 'easeinout', speed: 800 },
                background: 'transparent'
            }, chartOpts),
            grid: Object.assign({
                borderColor: 'rgba(255,255,255,0.04)',
                strokeDashArray: 4
            }, gridOpts),
            xaxis: Object.assign({
                labels: { style: { colors: '#888', fontSize: '10px' } },
                axisBorder: { show: false },
                axisTicks: { show: false }
            }, xaxisOpts),
            yaxis: Object.assign({
                labels: { style: { colors: '#888', fontSize: '10px' } }
            }, yaxisOpts),
            tooltip: Object.assign({
                theme: 'dark',
                style: { fontSize: '12px' }
            }, tooltipOpts),
            legend: Object.assign({
                labels: { colors: '#888' }
            }, legendOpts),
            dataLabels: Object.assign({
                enabled: false
            }, dataLabelsOpts)
        };

        Object.keys(rest).forEach(function(k) {
            base[k] = rest[k];
        });

        return base;
    }

    // --- Chart rendering with registry ---
    function renderChart(selector, options, scopeData) {
        var el = document.querySelector(selector);
        if (!el) return null;

        // Destroy existing chart if re-rendering
        if (chartInstances[selector]) {
            chartInstances[selector].destroy();
        }

        var chart = new ApexCharts(el, options);
        chart.render();
        chartInstances[selector] = chart;

        if (scopeData) {
            chartDataMap[selector] = scopeData;
        }

        return chart;
    }

    // --- Scope toggle system ---
    function initScopeToggle() {
        var buttons = document.querySelectorAll('.dd-scope-btn');

        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var scope = btn.dataset.scope;
                if (scope === currentScope) return;

                currentScope = scope;

                // Update button states
                buttons.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');

                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('dd:scopeChange', {
                    detail: { scope: scope, countries: scopeCountries[scope] || scopeCountries.all }
                }));
            });
        });
    }

    // --- Per-chart series toggle ---
    function initSeriesToggle(chartSelector, toggleContainerSelector) {
        var container = document.querySelector(toggleContainerSelector);
        if (!container) return;

        var buttons = container.querySelectorAll('.dd-series-btn');

        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var seriesName = btn.dataset.series;
                var chart = chartInstances[chartSelector];
                if (!chart) return;

                btn.classList.toggle('active');

                if (btn.classList.contains('active')) {
                    chart.showSeries(seriesName);
                } else {
                    chart.hideSeries(seriesName);
                }
            });
        });
    }

    // --- Reveal animations ---
    function initRevealAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance
        gsap.to('.dd-hero__content', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });

        // Sections
        document.querySelectorAll('.dd-section').forEach(function(section) {
            gsap.to(section, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    once: true
                }
            });
        });

        // Chart cards stagger within each section
        document.querySelectorAll('.dd-chart-grid').forEach(function(grid) {
            var cards = grid.querySelectorAll('.dd-chart-card');
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 85%',
                    once: true
                }
            });
        });

        // KPI grids
        document.querySelectorAll('.dd-kpi-grid').forEach(function(grid) {
            var cards = grid.querySelectorAll('.dd-kpi-card');
            gsap.fromTo(cards,
                { opacity: 0, y: 20, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        });
    }

    // --- KPI counter animation ---
    function initKPICounters() {
        document.querySelectorAll('.dd-kpi-card').forEach(function(card) {
            var valueEl = card.querySelector('.dd-kpi-card__value');
            if (!valueEl) return;

            var rawValue = parseFloat(card.dataset.value) || 0;
            var suffix = card.dataset.suffix || '';
            var decimals = parseInt(card.dataset.decimals) || 0;

            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                once: true,
                onEnter: function() {
                    gsap.to({ val: 0 }, {
                        val: rawValue,
                        duration: 1.5,
                        ease: 'power2.out',
                        onUpdate: function() {
                            var current = this.targets()[0].val;
                            var display;
                            if (decimals > 0) {
                                display = current.toFixed(decimals);
                            } else if (Math.abs(rawValue) >= 100) {
                                display = Math.round(current).toLocaleString();
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

    // --- Update charts on scope change ---
    function onScopeChange(callback) {
        document.addEventListener('dd:scopeChange', function(e) {
            callback(e.detail.scope, e.detail.countries);
        });
    }

    // --- Helper: filter series by scope ---
    function filterSeriesByScope(allSeries, scope) {
        var countries = scopeCountries[scope] || scopeCountries.all;
        return allSeries.filter(function(s) {
            return countries.indexOf(s.countryCode) !== -1;
        });
    }

    // --- Initialize page ---
    function initDiveDeep(pageConfig) {
        config = pageConfig || {};

        // Set accent color CSS variable
        if (config.accentColor) {
            document.documentElement.style.setProperty('--chapter-accent', config.accentColor);
        }

        // Set accent RGB for gradient backgrounds
        if (config.accentRgb) {
            document.documentElement.style.setProperty('--accent-rgb', config.accentRgb);
        }

        gsap.registerPlugin(ScrollTrigger);

        initScopeToggle();
        initRevealAnimations();
        initKPICounters();
    }

    // --- Public API ---
    return {
        initDiveDeep: initDiveDeep,
        getBaseChartConfig: getBaseChartConfig,
        renderChart: renderChart,
        initScopeToggle: initScopeToggle,
        initSeriesToggle: initSeriesToggle,
        initRevealAnimations: initRevealAnimations,
        initKPICounters: initKPICounters,
        onScopeChange: onScopeChange,
        filterSeriesByScope: filterSeriesByScope,
        countryColors: countryColors,
        countryNames: countryNames,
        scopeCountries: scopeCountries,
        charts: chartInstances,
        getScope: function() { return currentScope; }
    };

})();
