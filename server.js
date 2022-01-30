`use strict`;
const express = require('express');
const app =express(); 
const jsonData = require('./MovieData/data.json');


function ResponsExpress(title,poster_path,overview){
  this.title1=title;
  this.poster_path1=poster_path;
  this.overview1=overview;
 }

function firstfun(req,res){
  let mydata=new ResponsExpress(jsonData.title,jsonData.poster_path,jsonData.overview)
  return res.status(200).json(mydata);
  }

function secondfun(req,res){
 return res.status(200).send("hello");
}

app.get("/",firstfun);
app.get("/favorite",secondfun);


 

app.listen(3201, () =>{
console.log("Welcome to Favorite Page");
});


