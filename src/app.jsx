import { React, Component } from 'react';
import Result from './result.jsx';
import { searchApp } from './searchApp.jsx';
import { getUrlArgs, changeUrlArgs } from './url.jsx';
import './app.css';

class App extends Component {
    constructor(props) {
        super(props);
        if (getUrlArgs('country') != "") { var a = getUrlArgs('country') } else var a = 'cn';
        if (getUrlArgs('entity') != "") { var b = getUrlArgs('entity') } else var b = 'software';
        if (getUrlArgs('limit') != "") { var c = getUrlArgs('limit') } else var c = '10';
        if (getUrlArgs('cut') != "") { var d = getUrlArgs('cut') } else var d = '1';
        if (getUrlArgs('resolution') != "") { var e = getUrlArgs('resolution') } else var e = '512';
        if (getUrlArgs('format') != "") { var f = getUrlArgs('format') } else var f = 'png';
        this.state = {
            name: getUrlArgs('name'),
            country: a,
            entity: b,
            limit: c,
            cut: d,
            resolution: e,
            format: f,
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
            var url = window.location.href;
            var newUrl = changeUrlArgs(url, 'name', name);
            newUrl = changeUrlArgs(newUrl, 'country', country);
            newUrl = changeUrlArgs(newUrl, 'entity', entity);
            newUrl = changeUrlArgs(newUrl, 'limit', limit);
            newUrl = changeUrlArgs(newUrl, 'cut', cut);
            newUrl = changeUrlArgs(newUrl, 'resolution', resolution);
            newUrl = changeUrlArgs(newUrl, 'format', format);
            history.replaceState(null, null, newUrl);
        } else {
            history.replaceState(null, null, window.location.origin);
        }
    }

    render() {
        const { name, country, entity, cut, resolution, format, results } = this.state;
        return (
            <div className="app">
                <header>
                    <div className="center">
                        <div className="logo">HQ ICON</div>
                        <div className="description">从 App Store 获取高清应用图标</div>
                        <div className="options">
                            <label onClick={() => this.setState({ entity: 'software' })} >
                                <input name="entity" type="checkbox" checked={entity === 'software'} />
                                iOS
                            </label>
                            <label onClick={() => this.setState({ entity: 'macSoftware' })} >
                                <input name="entity" type="checkbox" checked={entity === 'macSoftware'} />
                                macOS
                            </label>
                        </div>
                        <div className="options">
                            <label onClick={() => this.setState({ country: 'cn' })} >
                                <input name="store" type="checkbox" checked={country === 'cn'} />
                                中/CN
                            </label>
                            <label onClick={() => this.setState({ country: 'us' })} >
                                <input name="store" type="checkbox" checked={country === 'us'} />
                                美/US
                            </label>
                            <label onClick={() => this.setState({ country: 'jp' })} >
                                <input name="store" type="checkbox" checked={country === 'jp'} />
                                日/JP
                            </label>
                            <label onClick={() => this.setState({ country: 'kr' })} >
                                <input name="store" type="checkbox" checked={country === 'kr'} />
                                韩/KR
                            </label>
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
                            <label onClick={() => this.setState({ cut: '1' })} >
                                <input name="cut" type="checkbox" checked={cut === '1'} />
                                裁切圆角
                            </label>
                            <label onClick={() => this.setState({ cut: '0' })} >
                                <input name="cut" type="checkbox" checked={cut === '0'} />
                                原始图像
                            </label>
                        </div>
                        <div className="options">
                            <label onClick={() => this.setState({ format: 'jpg' })} >
                                <input name="format" type="checkbox" checked={format === 'jpg'} />
                                JPG
                            </label>
                            <label onClick={() => this.setState({ format: 'png' })} >
                                <input name="format" type="checkbox" checked={format === 'png'} />
                                PNG
                            </label>
                            <label onClick={() => this.setState({ format: 'webp' })} >
                                <input name="format" type="checkbox" checked={format === 'webp'} />
                                WEBP
                            </label>
                        </div>
                        <div className="options">
                            <label onClick={() => this.setState({ resolution: '256' })} >
                                <input name="resolution" type="checkbox" checked={resolution === '256'} />
                                256px
                            </label>
                            <label onClick={() => this.setState({ resolution: '512' })} >
                                <input name="resolution" type="checkbox" checked={resolution === '512'} />
                                512px
                            </label>
                            <label onClick={() => this.setState({ resolution: '1024' })} >
                                <input name="resolution" type="checkbox" checked={resolution === '1024'} />
                                1024px
                            </label>
                        </div><br />
                    </div>
                </header>
                <main className="results">
                    {results.map((result) => (<Result key={result.trackId} data={result} cut={cut} resolution={resolution} format={format} />))}
                </main>
                <footer className="footer">Copyrights © 2023 - <a className="footer-msg" href='https://github.com/YuKongA'>YuKongA</a></footer>
            </div>
        );
    }
}

export default App
