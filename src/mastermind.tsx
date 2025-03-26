export function play() {

}

export function getNumber(level:number=0,c_min:number=4) {
  let code = "";
  const count = c_min + level;
  while (code.length < count) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

export function getWord(words:string="{}"):string {
  const wordsMap = JSON.parse(words);
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const c = alpha[Math.floor(Math.random() * 26)];
  const c_words = wordsMap[c];
  return c_words[Math.floor(Math.random() * c_words.length)];
}

export function generateCode(words:string="{}", level:number=0, difficulty:number=1):string[] {
  let code;
  if (words === "") {
    code = getNumber(level);
  } else {
    code = getWord();
  }
  return [code,hide(code, difficulty)];
}


function hide(code:string="",difficulty:number=0, diff:number=0):string {

  function hideRandom(c:string=""):[number,string] {
    return Math.round(Math.random()) === 1 ? [1, '#'] : [0, c];
  }

  let hidden = "";
  for (var c of code) {
    if (diff === difficulty) {
      hidden += c;
      continue;
    }
    if (c !== '#') {
      const hide = hideRandom(c);
      diff += hide[0];
      c = hide[1];
    }
    hidden += c;
  }
  return (diff === difficulty || diff===code.length) ? hidden : hide(hidden, difficulty, diff);
}

export function isCorrectCorrect(code:string="", guess:string=""):number {
  let count = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === guess[i]) count++;
  }
  return count;
}

export function isCorrectWrong(code:string="", guess:string=""):number {
  let count = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] !== guess[i] && code.includes(guess[i])) count++;
  }
  return count;
}