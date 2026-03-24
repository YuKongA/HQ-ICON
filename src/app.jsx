import { Component } from "react";
import Result from "./result.jsx";
import FilterGroup from "./FilterGroup.jsx";
import { searchApp } from "./searchApp.jsx";
import { getUrlArgs } from "./url.jsx";
import "./app.css";

const getSystemLang = () =>
  navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";

const isAndroid = /android/i.test(navigator.userAgent);

const TRANSLATIONS = {
  zh: {
    title: "HQ ICON",
    description: "从 App Store 获取高清应用图标",
    searchPlaceholder: "搜索应用...",
    filterToggle: "筛选条件",
    queryType: "查询类型",
    queryCount: "查询数量",
    region: "国家地区",
    cutMode: "裁切方式",
    cutCorner: "普通圆角",
    officialCorner: "官方圆角",
    originalImage: "原始图像",
    imageFormat: "图像格式",
    imageSize: "图像尺寸",
    langToggle: "切换语言",
    themeLight: "浅色",
    themeDark: "深色",
    themeSystem: "系统",
    noResults: "无查询结果",
    proxyWarning: "如果开启了代理，请关闭后重试，反之亦然",
    androidWarning: "检测到当前是 Android 设备，可使用",
    androidAppLink: "App 版本",
  },
  en: {
    title: "HQ ICON",
    description: "High-quality App Store icon downloader",
    searchPlaceholder: "Search for apps...",
    filterToggle: "Filter Options",
    queryType: "Platform",
    queryCount: "Results",
    region: "Region",
    cutMode: "Style",
    cutCorner: "Normal Rounded",
    officialCorner: "Official",
    originalImage: "Original",
    imageFormat: "Format",
    imageSize: "Size",
    langToggle: "Language",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "Auto",
    noResults: "No results",
    proxyWarning: "If you have a proxy enabled, please disable it and try again, or vice versa",
    androidWarning: "Android device detected. You can use the",
    androidAppLink: "App version",
  },
};

const ENTITY_MAPS = [
  { key: "entity", value: "software", text: "iOS" },
  { key: "entity", value: "iPadSoftware", text: "iPadOS" },
  { key: "entity", value: "desktopSoftware", text: "macOS" },
];
const COUNTRY_MAPS = [
  { key: "country", value: "cn", text: "CN" },
  { key: "country", value: "us", text: "US" },
  { key: "country", value: "jp", text: "JP" },
  { key: "country", value: "kr", text: "KR" },
  { key: "country", value: "tw", text: "TW" },
  { key: "country", value: "hk", text: "HK" },
  { key: "country", value: "sg", text: "SG" },
  { key: "country", value: "gb", text: "GB" },
  { key: "country", value: "fr", text: "FR" },
  { key: "country", value: "de", text: "DE" },
  { key: "country", value: "it", text: "IT" },
  { key: "country", value: "es", text: "ES" },
  { key: "country", value: "ru", text: "RU" },
  { key: "country", value: "in", text: "IN" },
  { key: "country", value: "th", text: "TH" },
  { key: "country", value: "id", text: "ID" },
  { key: "country", value: "ph", text: "PH" },
  { key: "country", value: "vn", text: "VN" },
  { key: "country", value: "tr", text: "TR" },
  { key: "country", value: "ca", text: "CA" },
  { key: "country", value: "au", text: "AU" },
  { key: "country", value: "br", text: "BR" },
  { key: "country", value: "mx", text: "MX" },
  { key: "country", value: "my", text: "MY" },
];
const FORMAT_MAPS = [
  { key: "format", value: "jpeg", text: "JPEG" },
  { key: "format", value: "png", text: "PNG" },
  { key: "format", value: "webp", text: "WebP" },
];
const RESOLUTION_MAPS = [
  { key: "resolution", value: "256", text: "256px" },
  { key: "resolution", value: "512", text: "512px" },
  { key: "resolution", value: "1024", text: "1024px" },
];
const LIMIT_MAPS = [
  { key: "limit", value: "6", text: "6" },
  { key: "limit", value: "18", text: "18" },
  { key: "limit", value: "30", text: "30" },
  { key: "limit", value: "48", text: "48" },
];

const getCutMaps = (t) => [
  { key: "cut", value: "2", text: t.officialCorner },
  { key: "cut", value: "1", text: t.cutCorner },
  { key: "cut", value: "0", text: t.originalImage },
];

