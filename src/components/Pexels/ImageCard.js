import React from 'react';

class ImageCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { spans: 0 };
        this.imageRef = React.createRef();
    }

    componentDidMount() {
        this.imageRef.current.addEventListener('load', this.setSpans);
    }

    setSpans = () => {
        const height = this.imageRef.current.clientHeight;
        const spans = Math.ceil(height / 10 + 1);
        this.setState({ spans });
    }

    render() {
        const {photographer, src} = this.props.image;

        return (
            <div style={{ cursor:'pointer', gridRowEnd: `span ${this.state.spans}`}} className="pexel-img-container">
                <img className="pexel-image"
                    ref={this.imageRef}
                    alt={photographer}
                    src={src.medium}
                    onClick={() => this.props.setImageUrl({pexelImage: this.imageRef.current.currentSrc, imageUrl: false, iconImage: false})}
                />
            </div>
        );
    }
}

export default ImageCard;
