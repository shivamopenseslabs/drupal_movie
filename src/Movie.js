import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Movie.css";
import Pagination from "./Components/Pagination";
import Categories from "./Components/Categories";
import MovieCard from "./Components/MovieCard";
import Input from "./Components/Input";

function Movie() {
  let [data, setData] = useState([]);
  let [page, setPage] = useState(1);
  let [lastPage, setLastPage] = useState(1);
  let [categories, setCategories] = useState([]);
  let [category, setCategory] = useState("");
  let [movieName, setMovieName] = useState("");
  let [loader, setLoader] = useState(true);
  let [searchResults, setSearchResults] = useState([]);
  const updateURL = (newPage) => {
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("page", newPage);
    window.history.pushState({ page: newPage }, "", newURL.toString());
  };
  const handleCategoryRemove = (removedCategory) => {
    // Remove the category from the current categories
    const updatedCategories = category
      .split(",")
      .filter((cat) => cat !== removedCategory);
    // Update the category state with the updated categories
    console.log(updatedCategories);
    setCategory(updatedCategories.join(","));

    // Fetch movies for the updated categories
    fetchMoviesByCategory(updatedCategories.join(","));
  };

  const handlePageChange = (newPage) => {
    // Update the 'page' state to reflect the new page
    setPage(newPage + 1);
    // Update the URL
    updateURL(newPage + 1);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get("page")) || 1;
    let initialCategory = urlParams.get("category") || "";
    const initialMovieName = urlParams.get("name") || "";

    setPage(initialPage);
    setCategory(initialCategory);
    setMovieName(initialMovieName);

    let apiEndpoint = `http://localhost:8081/get/movies/last?page=${initialPage}`;

    if (initialCategory || initialMovieName) {
      apiEndpoint = `http://localhost:8081/get/movies/last?`;
      if (initialCategory) {
        apiEndpoint += `category=${initialCategory}`;
        apiEndpoint += `&page=${initialPage}`;
      }
      if (initialMovieName) {
        apiEndpoint += `&name=${initialMovieName}`;
      }
      if (initialCategory) {
        setPage(1);
      }
    }

    axios
      .get(apiEndpoint)
      .then((res) => {
        console.log(res.data);
        setData(res.data.data);
        setLoader(false);
        setLastPage(res.data.total_pages);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(true);
      });
  }, [page, category, movieName]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/get/categories")
      .then((response) => {
        console.log(response.data);
        setLoader(false);
        setCategories(response.data);
      })
      .catch((err) => {
        setLoader(true);
        console.log(err);
      });
  }, []);

  // const handlePageChange = (newPage) => {
  //   setPage(newPage + 1);
  //   updateURL(newPage + 1);
  // };
  // console.log(movieName)

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setPage(1);
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("category", selectedCategory);
    newURL.searchParams.delete("page");
    window.history.pushState(
      { category: selectedCategory },
      "",
      newURL.toString()
    );
    fetchMoviesByCategory(selectedCategory);
  };

  const fetchMoviesByCategory = (selectedCategory) => {
    const apiEndpoint = `http://localhost:8081/get/movies/last?category=${selectedCategory}`;
    axios
      .get(apiEndpoint)
      .then((res) => {
        console.log(res.data);
        setData(res.data.data);
        setLoader(false);
        setLastPage(res.data.total_pages);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(true);
      });
  };

  return (
    <div className="movie">
      <h1 className="movie-title">Movie Dashboard</h1>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Input
          checkedCategory={category ? category.split(",") : []}
          onCategoryRemove={handleCategoryRemove}
          movieName={movieName}
          setMovieName={setMovieName} // Pass the setMovieName function
        />
        <Categories
          categories={categories}
          onCategoryChange={handleCategoryChange}
          checkedCategory={category ? category.split(",") : []}
          onCategoryRemove={handleCategoryRemove}
        />
      </header>
      <main>
        <div className="main">
          <div>
            <MovieCard loader={loader} displayedData={data} />
          </div>
        </div>
      </main>
      <footer>
        <div
          className="footer"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            lastPage={lastPage}
            page={page}
            handlePageChange={handlePageChange}
          />
        </div>
      </footer>
    </div>
  );
}

export default Movie;
