import React, { Component } from 'react';
import axios from 'axios';

class AddData extends Component {
  constructor(props){
    super(props);
    this.state = {
      cloudId: '',
      name: '',
      date: '',
    }
  }

  changeHandler = (e) => {
    this.setState({[e.target.name] : e.target.name === 'userId' ? 
                  parseInt(e.target.value, 10) ?
                  e.target.value :
                  '' :
                  e.target.value                  
                });
  }

  onSubmitHandler = (e) => {
    e.preventDefault()
    axios.post('http://localhost:8085/insert', this.state)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }

render() {
    const { cloudId, name, date } = this.state;
    const enable = this.state.cloudId.length > 0 && this.state.name.length > 0 && this.state.date.length > 0;
    return (
      <div>
        <form onSubmit={this.onSubmitHandler}>
          <div>
            <p>Numero ID</p>
            <input data-testid="id" label="id" id='id'type="text" name="userId" value={cloudId} onChange={this.changeHandler}/>
          </div>
          <div>
            <p>last name</p>
            <input data-testid="lastName" id='lastName'type="text" name="lastName" value={name} onChange={this.changeHandler}/>
          </div>
          <div>
            <p>first name</p>
            <input data-testid="firstName" id='firstName'type="text" name="firstName" value={date} onChange={this.changeHandler}/>
          </div>
          <button data-testid="button" id='button' type="submit" disabled={!enable}>
            Submit  
          </button>
        </form>
      </div>
    );
  }
}

export default AddData;