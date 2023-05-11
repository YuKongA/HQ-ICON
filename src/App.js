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
        if (getUrlArgs('c') != "") { var c = getUrlArgs('c') } else var c = 'CN';
        if (getUrlArgs('l') != "") { var l = getUrlArgs('l') } else var l = 10;
        if (getUrlArgs('r') != "") { var r = getUrlArgs('r') } else var r = '1';
        this.state = {
            input: getUrlArgs('n'),
            results: [],
            country: c,
            limit: l,
            cut: r,
        };
        this.search = this.search.bind(this);
        if (getUrlArgs('n') != null) this.search();
    }

    async search() {
        let { input, country, limit, cut } = this.state;
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
                    searchIosApp(input, country, limit),
                    searchMacApp(input, country, limit),
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
        const { input, results, country, limit, cut } = this.state;
        if (input != '') {
            history.replaceState(null, null, changeUrlArgs('n', input));
            history.replaceState(null, null, changeUrlArgs('c', country));
            history.replaceState(null, null, changeUrlArgs('r', cut));
            history.replaceState(null, null, changeUrlArgs('l', limit));
        }
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
                            <label onClick={() => this.setState({ cut: '1' })} >
                                <input name="cut" type="checkbox" checked={cut === '1'} />
                                裁切圆角矩形
                            </label>
                            <label onClick={() => this.setState({ cut: '0' })} >
                                <input name="cut" type="checkbox" checked={cut === '0'} />
                                应用原始图像
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

function getUrlArgs(string) {
    var reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
        context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

function changeUrlArgs(arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    var url = window.location.href;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
}