import './App.css'
import "./DoubleSlider.css";
import classnames from "classnames";
import {useState, useEffect, useRef, useCallback} from 'react';

function App() {

  //***** VARIABLES *****//

  const width = `90vw`;

  //Compare bar color values
  const leftColor = `#535bf2`;
  const rightColor = `#d10a0a`;
  const defaultColor = `#b4b8bd`;

  //Visually compare a statistic for two drivers in the head to head section
  const CompareBar = ({leftVal, rightVal}) => {
    const leftPercent = leftVal == 0 ? 0 : leftVal / (leftVal + rightVal) * 100;
    const rightPercent = rightVal == 0 ? 0 : 100 - leftPercent;

    const compareBarColor = rightVal == 0 ? leftVal == 0 ? defaultColor : leftColor : rightColor;

    const leftRadius = leftVal == 0 ? 10 : 0;
    const rightRadius = rightVal == 0 ? 10 : 0;

    const leftMin = leftVal == 0 ? 0 : 10;
    const rightMin = rightVal == 0 ? 0 : 10;

    const leftMinStyle = `${leftMin}px`;
    const rightMinStyle = `${rightMin}px`;

    const leftRadStyle = `${leftRadius}px`;
    const rightRadStyle = `${rightRadius}px`;

    const leftWidth = `${leftPercent}%`;
    const rightWidth = `${rightPercent}%`;

    return (
      <div className="CompareBar" style={{backgroundColor: compareBarColor}}>
        <div className="A-Bar" style={{width: leftWidth, borderTopRightRadius: rightRadStyle, borderBottomRightRadius: rightRadStyle, minWidth: leftMinStyle}}></div>
        <div className="B-Bar" style={{width: rightWidth, borderTopLeftRadius: leftRadStyle, borderBottomLeftRadius: leftRadStyle, minWidth: rightMinStyle}}></div>
      </div>
    )
  };

  //Select min and max values on one slider
  const DoubleSlider = ({min, max, minValRef, maxValRef}) => {
    const [minVal, setMinVal] = useState(minValRef && minValRef.current ? minValRef.current.value : min);
    const [maxVal, setMaxVal] = useState(maxValRef && maxValRef.current ? maxValRef.current.value : max);
  
    const range = useRef(null);
  
    const getPercent = useCallback(
      (value) => ((value - min) / (max - min)) * 100, [min, max]
    );
  
    useEffect(() => {
      if (maxValRef.current && minValRef.current) {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(+maxValRef.current.value);

        const leftOffset = minVal / max * 10;

        const rightOffset = (max - maxVal) / max * 20;

        if (range.current) {
          range.current.style.left = `calc(${minPercent}% - ${leftOffset}px)`;
          range.current.style.width = `calc(${maxPercent - minPercent}% + ${rightOffset}px)`;
        }
      }
    }, [minVal, getPercent]);
  
    useEffect(() => {
      if (minValRef.current) {
        const minPercent = getPercent(+minValRef.current.value);
        const maxPercent = getPercent(maxVal);

        const offset = (max - maxVal) / max * 20;
  
        if (range.current) {
          range.current.style.width = `calc(${maxPercent - minPercent}% + ${offset}px)`;
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
              "thumbOver": minVal > max / 2
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
              "thumbOver": maxVal < min * 2
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
  const [desc, setDesc] = useState('ASC');
  
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
      <></>
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
      <tr key={val.Name}>
        <td style={{width: `21vw`}}>{val.Name}</td>
        <td style={{width: `12vw`}}>{val.Nationality}</td>
        <td style={{width: `8vw`}}>{val.Championships}</td>
        <td style={{width: `6vw`}}>{val.Entries}</td>
        <td style={{width: `6vw`}}>{val.Starts}</td>
        <td style={{width: `6vw`}}>{val.Poles}</td>
        <td style={{width: `6vw`}}>{val.Wins}</td>
        <td style={{width: `6vw`}}>{val.Podiums}</td>
        <td style={{width: `11vw`}}>{val.Fastest}</td>
        <td style={{width: `6vw`}}>{val.Points * 10 == Math.round(val.Points * 10) ? val.Points : val.Points.toFixed(2)}</td>
        <td style={{width: `2vw`}} className="KeepDark"><button className="ButtonDefault" onClick={() => addHeadToHead(val)}>+</button></td>
      </tr>
    )
  }) : driverNotFound();

  //switch ascending/descending order if same column, descending if new column
  const handleOrderBy = (column) => {
    if (column == orderBy) {
      setDesc(desc == 'DESC' ? 'ASC' : 'DESC');
    } else {
      setOrderBy(column);
      if (column == 'Name' || column == 'Nationality') {
        setDesc('ASC');
      } else {
        setDesc('DESC');
      }
    }
    setChangeOrder(!changeOrder);
  }

  //new sql query when list order is changed
  useEffect(() => {
      getData();
  }, [changeOrder]);

  //stores information for drivers compared in the head to head
  const [driverA, setDriverA] = useState({Name: '', Nationality: '', Championships: 0, Entries: 0, Starts: 0, Poles: 0, Wins: 0, Podiums: 0, Fastest: 0, Points: 0.0});
  const [driverB, setDriverB] = useState({Name: '', Nationality: '', Championships: 0, Entries: 0, Starts: 0, Poles: 0, Wins: 0, Podiums: 0, Fastest: 0, Points: 0.0});

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
      {/* Title */}
      <h1>F1 Database</h1>
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
      <button className="ButtonSearch" onClick={() => getData()}>Search</button>

      {/* Display information for the drivers that fit the criteria in a table */}
      <table ref={tableScroll}>
        <thead>
          <tr className="ListHeader">
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Name')}>Name</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Nationality')}>Nationality</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Championships')}>Championships</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Entries')}>Entries</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Starts')}>Starts</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Poles')}>Poles</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Wins')}>Wins</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Podiums')}>Podiums</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Fastest')}>Fastest Laps</button></th>
            <th><button className="ButtonDefault" onClick={() => handleOrderBy('Points')}>Points</button></th>
            <th><button className="ButtonDefault">Add</button></th>
          </tr>
        </thead>
        <tbody>
        {results}
        </tbody>
      </table>

      {/* Compare drivers against each other on their career stats */}
      <div className='HeadtoHead'>
        <h2>Head to Head</h2>
        <div className="HeadtoHead-Top">
          <button className="DeleteDriver" onClick={() => setDriverA({Name: '', Nationality: '', Championships: 0, Entries: 0, Starts: 0, Poles: 0, Wins: 0, Podiums: 0, Fastest: 0, Points: 0.0})}>Clear</button>
          <div className="DriverA">
            <h3>{driverA.Name}</h3>
            <p>{driverA.Nationality}</p>
          </div>
          <div className="VsBlock">
            <h3>vs.</h3>
          </div>
          <div className="DriverB">
            <h3>{driverB.Name}</h3>
            <p>{driverB.Nationality}</p>
          </div>
          <button className="DeleteDriver" onClick={() => setDriverB({Name: '', Nationality: '', Championships: 0, Entries: 0, Starts: 0, Poles: 0, Wins: 0, Podiums: 0, Fastest: 0, Points: 0.0})}>Clear</button>
        </div>
        <div className="HeadtoHead-Stat">
          <h3>Championships</h3>
          <CompareBar
            leftVal={driverA.Championships}
            rightVal={driverB.Championships}
          />
          <div className="CompareValues">
            <div className="ValueA">
              <p>{driverA.Championships}</p>
            </div>
            <div className="ValueB">
              <p>{driverB.Championships}</p>
            </div>
          </div>
        </div>
        <div className="HeadtoHead-Stat">
          <h3>Wins</h3>
          <CompareBar
            leftVal={driverA.Wins}
            rightVal={driverB.Wins}
          />
          <div className="CompareValues">
            <div className="ValueA">
              <p>{driverA.Wins}</p>
            </div>
            <div className="ValueB">
              <p>{driverB.Wins}</p>
            </div>
          </div>
        </div>
        <div className="HeadtoHead-Stat">
          <h3>Podiums</h3>
          <CompareBar
            leftVal={driverA.Podiums}
            rightVal={driverB.Podiums}
          />
          <div className="CompareValues">
            <div className="ValueA">
              <p>{driverA.Podiums}</p>
            </div>
            <div className="ValueB">
              <p>{driverB.Podiums}</p>
            </div>
          </div>
        </div>
        <div className="HeadtoHead-Stat">
          <h3>Poles</h3>
          <CompareBar
            leftVal={driverA.Poles}
            rightVal={driverB.Poles}
          />
          <div className="CompareValues">
            <div className="ValueA">
              <p>{driverA.Poles}</p>
            </div>
            <div className="ValueB">
              <p>{driverB.Poles}</p>
            </div>
          </div>
        </div>
        <div className="HeadtoHead-Stat">
          <h3>Fastest Laps</h3>
          <CompareBar
            leftVal={driverA.Fastest}
            rightVal={driverB.Fastest}
          />
          <div className="CompareValues">
            <div className="ValueA">
              <p>{driverA.Fastest}</p>
            </div>
            <div className="ValueB">
              <p>{driverB.Fastest}</p>
            </div>
          </div>
        </div>
        <div className="HeadtoHead-Stat">
          <h3>Career Points</h3>
          <CompareBar
            leftVal={driverA.Points}
            rightVal={driverB.Points}
          />
          <div className="CompareValues">
            <div className="ValueA">
              <p>{driverA.Points}</p>
            </div>
            <div className="ValueB">
              <p>{driverB.Points}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App