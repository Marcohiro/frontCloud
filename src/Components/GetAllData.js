import React, { Component } from 'react';

class GetAllData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    fetch('https://grp4-apicloud.azurewebsites.net/api/CloudItems/')
      .then(response => response.json())
      .then(response => console.log(response))
      .then(data => this.setState({ data }));
 
  }

  render(){
    this.state.data.forEach(element => {
      console.log(element);
    });
      return(   
        <p>fail</p>
      );
  }
  
}
export default GetAllData;