class App extends Component {
  constructor(props) {
    super(props);
    const systemLang = getSystemLang();
    const theme = localStorage.getItem("theme") || "system";
    const language = localStorage.getItem("language") || "system";
    const currentLang = language === "system" ? systemLang : language;

    this.state = {
      name: getUrlArgs("name") || "",
      country: getUrlArgs("country") || "cn",
      entity: getUrlArgs("entity") || "software",
      limit: getUrlArgs("limit") || "18",
      cut:
        getUrlArgs("entity") === "desktopSoftware"
          ? "0"
          : getUrlArgs("cut") || "2",
      resolution: getUrlArgs("resolution") || "512",
      format: getUrlArgs("format") || "png",
      mobileCut:
        getUrlArgs("entity") === "desktopSoftware"
          ? "2"
          : getUrlArgs("cut") || "2",
      results: [],
      isSearching: false,
      hasSearched: !!getUrlArgs("name"),
      isFiltersVisible: false,
      theme,
      language,
      currentLang,
      isControlsVisible: false,
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
    this.darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.darkModeMediaQuery.addEventListener(
      "change",
      this.handleSystemThemeChange,
    );

    if (this.state.name) {
      this.search();
    }
  }

  componentWillUnmount() {
    this.darkModeMediaQuery?.removeEventListener(
      "change",
      this.handleSystemThemeChange,
    );
    document.removeEventListener("mousemove", this.handleDocumentMouseMove);
    document.removeEventListener("mouseup", this.handleDocumentMouseUp);
  }

  applyTheme = (theme) => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light",
      );
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  handleSystemThemeChange = () => {
    this.applyTheme(this.state.theme);
  };

  handleSystemLanguageChange = () => {
    const { language } = this.state;
    this.setState({
      currentLang: language === "system" ? getSystemLang() : language,
    });
  };

  toggleTheme = (newTheme) => {
    this.setState({ theme: newTheme }, () => {
      localStorage.setItem("theme", newTheme);
      this.applyTheme(newTheme);
    });
  };

  handleFilterChange = (option, callback) => {
    this.setState({ [option.key]: option.value }, callback);
  };

  toggleLanguage = (newLang) => {
    this.setState(
      {
        language: newLang,
        currentLang: newLang === "system" ? getSystemLang() : newLang,
      },
      () => {
        localStorage.setItem("language", newLang);
      },
    );
  };

  toggleFilters() {
    this.setState((prevState) => ({
      isFiltersVisible: !prevState.isFiltersVisible,
    }));
  }

  toggleControls = () => {
    this.setState((prevState) => ({
      isControlsVisible: !prevState.isControlsVisible,
    }));
  };

  async search() {
    const { name, country, entity, limit, cut, resolution, format } =
      this.state;
    const trimmedName = name.trim();
    if (!trimmedName) {
      this.setState({ results: [], hasSearched: false });
      const cleanUrl = window.location.href.split("?")[0];
      history.replaceState(null, null, cleanUrl);
      return;
    }

    this.setState({ isSearching: true });
    try {
      const data = await searchApp(trimmedName, country, entity, limit);
      const limitedResults = data.results.slice(0, parseInt(limit, 10));
      this.setState({
        results: limitedResults,
        isSearching: false,
        hasSearched: true,
      });

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("name", trimmedName);
      currentUrl.searchParams.set("country", country);
      currentUrl.searchParams.set("entity", entity);
      currentUrl.searchParams.set("limit", limit);
      currentUrl.searchParams.set("cut", cut);
      currentUrl.searchParams.set("resolution", resolution);
      currentUrl.searchParams.set("format", format);
      history.replaceState(null, null, currentUrl.toString());
    } catch (err) {
      console.error("Error:", err);
      this.setState({ results: [], isSearching: false, hasSearched: true });
    }
  }

  handleFilterOptionsMouseDown = (event) => {
    const el = event.currentTarget;
    this.draggedElement = el;
    this.isDragging = true;
    this.startX = event.pageX - el.offsetLeft;
    this.scrollLeftStart = el.scrollLeft;
    el.classList.add("grabbing");

    document.addEventListener("mousemove", this.handleDocumentMouseMove);
    document.addEventListener("mouseup", this.handleDocumentMouseUp);
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
      this.draggedElement.classList.remove("grabbing");
    }
    this.draggedElement = null;

