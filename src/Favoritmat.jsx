import React from 'react';
import './Favoritmat.css';
import { BiMessageAdd } from "react-icons/bi";
import Dexie from 'dexie';
import { CiCircleRemove } from "react-icons/ci";
import { BsArrowsFullscreen } from "react-icons/bs";
import moment from 'moment/moment';
import { FadeIn } from 'react-slide-fade-in';
import { useEffect } from 'react';


export const db = new Dexie('myDatabase');
db.version(4).stores({
  recept: '++id, maträtt, recept, kommentar, betyg, namn, datum', // Primary key and indexed props
});




class Favoritmat extends React.Component {
  constructor() {
    super();
    this.state = {
      add: false,
      maträtt: '',
      recept: '',
      kommentar: '',
      namn: '',
      betyg: '',
      search: '',
      RutaTaBort: '',
      fullscreen: false,
      full: '',
      fullinner: '',
      textareafull: '',
      allaReceptOrg: [],
      allaRecept: [],
      receptId: [],
    }
  }

  async componentDidMount() {
    fetch('https://node-express-verceltest-git-master-jakobgoransson95.vercel.app/allinfo', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 2,
      })
    })
      .then(response => response.json())
      .then(x => {
        const reverseRecept = x.reverse()
        this.setState({ allaRecept: reverseRecept, allaReceptOrg: reverseRecept, show: this.state.show })
      })
      .catch(error => alert('Server is down'))
  }


  showBox = (x) => {
    this.setState({ add: true })
    this.setState({
      maträtt: '',
      recept: '',
      kommentar: '',
      namn: '',
      betyg: '',
      allaRecept: []
    })
  }

  hideBox = (x) => {
    this.setState({ add: false })
    this.componentDidMount()
  }
  send = async (x) => {
    const betyg = Number(this.state.betyg)
    fetch('https://node-express-verceltest-git-master-jakobgoransson95.vercel.app/allinfo', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maträtt: this.state.maträtt,
        recept: this.state.recept,
        kommentar: this.state.kommentar,
        betyg: betyg,
        namn: this.state.namn
      })
    })
      .then(this.setState({ add: false, prio: '' }))
      .catch(error => alert('Server is down'))
      .then(d => this.componentDidMount())
  }


  updateState = (x) => {
    this.setState({ [x.target.id]: x.target.value })
  }

  delete = (x) => {
    const id = Number(x.target.id)
    fetch('https://node-express-verceltest-git-master-jakobgoransson95.vercel.app/allinfo/'
      + x.target.id, {
      method: 'DELETE',
    })
      .then(res => res.json()) // or res.json()
      .then(d => this.componentDidMount())
  }

  visaTaBort = (x) => {
    this.setState({ RutaTaBort: x.target.id })


    // this.state.allaRecept.map((list) => {
    //   const listNr = Number(list.id)
    //   const xNr = Number(x.target.id)
    //   if (listNr === xNr) {
    //     let arr = []
    //     arr.push(list)
    //     this.setState({
    //       allaRecept: arr,
    //       RutaTaBort: x.target.id
    //     })
    //   }
    // })

  }

  döljTaBort = (x) => {
    this.setState({ RutaTaBort: ''/* , allaRecept: this.state.allaReceptOrg */ })
  }

  full = (x) => {
    if (this.state.full === '') {
      this.state.allaRecept.map((list) => {
        const listNr = Number(list.id)
        const xNr = Number(x.target.id)
        if (listNr === xNr) {
          let arr = []
          arr.push(list)
          this.setState({
            allaRecept: arr,
            full: 'full',
            fullinner: 'fullinner',
            textareafull: 'textareafull',
          })
        }
      })
    } else {
      this.setState({
        allaRecept: this.state.allaReceptOrg,
        full: '',
        fullinner: '',
        textareafull: '',
      })
      this.componentDidMount()
    }
  }

  render() {
    const { add, allaRecept, search, RutaTaBort } = this.state;
    const filteredRecept = allaRecept.filter(message => {
      return message.maträtt.toLowerCase().includes(search.toLowerCase());
    });
    return (
      <div className='hela'>
        <div id='rubrik'><BiMessageAdd id='add' onClick={this.showBox} />
          <div id='rubriktext'>Favoritmat</div>
          <input id='serchPlanering'
            placeholder='Sök'
            onChange={(x) => this.setState({ search: x.target.value })} />
        </div>
        {add === true &&
          <div id='ny'>
            <div id='rubrikNy'>Lägg till ny maträtt</div>
            <input id='maträtt' placeholder='Namn på maträtt' onChange={this.updateState} />
            <textarea id='recept' placeholder='Recept / länk' onChange={this.updateState} />
            <textarea id='kommentar' placeholder='Kommentar' onChange={this.updateState} />
            <input
              id='betyg'
              placeholder='Betyg 1-10'
              type='number'
              min='1'
              max='10'
              onChange={this.updateState}
            />
            <input id='namn' placeholder='Ditt namn' onChange={this.updateState} />
            <div id='välj'>
              <span className='send' onClick={this.send}>Send</span>
              <span className='send' onClick={this.hideBox}>Exit</span>
            </div>
          </div>}
        <div id='innerGrid'>
          {filteredRecept.map((helaListan, i) =>
            <FadeIn
              from="bottom"
              positionOffset={400}
              triggerOffset={200}
              delayInMilliseconds={0}
            >
              <div id={helaListan.id} className='matbox' key={i} >
                <div className={this.state.full}>
                  <div id='removeMaträtt'> <CiCircleRemove
                    id={helaListan.id}
                    onClick={this.visaTaBort}
                    className='remove' />
                    <BsArrowsFullscreen className='fullscreen' id={helaListan.id}
                      onClick={this.full} />
                    {Number(RutaTaBort) === helaListan.id &&
                      <FadeIn
                        from="left"
                        positionOffset={400}
                        triggerOffset={200}
                        delayInMilliseconds={0}
                      >
                        <div className='rutaTaBortPlanering' id={helaListan.id}>
                          <p id='TaBortTextPlanering' >Vill du ta bort?</p>
                          <p onClick={this.delete}
                            className='TaBortJaPlanering'
                            id={helaListan.id}>Ja</p>
                          <p onClick={this.döljTaBort}
                            className='TaBortJaPlanering'>Nej</p>
                        </div> </FadeIn>}
                    <div id='maträtt2'>{helaListan.maträtt}</div>
                  </div>
                  <div >
                    <div id={this.state.fullinner}>
                      <div className='inner' id='receptinner'>
                        <div className='rubrikinner'>Recept / länk</div>
                        <textarea id={this.state.textareafull} className='textArea' value={helaListan.recept} readOnly={true} />
                      </div>
                      <div className='inner' id='kommentarinner'>
                        <div className='rubrikinner'>kommentar</div>
                        <textarea className='textArea' id={this.state.textareafull} value={helaListan.kommentar} readOnly={true} />
                      </div>
                      <div className='inner' id='betyginner'>
                        <div className='rubrikinner'>Betyg</div>
                        <div id={this.state.textareafull} >{helaListan.betyg} /10</div>
                      </div>
                      <div className='inner' id='namninner'>
                        <div className='rubrikinner'>Namn</div>
                        <div id={this.state.textareafull} >{helaListan.namn}</div>
                      </div>
                      <div id='newdate'> {moment(helaListan.datum).format("DD MMMM YYYY")}{" "}</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

        </div>
      </div >
    );
  }
}

export default Favoritmat;