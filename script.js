// ===== Skills Radar Chart - Apple Style =====
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('skillsChart');

    if (ctx) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Python',
                    'SQL',
                    'Data Visualization',
                    'Excel/Analytics',
                    'Web Development',
                    'Design Tools'
                ],
                datasets: [{
                    label: 'Nivel Actual',
                    data: [70, 65, 75, 85, 80, 85],
                    fill: true,
                    backgroundColor: 'rgba(0, 113, 227, 0.15)',
                    borderColor: 'rgba(94, 176, 255, 1)',
                    pointBackgroundColor: 'rgba(0, 113, 227, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 113, 227, 1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: 'Objetivo 2026',
                    data: [90, 85, 90, 90, 85, 85],
                    fill: true,
                    backgroundColor: 'rgba(52, 199, 89, 0.08)',
                    borderColor: 'rgba(52, 199, 89, 0.5)',
                    pointBackgroundColor: 'rgba(52, 199, 89, 0.5)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(52, 199, 89, 1)',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.15)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                                size: 11,
                                family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                                weight: '500'
                            }
                        },
                        ticks: {
                            display: false,
                            stepSize: 20
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            font: {
                                size: 12,
                                family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                                weight: '400'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1d1d1f',
                        bodyColor: '#86868b',
                        borderColor: 'rgba(0, 0, 0, 0.08)',
                        borderWidth: 1,
                        padding: 14,
                        cornerRadius: 12,
                        displayColors: true,
                        titleFont: {
                            family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                            weight: '600',
                            size: 13
                        },
                        bodyFont: {
                            family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                            weight: '400',
                            size: 12
                        },
                        callbacks: {
                            label: function(context) {
                                return ' ' + context.dataset.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false
                }
            }
        });
    }

    // ===== Intersection Observer for Animations =====
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    // Progress bars animation
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-fill');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.width = bar.style.getPropertyValue('--width');
                    }, index * 100);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsSection = document.querySelector('.skills-bars');
    if (skillsSection) {
        progressObserver.observe(skillsSection.parentElement);
    }

    // ===== Timeline Items Animation =====
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.1}s`;
        timelineObserver.observe(item);
    });

    // ===== Smooth hover effects for cards =====
    const cards = document.querySelectorAll('.project-card, .card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
        });
    });

    // ===== Header scroll effect =====
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // ===== Smooth scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== Tags hover effect =====
    const tags = document.querySelectorAll('.tag, .project-tags span');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ===== Dynamic year in footer =====
    const footerYear = document.querySelector('.footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
    }

    // ===== Console signature =====
    console.log(
        '%cHola! %c\n\nGracias por explorar mi portfolio.',
        'font-size: 20px; font-weight: 600; color: #0071e3;',
        'font-size: 12px; color: #86868b;'
    );
    console.log(
        '%cContacto: germinalbarrena@gmail.com',
        'font-size: 11px; color: #34c759;'
    );

    // ===== Interactive Dashboards =====
    initializeDashboards();
});

// ===== Dashboard Manager =====
function initializeDashboards() {
    // Initialize all dashboards
    initializeDashboard('birth', initializeBirthCharts);
    initializeDashboard('education', initializeEducationCharts);
    initializeDashboard('adolescence', initializeAdolescenceCharts);
}

function initializeDashboard(dashboardId, chartInitFunction) {
    const clickableData = document.querySelector(`[data-dashboard="${dashboardId}"]`);
    const dashboardContainer = document.getElementById(`${dashboardId}-dashboard`);
    const closeButton = dashboardContainer?.querySelector('.dashboard-close');

    if (!clickableData || !dashboardContainer) return;

    let chartsInitialized = false;

    // Click handler
    clickableData.addEventListener('click', function() {
        toggleDashboard();
    });

    // Keyboard accessibility
    clickableData.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDashboard();
        }
    });

    // Close button handler
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            closeDashboard();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dashboardContainer.classList.contains('expanded')) {
            closeDashboard();
        }
    });

    function toggleDashboard() {
        const isExpanded = dashboardContainer.classList.contains('expanded');

        if (isExpanded) {
            closeDashboard();
        } else {
            openDashboard();
        }
    }

    function openDashboard() {
        // Close any other open dashboards first
        document.querySelectorAll('.dashboard-container.expanded').forEach(container => {
            if (container.id !== `${dashboardId}-dashboard`) {
                container.classList.remove('expanded');
                container.setAttribute('aria-hidden', 'true');
                const relatedClickable = document.querySelector(`[aria-controls="${container.id}"]`);
                if (relatedClickable) {
                    relatedClickable.classList.remove('active');
                    relatedClickable.setAttribute('aria-expanded', 'false');
                }
            }
        });

        clickableData.classList.add('active');
        clickableData.setAttribute('aria-expanded', 'true');
        dashboardContainer.classList.add('expanded');
        dashboardContainer.setAttribute('aria-hidden', 'false');

        // Initialize charts only once
        if (!chartsInitialized && chartInitFunction) {
            setTimeout(() => {
                chartInitFunction();
                chartsInitialized = true;
            }, 300);
        }

        // Smooth scroll to show the dashboard
        setTimeout(() => {
            dashboardContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }

    function closeDashboard() {
        clickableData.classList.remove('active');
        clickableData.setAttribute('aria-expanded', 'false');
        dashboardContainer.classList.remove('expanded');
        dashboardContainer.setAttribute('aria-hidden', 'true');
    }
}

// ===== Birth Dashboard Charts =====
function initializeBirthCharts() {
    initializeApexCharts();
}

// ===== ApexCharts Configuration =====
function initializeApexCharts() {
    // Population Evolution Chart
    const populationChartOptions = {
        series: [{
            name: 'Poblacion (millones)',
            data: [33.8, 35.5, 37.4, 38.4, 39.0, 39.4, 40.5, 43.4, 46.6, 46.4, 47.4, 48.2]
        }],
        chart: {
            type: 'area',
            height: 250,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        colors: ['#0071e3'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            categories: ['1970', '1975', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2024'],
            labels: {
                style: {
                    colors: '#86868b',
                    fontSize: '11px',
                    fontWeight: 500
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            min: 30,
            max: 50,
            labels: {
                style: {
                    colors: '#86868b',
                    fontSize: '11px',
                    fontWeight: 500
                },
                formatter: function(val) {
                    return val.toFixed(0) + 'M';
                }
            }
        },
        grid: {
            borderColor: 'rgba(0, 0, 0, 0.06)',
            strokeDashArray: 4
        },
        markers: {
            size: 0,
            hover: {
                size: 6
            }
        },
        tooltip: {
            theme: 'light',
            style: {
                fontSize: '12px'
            },
            y: {
                formatter: function(val) {
                    return val + ' millones';
                }
            }
        },
        annotations: {
            xaxis: [{
                x: '1980',
                borderColor: '#af52de',
                strokeDashArray: 4,
                label: {
                    borderColor: '#af52de',
                    style: {
                        color: '#fff',
                        background: '#af52de',
                        fontSize: '10px',
                        fontWeight: 600
                    },
                    text: '1978'
                }
            }]
        }
    };

    const populationChart = new ApexCharts(
        document.querySelector('#population-chart'),
        populationChartOptions
    );
    populationChart.render();

    // Price Comparison Chart
    const pricesChartOptions = {
        series: [{
            name: 'Factor de incremento (x veces)',
            data: [7.9, 35.6, 5.6, 12.0, 15.8, 28.3]
        }],
        chart: {
            type: 'bar',
            height: 250,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                barHeight: '60%',
                distributed: true
            }
        },
        colors: ['#0071e3', '#34c759', '#af52de', '#ff9500', '#ff3b30', '#5856d6'],
        xaxis: {
            categories: ['Gasolina', 'Pan', 'Leche', 'Cafe', 'Cine', 'Alquiler'],
            labels: {
                style: {
                    colors: '#86868b',
                    fontSize: '11px',
                    fontWeight: 500
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#1d1d1f',
                    fontSize: '12px',
                    fontWeight: 500
                }
            }
        },
        grid: {
            borderColor: 'rgba(0, 0, 0, 0.06)',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: false
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return 'x' + val.toFixed(1);
            },
            style: {
                fontSize: '11px',
                fontWeight: 600,
                colors: ['#fff']
            },
            offsetX: -10
        },
        legend: {
            show: false
        },
        tooltip: {
            theme: 'light',
            style: {
                fontSize: '12px'
            },
            y: {
                formatter: function(val) {
                    return 'x' + val + ' veces mas caro';
                }
            }
        }
    };

    const pricesChart = new ApexCharts(
        document.querySelector('#prices-chart'),
        pricesChartOptions
    );
    pricesChart.render();
}

// ===== Education Dashboard Charts =====
function initializeEducationCharts() {
    // Students Evolution Chart
    const studentsChartOptions = {
        series: [
            {
                name: 'EGB',
                data: [5.6, 5.65, 5.7, 5.75, 5.78, 5.8, 5.75, 5.68, 5.6, 5.5]
            },
            {
                name: 'BUP/COU',
                data: [1.1, 1.15, 1.2, 1.28, 1.35, 1.4, 1.48, 1.52, 1.55, 1.58]
            },
            {
                name: 'FP',
                data: [0.65, 0.68, 0.71, 0.75, 0.78, 0.8, 0.82, 0.85, 0.87, 0.88]
            }
        ],
        chart: {
            type: 'area',
            height: 250,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            stacked: true,
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        colors: ['#0071e3', '#af52de', '#ff9500'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            categories: ['1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992'],
            labels: {
                style: {
                    colors: '#86868b',
                    fontSize: '11px',
                    fontWeight: 500
                }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#86868b',
                    fontSize: '11px',
                    fontWeight: 500
                },
                formatter: function(val) {
                    return val.toFixed(1) + 'M';
                }
            }
        },
        grid: {
            borderColor: 'rgba(0, 0, 0, 0.06)',
            strokeDashArray: 4
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            labels: {
                colors: '#86868b'
            },
            markers: {
                radius: 12
            }
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function(val) {
                    return val + ' millones de alumnos';
                }
            }
        }
    };

    const studentsChart = new ApexCharts(
        document.querySelector('#students-chart'),
        studentsChartOptions
    );
    studentsChart.render();

    // Dropout Rate Chart
    const dropoutChartOptions = {
        series: [
            {
                name: 'Espana',
                data: [42, 40, 38, 36, 34, 33]
            },
            {
                name: 'Media Europa',
                data: [25, 24, 23, 22, 21, 20]
            }
        ],
        chart: {
            type: 'line',
            height: 250,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        colors: ['#ff3b30', '#34c759'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 5,
            hover: {
                size: 7
            }
        },
        xaxis: {
            categories: ['1983', '1985', '1987', '1989', '1991', '1992'],
            labels: {
                style: {
                    colors: '#86868b',
                    fontSize: '11px',
                    fontWeight: 500
                }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            min: 15,
            max: 45,
            labels: {
                style: {
                    colors: '#86868b',
                    fontSize: '11px',
                    fontWeight: 500
                },
                formatter: function(val) {
                    return val + '%';
                }
            }
        },
        grid: {
            borderColor: 'rgba(0, 0, 0, 0.06)',
            strokeDashArray: 4
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            labels: {
                colors: '#86868b'
            },
            markers: {
                radius: 12
            }
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function(val) {
                    return val + '% abandono escolar';
                }
            }
        },
        annotations: {
            yaxis: [{
                y: 20,
                borderColor: '#34c759',
                strokeDashArray: 4,
                label: {
                    borderColor: '#34c759',
                    style: {
                        color: '#fff',
                        background: '#34c759',
                        fontSize: '9px'
                    },
                    text: 'Objetivo UE'
                }
            }]
        }
    };

    const dropoutChart = new ApexCharts(
        document.querySelector('#dropout-chart'),
        dropoutChartOptions
    );
    dropoutChart.render();
}

// ===== Adolescence Dashboard Charts =====
function initializeAdolescenceCharts() {
    const chartColors = {
        male: '#0071e3',
        female: '#ff6b6b',
        danger: '#ff3b30',
        warning: '#ff9500',
        purple: '#af52de',
        green: '#34c759'
    };

    // Alcohol consumption chart
    const alcoholChartOptions = {
        series: [
            { name: 'Hombres', data: [58, 60, 62, 63, 65, 67] },
            { name: 'Mujeres', data: [46, 48, 49, 50, 52, 54] }
        ],
        chart: {
            type: 'line',
            height: 220,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: { show: false }
        },
        colors: [chartColors.male, chartColors.female],
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 4 },
        xaxis: {
            categories: ['1992', '1993', '1994', '1995', '1996', '1997'],
            labels: { style: { colors: '#86868b', fontSize: '10px' } }
        },
        yaxis: {
            min: 40, max: 70,
            labels: {
                style: { colors: '#86868b', fontSize: '10px' },
                formatter: val => val + '%'
            }
        },
        grid: { borderColor: 'rgba(0,0,0,0.06)', strokeDashArray: 4 },
        legend: { show: false },
        tooltip: { theme: 'light', y: { formatter: val => val + '%' } }
    };
    new ApexCharts(document.querySelector('#alcohol-chart'), alcoholChartOptions).render();

    // Cannabis chart
    const cannabisChartOptions = {
        series: [
            { name: 'Hombres', data: [16, 18, 20, 22, 25, 28] },
            { name: 'Mujeres', data: [8, 10, 12, 14, 16, 17] }
        ],
        chart: {
            type: 'area',
            height: 220,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: { show: false }
        },
        colors: [chartColors.male, chartColors.female],
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 }
        },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ['1992', '1993', '1994', '1995', '1996', '1997'],
            labels: { style: { colors: '#86868b', fontSize: '10px' } }
        },
        yaxis: {
            min: 0, max: 35,
            labels: {
                style: { colors: '#86868b', fontSize: '10px' },
                formatter: val => val + '%'
            }
        },
        grid: { borderColor: 'rgba(0,0,0,0.06)', strokeDashArray: 4 },
        legend: { show: false },
        tooltip: { theme: 'light', y: { formatter: val => val + '%' } }
    };
    new ApexCharts(document.querySelector('#cannabis-chart'), cannabisChartOptions).render();

    // Hard drugs chart (heroin vs cocaine)
    const hardDrugsChartOptions = {
        series: [
            { name: 'Heroina', data: [0.8, 0.7, 0.6, 0.5, 0.4, 0.3] },
            { name: 'Cocaina', data: [1.8, 2.0, 2.2, 2.5, 2.8, 3.2] }
        ],
        chart: {
            type: 'line',
            height: 200,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: { show: false }
        },
        colors: [chartColors.danger, chartColors.warning],
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 5 },
        xaxis: {
            categories: ['1992', '1993', '1994', '1995', '1996', '1997'],
            labels: { style: { colors: '#86868b', fontSize: '10px' } }
        },
        yaxis: {
            min: 0, max: 4,
            labels: {
                style: { colors: '#86868b', fontSize: '10px' },
                formatter: val => val.toFixed(1) + '%'
            }
        },
        grid: { borderColor: 'rgba(0,0,0,0.06)', strokeDashArray: 4 },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            labels: { colors: '#86868b' }
        },
        tooltip: { theme: 'light', y: { formatter: val => val + '% consumo anual' } },
        annotations: {
            points: [{
                x: '1992',
                y: 0.8,
                marker: { size: 6, fillColor: '#ff3b30', strokeColor: '#fff' },
                label: {
                    text: 'Pico heroina',
                    style: { background: '#ff3b30', color: '#fff', fontSize: '9px' }
                }
            }]
        }
    };
    new ApexCharts(document.querySelector('#hard-drugs-chart'), hardDrugsChartOptions).render();

    // HIV cases chart
    const hivCasesChartOptions = {
        series: [{
            name: 'Nuevos casos SIDA',
            data: [7254, 7330, 7053, 6492, 5542, 4455]
        }],
        chart: {
            type: 'bar',
            height: 220,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: { show: false }
        },
        colors: [chartColors.danger],
        plotOptions: {
            bar: { borderRadius: 6, columnWidth: '60%' }
        },
        xaxis: {
            categories: ['1992', '1993', '1994', '1995', '1996', '1997'],
            labels: { style: { colors: '#86868b', fontSize: '10px' } }
        },
        yaxis: {
            labels: {
                style: { colors: '#86868b', fontSize: '10px' },
                formatter: val => (val/1000).toFixed(1) + 'K'
            }
        },
        grid: { borderColor: 'rgba(0,0,0,0.06)', strokeDashArray: 4 },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light', y: { formatter: val => val.toLocaleString() + ' casos' } },
        annotations: {
            xaxis: [{
                x: '1996',
                borderColor: chartColors.green,
                strokeDashArray: 0,
                label: {
                    text: 'Antiretrovirales',
                    style: { background: chartColors.green, color: '#fff', fontSize: '9px' }
                }
            }]
        }
    };
    new ApexCharts(document.querySelector('#hiv-cases-chart'), hivCasesChartOptions).render();

    // AIDS deaths by sex chart
    const aidsDeathsChartOptions = {
        series: [
            { name: 'Hombres', data: [3190, 3856, 4294, 4806, 4134, 2294] },
            { name: 'Mujeres', data: [562, 680, 758, 848, 729, 405] }
        ],
        chart: {
            type: 'area',
            height: 220,
            stacked: true,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: { show: false }
        },
        colors: [chartColors.male, chartColors.female],
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.2 }
        },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: ['1992', '1993', '1994', '1995', '1996', '1997'],
            labels: { style: { colors: '#86868b', fontSize: '10px' } }
        },
        yaxis: {
            labels: {
                style: { colors: '#86868b', fontSize: '10px' },
                formatter: val => (val/1000).toFixed(1) + 'K'
            }
        },
        grid: { borderColor: 'rgba(0,0,0,0.06)', strokeDashArray: 4 },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            labels: { colors: '#86868b' }
        },
        tooltip: { theme: 'light', y: { formatter: val => val.toLocaleString() + ' muertes' } }
    };
    new ApexCharts(document.querySelector('#aids-deaths-chart'), aidsDeathsChartOptions).render();

    // Mortality causes chart (donut)
    const mortalityCausesChartOptions = {
        series: [39, 14, 16, 9, 22],
        chart: {
            type: 'donut',
            height: 250,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif'
        },
        labels: ['Trafico', 'Drogas', 'SIDA', 'Suicidio', 'Otras'],
        colors: [chartColors.warning, chartColors.danger, '#af52de', '#5856d6', '#86868b'],
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: () => '4.450'
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(0) + '%',
            style: { fontSize: '11px', fontWeight: 600 }
        },
        legend: {
            position: 'bottom',
            labels: { colors: '#86868b' }
        },
        tooltip: {
            y: { formatter: val => val + '% de muertes juveniles' }
        }
    };
    new ApexCharts(document.querySelector('#mortality-causes-chart'), mortalityCausesChartOptions).render();

    // Mortality by sex evolution
    const mortalitySexChartOptions = {
        series: [
            { name: 'Hombres', data: [120, 112, 98] },
            { name: 'Mujeres', data: [34, 32, 28] }
        ],
        chart: {
            type: 'bar',
            height: 250,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif',
            toolbar: { show: false }
        },
        colors: [chartColors.male, chartColors.female],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
                borderRadius: 6
            }
        },
        xaxis: {
            categories: ['1992', '1994', '1996'],
            labels: { style: { colors: '#86868b', fontSize: '11px' } }
        },
        yaxis: {
            title: { text: 'Muertes por 100.000', style: { color: '#86868b', fontSize: '10px' } },
            labels: { style: { colors: '#86868b', fontSize: '10px' } }
        },
        grid: { borderColor: 'rgba(0,0,0,0.06)', strokeDashArray: 4 },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            labels: { colors: '#86868b' }
        },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light', y: { formatter: val => val + ' por 100.000' } }
    };
    new ApexCharts(document.querySelector('#mortality-sex-chart'), mortalitySexChartOptions).render();
}