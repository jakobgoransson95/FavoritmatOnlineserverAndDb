import React, { Component } from 'react';
import './App.css'
import Favoritmat from './Favoritmat'
import Navbar from './Components/Navbar/Navbar';
import Registrera from './Components/Registrera/Registrera';
import Emaillist from './Components/Emaillista/Emaillist';




class App extends Component {
  constructor() {
    super();
    this.state = {
      route: 'signin',
      page: 'favoritmat',
    }
  }

  onPageChange = (x) => {
    this.setState({ page: x })
  }


  render() {
    const { page } = this.state;
    return (
      <div className="App">
        <Navbar onPageChange={this.onPageChange} sida={page} />
        {page === 'favoritmat' && <Favoritmat />}
        {page === 'signUp' &&
          <Registrera onPageChange={this.onPageChange} />}
        {page === 'emailLista' && <Emaillist />}
      </div>
    );
  }
}

export default App;
