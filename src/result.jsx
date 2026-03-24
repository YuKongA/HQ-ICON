import { Component } from "react";
import drawOutline from "./drawOutline.jsx";
import "./result.css";

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = { base64: "", loading: true, failed: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.data.trackId !== this.props.data.trackId ||
      nextProps.cut !== this.props.cut ||
      nextProps.resolution !== this.props.resolution ||
      nextProps.format !== this.props.format ||
      nextState.base64 !== this.state.base64 ||
      nextState.loading !== this.state.loading ||
      nextState.failed !== this.state.failed
    );
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
      this.setState({ loading: true, failed: false });
      await this.updateBase64();
    }
  }

  async updateBase64() {
    const { data, cut, resolution, format } = this.props;
    try {
      const base64 = await drawOutline(data, cut, resolution, format);
      this.setState({ base64, loading: false, failed: false });
    } catch {
      this.setState({ base64: "", loading: false, failed: true });
    }
  }

  render() {
    const { data } = this.props;
    const { trackName, kind, primaryGenreName, artistName } = data;
    const { base64, loading, failed } = this.state;
    const platform = kind.startsWith("mac") ? "macOS" : "iOS";
    const hasIcon = !loading && !failed && base64;

    const downloadName = hasIcon
      ? `${trackName}-${platform}-${this.props.resolution}x${this.props.resolution}.${this.props.format}`
      : undefined;

    return (
      <a
        className={`result ${loading ? "skeleton" : ""}`}
        href={hasIcon ? base64 : undefined}
        download={downloadName}
      >
        <div className="icon-wrapper">
          {hasIcon ? (
            <img className="icon" src={base64} alt={trackName} />
          ) : failed ? (
            <div className="icon-failed" />
          ) : null}
        </div>
        <div className="info">
          {loading ? (
            <>
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-artist" />
              <div className="skeleton-line skeleton-platform" />
            </>
          ) : (
            <>
              <div className="icon-trackName">{trackName}</div>
              <div className="icon-artistName">{artistName}</div>
              <div className="icon-platform">
                {platform} - {primaryGenreName}
              </div>
            </>
          )}
        </div>
      </a>
    );
  }
}

export default Result;
