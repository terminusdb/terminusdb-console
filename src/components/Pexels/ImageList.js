import './ImageList.css';
import React, { useState } from 'react';
import ImageCard from './ImageCard'

const ImageList = (props) => {
    const list = props.images || [];
    const setImageUrl = props.setImageUrl;
    const images = list.map((image) => {
        return <ImageCard key={image.id} image={image} setImageUrl={setImageUrl}/>;
    })
    return <div className="image-list">{images}</div>;
}

export default ImageList;
