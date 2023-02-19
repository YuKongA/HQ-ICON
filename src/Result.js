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
        const { data, resolution, cut } = this.props;
        const base64 = await drawOutline(data, resolution, cut);
        this.setState({ base64 });
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.resolution !== this.props.resolution) {
            const { data, resolution, cut } = nextProps;
            const base64 = await drawOutline(data, resolution, cut);
            this.setState({ base64 });
        }
        if (nextProps.cut !== this.props.cut) {
            const { data, resolution, cut } = nextProps;
            const base64 = await drawOutline(data, resolution, cut);
            this.setState({ base64 });
        }
    }

    render() {
        const { data, resolution, cut } = this.props;
        const { trackName, kind } = data;
        const { base64 } = this.state;
        const platform = kind.startsWith('mac') ? 'Mac' : 'iOS';
        return (
            <div className="result">
                <a href={base64} download={`${trackName}-${platform}-${resolution}x${resolution}x${cut}.png`}>
                    <img className="icon" src={base64} alt={trackName} />
                </a>
                <div className="kind">{platform}</div>
                {trackName}
            </div>
        );
    }
}

Result.propTypes = { data: PropTypes.object.isRequired };

export default Result;
