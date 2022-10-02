import { useReducer, useState, useEffect, useRef } from 'react';
import './App.css';
import Modal from './Modal';

const saveqLib = (qLib) => {
  console.log(qLib)
  localStorage.setItem("qLibrary", JSON.stringify(qLib))


}

const reducer = (state, action) => {
  switch (action.type) {
    case 'addBank':
      saveqLib([...state.qLibrary, action.newBank])
      return { qLibrary: [...state.qLibrary, action.newBank] }
    case 'addCorrect':
      // console.log("SUP")
      let v = state.qLibrary;
      v[action.bankNum].quotes[action.quoteInd].correct += 1
      // console.log(v[action.bankNum].quotes[action.quoteInd].correct)
      saveqLib(v)
      return { qLibrary: v }
    case 'addIncorrect':

      let j = state.qLibrary;
      j[action.bankNum].quotes[action.quoteInd].incorrect += 1
      // console.log(j[action.bankNum].quotes[action.quoteInd].incorrect)

      saveqLib(j)
      return { qLibrary: j }
    case 'removeBank':

      let x = state.qLibrary;
      x.splice(action.removedInd, 1);
      saveqLib(x);
      return { qLibrary: x }
    case 'changeBank':
      let h = state.qLibrary;
      h[action.bankIndex] = action.changedBank;

      saveqLib(h)

      return { qLibrary: h }
    case 'removeQuote':
      let k = state.qLibrary;
      let r = k[action.bankNum].quotes
      r.splice(action.removedIn, 1);

      k[action.bankNum].quotes = r
      saveqLib(k);
      return { qLibrary: k }

    default:
      return state
  }
}

const getLib = () => {
  if (localStorage.getItem("qLibrary") == undefined) {
    localStorage.setItem("qLibrary", JSON.stringify([]))
    return []
  } else {
    return JSON.parse(localStorage.getItem("qLibrary"))
  }
}



const useKeyPress = (target) => {


  const [pressed, setPressed] = useState(false);  // State for key press
  const downHandler = ({ key }) => {
    if (key == target) setPressed(true);
  };
  const upHandler = ({ key }) => {
    if (key === target) setPressed(false);
  };
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return pressed;

}