    document.removeEventListener("mousemove", this.handleDocumentMouseMove);
    document.removeEventListener("mouseup", this.handleDocumentMouseUp);
  };

  render() {
    const {
      name,
      cut,
      resolution,
      format,
      results,
      isSearching,
      hasSearched,
      isFiltersVisible,
      theme,
      language,
      currentLang,
      isControlsVisible,
    } = this.state;

    const t =
      TRANSLATIONS[language === "system" ? currentLang : language] ||
      TRANSLATIONS.en;

    const cutMaps = getCutMaps(t);
    const disabledCutValues =
      this.state.entity === "desktopSoftware" ? ["1", "2"] : [];

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
                <div
                  className={`header-controls ${isControlsVisible ? "show" : ""}`}
                >
                  <div className="lang-toggle">
                    <span
                      className="toggle-slider"
                      style={{
                        "--active-index":
                          language === "zh" ? 0 : language === "system" ? 1 : 2,
                      }}
                    />
                    <button
                      className={`theme-btn ${language === "zh" ? "active" : ""}`}
                      onClick={() => this.toggleLanguage("zh")}
                    >
                      中文
                    </button>
                    <button
                      className={`theme-btn ${language === "system" ? "active" : ""}`}
                      onClick={() => this.toggleLanguage("system")}
                    >
                      {t.themeSystem}
                    </button>
                    <button
                      className={`theme-btn ${language === "en" ? "active" : ""}`}
                      onClick={() => this.toggleLanguage("en")}
                    >
                      EN
                    </button>
                  </div>
                  <div className="theme-toggle">
                    <span
                      className="toggle-slider"
                      style={{
                        "--active-index":
                          theme === "light" ? 0 : theme === "system" ? 1 : 2,
                      }}
                    />
                    <button
                      className={`theme-btn ${theme === "light" ? "active" : ""}`}
                      onClick={() => this.toggleTheme("light")}
                    >
                      {t.themeLight}
                    </button>
                    <button
                      className={`theme-btn ${theme === "system" ? "active" : ""}`}
                      onClick={() => this.toggleTheme("system")}
                    >
                      {t.themeSystem}
                    </button>
                    <button
                      className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                      onClick={() => this.toggleTheme("dark")}
                    >
                      {t.themeDark}
                    </button>
                  </div>
                  <button
                    className={`expand-controls ${isControlsVisible ? "active" : ""}`}
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
                    onKeyDown={(e) =>
                      e.key === "Enter" ? this.search() : null
                    }
                  />
                  <button className="search-button" onClick={this.search}>
                    <div className="search-icon" />
                  </button>
                </div>
              </div>
            </div>
            <div className="filters-container">
              <button
                className={`filters-toggle ${isFiltersVisible ? "active" : ""}`}
                onClick={this.toggleFilters}
              >
                {t.filterToggle}
              </button>
              <div className={`filters ${isFiltersVisible ? "show" : ""}`}>
                <div className="filters-inner">
                  <FilterGroup
                    title={t.queryType}
                    options={ENTITY_MAPS}
                    currentValue={this.state.entity}
                    onChange={(option) => {
                      const newState = { entity: option.value };
                      if (option.value === "desktopSoftware") {
                        newState.cut = "0";
                      } else if (this.state.entity === "desktopSoftware") {
                        newState.cut = this.state.mobileCut;
                      }
                      this.setState(newState, this.search);
                    }}
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.queryCount}
                    options={LIMIT_MAPS}
                    currentValue={this.state.limit}
                    onChange={(option) =>
                      this.handleFilterChange(option, this.search)
                    }
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.region}
                    options={COUNTRY_MAPS}
                    currentValue={this.state.country}
                    onChange={(option) =>
                      this.handleFilterChange(option, this.search)
                    }
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.cutMode}
                    options={cutMaps}
                    currentValue={this.state.cut}
                    onChange={(option) => {
                      const newState = { cut: option.value };
                      if (this.state.entity !== "desktopSoftware") {
                        newState.mobileCut = option.value;
                      }
                      this.setState(newState);
                    }}
                    disabledValues={disabledCutValues}
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.imageFormat}
                    options={FORMAT_MAPS}
                    currentValue={this.state.format}
                    onChange={(option) => this.handleFilterChange(option)}
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                  <FilterGroup
                    title={t.imageSize}
                    options={RESOLUTION_MAPS}
                    currentValue={this.state.resolution}
                    onChange={(option) => this.handleFilterChange(option)}
                    onMouseDown={this.handleFilterOptionsMouseDown}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="results">
          {isSearching ? (
            Array.from({ length: parseInt(this.state.limit, 10) }, (_, i) => (
              <div className="result skeleton" key={i}>
                <div className="icon-wrapper" />
                <div className="info">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-artist" />
                  <div className="skeleton-line skeleton-platform" />
                </div>
              </div>
            ))
          ) : results.length > 0 ? (
            results.map((result) => (
              <Result
                key={result.trackId}
                data={result}
                cut={cut}
                resolution={resolution}
                format={format}
              />
            ))
          ) : hasSearched ? (
            <div className="no-results">
              <div>{t.noResults}</div>
              <div className="proxy-warning">{t.proxyWarning}</div>
              {isAndroid && (
                <div className="android-warning">
                  {t.androidWarning}
                  <a
                    href="https://github.com/YuKongA/HQ-ICON_Compose/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.androidAppLink}
                  </a>
                </div>
              )}
            </div>
          ) : null}
        </main>
        <footer>
          <div className="center">
            <div className="footer-content">
              <div className="copyright">
                Copyright © 2024 - 2026{" "}
                <a href="https://github.com/YuKongA">YuKongA</a>
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
