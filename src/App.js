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
            input: '',
            results: [],
            country: 'CN',
            resolution: 1024,
            cut: 'Rounded',
        };
        this.search = this.search.bind(this);
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
        const { input, results, country, resolution, cut } = this.state;
        return (
            <div className="app">
                <header>
                    <div className="center">
                        <div className="logo">HQ ICON</div>
                        <div className="description">从 App Store 获取高清应用图标</div>
                        <div className="description">Get high quality icons from App Store</div>
                        <div className="options">
                            <lable onClick={() => this.setState({ country: 'CN' })} >
                                <input name="store" type="radio" checked={country === 'CN'} />
                                中国 / CN
                            </lable>
                            <lable onClick={() => this.setState({ country: 'US' })} >
                                <input name="store" type="radio" checked={country === 'US'} />
                                美国 / US
                            </lable>
                            <lable onClick={() => this.setState({ country: 'JP' })} >
                                <input name="store" type="radio" checked={country === 'JP'} />
                                日本 / JP
                            </lable>
                        </div>
                        <div className="options">
                            <lable onClick={() => this.setState({ resolution: 1024 })} >
                                <input name="resolution" type="radio" checked={resolution === 1024} />
                                1024x1024
                            </lable>
                            <lable onClick={() => this.setState({ resolution: 512 })} >
                                <input name="resolution" type="radio" checked={resolution === 512} />
                                512x512
                            </lable>
                        </div>
                        <div className="options">
                            <lable onClick={() => this.setState({ cut: 'Rounded' })} >
                                <input name="cut" type="radio" checked={cut === 'Rounded'} />
                                圆角矩形 / Rounded rectangle
                            </lable>
                            <lable onClick={() => this.setState({ cut: 'Original' })} >
                                <input name="cut" type="radio" checked={cut === 'Original'} />
                                原图 / Original image
                            </lable>
                        </div>
                        <div className="search">
                            <input
                                className="search-input"
                                placeholder="iTunes 链接或应用名称 / iTunes url or App name"
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
                            resolution={resolution}
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
