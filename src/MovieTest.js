import axios from 'axios';
import React, { useEffect, useState } from 'react'

function MovieTest() {
    let [data , setData] = useState([]);
    let[page , setPage] = useState(1);
    let [loader ,setLoader] = useState(true);
    useEffect(() =>{
        axios.get(`http://localhost:8081/get/movies/last?page=${page}`).then((res) =>{
            setLoader(false);
            setData(res.data.data)
        }).catch((err) =>{
            console.log(err)
            setLoader(true);
        })
    },[])
  return (
    <div className='movie'>
        <header></header>
        <main></main>
        {/* <footer>
            <div className='pagination'></div>
        </footer> */}

    </div>
  )
}

export default MovieTest;