import './SearchBar.css';
import React, { useState } from 'react';

const  SearchBar = (props) => {
    //state = { term: '' };

    const [searchText, setSearchText] =  useState('art')

    const onFormSubmit = (e) => {
        e.preventDefault();
        setSearchText(searchText);
        //this.props.onSubmit(this.state.term);
    }

        return (
            <form onSubmit={onFormSubmit} className="ui form">
                <div className="field">
                    <input type="text"
                        placeholder="Search for photos on Pexels..."
                        value={searchText}
                        onChange={  (e) =>{
                            console.log('val',  e.target.value)
                            setSearchText(e.target.value)
                            //this.setState({ term: e.target.value})
                        } }/>
                </div>
            </form>
            );
}

export default SearchBar;
