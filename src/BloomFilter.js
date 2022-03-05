import { words } from "./words";
export class BloomFilters {
  constructor(bytes = 5000000, hashFunctions = 6) {
    this.bitSet = Array(bytes).fill(0);
    this.hashFunctions = hashFunctions;
    this.words = words;
    this.arr = [];
    this.hashSet = new Set();
    this.words.forEach((word) => {
      this.setPositions(word.toLowerCase());
      this.hashSet.add(word.toLowerCase());
      this.arr.push(word);
    });
  }
  setPositions(string) {
    string = string.toLowerCase();
    let positions = this.getStringHashes(string);
    positions.forEach((position) => {
      this.bitSet[position] = 1;
    });
  }
  getPosition(position) {
    return this.bitSet[position];
  }
  getAllPosition() {
    return this.bitSet;
  }
  getStringHashes(string) {
    string = string.toLowerCase();
    let hashNumbers = [];
    for (let i = 1; i <= this.hashFunctions; i++) {
      let hashValue =
        Math.abs(
          string
            .split("")
            .reduce((a, b) => ((a << i) - a + b.charCodeAt(0)) | 0, 0)
        ) % this.bitSet.length;
      hashNumbers.push(hashValue);
    }
    return hashNumbers;
  }
  isBloomWord(string) {
    string = string.toLowerCase();
    let hashes = this.getStringHashes(string);
    return hashes.every((hash) => this.bitSet[hash]);
  }
  isActualWord(string) {
    string = string.toLowerCase();
    return this.hashSet.has(string);
  }
  isAFalsePositive(string) {
    return this.isBloomWord(string) !== this.isActualWord(string);
  }
  makeRandomWord(length = 5) {
    let result = "";
    let characters = "abcdefghijklmnopqrstuvwxyz";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  generateTenThousandWords(length = 10000) {
    let words = [];
    for (let i = 1; i <= length; i++) {
      words.push(this.makeRandomWord());
    }
    return words;
  }
  bloomFilterAnalysis(length = 10000) {
    let generatedWords = this.generateTenThousandWords(length);
    let generatedWordsLength = generatedWords.length;
    let actualWordList = generatedWords.filter((word) =>
      this.isActualWord(word)
    );
    let bloomFilterList = generatedWords.filter((word) =>
      this.isBloomWord(word)
    );
    let actualWordCount = 0;
    let bloomWordCount = 0;
    let numberOfFalsePositives = 0;
    generatedWords.forEach((word) => {
      actualWordCount += this.isActualWord(word);
      bloomWordCount += this.isBloomWord(word);
      numberOfFalsePositives += this.isAFalsePositive(word);
    });
    let percentageOfFalsePositives =
      (numberOfFalsePositives / generatedWords.length) * 100;
    return {
      actualWordCount,
      bloomWordCount,
      numberOfFalsePositives,
      percentageOfFalsePositives,
      generatedWordsLength,
      actualWordList,
      bloomFilterList,
      generatedWords,
    };
  }
}

export const newFilter = new BloomFilters();
