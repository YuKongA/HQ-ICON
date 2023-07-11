import React, { Component } from 'react';
import Result from './Result';
import { searchApp } from './searchApp';
import { getUrlArgs, changeUrlArgs } from './Url.js';
import search from './search.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        if (getUrlArgs('country') != "") { var c = getUrlArgs('country') } else var c = 'cn';
        if (getUrlArgs('entity') != "") { var d = getUrlArgs('entity') } else var d = 'software';
        if (getUrlArgs('cut') != "") { var r = getUrlArgs('cut') } else var r = '1';
        if (getUrlArgs('limit') != "") { var l = getUrlArgs('limit') } else var l = 10;
        this.state = {
            name: getUrlArgs('name'),
            country: c,
            entity: d,
            limit: l,
            cut: r,
            results: [],
        };
        this.search = this.search.bind(this);
        if (getUrlArgs('name') != null) this.search();
    }

    async search() {
        let { name, country, entity, limit, cut } = this.state;
        name = name.trim();
        try {
            const data = await Promise.all([searchApp(name, country, entity, limit)]);
            this.setState({ results: data[0].results, doCut: cut });
        } catch (err) {
            console.error(err);
        }
        if (name != '') {
            history.replaceState(null, null, changeUrlArgs('name', name));
            history.replaceState(null, null, changeUrlArgs('country', country));
            history.replaceState(null, null, changeUrlArgs('entity', entity));
            history.replaceState(null, null, changeUrlArgs('limit', limit));
            history.replaceState(null, null, changeUrlArgs('cut', cut));
        } else {
            history.replaceState(null, null, window.location.origin);
        }
    }

    render() {
        const { name, country, entity, cut, results, doCut } = this.state;
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
                                MacOS
                            </label>
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
                                <img src={search} className="search-icon" alt="search" />
                            </div>
                        </div>
                    </div>
                </header>
                <main className="results">
                    {results.map((result) => (
                        <Result
                            key={result.trackId}
                            data={result}
                            cut={doCut}
                        />
                    ))}
                </main>
                <footer className="footer">Copyrights © 2023 - YuKongA</footer>
            </div>
        );
    }
}

export default App;
