import React from 'react';
import './Emaillist.css';





class Emaillist extends React.Component {
  constructor() {
    super();
    this.state = {
      emailregistrerade: '',
      error: null
    }
  }

  componentDidMount() {
    const arr = []
    fetch('https://node-express-verceltest-git-master-jakobgoransson95.vercel.app/users', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(x => {
        x.map((helaListan, i) => {
          arr.push(helaListan.email)
        })
        const joinedEmail = arr.join(", ")
        this.setState({
          emailregistrerade: joinedEmail
        })
      })
      .catch(error => {
        this.setState({ error: 'Server is down' });
      });
  }

  render() {
    const { emailregistrerade, error } = this.state
    if (error) {
      return (
        <div id='emaillist'>
          {error}
        </div>
      )
    }
    return (
      <div id='emaillist'>
        {emailregistrerade}
      </div>
    );
  }
}

export default Emaillist;
