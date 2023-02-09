import React from 'react';
import './Favoritmat.css';
import { BiMessageAdd } from "react-icons/bi";
import Dexie from 'dexie';
import { VscTrash } from "react-icons/vsc";
import { BsArrowsFullscreen } from "react-icons/bs";
import moment from 'moment/moment';
import { FadeIn } from 'react-slide-fade-in';
import { MdOutlineGrade } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { BsStarFill } from "react-icons/bs";
import Select from 'react-select'
import { TbListSearch } from "react-icons/tb";
import { AiOutlineCloseCircle } from "react-icons/ai";



const options = [
  { value: 'Frukost', label: 'Frukost' },
  { value: 'Middag', label: 'Middag' },
  { value: 'Matlådemat', label: 'Matlådemat' },
  { value: 'Mellanmål', label: 'Mellanmål' }
]


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
      matTyp: '',
      recept: '',
      kommentar: '',
      namn: '',
      betyg: 0,
      search: '',
      RutaTaBort: '',
      fullscreen: false,
      full: '',
      fullinner: '',
      textareafull: '',
      showbetyg: '',
      uppdateraBetyg: 0,
      IdState: 0,
      starFylld: 0,
      totalabetygpoang: 0,
      rateSend: false,
      filter: '',
      showFilter: false,
      allaReceptOrg: [],
      allaRecept: []
    }
  }

  async componentDidMount() {
    fetch('https://node-express-verceltest-git-master-jakobgoransson95.vercel.app/allinfo', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
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
        namn: this.state.namn,
        mattyp: this.state.matTyp,
        totalabetygpoang: betyg
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

  rate = (x) => {
    this.state.allaRecept.map((list) => {
      const listNr = Number(list.id)
      const xNr = Number(x.target.id)
      if (listNr === xNr) {
        const betygadd = Number(list.totalabetygpoang) + Number(this.state.starFylld) + 1
        const antalbetyg = list.antalbetyg + 1
        const betygDecimal = betygadd / antalbetyg
        const nyttBetyg = Number(betygDecimal).toFixed(0)
        this.setState({
          uppdateraBetyg: nyttBetyg,
          IdState: xNr,
          totalabetygpoang: betygadd,
          rateSend: true
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.uppdateraBetyg !== this.state.uppdateraBetyg &&
      this.state.rateSend === true) {
      fetch('https://node-express-verceltest-git-master-jakobgoransson95.vercel.app/updatebetyg', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(this.state.IdState),
          betyg: Number(this.state.uppdateraBetyg),
          totalabetygpoang: Number(this.state.totalabetygpoang)
        })
      })
        .catch(error => alert('API server is down'))
        .then(this.setState({ showbetyg: false, rateSend: false }))
        .then(d => this.componentDidMount())
    }
  }

  star = (x) => {
    this.setState({
      starFylld: x.target.id
    })
  }

  matTypFilter = (x) => {
    const valdMatTyp = x.value
    const arr = []
    this.state.allaRecept.map((list) => {
      if (valdMatTyp === list.mattyp) {
        arr.push(list)
        this.setState({ allaRecept: arr })
      }
    })

  }

  closeMatTypFilter = (x) => {
    this.setState({
      showFilter: false,
      allaRecept: this.state.allaReceptOrg
    })
  }


  render() {
    const { add, allaRecept, search, RutaTaBort, showbetyg, starFylld, showFilter } = this.state;
    const filteredRecept = allaRecept.filter(message => {
      return message.maträtt.toLowerCase().includes(search.toLowerCase());
    });
    return (
      <div className='hela' >
        <div id='rubrik'><BiMessageAdd id='add' onClick={this.showBox} />
          <div id='rubriktext'>Favoritmat</div>
          <TbListSearch id='filter' onClick={(x) => this.setState({ showFilter: true })} />
          <input id='serchPlanering'
            placeholder='Sök'
            onChange={(x) => this.setState({ search: x.target.value })} />

          {/* FÅ FRAM FILTRERINGSRUTAN */}

          {showFilter === true &&
            <div id='filterAndClose'>
              <AiOutlineCloseCircle id='closeFilter' onClick={this.closeMatTypFilter} />
              <Select options={options} placeholder='Filtrera på typ av mat' id='matTypFilt' onChange={this.matTypFilter} />
            </div>}
        </div>

        {/*   NY MATRÄTT RUTA */}

        {add === true &&
          <FadeIn
            from="bottom"
            positionOffset={400}
            triggerOffset={200}
            delayInMilliseconds={0}
          >
            <div id='ny'>
              <div id='rubrikNy'>Lägg till ny maträtt</div>
              <Select options={options} placeholder='Vilken typ av mat' id='matTyp' onChange={(x) => this.setState({ matTyp: x.value })} />
              <input id='maträtt' placeholder='Namn på maträtt' onChange={this.updateState} />
              <textarea id='recept' placeholder='Recept / länk' onChange={this.updateState} />
              <textarea id='kommentar' placeholder='Kommentar' onChange={this.updateState} />
              <input
                id='betyg'
                placeholder='Betyg 1-10'
                type='number'
                min='1'
                max='10'
                onChange={(x) => this.setState({ betyg: Number(x.target.value).toFixed(0) })}
              />
              <input id='namn' placeholder='Ditt namn' onChange={this.updateState} />
              <div id='välj'>
                <span className='send' onClick={this.send}>Send</span>
                <span className='send' onClick={this.hideBox}>Exit</span>
              </div>
            </div></FadeIn>}

        {/* LOOP IGENOM ALLA RECEPT OCH SKAPAR RECEPTKORTEN  */}

        <div id='innerGrid'>
          {filteredRecept.map((helaListan, i) =>
            <FadeIn
              from="bottom"
              positionOffset={400}
              triggerOffset={200}
              delayInMilliseconds={0}>
              <div id={helaListan.id} className='matbox' key={i} >
                <div className={this.state.full}>
                  <div id='removeMaträtt'> <VscTrash
                    id={helaListan.id}
                    onClick={this.visaTaBort}
                    className='remove' />
                    <BsArrowsFullscreen className='fullscreen' id={helaListan.id}
                      onClick={this.full} />

                    {/* FÅ FRAM RUTAN ATT KUNNA RADERA ETT RECEPT */}

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
                        <div className='rubrikinner'>Typ av mat</div>
                        <input className='matTyp' value={helaListan.mattyp} readOnly={true} />
                      </div>
                      <div className='inner' id='kommentarinner'>
                        <div className='rubrikinner'>kommentar</div>
                        <textarea className='textArea' id={this.state.textareafull} value={helaListan.kommentar} readOnly={true} />
                      </div>
                      <div className='inner' id='betyginner'>
                        <div className='rubrikinner'>Betyg </div>
                        <MdOutlineGrade className='star' onClick={(x) => this.setState({ showbetyg: x.target.id })} id={helaListan.id} />

                        {/* FÅ FRAM RUTAN FÖR ATT KUNNA BETYGSÄTTA RECEPTET */}

                        {Number(showbetyg) === helaListan.id &&
                          <FadeIn
                            from="right"
                            positionOffset={400}
                            triggerOffset={200}
                            delayInMilliseconds={0} >
                            <div id='ratebox'>
                              <div id='rateRubrik'>Vad vill du ge för betyg?</div>
                              {Array.apply(null, { length: 10 }).map((e, i) => (
                                <div id='starBoth'>
                                  <CiStar className='starOfylld' id={i} onClick={this.star} key={i} />
                                  {starFylld > i - 1 &&
                                    <BsStarFill id="starFylld" onClick={this.star} />
                                  }
                                </div>
                              ))}
                              <div id={helaListan.id} className='betygSend' onClick={this.rate}>Send </div>
                              <div onClick={(x) => this.setState({ showbetyg: false })} className='betygSend'>Exit</div>
                            </div>
                          </FadeIn>}
                        <div id={this.state.textareafull} >{helaListan.betyg} /10</div>
                        <div id='antalbetyg' >Antal betyg: {helaListan.antalbetyg}</div>
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