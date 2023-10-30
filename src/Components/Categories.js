import { useState, useEffect } from "react";
import "../Components/Categories.css"

function Categories(props) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  useEffect(() => {
    // Ensure props.checkedCategory is a string
    const checkedCategoryString = String(props.checkedCategory);
    // Convert string to array
    setSelectedCategories(checkedCategoryString.split(","));
  }, [props.checkedCategory]);

  const handleCategorySelection = (event) => {
    const selectedCategory = event.target.value;
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

  return (
    <div>
      <div className="categories">
        <h2>Select the Categories</h2>
        <div>
          <input
            type="checkbox"
            value="All"
            onChange={handleCategorySelection}
            checked={selectedCategories.includes("all")}
          />
          <span>All</span>

          {props.categories.map((item) => (
            <div key={item.name}>
              <input
                type="checkbox"
                value={item.name}
                onChange={handleCategorySelection}
                checked={selectedCategories.includes(item.name)}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
