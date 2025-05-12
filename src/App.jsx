import './App.css'
import "./DoubleSlider.css";
import classnames from "classnames";
import {useState, useEffect, useRef, useCallback} from 'react';

function App() {

  //***** VARIABLES *****//

  //Select min and max values on one slider
  const DoubleSlider = ({min, max, minValRef, maxValRef}) => {
    const [minVal, setMinVal] = useState(minValRef && minValRef.current ? minValRef.current.value : min);
    const [maxVal, setMaxVal] = useState(maxValRef && maxValRef.current ? maxValRef.current.value : max);
  
    const range = useRef(null);
  
    const getPercent = useCallback(
      (value) => Math.round(((value - min) / (max - min)) * 100), [min, max]
    );
  
    useEffect(() => {
      if (maxValRef.current) {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(+maxValRef.current.value);
  
        if (range.current) {
          range.current.style.left = `${minPercent}%`;
          range.current.style.width = `${maxPercent - minPercent}%`;
        }
      }
    }, [minVal, getPercent]);
  
    useEffect(() => {
      if (minValRef.current) {
        const minPercent = getPercent(+minValRef.current.value);
        const maxPercent = getPercent(maxVal);
  
        if (range.current) {
          range.current.style.width = `${maxPercent - minPercent}%`;
        }
      }
    }, [maxVal, getPercent]);
  
      return (
        <div className="container">
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            ref={minValRef}
            onChange={(event) => {
              const value = Math.min(+event.target.value, maxVal);
              setMinVal(value);
              event.target.value = value.toString();
            }}
            className={classnames("thumb thumbLeft", {
              "thumbOver": minVal > max - 100
            })}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            ref={maxValRef}
            onChange={(event) => {
              const value = Math.max(+event.target.value, minVal);
              setMaxVal(value);
              event.target.value = value.toString();
            }}
            className={classnames("thumb thumbRight", {
              "thumbOver": maxVal < min + 20
            })}
          />
          <div className="slider">
              <div className="sliderTrack"/>
              <div ref={range} className="sliderRange"/>
              <div className="sliderLeftValue">{minVal}</div>
              <div className="sliderRightValue">{maxVal}</div>
          </div>
        </div>
      )
  };

  //stores list of drivers returned from sql query
  const [returnedData, setReturnedData] = useState([]);

  //column to sort list by
  const [orderBy, setOrderBy] = useState('Name');

  //sort in descending or ascending order
  const [desc, setDesc] = useState('DESC');
  
  //tracks when order is changed by flipping between true and false
  const [changeOrder, setChangeOrder] = useState(false);

  //tracks scroll position of table
  const tableScroll = useRef(null);

  //store slider values

  const champMin = useRef(null);

  const champMax = useRef(null);

  const entryMin = useRef(null);

  const entryMax = useRef(null);

  const startMin = useRef(null);

  const startMax = useRef(null);

  const poleMin = useRef(null);

  const poleMax = useRef(null);

  const winMin = useRef(null);

  const winMax = useRef(null);

  const podiumMin = useRef(null);

  const podiumMax = useRef(null);

  const fastestMin = useRef(null);

  const fastestMax = useRef(null);

  const pointMin = useRef(null);

  const pointMax = useRef(null);

  //display empty set if no drivers are found
  const driverNotFound = () => {
    return (
      <tbody>
      </tbody>
    )
  }

  //add driver to head to head display
  const addHeadToHead = (driver) => {
    if (driverA.Name == '') {
      setDriverA(driver);
    } else {
      setDriverB(driver);
    }
  }

  //display results if more than zero drivers found
  var results = returnedData.length > 0 ? returnedData.map((val) => {
    return (
      <tbody>
        <tr key={val.Name}>
          <td>{val.Name}</td>
          <td>{val.Nationality}</td>
          <td>{val.Championships}</td>
          <td>{val.Entries}</td>
          <td>{val.Starts}</td>
          <td>{val.Poles}</td>
          <td>{val.Wins}</td>
          <td>{val.Podiums}</td>
          <td>{val.Fastest}</td>
          <td>{Math.round((val.Points + Number.EPSILON) * 100) / 100 | ''}</td>
          <td className="KeepDark"><button onClick={() => addHeadToHead(val)}>+</button></td>
        </tr>
      </tbody>
    )
  }) : driverNotFound();

  //switch ascending/descending order if same column, descending if new column
  const handleOrderBy = (column) => {
    if (column == orderBy) {
      setDesc(desc == 'DESC' ? 'ASC' : 'DESC');
    } else {
      setOrderBy(column);
      setDesc('DESC');
    }
    setChangeOrder(!changeOrder);
  }

  //new sql query when list order is changed
  useEffect(() => {
      getData();
  }, [changeOrder]);

  //stores information for drivers compared in the head to head
  const [driverA, setDriverA] = useState({Name: '', Nationality: '', Championships: -1, Entries: -1, Starts: -1, Poles: -1, Wins: -1, Podiums: -1, Fastest: -1, Points: -1.0});
  const [driverB, setDriverB] = useState({Name: '', Nationality: '', Championships: -1, Entries: -1, Starts: -1, Poles: -1, Wins: -1, Podiums: -1, Fastest: -1, Points: -1.0});

  //stores name and nationality for the inputted driver information
  const [driverTextInput, setDriverTextInput] = useState({Name: '', Nationality: ''});

  //set values for driver name and nationality
  const setTextInput = (e) => {
    const {name, value} = e.target;
    setDriverTextInput(prevState => ({
      ...prevState,
      [name]: value
    }));
    return;
  }

  //retrieve list of drivers from sql server, passing in criteria
  const getData = async () => {
    if (tableScroll.current) {
        tableScroll.current.scrollTop = 0;
    }
    const data = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        Name: driverTextInput.Name,
        Nationality: driverTextInput.Nationality,
        champMin: champMin.current.value,
        champMax: champMax.current.value,
        entryMin: entryMin.current.value,
        entryMax: entryMax.current.value,
        startMin: startMin.current.value,
        startMax: startMax.current.value,
        poleMin: poleMin.current.value,
        poleMax: poleMax.current.value,
        winMin: winMin.current.value,
        winMax: winMax.current.value,
        podiumMin: podiumMin.current.value,
        podiumMax: podiumMax.current.value,
        fastestMin: fastestMin.current.value,
        fastestMax: fastestMax.current.value,
        pointMin: pointMin.current.value,
        pointMax: pointMax.current.value,
        orderBy: orderBy,
        desc: desc
      })
    })
    .then(res => res.json());
    setReturnedData(data);
  }

  //***** PAGE LAYOUT *****//

  return (
    <div className="App">
      {/* Inputs for finding drivers by criteria */}
      <input  
        name="Name"   
        placeholder="Name"
        onChange={setTextInput}
        className="NormInput"/>
      <input 
        name="Nationality"  
        placeholder="Nationality"
        onChange={setTextInput}
        className="NormInput"/>
      <p>Championships</p>
      <DoubleSlider
        min={0}
        max={7}
        minValRef={champMin}
        maxValRef={champMax}
      />
      <p>Entries</p>
      <DoubleSlider
        min={0}
        max={404}
        minValRef={entryMin}
        maxValRef={entryMax}
      />
      <p>Starts</p>
      <DoubleSlider
        min={0}
        max={401}
        minValRef={startMin}
        maxValRef={startMax}
      />
      <p>Poles</p>
      <DoubleSlider
        min={0}
        max={104}
        minValRef={poleMin}
        maxValRef={poleMax}
      />
      <p>Wins</p>
      <DoubleSlider
        min={0}
        max={105}
        minValRef={winMin}
        maxValRef={winMax}
      />
      <p>Podiums</p>
      <DoubleSlider
        min={0}
        max={202}
        minValRef={podiumMin}
        maxValRef={podiumMax}
      />
      <p>Fastest Laps</p>
      <DoubleSlider
        min={0}
        max={77}
        minValRef={fastestMin}
        maxValRef={fastestMax}
      />
      <p>Points</p>
      <DoubleSlider
        min={0}
        max={4863}
        minValRef={pointMin}
        maxValRef={pointMax}
      />
      
      {/* Request list of drivers fitting criteria from sql server */}
      <button onClick={() => getData()}>Search</button>

      {/* Display information for the drivers that fit the criteria in a table */}
      <table ref={tableScroll}>
        <tbody>
          <tr className="ListHeader">
            <th><button onClick={() => handleOrderBy('Name')}>Name</button></th>
            <th><button onClick={() => handleOrderBy('Nationality')}>Nationality</button></th>
            <th><button onClick={() => handleOrderBy('Championships')}>Championships</button></th>
            <th><button onClick={() => handleOrderBy('Entries')}>Entries</button></th>
            <th><button onClick={() => handleOrderBy('Starts')}>Starts</button></th>
            <th><button onClick={() => handleOrderBy('Poles')}>Poles</button></th>
            <th><button onClick={() => handleOrderBy('Wins')}>Wins</button></th>
            <th><button onClick={() => handleOrderBy('Podiums')}>Podiums</button></th>
            <th><button onClick={() => handleOrderBy('Fastest')}>Fastest Laps</button></th>
            <th><button onClick={() => handleOrderBy('Points')}>Points</button></th>
            <th><button>Add</button></th>
          </tr>
        </tbody>
        {results}
      </table>

      {/* Compare drivers against each other on their career stats */}
      <div className='HeadtoHead'>
        <p>Head to Head</p>
        <p>{driverA.Name} vs. {driverB.Name}</p>
        <p>{driverA.Nationality} {driverB.Nationality}</p>
        <p>Championships</p>
        <p>{driverA.Championships} {driverB.Championships}</p>
        <p>Wins</p>
        <p>{driverA.Wins} {driverB.Wins}</p>
        <p>Podiums</p>
        <p>{driverA.Podiums} {driverB.Podiums}</p>
        <p>Poles</p>
        <p>{driverA.Poles} {driverB.Poles}</p>
        <p>Fastest Laps</p>
        <p>{driverA.Fastest} {driverB.Fastest}</p>
        <p>Career Points</p>
        <p>{driverA.Points} {driverB.Points}</p>
        <button onClick={() => setDriverA({Name: '', Nationality: '', Championships: -1, Entries: -1, Starts: -1, Poles: -1, Wins: -1, Podiums: -1, Fastest: -1, Points: -1.0})}></button>
        <button onClick={() => setDriverB({Name: '', Nationality: '', Championships: -1, Entries: -1, Starts: -1, Poles: -1, Wins: -1, Podiums: -1, Fastest: -1, Points: -1.0})}></button>
      </div>
    </div>
  )
}

export default App