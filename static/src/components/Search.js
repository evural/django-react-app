import React from "react";
import Button from 'react-bootstrap/Button';

const Search = () => {

    return (
        <form className="form-inline mx-5 my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
          <Button className="btn btn-primary my-2 my-sm-0" type="submit">Search</Button>
        </form>
    );
}

export default Search;
