`use strict`;
const express = require('express');
const app = express();
const jsonData = require('./MovieData/data.json');
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();
const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;
app.get("/trending", funfortask12);

app.get("/", firstfun);
app.get("/favorite", secondfun);
app.get("/searchmovie", searchMovieHandler);


function ResponsExpress(id, title, release, poster_path, overview) {
  this.id = id;
  this.title1 = title;
  this.release - release
  this.poster_path1 = poster_path;
  this.overview1 = overview;
}
function errorHandler(error, req, res) {
  const err = {
    status: 500,
    message: error
  }

  res.status(500).send(err);
}
function DataConst(title, poster_path, overview) {
  this.title1 = title;
  this.poster_path1 = poster_path;
  this.overview1 = overview;
}

function searchMovieHandler(req,res){
  /*console.log(req.query);*/
let searchq=req.query.search;
let movie=[];
axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${searchq}`).then ( value =>{
  console.log(value.data.results.array.forEach(element => {
    value.data.results.forEach(movies => {
      let movie = new DataConst (movies.title,movies.poster_path,movies.overview);
      myArray.push(movie);
  });return res.status(200).json(myArray);
}).catch(error => {
  errorHandler(error, req,res);})

  )})};

function funfortask12(req, res) {

  axios.get(`https://api.themoviedb.org/3/movie/550?api_key=${APIKEY}`).then(value => {

    let mymovie = new ResponsExpress(value.data.id, value.data.title, value.data.release_date, value.data.poster_path, value.data.overview);
    return res.status(200).json(mymovie);
  }).catch(error => {
    errorHandler(error, req, res);
  });
}


function firstfun(req, res) {
  let mydata = new ResponsExpress(jsonData.title, jsonData.poster_path, jsonData.overview)
  return res.status(200).json(mydata);
}

function secondfun(req, res) {
  return res.status(200).send("hello");
}

app.listen(PORT, () => {
  console.log("Welcome to Favorite Page");
});