const mod = (n, m) => {
  return ((n % m) + m) % m;
}
function App() {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  let x = getLib()
  const [open, setOpen] = useState(false);
  const [reset, setReset] = useState(false);

  const [editOn, setEditOn] = useState(false);


  const control = useKeyPress("Control");
  const tab = useKeyPress("Tab");
  const up = useKeyPress("ArrowUp");
  const down = useKeyPress("ArrowDown");
  const space = useKeyPress("Space")

  const currentQuoteLearnRef = useRef(null);
  const rerenderth = useRef(null);

  const [currNumber, setCurrNumber] = useState(0);
  const [quoteShown, setQuoteShown] = useState(true);



  const [learnOn, setLearnOn] = useState(false);
  const [viewOn, setViewOn] = useState(false);
  const [state, dispatch] = useReducer(reducer, { qLibrary: getLib() })
  const [tempQuotes, setTempQuotes] = useState(["Quote 1"]);
  const [tempName, setTempName] = useState("");
  const [selected, setSelected] = useState(-1);
  const [correct, setCorrect] = useState(0);

  const resetVals = () => {
    setCorrect(0);
    setQuoteShown(false);
    setCurrQuoteLearn("");
    currentQuoteLearnRef.current.value = "";
  }
  useEffect(() => {
    if (learnOn) {
      if (down) {
        forwards()

      }
      if (up) {
        backwards()


      }

    }

  }, [down, up])
  const forwards = () => {
    setCurrNumber((mod(currNumber + 1, state.qLibrary[selected].quotes.length)));
    resetVals()

  }
  const backwards = () => {
    setCurrNumber((mod(currNumber - 1, state.qLibrary[selected].quotes.length)));
    resetVals()

  }


  // const [show, setShow] = useState(true);

  const [currQuoteLearn, setCurrQuoteLearn] = useState("");

  const [tempEditQuotes, setTempEditQuotes] = useState([]);

  const startEdit = () => {
    // console.log(state.qLibrary[selected])
    setEditOn(true);
    setTempEditQuotes(state.qLibrary[selected].quotes);
    // console.log(state.qLibrary[selected])
  }

  const processLearn = (e, correctQuote) => {
    if (e.repeat) return;
    if (e.key == "Enter") {
      if (currQuoteLearn == correctQuote) {
        setCorrect(1);
        dispatch({ type: 'addCorrect', bankNum: selected, quoteInd: currNumber })
        currentQuoteLearnRef.current.value = "";
      } else {
        setCorrect(-1);
        dispatch({ type: 'addIncorrect', bankNum: selected, quoteInd: currNumber })
      }
    }

  }

  const recordLearn = (e) => {
    setQuoteShown(false);
    setCurrQuoteLearn(e.target.value);

  }

  const addQuoteBank = () => {
    let b = [];
    tempQuotes.forEach((q) => {
      b.push({ text: q, correct: 0, incorrect: 0 })
    })
    // console.log({ name: tempName, quotes: b })
    dispatch({ type: "addBank", newBank: { name: tempName, quotes: b } });

    setTempQuotes(["Quote 1"]);
    setTempName("");
    setOpen(false);
    location.href='/';
    


  }

  const del = (selected) => {

    if (prompt(`Type ${state.qLibrary[selected].name.toUpperCase()} to delete`) == state.qLibrary[selected].name.toUpperCase()) {
      dispatch({ type: 'removeBank', removedInd: selected })
      setSelected(-1);
      setViewOn(false);
    }


  }

  const handleChange = (e, i) => {
    let q = tempQuotes;
    q[i] = e.target.value;
    setTempQuotes(tempQuotes);
  }
  const handleEditChange = (e, i) => {
    let q = tempEditQuotes;
    q[i].text = e.target.value;
    setTempEditQuotes(q);
    // let m = state.qLibrary[selected];
    // console.log(m)

  }

  const resetLearn = () => {
    setLearnOn(false);
    setCurrNumber(0);
    setCorrect(0);
  }

  const resetView = () => {
    setEditOn(false);
    setTempEditQuotes([]);
  }
  const saveChanges = () => {


    let m = state.qLibrary[selected];
    // console.log(m)
    m.quotes.forEach((quote, index) => {
      m.quotes[index].text = tempEditQuotes[index].text
    })
    // console.log(m)
    dispatch({ type: "changeBank", bankIndex: selected, changedBank: m })
    resetView()

  }
  const discardChanges = () => {
    resetView()

  }

  const addQuoteEditing = () => {
    let m = state.qLibrary[selected];
    m.quotes.push({ incorrect: 0, correct: 0, text: "New Quote" })
    dispatch({ type: "changeBank", bankIndex: selected, changedBank: m })
  }
  const resetProgress = (i) => {
    if (confirm("Reset Progress?")) {
      let m = state.qLibrary[selected]
      m.quotes[i].correct = 0;
      m.quotes[i].incorrect = 0;
      dispatch({ type: "changeBank", bankIndex: selected, changedBank: m })
    }

  }
  const deleteQuote = (i) => {
    if (state.qLibrary[selected].quotes.length > 1) {
      if (confirm("Delete quote?")) {
        dispatch({ type: "removeQuote", bankNum: selected, removedInd: i })

      }
    } else {
      alert("You must have at least one quote");
    }

  }

  let r = 300 + (state.qLibrary.length > 8 ? 140 / (2 * Math.PI) * (state.qLibrary.length - 8) : 0);
  return (
    <>
      <div className="App">
        <div className='books'>
          {state.qLibrary.map((book, index) => {

            return <div onClick={() => { if (selected !== index) setSelected(index); else setSelected(-1) }} style={{ position: 'fixed', transform: `translate(${r * Math.cos(2 * Math.PI * index / (state.qLibrary.length + 1))}px,${r * Math.sin(2 * Math.PI * index / (state.qLibrary.length + 1))}px)` }} className={`${reset == false ? (index === selected ? 'selBook' : 'book') : 'reset'}`} key={book.name}>
              {book.name}
            </div>

          })}
          <div onClick={() => setOpen(true)} style={{ position: 'fixed', transform: `translate(${r * Math.cos(2 * Math.PI * state.qLibrary.length / (state.qLibrary.length + 1))}px,${r * Math.sin(2 * Math.PI * state.qLibrary.length / (state.qLibrary.length + 1))}px)` }} className='adder'>
            +
          </div>

          <div className='actions'>
            {selected !== -1 ? <div className='bTitle'>{state.qLibrary[selected].name}</div> : <div className='bTitle'>Quotes</div>}
            <div className='action' onClick={() => { if (selected !== -1) setViewOn(true); }}>View</div>
            <div className='action' onClick={() => { if (selected !== -1) setLearnOn(true); }}>Learn</div>
            {/* <div className='action'>Revise</div> */}
          </div>
        </div>
        <div className='hardReset' onClick={() => { if (prompt("Type 'HARD RESET' to confirm") == "HARD RESET")  {localStorage.clear(); location.href='/'}}}>HARD RESET</div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className='quoteBank'>
            <div className='back' onClick={() => setOpen(false) || setTempQuotes(["Quote 1"])}>Cancel</div>
            <div className='main'>
              <input onChange={((e) => setTempName(e.target.value))} type="text" className="in" placeholder="Name of Quotebank" spellCheck="false"></input>
              <div className='quoteBankQuotes'>
                {tempQuotes.map((quote, index) => {

                  return <input key={index} onChange={((e) => handleChange(e, index))} type="text" className="in quoteBankQuote" placeholder={`Quote ${index + 1}`} spellCheck="false"></input>
                })}

              </div>
              <div className='plusQBQ' onClick={() => setTempQuotes([...tempQuotes, `Quote ${tempQuotes.length + 1}`])}>+ Add Another Quote</div>
              <div className='addQB' onClick={addQuoteBank}>Done</div>

            </div>
          </div>
        </Modal>

        <Modal open={viewOn} >
          {selected != -1 ? <div className='view'>
            <div className='titleM'>{state.qLibrary[selected].name}</div>
            <div className='mainS'>

              <div className='quotesV'>

                {state.qLibrary[selected].quotes.map((quote, index) => {
                  if (editOn) {
                    return <div key={index} onChange={(e) => handleEditChange(e, index)} className='quoteV'>
                      <input type="text" className="editQ" defaultValue={quote.text}></input>
                      <div className='numberV'>{index + 1}</div>

                      <div className='actionsEdit'>

                        <div className='resetProgress' onClick={() => { resetProgress(index) }}>Reset Progress</div>
                        <div className='deleteQuote' onClick={() => { deleteQuote(index) }}>Delete Quote</div>

                      </div>

                    </div>
                  } else {
                    return <div key={index} className='quoteV'><div>{quote.text}</div> <div className='numberV'>{index + 1}</div><div className='stats'><div className='correct'>Correct: {quote.correct}</div> <div className='incorrect'>Incorrect: {quote.incorrect}</div> </div></div>
                  }
                })}
              </div>

            </div>

            <div className='back2' onClick={() => { setViewOn(false); resetView(); }}>Back</div>
            <div className='editGen'>
              {
                editOn ? <div className='saveSt'>
                  <div className='save' onClick={saveChanges}>Save</div>
                  <div className='discard' onClick={discardChanges}>Discard</div>
                </div>
                  : <div className='edit' onClick={startEdit}>Edit</div>



              }
              <div className='addQuoteEdit' onClick={addQuoteEditing}>
                + Add Quote
              </div>
            </div>

            <div className='delete' onClick={() => del(selected)}>Delete ALL</div>
          </div> : ''
          }

        </Modal>

        <Modal open={learnOn}>
          {selected != -1 ? <>
            <div className='learn'>
              <div className='titleM'>{state.qLibrary[selected].name}</div>
              <div className='mainSpace'>
                <div className='quoteG' >
                  <div onClick={() => { setQuoteShown(!quoteShown) }} className={`quoteV clickable`}><div className={`${quoteShown ? 'shown' : 'hidden'}`}>{quoteShown ? state.qLibrary[selected].quotes[currNumber].text : 'Click to show'}</div> <div className={`${correct == 0 ? 'numberV' : correct == 1 ? 'numberVC' : 'numberVW'}`}>{currNumber + 1}</div></div>
                </div>
                <div><input ref={currentQuoteLearnRef} onKeyDown={(e) => { processLearn(e, state.qLibrary[selected].quotes[currNumber].text) }} onChange={(e) => { recordLearn(e) }} className='lAnswer' placeholder='Quote' onPaste={(e) => { e.preventDefault() }}></input></div>

              </div>


              <div className='back2' onClick={() => resetLearn()}>Back</div>
              <div className='up' onClick={backwards}>↑</div>
              <div className='down' onClick={forwards}>↓</div>
            </div>
          </> : ''}

        </Modal>
      </div>
    </>
  );
}

export default App;
