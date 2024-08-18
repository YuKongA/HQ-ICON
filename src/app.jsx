import { React, Component } from 'react';
import Result from './result.jsx';
import { searchApp } from './searchApp.jsx';
import { getUrlArgs, changeUrlArgs } from './url.jsx';
import './app.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: getUrlArgs('name') || '',
            country: getUrlArgs('country') || 'cn',
            entity: getUrlArgs('entity') || 'software',
            limit: getUrlArgs('limit') || '12',
            cut: getUrlArgs('cut') || '1',
            resolution: getUrlArgs('resolution') || '512',
            format: getUrlArgs('format') || 'png',
            results: [],
        };
        this.search = this.search.bind(this);
        if (getUrlArgs('name') != null) this.search();
    }

    async search() {
        let { name, country, entity, limit, cut, resolution, format } = this.state;
        name = name.trim();
        try {
            const data = await Promise.all([searchApp(name, country, entity, limit)]);
            this.setState({ results: data[0].results, cut: cut, resolution: resolution, format: format });
        } catch (err) {
            console.error(err);
        }
        if (name != '') {
            const params = ['name', 'country', 'entity', 'limit', 'cut', 'resolution', 'format'];
            let newUrl = window.location.href;
            params.forEach(param => {
                newUrl = changeUrlArgs(newUrl, param, this.state[param]);
            });
            history.replaceState(null, null, newUrl);
        } else {
            history.replaceState(null, null, window.location.origin);
        }
    }

    renderOption(key, value, text) {
        return (
            <label onClick={() => this.setState({ [key]: value })} >
                <input name={key} type="checkbox" checked={this.state[key] === value} />
                {text}
            </label>
        );
    }

    render() {
        const { name, cut, resolution, format, results } = this.state;
        const entityMaps = [
            { key: 'entity', value: 'software', text: 'iOS' },
            { key: 'entity', value: 'macSoftware', text: 'macOS' },
        ];
        const countryMaps = [
            { key: 'country', value: 'cn', text: '中/CN' },
            { key: 'country', value: 'us', text: '美/US' },
            { key: 'country', value: 'jp', text: '日/JP' },
            { key: 'country', value: 'kr', text: '韩/KR' },
        ];
        const cutMaps = [
            { key: 'cut', value: '1', text: '裁切圆角' },
            { key: 'cut', value: '0', text: '原始图像' },
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
        return (
            <div className="app">
                <header>
                    <div className="center">
                        <div className="logo">HQ ICON</div>
                        <div className="description">从 App Store 获取高清应用图标</div>
                        <div className="options">
                            {entityMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div>
                        <div className="options">
                            {countryMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div>
                        <div className="search">
                            <input
                                className="search-input"
                                placeholder="应用名称"
                                value={name}
                                onChange={(e) => this.setState({ name: e.target.value.trim() })}
                                onKeyDown={(e) => e.key == 'Enter' ? this.search() : ''} />
                            <div className="search-button" onClick={this.search} >
                                <dev className="search-icon" />
                            </div>
                        </div>
                        <div className="options">
                            {cutMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div>
                        <div className="options">
                            {formatMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div>
                        <div className="options">
                            {resolutionMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div><br />
                    </div>
                </header>
                <main className="results">
                    {results.map((result) => (<Result key={result.trackId} data={result} cut={cut} resolution={resolution} format={format} />))}
                </main>
                <footer className="footer">Copyright © 2024 - <a className="footer-msg" href='https://github.com/YuKongA'>YuKongA</a></footer>
            </div>
        );
    }
}

export default App
