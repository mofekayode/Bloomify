import { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import { newFilter, BloomFilters } from "./BloomFilter.js";
import setting from "./setting.svg";
import "./App.css";
import styled from "styled-components";
function App() {
  const inputRef = useRef();

  const [memory, setMemory] = useState(5000);
  const [hashFunctions, setHashFunctions] = useState(6);
  const [stats, setGeneratedStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleWordsChange = (e) => {
    let words = e.target.outerText;
    createWordRange(words.split(" "));
  };
  function createWordRange(words) {
    let letters = /[A-Za-z]/gi;
    let result = "";
    words.forEach((word) => {
      if (
        !newFilter.isBloomWord(word) &&
        word.trim().match(letters)?.length === word.trim().length
      ) {
        result += `<span class="error">${word} </span>`;
      } else {
        result += word + " ";
      }
    });
    inputRef.current.innerHTML = result;
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(inputRef.current);
    selection.removeAllRanges();
    range.collapse(false);
    selection.addRange(range);
    inputRef.current.focus();
  }

  function generateWords() {
    setLoading(true);
    let Filter = new BloomFilters(memory * 1000, hashFunctions);
    const statistics = Filter.bloomFilterAnalysis();
    createWordRange(statistics.generatedWords);
    setGeneratedStats(statistics);
  }

  return (
    <div className="App">
      <Logo>
        <img width="100%" src={logo} />
      </Logo>

      <Grid>
        <div style={{ position: "relative" }}>
          <Clear
            onClick={() => {
              createWordRange([]);
            }}
          >
            X Clear
          </Clear>
          <Text
            contentEditable={true}
            suppressContentEditableWarning={true}
            spellCheck={false}
            ref={inputRef}
            placeholder="Start typing to spell check"
            onInput={handleWordsChange}
          ></Text>
        </div>

        <Settings>
          <div className="container container--dark">
            <h1>
              Settings{" "}
              <span>
                <img width="20px" src={setting} />
              </span>
            </h1>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "20px", margin: "10px 0px" }}>
                <span style={{ marginRight: "10px", color: "#aaa" }}>
                  Memory
                </span>
                <input
                  className="range"
                  type="range"
                  min="1000"
                  max="10000"
                  value={memory}
                  onChange={(e) => {
                    setMemory(e.target.value);
                  }}
                  step="10"
                />
                <output id="rangevalue2">{memory} KB</output>
              </div>

              <div style={{ marginBottom: "20px", margin: "10px 0px" }}>
                <span style={{ marginRight: "10px", color: "#aaa" }}>
                  Hashes
                </span>
                <input
                  className="range"
                  type="range"
                  min="1"
                  max="10"
                  value={hashFunctions}
                  onChange={(e) => {
                    setHashFunctions(e.target.value);
                  }}
                  step="1"
                />
                <output id="rangevalue2">{hashFunctions} hashes</output>
              </div>
            </div>
            <Generate onClick={generateWords}>Generate</Generate>
            {loading && !stats && <h2>Calculating...</h2>}

            {stats && (
              <div>
                <h2>Statistics</h2>
                <p>Random words generated: 10000 words</p>
                <p>Actual real words: {stats?.actualWordCount} words</p>
                <p>Bloom filter real words: {stats?.bloomWordCount} words</p>
                <p>
                  Percentage of false positives:{" "}
                  {stats?.percentageOfFalsePositives?.toFixed(4)}%
                </p>
              </div>
            )}
          </div>
        </Settings>
      </Grid>
    </div>
  );
}
const Grid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  width: 80%;
  margin: 100px auto;
  @media only screen and (max-width: 1000px) {
    margin: 50px auto;
    grid-template-columns: 1fr;
    width: 95%;
  } ;
`;
const Clear = styled.div`
  color: #aaa;
  /* background:#000; */
  text-align: center;
  width: 100px;
  padding: 15px 10px;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  right: 40px;
  top: -40px;
`;
const Text = styled.div`
  width: 80%;
  height: 400px;
  font-family: Lato;
  line-height: 40px;
  outline: none;
  border: none;
  font-size: 1.5em;
  &[placeholder]:empty:before {
    content: attr(placeholder);
    color: #555;
    font-size: 1em;
  }
  height: 70vh;
  overflow: scroll;
  @media only screen and (max-width: 1000px) {
    width: 95%;
    margin-bottom: 10px;
  } ;
`;
const Generate = styled.div`
  cursor: pointer;
  padding: 10px 20px;
  color: #aaa;
  width: 70px;
  border: 1px solid #aaa;
  border-radius: 5px;
  margin: 30px auto;
  &:hover {
    color: #ffff;
    border: 1px solid #ffff;
  }
`;

const Logo = styled.div`
  width:180px;
  cursor:pointer;
  margin:30px;
}
`;
const Settings = styled.div`
 width:100%;
 display:flex;
 justify-content:center;
 height:fit-content;
 max-height:550px;
}`;
export default App;
