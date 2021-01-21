import React, {useState, useEffect} from 'react'
import initPexel from './initPexel';
import SearchBar from './SearchBar';
import ImageList from './ImageList';
import './SearchBar.css';
import {Row, Col} from "react-bootstrap" //replaced
import {FaArrowAltCircleRight, FaArrowAltCircleLeft} from "react-icons/fa"
import {AiOutlineSearch} from "react-icons/ai"


export const Pexels = (params) => {

    const [images, setImages] = useState(false);
    const [searchText, setSearchText] = useState(false);
    const setImageUrl = params.setDbImage;
    const [nextPage, setNextPage] = useState(false)
    const [previousPage, setPreviousPage] = useState(false)

    const getPhotos = (data) => {
        setNextPage(data.next_page)
        setPreviousPage(data.prev_page)
        setImages({photos: data.photos})
    }

    const onSearchSubmit = async () => {
        const response = await initPexel.get(`/v1/search`, {
            params: {
                query: searchText,
                per_page: 15,
                page: 1
            }
        });
        getPhotos(response.data)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter'){
            document.getElementById("pexelUrl").value = searchText;
            onSearchSubmit()
        }
    }

    const getNext =  async() => {
        const response = await initPexel.get(nextPage);
        getPhotos(response.data)
    }

    const getPrevious =  async() => {
        const response = await initPexel.get(previousPage);
        getPhotos(response.data)
    }

    return (
    <div className="pexels-container">
        <span style={{display: 'flex'}}>
            <span className="pexel-search-field">
                <input type="text"
                    placeholder="Search for photos on Pexels..."
                    id="pexelUrl"
                    className="pexel-search-input"
                    onKeyPress={handleKeyPress}
                    onChange={(e) =>{
                        setSearchText(e.target.value)
                    }}/>
            </span>
            <span className="pexels-controls" onClick={onSearchSubmit} title="Search Pexels for pictures">
                <AiOutlineSearch/>
            </span>
        </span>
        <Row>
            <div className="pexels-control">
                {nextPage && <span onClick={getNext} className="pexels-controls" title="Next">
                    <FaArrowAltCircleRight/>
                </span>}
                {previousPage && <span onClick={getPrevious} className="pexels-controls" title="Previous">
                    <FaArrowAltCircleLeft/>
                </span>}
            </div>
        </Row>

        <ImageList images={images.photos} setImageUrl={setImageUrl}/>

    </div>
    );

}

/*
class App extends React.Component {
    state = { photos: [] };

    onSearchSubmit = async (term) => {
        const response = await pexels.get(`/v1/search`, {
            params: {
                query: term,
                per_page: 10,
                page: 3
            }
        });

        this.setState({ photos: response.data.photos });
    }

    render() {
    return (
    <div className="container" style={{marginTop: '10px'}}>
        <SearchBar onSubmit={this.onSearchSubmit}/>
        <ImageList images={this.state.photos} />
    </div>
    );
    };
}

export default App;*/
