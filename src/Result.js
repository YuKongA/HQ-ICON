import React, { Component } from 'react';
import PropTypes from 'prop-types';
import drawOutline from './drawOutline';
import './Result.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = { base64: '' };
    }

    async componentDidMount() {
        const { data, cut } = this.props;
        const base64 = await drawOutline(data, cut);
        this.setState({ base64 });
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.cut !== this.props.cut) {
            const { data, cut } = nextProps;
            const base64 = await drawOutline(data, cut);
            this.setState({ base64 });
        }
    }

    render() {
        const { data } = this.props;
        const { trackName, kind, primaryGenreName, artistName, trackViewUrl, artistViewUrl } = data;
        const { base64 } = this.state;
        const platform = kind.startsWith('mac') ? 'Mac' : 'iOS';
        return (
            <div className="result">
                <a href={base64} download={`${trackName}-${platform}-512x512.png`}><img className="icon" src={base64} alt={trackName} /></a>
                <div className="icon-trackName"><a className="icon-info" href={trackViewUrl}>{trackName}</a></div>
                <div className="icon-artistName"><a className="icon-info" href={artistViewUrl}>{artistName}</a></div>
                <div className="icon-platform">{platform} - {primaryGenreName}</div>
            </div>
        );
    }
}

Result.propTypes = { data: PropTypes.object.isRequired };

export default Result;
