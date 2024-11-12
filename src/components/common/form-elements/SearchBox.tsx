import React from 'react';
// import { FaSearch } from 'react-icons/fa';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const SearchBox: React.FC = () => {
  return (
    <div className="input-group mb-3">
      <input type="text" className="form-control" placeholder="Search..." />
      <div className="input-group-append">
        <span className="input-group-text">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
    </div>
  );
};

export default SearchBox;
