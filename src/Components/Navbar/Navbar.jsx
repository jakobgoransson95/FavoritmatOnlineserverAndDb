import React from 'react';
import './Navbar.css';
import { CgDetailsMore } from "react-icons/cg";


class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      registrera: false,
      dropdown: false
    }
  }

  showDropdown = (x) => {
    if (this.state.dropdown === false) {
      this.setState({ dropdown: true })
    } else {
      this.setState({ dropdown: false })
    }
  }

  signUp = (x) => {
    this.props.onPageChange('signUp')
    this.setState({ dropdown: false })
  }

  emailLista = (x) => {
    this.props.onPageChange('emailLista')
    this.setState({ dropdown: false })
  }


  render() {
    const { onPageChange, sida } = this.props;
    const { dropdown } = this.state
    return (
      <div className="main-nav">
        <CgDetailsMore id='filterNavbar' onClick={this.showDropdown} />
        {dropdown === true &&
          <div id='rutaMore'>
            <li id='signup' onClick={this.signUp} >Registrera</li>
            <li id='signup'  >Logga In</li>
            <li id='signup' onClick={this.emailLista} >Email</li>
          </div>}
        {sida !== 'favoritmat' &&
          <div id='navStart' onClick={() => onPageChange('favoritmat')}> Startsida</div>}
      </div >
    );
  }
}

export default Navbar;