let timer = 60;
let passed = false;
async function countdown() {
  const interval = setInterval(() => {
    timer=timer - 1;
    if (timer === 0 || passed) {
      clearInterval(interval);
    }
    console.log(timer);
  }, 1000);
}

countdown();