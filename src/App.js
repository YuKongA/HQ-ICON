import React, { Component } from 'react';
import Result from './Result';
import {
    expandShortLink,
    searchAppById,
    searchIosApp,
    searchMacApp,
} from './iTunes';
import search from './search.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: getUrlString(''),
            results: [],
            country: 'CN',
            cut: 'Rounded',
        };
        this.search = this.search.bind(this);
        if (getUrlString('') != '') this.search()
    }

    async search() {
        let { input, country } = this.state;
        input = input.trim();
        let url = input;
        const itunesReg = /^(http|https):\/\/itunes/;
        const idReg = /\/id(\d+)/i;
        const shortReg = /^(http|https):\/\/appsto/;
        try {
            if (shortReg.test(input)) {
                url = await expandShortLink(input);
            }
            if (itunesReg.test(url) && idReg.test(url)) {
                const id = idReg.exec(url)[1];
                const data = await searchAppById(id, country);
                this.setState({ results: data.results });
            } else {
                const data = await Promise.all([
                    searchIosApp(input, country),
                    searchMacApp(input, country),
                ]);
                this.setState({
                    results: data[0].results.concat(data[1].results),
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const { input, results, country, cut } = this.state;
        return (
            <div className="app">
                <header>
                    <div className="center">
                        <div className="logo">HQ ICON</div>
                        <div className="description">从 App Store 获取高清应用图标</div>
                        <div className="options">
                            <label onClick={() => this.setState({ country: 'CN' })} >
                                <input name="store" type="checkbox" checked={country === 'CN'} />
                                中/CN
                            </label>
                            <label onClick={() => this.setState({ country: 'US' })} >
                                <input name="store" type="checkbox" checked={country === 'US'} />
                                美/US
                            </label>
                            <label onClick={() => this.setState({ country: 'JP' })} >
                                <input name="store" type="checkbox" checked={country === 'JP'} />
                                日/JP
                            </label>
                            <label onClick={() => this.setState({ country: 'KR' })} >
                                <input name="store" type="checkbox" checked={country === 'KR'} />
                                韩/KR
                            </label>
                        </div>
                        <div className="options">
                            <label onClick={() => this.setState({ cut: 'Rounded' })} >
                                <input name="cut" type="checkbox" checked={cut === 'Rounded'} />
                                裁切圆角
                            </label>
                            <label onClick={() => this.setState({ cut: 'Original' })} >
                                <input name="cut" type="checkbox" checked={cut === 'Original'} />
                                原始图像
                            </label>
                        </div>
                        <div className="search">
                            <input
                                className="search-input"
                                placeholder="iTunes 链接或应用名称"
                                value={input}
                                onChange={(e) => this.setState({ input: e.target.value })}
                                onKeyDown={(e) => e.keyCode === 13 ? this.search() : ''}
                            />
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
                            cut={cut}
                        />
                    ))}
                </main>
                <footer className="footer">Copyrights © 2023 - YuKongA</footer>
            </div>
        );
    }
}

export default App;

function getUrlString(string) {
    var reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}
