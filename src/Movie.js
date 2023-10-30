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
  let [cost, setCost] = useState("");
  let [loader, setLoader] = useState(true);
  let [view, setView] = useState("");

  const updateURL = (newPage) => {
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("page", newPage);
    window.history.pushState({ page: newPage }, "", newURL.toString());
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };
  const handleCategoryRemove = (removedCategory) => {
    const updatedCategories = category
      .split(",")
      .filter((cat) => cat !== removedCategory);
    setCategory(updatedCategories.join(","));
    fetchMoviesByCategory(updatedCategories.join(","));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
    updateURL(newPage + 1);
  };

  const handleCostChange = (newCost) => {
    setCost(newCost);
    setPage(1);

    // Fetch movies based on the selected sorting
    fetchMovies(category, movieName, newCost);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = parseInt(urlParams.get("page")) || 1;
    const initialCategory = urlParams.get("category") || "";
    const initialMovieName = urlParams.get("name") || "";
    const initialCost = urlParams.get("cost") || "";
    const intialView = urlParams.get("view");

    setPage(initialPage);
    setCategory(initialCategory);
    setMovieName(initialMovieName);
    setCost(initialCost);
    setView(intialView);

    fetchMovies(initialCategory, initialMovieName, initialCost, intialView);
  }, [page,cost,movieName, category]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/get/categories")
      .then((response) => {
        setLoader(false);
        setCategories(response.data);
      })
      .catch((err) => {
        setLoader(true);
        console.log(err);
      });
  }, []);
  useEffect(() => {
    // Add an event listener to handle "view" changes
    window.addEventListener("popstate", (event) => {
      const urlParams = new URLSearchParams(window.location.search);
      const newView = urlParams.get("view");
      handleViewChange(newView);
    });

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("popstate", handleViewChange);
    };
  }, [view]);

  const fetchMovies = (
    selectedCategory,
    selectedMovieName,
    selectedCost,
    selectedView
  ) => {
    let apiEndpoint = `http://localhost:8081/get/movies/last?page=${page}`;

    if (selectedCategory || selectedMovieName || selectedCost || selectedView) {
      apiEndpoint = `http://localhost:8081/get/movies/last?`;

      if (selectedCategory) {
        apiEndpoint += `category=${selectedCategory}`;
      }
      if (selectedMovieName) {
        apiEndpoint += `&name=${selectedMovieName}`;
      }
      if (selectedCost) {
        apiEndpoint += `&cost=${selectedCost}`;
      }
      if (selectedView) {
        apiEndpoint += `&view=${selectedView}`;
      }
      apiEndpoint += `&page=${page}`;
    }

    axios
      .get(apiEndpoint)
      .then((res) => {
        setData(res.data.data);
        console.log(res.data);
        setLoader(false);
        setView(res.data.view);
        setLastPage(res.data.total_pages);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(true);
      });
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setPage(1);
    setMovieName("");
    setCost("");
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("category", selectedCategory);
    newURL.searchParams.delete("page");
    newURL.searchParams.delete("cost");
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
          onCategoryChange={handleCategoryChange}
          movieName={movieName}
          setMovieName={setMovieName}
          cost={cost}
          setCost={handleCostChange} // Updated to call handleCostChange
          fetchMovies={fetchMovies}
          view={view}
          data = {data}
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
            <MovieCard loader={loader} displayedData={data} view={view} />
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
            data={data.length}
            page={page}
            handlePageChange={handlePageChange}
          />
        </div>
      </footer>
    </div>
  );
}

export default Movie;
