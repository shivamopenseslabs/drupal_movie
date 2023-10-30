import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../Components/Input.css"

function Input(props) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCost, setSelectedCost] = useState(""); // Add a state for selectedCost
  const [selectedView, setSelectedView] = useState(""); // Add a state for selectedView
  useEffect(() => {
    // Ensure props.checkedCategory is a string
    const checkedCategoryString = String(props.checkedCategory);
    // Convert string to array
    setSelectedCategories(checkedCategoryString.split(","));
  }, [props.checkedCategory]);

  useEffect(() => {
    // Get the cost value from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const costFromUrl = urlParams.get("cost");

    if (costFromUrl) {
      // Set the selectedCost state based on the URL parameter
      setSelectedCost(costFromUrl);
    }
    const viewFromUrl = urlParams.get("view");

    if (viewFromUrl) {
      setSelectedView(viewFromUrl);
    }
  }, [selectedView]);

  const handleCategorySelection = (item) => {
    console.log(item);
    const selectedCategory = item;
    let updatedCategories;
    if (selectedCategories.includes(selectedCategory)) {
      updatedCategories = selectedCategories.filter(
        (category) => category !== selectedCategory
      );
    } else {
      updatedCategories = [...selectedCategories, selectedCategory];
    }

    // Convert updatedCategories to a string for prop update
    const updatedCategoryString = updatedCategories.join(",");
    setSelectedCategories(updatedCategories);
    props.onCategoryChange(updatedCategoryString);
  };

  const handleMovieNameChange = (event) => {
    const newMovieName = event.target.value;
    props.setMovieName(newMovieName);

    const newURL = new URL(window.location.href);

    if (newMovieName === "") {
      // If the newMovieName is empty, remove the 'name' parameter from the URL
      newURL.searchParams.delete("name");
      window.history.pushState({ name: newMovieName }, "", newURL.toString());
    } else {
      newURL.searchParams.set("name", newMovieName);
      window.history.pushState({ name: newMovieName }, "", newURL.toString());
    }
  };

  const handleCostChange = (event) => {
    const newCost = event.target.value;
    setSelectedCost(newCost); // Update the selectedCost state

    const newURL = new URL(window.location.href);

    if (newCost === "low_to_high" || newCost === "high_to_low") {
      newURL.searchParams.set("cost", newCost);

      // Remove the "page" parameter when the cost is selected
      newURL.searchParams.delete("page");
    } else {
      newURL.searchParams.delete("cost");
    }

    // Reset the page to 1 when changing the sorting
    newURL.searchParams.set("page", "1");

    window.history.pushState({ cost: newCost, page: 1 }, "", newURL.toString());

    // Call the parent component's function to fetch movies based on the selected sorting
    props.fetchMovies(
      props.checkedCategory.join(","),
      props.movieName,
      newCost
    );
  };
  const handleViewChange = (event) => {
    const newView = event.target.value;
    setSelectedView(newView);

    const newURL = new URL(window.location.href);

    if (newView) {
      newURL.searchParams.set("view", newView);
    } else {
      newURL.searchParams.delete("view");
    }

    window.history.pushState({ view: newView }, "", newURL.toString());
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
      <div>
        {
          selectedCategories.length > 0 ? <p>Showing {props.data.length} out of 10 results</p> : "" 
        }
      </div>
      <div>
        <div>
          <select onChange={handleCostChange} value={selectedCost}>
            <option value="" selected disabled>Select cost</option>
            <option value="low_to_high">Low to High</option>
            <option value="high_to_low">High to Low</option>
          </select>
        </div>
        <div>
          <select onChange={handleViewChange} value={selectedView}>
            <option value="" selected disabled>Select View</option>
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
      </div>
      <div className="category-list">
        {props.checkedCategory.map((item, index) => (
          <div className="category" key={index}>
            {index !== 0 && (
              <div className ={`category-item`} >
                <p>{item}</p>
                <span
                  className="close-icon"
                  onClick={() => handleCategorySelection(item)}
                >
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
