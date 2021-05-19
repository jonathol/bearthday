import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import Loader from "react-loader-spinner";
import axios from 'axios';
import './App.css';
import banner from './banner.png';

class DayForm extends React.Component {
  constructor() {
    super();
    this.state = {
      image: false,
      imageURL: '',
      value: '',
      day: '',
      month: '',
      year: '',
      loading: false,
      results: [],
      currentIdx: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(value) {
    this.setState({value: value});
  }

  handleSubmit(event) { 
    event.preventDefault();   

    // kick off loading animation
    this.setState({loading: true, image:false, results: [], currentIdx: 0}); 

    // format day and month for api call
    let month = this.state.value.getMonth()+1
    if (month.toString().length < 2) {
      month = "0" + month
    }
    let day = this.state.value.getDate()
    if (day.toString().length < 2) {
      day = "0" + day
    }

    let dateString = this.state.value.getFullYear() + "-" + month + "-" + day;
    axios.get(`https://epic.gsfc.nasa.gov/api/natural/date/` + dateString)
      .then(res => {
        const results = res.data;
        // Retrying until I get a result would solve the problem but I have limited
        // amounts of calls so I will only look one year back from the current year.
        // Based off of my experimentations, there's usually something one year back from 
        // current year
        if (results.length > 0){
          this.setState({
            results: results,
            currentIdx: 0,
            imageURL: "https://epic.gsfc.nasa.gov/archive/natural/" + this.state.value.getFullYear() + "/" + month + "/" + day + "/png/",
            image: true,
            loading: false
          })
        } else {
          let d = new Date();
          let year = d.getFullYear() - 1;
          dateString = year + "-" + month + "-" + day;
          axios.get(`https://epic.gsfc.nasa.gov/api/natural/date/` + dateString)
            .then(res => {
              const results = res.data;
              if (results.length > 0){
                this.setState({
                  results: results,
                  currentIdx: 0,
                  imageURL: "https://epic.gsfc.nasa.gov/archive/natural/" + year + "/" + month + "/" + day + "/png/",
                  image: true,
                  loading: false
                })
              } else {
                alert("No Image Available.")
                this.setState({loading: false, image: false})
              }
          })
        }
      })
  }

  plusSlides() {
    let current = this.state.currentIdx + 1;
    if (current > this.state.results.length -1) {
      current = 0
    } 
    this.setState({
      currentIdx: current,
    })
  }

  minusSlides() {
    let current = this.state.currentIdx - 1;
    if (current < 0) {
      current = this.state.results.length - 1;
    }
    this.setState({
      currentIdx: current
    })
  }

  render() {
    let img;
    const hasImg = this.state.image;
    let loading = this.state.loading;
    if (!hasImg) {
      img = <div/>
    } else {
      if (this.state.results.length <= 1) {
        img = (
          <div className="DayContainer">          
            <div>{"Date: " + this.state.results[this.state.currentIdx].date}</div>
            <img className="DayImage" alt="Earth" src={this.state.imageURL + this.state.results[this.state.currentIdx].image + ".png"}/>
          </div>
        )
      } else {
        img = (
          <div className="DayContainer">          
            <div>{"Date: " + this.state.results[this.state.currentIdx].date}</div>
            <div className="DayCarousel">
              <img className="DayImage" alt="Earth" src={this.state.imageURL + this.state.results[this.state.currentIdx].image + ".png"}/>
              <a className="prev" onClick={this.minusSlides.bind(this)}>&#10094;</a>
              <a className="next" onClick={this.plusSlides.bind(this)}>&#10095;</a>
            </div>
          </div>
        )
      }
      
    }
    return (
      <form className="DayForm" onSubmit={this.handleSubmit}>
        <div className="DayInput">
          <label className="DayInputLabel">
            Birthday:        
          </label>
          <DatePicker
            onChange={this.handleChange}
            value={this.state.value}
          />
        </div>
        <input 
          type="submit" 
          value="Submit" 
          disabled={!this.state.value}
          className="DayFormSubmit"
        />
        {img}
        {loading ? <Loader
          type="TailSpin"
          color="#000000"
          height={100}
          width={100}
        /> : <div/>}
      </form>
    );
  }
}

function App() {
  return (
    <div className="App">      
      <div className="BearthdayHeader">
        <img src={banner} alt="banner" className="BearthdayHeaderImg"/>
        Happy Bearthday!
        <img src={banner} alt="banner" className="BearthdayHeaderImg"/>
      </div>   
      <DayForm/>    
    </div>
  );
}

export {App, DayForm};
