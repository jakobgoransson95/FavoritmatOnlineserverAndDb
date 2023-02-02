import { useState } from 'react'
import './App.css'
import Favoritmat from './Favoritmat'
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

export const db = new Dexie('myDatabase');
db.version(4).stores({
  recept: '++id, maträtt, recept, kommentar, betyg, namn, datum', // Primary key and indexed props
});



function App() {
  const [count, setCount] = useState(0)


  const recept = useLiveQuery(
    () => db.recept.toArray()
  );


  return (
    <div className="App">
      <Favoritmat />
    </div>
  )
}

export default App
