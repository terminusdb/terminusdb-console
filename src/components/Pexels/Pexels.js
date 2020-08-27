import React, {useState, useEffect} from 'react'
import initPexel from './initPexel';
import SearchBar from './SearchBar';
import ImageList from './ImageList';
import './SearchBar.css';
import { Row, Col } from "reactstrap"


export const Pexels = (params) => {

    const [images, setImages] = useState(false);
    const [searchText, setSearchText] = useState('data');
    const setImageUrl = params.setImageUrl;

    const onSearchSubmit = async (term) => {
        const response = await initPexel.get(`/v1/search`, {
            params: {
                query: searchText,
                per_page: 10,
                page: 1
            }
        });
        setImages({photos: response.data.photos })
    }


    return (
    <div className="container" style={{marginTop: '50px'}}>
        <Row>
            <Col md={9}>
                <div className="field">
                    <input type="text"
                        placeholder="Search for photos on Pexels..."
                        value={searchText}
                        className="pexel-search-input"
                        onChange={  (e) =>{
                            setSearchText(e.target.value)
                        } }/>
                </div>
            </Col>
            <Col md={3}>
                <button onClick={onSearchSubmit}>Search</button>
            </Col>
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
