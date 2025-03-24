export function play() {

}

export function getNumber(c_min = 4, level = 0) {
  let code = "";
  const count = c_min + level;
  while (code.length < count) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

export function getWord(words) {
  const wordsMap = JSON.parse(words);
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const c = alpha[Math.floor(Math.random() * 26)];
  const c_words = wordsMap[c];
  return c_words[Math.floor(Math.random() * c_words.length)];
}

export function generateCode(words="") {
  let code;
  if (words === "") {
    code = getNumber();
  } else {
    code = getWord();
  }
  return [code,hide(code)];
}

function hideRandom(c) {
  return Math.round(Math.random()) === 1 ? [1, '_'] : [0, c];
}

function hide(code, diff = 0, difficulty =1) {
  let hidden = "";
  for (var c of code) {
    if (diff === difficulty) {
      hidden += c;
      continue;
    }
    if (c !== '_') {
      const hide = hideRandom(c);
      diff += hide[0];
      c = hide[1];
    }
    hidden += c;
  }
  return diff == difficulty ? hidden : hide(hidden, diff, difficulty);
}

export function isCorrectCorrect(code, guess) {
  let count = 0;
  if (code.length != guess.length) return -1;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === guess[i]) count++;
  }
  return count;
}

export function isCorrectWrong(code, guess) {
}