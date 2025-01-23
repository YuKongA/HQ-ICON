import React, { Component } from 'react';
import PropTypes from 'prop-types';
import drawOutline from './drawOutline.jsx';
import './result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = { base64: '', loading: true };
    }

    async componentDidMount() {
        await this.updateBase64();
    }

    async componentDidUpdate(prevProps) {
        if (
            prevProps.cut !== this.props.cut ||
            prevProps.resolution !== this.props.resolution ||
            prevProps.format !== this.props.format
        ) {
            await this.updateBase64();
        }
    }

    async updateBase64() {
        const { data, cut, resolution, format } = this.props;
        const base64 = await drawOutline(data, cut, resolution, format);
        this.setState({ base64, loading: false });
    }

    render() {
        const { data } = this.props;
        const { trackName, kind, primaryGenreName, artistName, trackViewUrl, artistViewUrl } = data;
        const { base64, loading } = this.state;
        const platform = kind.startsWith('mac') ? 'macOS' : 'iOS';

        return (
            <div className="result">
                <a href={base64} download={`${trackName}-${platform}-${this.props.resolution}x${this.props.resolution}.${this.props.format}`}>
                    <div className="icon-wrapper">
                        <img className={`icon ${loading ? 'icon-null' : ''}`} src={loading ? '' : base64} alt={loading ? '' : trackName} />
                    </div>
                </a>
                <div className="info">
                    <a className="icon-info" href={trackViewUrl}>
                        <div className="icon-trackName">{trackName}</div>
                    </a>
                    <a className="icon-info" href={artistViewUrl}>
                        <div className="icon-artistName">{artistName}</div>
                    </a>
                    <div className="icon-platform">{platform} - {primaryGenreName}</div>
                </div>
            </div>
        );
    }
}

Result.propTypes = {
    data: PropTypes.object.isRequired,
    cut: PropTypes.string.isRequired,
    resolution: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired
};

export default Result;
