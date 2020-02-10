import React, { Component } from 'react';
import axios from 'axios';

class AddData extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      date: (new Date().getDay() > 10 ? (new Date().getDay()+2) : "0"+(new Date().getDay()+2)) + "-" + 
            (new Date().getMonth() > 10 ? (new Date().getMonth()+1) : "0"+(new Date().getMonth()+1)) + "-" + new Date().getFullYear(),
    }
  }

  changeHandler = (e) => {
    this.setState({[e.target.name] : e.target.value });
  }

  onSubmitHandler = (e) => {
    e.preventDefault()
    axios.post('https://grp4-apicloud.azurewebsites.net/api/CloudItems', this.state)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }

render() {
    const { name } = this.state;
    const enable = this.state.name.length > 0;
    return (
      <>
        <form onSubmit={this.onSubmitHandler}>
          <div>
            <p id="text">insertion</p>
            <input data-testid="name" id='name'type="text" name="name" value={name} onChange={this.changeHandler}/>
          </div>
          <button data-testid="button" id='button' type="submit" disabled={!enable}>
            Ajout  
          </button>
        </form>
      </>
    );
  }
}

export default AddData;