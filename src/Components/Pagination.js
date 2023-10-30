import React from "react";
import ReactPaginate from "react-paginate";
import "../Components/Pagination.css"

function Pagination(props) {
  // const [currentPage , setCurrentPage] = useState();
  function xyz(data){ 
    props.handlePageChange(data.selected);
    // setCurrentPage(data.selected)
  }
  console.log("length")
  return (
    <div>
      <ReactPaginate
        breakLabel={"..."}
        nextLabel={"next >"}
        // onPageChange={() => props.handlePageChange(page)}
        onPageChange={xyz}
        pageRangeDisplayed={3}
        pageCount={props.lastPage}
        forcePage={props.page-1}
        marginPagesDisplayed={1}
        previousLabel={"< previous"}
        containerClassName="pagination justify-content-center"
        pageClassName={"page-item"}
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        // breakClassName="page-link"
        breakLinkClassName="page-link"
        activeClassName="active"
      />
    </div>
  );
}

export default Pagination;
