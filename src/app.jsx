import React, { Component } from 'react';
import Result from './result.jsx';
import { searchApp } from './searchApp.jsx';
import { getUrlArgs, changeUrlArgs } from './url.jsx';
import './app.css';

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
            cut: getUrlArgs('cut') || '1',
            resolution: getUrlArgs('resolution') || '512',
            format: getUrlArgs('format') || 'png',
            results: [],
            isFiltersVisible: false,
            theme,
            language,
            currentLang,
        };

        this.search = this.search.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);

        this.applyTheme(theme);
    }

    componentDidMount() {
        this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.darkModeMediaQuery.addEventListener('change', this.handleSystemThemeChange);

        if (this.state.name) {
            this.search();
        }
    }

    componentWillUnmount() {
        this.darkModeMediaQuery?.removeEventListener('change', this.handleSystemThemeChange);
    }

    applyTheme = (theme) => {
        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    handleSystemThemeChange = (e) => {
        if (this.state.theme === 'system') {
            const isDark = e?.matches ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
    }

    handleSystemLanguageChange = () => {
        if (this.state.language === 'system') {
            const systemLang = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
            this.setState({ currentLang: systemLang });
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

    async search() {
        const { name, country, entity, limit } = this.state;
        const trimmedName = name.trim();
        if (!trimmedName) {
            this.setState({ results: [] });
            const cleanUrl = window.location.href.split('?')[0];
            history.replaceState(null, null, cleanUrl);
            return;
        }

        try {
            const data = await searchApp(trimmedName, country, entity, limit);
            const limitedResults = data.results.slice(0, parseInt(limit));
            this.setState({ results: limitedResults });

            const params = ['name', 'country', 'entity', 'limit', 'cut', 'resolution', 'format'];
            const newUrl = params.reduce((url, param) => 
                changeUrlArgs(url, param, this.state[param]), 
                window.location.href
            );
            history.replaceState(null, null, newUrl);
        } catch (err) {
            console.error('Error:', err);    
            this.setState({ results: [] });
        }
    }

    render() {
        const { name, cut, resolution, format, results, isFiltersVisible, theme, language, currentLang } = this.state;
        
        const translations = {
            zh: {
                title: 'HQ ICON',
                description: '从 App Store 获取高清应用图标',
                searchPlaceholder: '搜索应用...',
                filterToggle: '筛选条件',
                queryType: '查询类型',
                queryCount: '查询数量',
                region: '国家地区',
                cutMode: '裁切方式',
                cutCorner: '裁切圆角',
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
                cutCorner: 'Rounded',
                originalImage: 'Original',
                imageFormat: 'Format',
                imageSize: 'Size',
                langToggle: 'Language',
                themeLight: 'Light',
                themeDark: 'Dark',
                themeSystem: 'Auto'
            }
        };

        const t = translations[language === 'system' ? currentLang : language];

        const entityMaps = [
            { key: 'entity', value: 'software', text: 'iOS' },
            { key: 'entity', value: 'macSoftware', text: 'macOS' },
        ];
        const countryMaps = [
            { key: 'country', value: 'cn', text: 'CN' },
            { key: 'country', value: 'us', text: 'US' },
            { key: 'country', value: 'jp', text: 'JP' },
            { key: 'country', value: 'kr', text: 'KR' },
        ];
        const cutMaps = [
            { key: 'cut', value: '1', text: t.cutCorner },
            { key: 'cut', value: '0', text: t.originalImage },
        ];
        const formatMaps = [
            { key: 'format', value: 'jpeg', text: 'JPEG' },
            { key: 'format', value: 'png', text: 'PNG' },
            { key: 'format', value: 'webp', text: 'WebP' },
        ];
        const resolutionMaps = [
            { key: 'resolution', value: '256', text: '256px' },
            { key: 'resolution', value: '512', text: '512px' },
            { key: 'resolution', value: '1024', text: '1024px' },
        ];
        const limitMaps = [
            { key: 'limit', value: '18', text: '18' },
            { key: 'limit', value: '24', text: '24' },
            { key: 'limit', value: '30', text: '30' },
        ];

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
                                <div className="header-controls">
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
                                </div>
                                <div className="search">
                                    <input
                                        className="search-input"
                                        placeholder={t.searchPlaceholder}
                                        value={name}
                                        onChange={(e) => this.setState({ name: e.target.value.trim() })}
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
                                    <div className="filter-options">
                                        {entityMaps.map(option => (
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
                                    <div className="filter-group-title">{t.queryCount}</div>
                                    <div className="filter-options">
                                        {limitMaps.map(option => (
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
                                    <div className="filter-group-title">{t.region}</div>
                                    <div className="filter-options">
                                        {countryMaps.map(option => (
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
                                    <div className="filter-group-title">{t.cutMode}</div>
                                    <div className="filter-options">
                                        {cutMaps.map(option => (
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
                                    <div className="filter-group-title">{t.imageFormat}</div>
                                    <div className="filter-options">
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
                                    <div className="filter-options">
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
