import React, { Component } from 'react';
import axios from 'axios';

class GetAllData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      cloudId: '',
      hasFetched: false,
      idInvalid: false,
    };
  }

  GetData(){
    fetch('https://grp4-apicloud.azurewebsites.net/api/CloudItems')
    .then(response => response.json())
    .then(data => this.setState({ data }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ( this.state.hasFetched ) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.GetData();
    if(!this.state.hasFetched)setInterval(this.GetData.bind(this), 1000);
    else setInterval(this.GetData.bind(this), 1000);
  }

  deleteItem(cloudId){
    axios.delete('https://grp4-apicloud.azurewebsites.net/api/CloudItems/ '+ cloudId)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
  }

  changeHandler = (e) => {
    this.setState({[e.target.name] : e.target.value });
  }

  getItemById(){
    fetch(`https://grp4-apicloud.azurewebsites.net/api/CloudItems/${this.state.cloudId}`)
    .then(response => response.json())
    .then(data => {
      var arr = [];
      arr.push(data);
      if(data.status === 404){
        this.setState({idInvalid : true});
      } else {
        this.setState({idInvalid : false});
        this.setState({data : arr});
        if(this.state.cloudId === "" ) this.setState({hasFetched : false});
        else this.setState({hasFetched : true});
      }
    });
  }

  render(){
    const { num } = this.state.cloudId;
      return( 
        <>  
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Date</th>
              <th>Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((item, index) => {
              return(<tr key={index}>
                <td>{item.cloudId}</td>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td><button onClick={() => {this.deleteItem(item.cloudId)}}> X </button></td>
              </tr>)
            })}
          </tbody>
        </table>
        <p id="text">Recherche par ID unique</p>
        <input id="cloudID" type="text" name="cloudId" value={num} onChange={this.changeHandler}/>
        <button id="search" onClick={() => {this.getItemById()}}>Recherche</button>
        {this.state.idInvalid && <p>ID Introuvable</p>}
        </>
      );
  }
  
}
export default GetAllData;