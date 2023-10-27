import React from "react";
import { TailSpin } from "react-loader-spinner";
function MovieCard(props) {
  return (
    <div>
      {props.loader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <div className="movies-div">
          {props.displayedData.map((item, index) => {
            return (
              <div className="movie-card" key={index}>
                <div>
                  movie image : <img   src={item.movie_image} />
                </div>
                <p className="movie-info">Name : {item.name}</p>
                <p className="movie-info">Cost : {item.movie_cost}</p>
                <p className="movie-info">Category : {item.category}</p>
                <p className="movie-info">Total Seats : {item.total_seats}</p>
                <p className="movie-info">
                  Seats Booked : {item.total_seats_booked}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default MovieCard;
