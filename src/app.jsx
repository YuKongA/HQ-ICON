import React, { Component } from 'react';
import Result from './result.jsx';
import { searchApp } from './searchApp.jsx';
import { getUrlArgs } from './url.jsx';
import './app.css';

const TRANSLATIONS = {
    zh: {
        title: 'HQ ICON',
        description: '从 App Store 获取高清应用图标',
        searchPlaceholder: '搜索应用...',
        filterToggle: '筛选条件',
        queryType: '查询类型',
        queryCount: '查询数量',
        region: '国家地区',
        cutMode: '裁切方式',
        cutCorner: '普通圆角',
        officialCorner: '官方圆角',
        originalImage: '原始图像',
        imageFormat: '图像格式',
        imageSize: '图像尺寸',
        langToggle: '切换语言',
        themeLight: '浅色',
        themeDark: '深色',
        themeSystem: '系统'
    },
    en: {
        title: 'HQ ICON',
        description: 'High-quality App Store icon downloader',
        searchPlaceholder: 'Search for apps...',
        filterToggle: 'Filter Options',
        queryType: 'Platform',
        queryCount: 'Results',
        region: 'Region',
        cutMode: 'Style',
        cutCorner: 'Normal Rounded',
        officialCorner: 'Official',
        originalImage: 'Original',
        imageFormat: 'Format',
        imageSize: 'Size',
        langToggle: 'Language',
        themeLight: 'Light',
        themeDark: 'Dark',
        themeSystem: 'Auto'
    }
};

const ENTITY_MAPS = [
    { key: 'entity', value: 'software', text: 'iOS' },
    { key: 'entity', value: 'iPadSoftware', text: 'iPadOS' },
    { key: 'entity', value: 'desktopSoftware', text: 'macOS' },
];
const COUNTRY_MAPS = [
    { key: 'country', value: 'cn', text: 'CN' },
    { key: 'country', value: 'us', text: 'US' },
    { key: 'country', value: 'jp', text: 'JP' },
    { key: 'country', value: 'kr', text: 'KR' },
    { key: 'country', value: 'tw', text: 'TW' },
    { key: 'country', value: 'hk', text: 'HK' },
    { key: 'country', value: 'sg', text: 'SG' },
    { key: 'country', value: 'gb', text: 'GB' },
    { key: 'country', value: 'fr', text: 'FR' },
    { key: 'country', value: 'de', text: 'DE' },
    { key: 'country', value: 'it', text: 'IT' },
    { key: 'country', value: 'es', text: 'ES' },
    { key: 'country', value: 'ru', text: 'RU' },
    { key: 'country', value: 'in', text: 'IN' },
    { key: 'country', value: 'th', text: 'TH' },
    { key: 'country', value: 'id', text: 'ID' },
    { key: 'country', value: 'ph', text: 'PH' },
    { key: 'country', value: 'vn', text: 'VN' },
    { key: 'country', value: 'tr', text: 'TR' },
    { key: 'country', value: 'ca', text: 'CA' },
    { key: 'country', value: 'au', text: 'AU' },
    { key: 'country', value: 'br', text: 'BR' },
    { key: 'country', value: 'mx', text: 'MX' },
    { key: 'country', value: 'my', text: 'MY' },
];
const FORMAT_MAPS = [
    { key: 'format', value: 'jpeg', text: 'JPEG' },
    { key: 'format', value: 'png', text: 'PNG' },
    { key: 'format', value: 'webp', text: 'WebP' },
];
const RESOLUTION_MAPS = [
    { key: 'resolution', value: '256', text: '256px' },
    { key: 'resolution', value: '512', text: '512px' },
    { key: 'resolution', value: '1024', text: '1024px' },
];
const LIMIT_MAPS = [
    { key: 'limit', value: '6', text: '6' },
    { key: 'limit', value: '18', text: '18' },
    { key: 'limit', value: '30', text: '30' },
    { key: 'limit', value: '48', text: '48' },
];

const getCutMaps = (t) => [
    { key: 'cut', value: '2', text: t.officialCorner },
    { key: 'cut', value: '1', text: t.cutCorner },
    { key: 'cut', value: '0', text: t.originalImage },
];


