`use strict`;
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const jsonData = require('./MovieData/data.json');
const axios = require("axios");

dotenv.config();


const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;
const pg = require("pg");
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
app.use(express.json());
app.get("/trending", getMoviesHandler);
app.post("/addFavmovie", addFavmoveHandler);
app.get("/getAllFavmovie", getAllFavMovieHandler);
app.get("/", firstfun);
app.get("/favorite", secondfun);
app.get('/randompath',APIfunction)
app.get("/searchmovie", searchMovieHandler);

app.get("/getFavmovie/:id", getFavmoviesHandler);
app.put("/updateFavmovie/:id", updateFavmovieHandler);
app.delete("/deleteFavmovie/:id", deleteFavmovieHandler)
app.use(errorHandler);
function deleteFavmovieHandler(req,res){
  const id = req.params.id;
  console.log(req.params.id);
    const sql = `DELETE FROM favmovies WHERE id=${id};`

    client.query(sql).then(() => {
        return res.status(204).json([]);
    }).catch(error => {
        errorHandler(error, req, res);
    })
}
function updateFavmovieHandler(req, res){
  const id = req.params.id;
  const movie = req.body;
  const sql = `UPDATE favmovies SET comment=$1 WHERE id=${id} RETURNING *;`
  const values = [movie.comment];
  client.query(sql,values).then(data => {
      // return res.status(204).send([]);
      return res.status(200).json(data.rows);
  }).catch(error => {
      errorHandler(error, req, res);
  })};

function getFavmoviesHandler(req,res){
  console.log(req.params);
  const id =JSON.parse(req.params.id);
  const sql = `SELECT * FROM favmovies WHERE id=${id}`;

  client.query(sql).then(data => {
      
      res.status(200).json(data.rows);
  }).catch(error => {
      console.log(error);
      errorHandler(error, req, res);
  })
}

function DatamovieConstructer(id,title,release_date,poster_path,overview){
  this.id=id;
  this.title =title,
  this.release_date=release_date;
  this.poster_path = poster_path,
  this.overview =overview 
};

function searchMovieHandler(req,res){
  let searchquery = req.query.search;
  console.log(req.query.search);
  let arr1=[];
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${searchquery}`).then(value => {
      value.data.results.forEach(movies => {
          let movie = new DatamovieConstructer (movies.id,movies.
            title,movies.release_date,movies.poster_path,movies.overview);
          arr1.push(movie);

      })
      return res.status(200).json(arr1);
  }).catch(error => {
      errorHandler(error, req,res);
    
  });
}

function getMoviesHandler(req,res){
  let arr1=[];
  axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${APIKEY}`).then(value => {
      // console.log(value.data);
          value.data.results.forEach(value=>{
          let movie = new DatamovieConstructer (value.id,value.title,value.release_date,value.poster_path,value.overview);            
              arr1.push(movie)
          })
       return res.status(200).json(arr1);
  }).catch(error => {
      errorHandler(error, req,res);
  
  });
};

function APIfunction(req,res){
  let arr1=[];
axios.get(`https://api.themoviedb.org/3/movie/changes?api_key=${APIKEY}&page=1`).then(value =>{
value.data.results.forEach(value=>{
   arr1.push(value);
});return res.status(200).json(arr1);
}).catch(error => {
   errorHandler(error, req,res);
});
};

function firstfun(req, res) {
  let mydata = new DatamovieConstructer(jsonData.id,jsonData.title,jsonData.release_date,jsonData.poster_path, jsonData.overview)
  
  return res.status(200).json(mydata);
}

function secondfun(req, res) {
  return res.status(200).send("hello");
}


function addFavmoveHandler(req,res){
  let movie = req.body;


  const sql = `INSERT INTO favmovies( title,release_date, poster_path, overview,comment) VALUES($1, $2, $3, $4, $5)RETURNING * ;`


  let values = [movie.title,movie.release_date, movie.poster_path, movie.overview,movie.comment];

  client.query(sql, values).then((data) => {
     
      return res.status(201).json(data.rows[0]);
  }).catch(error => {
      errorHandler(error, req, res);
  })
};

function getAllFavMovieHandler(req, res){

  const sql = `SELECT * FROM favmovies`;

  client.query(sql).then(data => {
      return res.status(200).json(data.rows);
  }).catch(error => {
      errorHandler(error, req,res);
  })
}
function notFountHandler(req,res){
  res.status(404).send("No endpoint with this name");
}

function errorHandler(error, req, res){
  const err = {
      status : 500,
      message : error
  }

  res.status(500).send(err);
}
client.connect().then(() => {
  
  app.listen(PORT, () => {
      console.log(`I am using port ${PORT}`);

  });});

