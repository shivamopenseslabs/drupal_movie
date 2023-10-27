import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function Input(props) {
  const closeClicked = (item) => {
    props.onCategoryRemove(item);
  };

  const handleMovieNameChange = (event) => {
    event.preventDefault(); 
    const newMovieName = event.target.value;
    props.setMovieName(newMovieName);
  };

  return (
    <div className="input">
      <p>Selected categories</p>
      <div>
        <input
          type="text"
          onChange={handleMovieNameChange}
          placeholder="Enter the movie search"
          value={props.movieName}
        />
      </div>
      <div className="category-list">
        {props.checkedCategory.map((item, index) => (
          <div className="category" key={index}>
            {index !== 0 && (
              <div className="category-item">
                <p>{item}</p>
                <span className="close-icon" onClick={() => closeClicked(item)}>
                  <CloseIcon />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Input;