class App extends Component {
    constructor(props) {
        super(props);
        const systemLang = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
        const theme = localStorage.getItem('theme') || 'system';
        const language = localStorage.getItem('language') || 'system';
        const currentLang = language === 'system' ? systemLang : language;

        this.state = {
            name: getUrlArgs('name') || '',
            country: getUrlArgs('country') || 'cn',
            entity: getUrlArgs('entity') || 'software',
            limit: getUrlArgs('limit') || '18',
            cut: (getUrlArgs('entity') === 'desktopSoftware') ? '0' : (getUrlArgs('cut') || '2'),
            resolution: getUrlArgs('resolution') || '512',
            format: getUrlArgs('format') || 'png',
            results: [],
            isFiltersVisible: false,
            theme,
            language,
            currentLang,
            isControlsVisible: false
        };

        this.search = this.search.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);

        this.draggedElement = null;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeftStart = 0;

        this.applyTheme(theme);
    }

    componentDidMount() {
        this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.darkModeMediaQuery.addEventListener('change', this.handleSystemThemeChange);

        this.loadSettings();
        if (this.state.name) {
            this.search();
        }
    }

    componentWillUnmount() {
        this.darkModeMediaQuery?.removeEventListener('change', this.handleSystemThemeChange);
        document.removeEventListener('mousemove', this.handleDocumentMouseMove);
        document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    }

    loadSettings() {
        const savedTheme = localStorage.getItem('theme') || 'system';
        const savedLanguage = localStorage.getItem('language') || 'system';

        this.setState({
            theme: savedTheme,
            language: savedLanguage
        }, () => {
            this.applyTheme(this.state.theme);
            this.handleSystemLanguageChange();
        });
    }

    applyTheme = (theme) => {
        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('theme', theme);
    }

    handleSystemThemeChange = (e) => {
        if (this.state.theme === 'system') {
            const isDark = e?.matches ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
    }

    handleSystemLanguageChange = () => {
        const { language } = this.state;
        if (language === 'system') {
            const systemLang = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
            this.setState({ currentLang: systemLang });
        } else {
            this.setState({ currentLang: language });
        }
    }

    toggleTheme = (newTheme) => {
        this.setState({ theme: newTheme }, () => {
            localStorage.setItem('theme', newTheme);
            this.applyTheme(newTheme);
        });
    }

    toggleLanguage = (newLang) => {
        this.setState({
            language: newLang,
            currentLang: newLang === 'system'
                ? (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en')
                : newLang
        }, () => {
            localStorage.setItem('language', newLang);
        });
    }

    toggleFilters() {
        this.setState(prevState => ({
            isFiltersVisible: !prevState.isFiltersVisible
        }));
    }

    toggleControls = () => {
        this.setState(prevState => ({
            isControlsVisible: !prevState.isControlsVisible
        }));
    }

    async search() {
        const { name, country, entity, limit, cut, resolution, format } = this.state;
        const trimmedName = name.trim();
        if (!trimmedName) {
            this.setState({ results: [] });
            const cleanUrl = window.location.href.split('?')[0];
            history.replaceState(null, null, cleanUrl);
            return;
        }

        try {
            const data = await searchApp(trimmedName, country, entity, limit);
            const limitedResults = data.results.slice(0, parseInt(limit, 10));
            this.setState({ results: limitedResults });

            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('name', trimmedName);
            currentUrl.searchParams.set('country', country);
            currentUrl.searchParams.set('entity', entity);
            currentUrl.searchParams.set('limit', limit);
            currentUrl.searchParams.set('cut', cut);
            currentUrl.searchParams.set('resolution', resolution);
            currentUrl.searchParams.set('format', format);
            history.replaceState(null, null, currentUrl.toString());
        } catch (err) {
            console.error('Error:', err);
            this.setState({ results: [] });
        }
    }

    handleFilterOptionsMouseDown = (event) => {
        const el = event.currentTarget;
        this.draggedElement = el;
        this.isDragging = true;
        this.startX = event.pageX - el.offsetLeft;
        this.scrollLeftStart = el.scrollLeft;
        el.classList.add('grabbing');

        document.addEventListener('mousemove', this.handleDocumentMouseMove);
        document.addEventListener('mouseup', this.handleDocumentMouseUp);
        event.preventDefault();
    };

    handleDocumentMouseMove = (event) => {
        if (!this.isDragging || !this.draggedElement) return;
        event.preventDefault();
        const x = event.pageX - this.draggedElement.offsetLeft;
        const walk = (x - this.startX) * 1.5;
        this.draggedElement.scrollLeft = this.scrollLeftStart - walk;
    };

    handleDocumentMouseUp = () => {
        if (!this.isDragging) return;
        this.isDragging = false;
        if (this.draggedElement) {
            this.draggedElement.classList.remove('grabbing');
        }
        this.draggedElement = null;

        document.removeEventListener('mousemove', this.handleDocumentMouseMove);
        document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    };

    render() {
        const { name, cut, resolution, format, results, isFiltersVisible, theme, language, currentLang, isControlsVisible } = this.state;

        const t = TRANSLATIONS[language === 'system' ? currentLang : language] || TRANSLATIONS.en;

        const cutMaps = getCutMaps(t);
        const entityMaps = ENTITY_MAPS;
        const countryMaps = COUNTRY_MAPS;
        const formatMaps = FORMAT_MAPS;
        const resolutionMaps = RESOLUTION_MAPS;
        const limitMaps = LIMIT_MAPS;

        return (
            <div className="app">
                <header>
                    <div className="center">
                        <div className="header-content">
                            <div className="branding">
                                <div className="logo">{t.title}</div>
                                <div className="description">{t.description}</div>
                            </div>
                            <div className="header-right">
                                <div className={`header-controls ${isControlsVisible ? 'show' : ''}`}>
                                    <div className="lang-toggle">
                                        <button
                                            className={`theme-btn ${language === 'zh' ? 'active' : ''}`}
                                            onClick={() => this.toggleLanguage('zh')}
                                        >
                                            中文
                                        </button>
                                        <button
                                            className={`theme-btn ${language === 'system' ? 'active' : ''}`}
                                            onClick={() => this.toggleLanguage('system')}
                                        >
                                            {t.themeSystem}
                                        </button>
                                        <button
                                            className={`theme-btn ${language === 'en' ? 'active' : ''}`}
                                            onClick={() => this.toggleLanguage('en')}
                                        >
                                            EN
                                        </button>
                                    </div>
                                    <div className="theme-toggle">
                                        <button
                                            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                            onClick={() => this.toggleTheme('light')}
                                        >
                                            {t.themeLight}
                                        </button>
                                        <button
                                            className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                                            onClick={() => this.toggleTheme('system')}
                                        >
                                            {t.themeSystem}
                                        </button>
                                        <button
                                            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                            onClick={() => this.toggleTheme('dark')}
                                        >
                                            {t.themeDark}
                                        </button>
                                    </div>
                                    <button
                                        className={`expand-controls ${isControlsVisible ? 'active' : ''}`}
                                        onClick={this.toggleControls}
                                        aria-label="Toggle controls"
                                    />
                                </div>
                                <div className="search">
                                    <input
                                        className="search-input"
                                        placeholder={t.searchPlaceholder}
                                        value={name}
                                        onChange={(e) => this.setState({ name: e.target.value })}
                                        onKeyDown={(e) => e.key === 'Enter' ? this.search() : null}
                                    />
                                    <button className="search-button" onClick={this.search}>
                                        <div className="search-icon" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="filters-container">
                            <button
                                className={`filters-toggle ${isFiltersVisible ? 'active' : ''}`}
                                onClick={this.toggleFilters}
                            >
                                {t.filterToggle}
                            </button>
                            <div className={`filters ${isFiltersVisible ? 'show' : ''}`}>
                                <div className="filter-group">
                                    <div className="filter-group-title">{t.queryType}</div>
                                    <div className="filter-options" onMouseDown={this.handleFilterOptionsMouseDown}>
                                        {entityMaps.map(option => (
                                            <React.Fragment key={option.value}>
                                                <input
                                                    type="checkbox"
                                                    id={`${option.key}-${option.value}`}
                                                    checked={this.state[option.key] === option.value}
                                                    onChange={() => {
                                                        const newState = { [option.key]: option.value };
                                                        if (option.value === 'desktopSoftware') {
                                                            newState.cut = '0';
                                                        } else if (this.state.entity === 'desktopSoftware') {
                                                            newState.cut = this.state.mobileCut;
                                                        }
                                                        this.setState(newState, this.search);
                                                    }}
                                                />
                                                <label htmlFor={`${option.key}-${option.value}`}>
                                                    {option.text}
                                                </label>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <div className="filter-group-title">{t.queryCount}</div>
                                    <div className="filter-options" onMouseDown={this.handleFilterOptionsMouseDown}>
                                        {limitMaps.map(option => (
                                            <React.Fragment key={option.value}>
                                                <input
                                                    type="checkbox"
                                                    id={`${option.key}-${option.value}`}
                                                    checked={this.state[option.key] === option.value}
                                                    onChange={() => this.setState({ [option.key]: option.value }, this.search)}
                                                />
                                                <label htmlFor={`${option.key}-${option.value}`}>
                                                    {option.text}
                                                </label>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <div className="filter-group-title">{t.region}</div>
                                    <div className="filter-options" onMouseDown={this.handleFilterOptionsMouseDown}>
                                        {countryMaps.map(option => (
                                            <React.Fragment key={option.value}>
                                                <input
                                                    type="checkbox"
                                                    id={`${option.key}-${option.value}`}
                                                    checked={this.state[option.key] === option.value}
                                                    onChange={() => this.setState({ [option.key]: option.value }, this.search)}
                                                />
                                                <label htmlFor={`${option.key}-${option.value}`}>
                                                    {option.text}
                                                </label>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <div className="filter-group-title">{t.cutMode}</div>
                                    <div className="filter-options" onMouseDown={this.handleFilterOptionsMouseDown}>
                                        {cutMaps.map(option => (
                                            <React.Fragment key={option.value}>
                                                <input
                                                    type="checkbox"
                                                    id={`${option.key}-${option.value}`}
                                                    checked={this.state[option.key] === option.value}
                                                    onChange={() => {
                                                        const newState = { [option.key]: option.value };
                                                        if (this.state.entity !== 'desktopSoftware') {
                                                            newState.mobileCut = option.value;
                                                        }
                                                        this.setState(newState);
                                                    }}
                                                    disabled={this.state.entity === 'desktopSoftware' && option.value !== '0'}
                                                />
                                                <label htmlFor={`${option.key}-${option.value}`}>
                                                    {option.text}
                                                </label>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <div className="filter-group-title">{t.imageFormat}</div>
                                    <div className="filter-options" onMouseDown={this.handleFilterOptionsMouseDown}>
                                        {formatMaps.map(option => (
                                            <React.Fragment key={option.value}>
                                                <input
                                                    type="checkbox"
                                                    id={`${option.key}-${option.value}`}
                                                    checked={this.state[option.key] === option.value}
                                                    onChange={() => this.setState({ [option.key]: option.value })}
                                                />
                                                <label htmlFor={`${option.key}-${option.value}`}>
                                                    {option.text}
                                                </label>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <div className="filter-group-title">{t.imageSize}</div>
                                    <div className="filter-options" onMouseDown={this.handleFilterOptionsMouseDown}>
                                        {resolutionMaps.map(option => (
                                            <React.Fragment key={option.value}>
                                                <input
                                                    type="checkbox"
                                                    id={`${option.key}-${option.value}`}
                                                    checked={this.state[option.key] === option.value}
                                                    onChange={() => this.setState({ [option.key]: option.value })}
                                                />
                                                <label htmlFor={`${option.key}-${option.value}`}>
                                                    {option.text}
                                                </label>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="results">
                    {results.map((result) => (
                        <Result
                            key={result.trackId}
                            data={result}
                            cut={cut}
                            resolution={resolution}
                            format={format}
                        />
                    ))}
                </main>
                <footer>
                    <div className="center">
                        <div className="footer-content">
                            <div className="copyright">
                                Copyright © 2024 - <a href='https://github.com/YuKongA'>YuKongA</a>
                            </div>
                            <a
                                href="https://github.com/YuKongA/HQ-ICON"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="github-link"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default App;
