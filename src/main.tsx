import { Devvit, useState } from '@devvit/public-api';
import { generateCode, isCorrectCorrect, isCorrectWrong } from './mastermind.js';
// import { NumPad, entry } from './numpad.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
  media: true,
  http: true
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add New Mastermind Game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting a new Game - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Mastermind!',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Add New Mastermind Game',
  description: 'Create a new mastermind game to play with the community',
  height: 'tall',
  render: (_context) => {
    const [words, setWords] = useState("");
    const [stage, setStage] = useState(1);
    const [level, setLevel] = useState(0);
    const [difficulty, setDifficulty] = useState(1);
    const [passed, setPassed] = useState(false);
    const [attempted, setAttempted] = useState(false);
    const [guess, setGuess] = useState("");
    const [message1, setMessage1] = useState("");
    const [message2, setMessage2] = useState("");
    const [message, setMessage] = useState("");

    let codeNew = generateCode(words, level, difficulty);
    const [code, setCode] = useState(codeNew[0]);
    const [hiddenCode, setHiddenCode] = useState(codeNew[1]);

    function NumPad({ n }: { n: number }): JSX.Element {
      const [numbers, setNumbers] = useState(Array.from({ length: n }, (_, i) => (i + 1).toString()));

      function Button({ text }: { text: string }): JSX.Element {
        return <button appearance='secondary' disabled={text === "*" || text === "#"}
          onPress={() => {
            buttonPress(text);
          }}>{text}</button>;
      }

      function ButtonRow({ row }: { row: string[] }): JSX.Element {
        return (
          <hstack gap='small'>
            {row.map((button) => (
              <Button text={button.toString()}></Button>
            ))}
          </hstack>
        );
      }

      function ButtonGrid({ numbers }: { numbers: string[] }): JSX.Element {
        return (
          <vstack gap='small'>
            <ButtonRow row={numbers.slice(0, 3)}></ButtonRow>
            <ButtonRow row={numbers.slice(3, 6)}></ButtonRow>
            <ButtonRow row={numbers.slice(6, 9)}></ButtonRow>
            <ButtonRow row={["*", "0", "#"]}></ButtonRow>
          </vstack>
        );
      }

      return (
        ButtonGrid({ numbers: numbers })
      );
    }

    function buttonPress(text: string): void {
      const userCode = guess + text;
      setGuess(userCode);
      if (userCode.length === code.length)
        attempt(userCode)
      else {
        if (attempted) {
          setAttempted(false);
          setMessage("");
          setMessage1("");
          setMessage2("");
        }
      }
    }

    function attempt(userCode: string): void {
      if (code === userCode) {
        win();
      } else {
        lose(userCode);
      }
      setAttempted(true);
      setGuess("");
    }

    function win(): void {
      setHiddenCode(code);
      setMessage("PASSED!")
      setMessage1("");
      setMessage2("");
      setPassed(true);
    }

    function lose(userCode: string): void {
        setMessage("FAILED!")
        setMessage1(`Correct in correct place: ${isCorrectCorrect(code, userCode)}`);
        setMessage2(`Correct in incorrect place: ${isCorrectWrong(code, userCode)}`);
    }

    function nextStage(): void {
      if (difficulty < code.length) {
        setDifficulty((difficulty:number)=>difficulty + 1);
        startGame(level, difficulty + 1);
      } else {
        setDifficulty((difficulty:number)=>difficulty - 2);
        setLevel((level:number)=>level + 1);
        startGame(level + 1, difficulty - 2);
      }
      setStage((stage:number)=>stage + 1);
    }

    function startGame(level: number, difficulty: number): void {
      codeNew = generateCode(words, level, difficulty);
      setCode(codeNew[0]);
      setHiddenCode(codeNew[1]);
      setAttempted(false);
      setPassed(false);
      setMessage("");
    }

    function reset() {
      setLevel(0);
      setDifficulty(1);
      setAttempted(false);
      setPassed(false);
      setGuess("");
      setMessage("");
      setMessage1("");
      setMessage2("");
      setPassed(false);
      startGame(0, 1);
    }

    function imageSrc():string{
      if(passed) {
        const dir = `happy${Math.floor(Math.random()*4+1)}.png`;
        return dir;
      }
      return `${difficulty}.png`;
    }

    return (
      <vstack height="100%" width="100%" gap="small" alignment="center middle">

        <hstack gap='large' alignment='end middle'>
          <image
            url={imageSrc()}
            description="difficulty"
            imageHeight={256}
            imageWidth={256}
            height="100px"
            width="100px" />
          <vstack gap="small">
            <text size="large" wrap={true} alignment='start middle'>Break the code</text>
            <text alignment='start' size='large'>{`Stage: ${stage}`}</text>
          </vstack>
        </hstack>

        <text size="xxlarge">{hiddenCode}</text>
        <text size="xxlarge">{guess}</text>
        <text size='xxlarge'>{message}</text>
        <text size='large'>{message1}</text>
        <text size='large'>{message2}</text>
        <hstack gap='small'>
          <NumPad n={9}></NumPad>
          <vstack gap='small' alignment='bottom center'>
            <button appearance='success' width="100%" disabled={!passed} onPress={() => {
              nextStage();
            }}>Continue</button>
            <button appearance='caution' width="100%" onPress={() => {
              reset();
            }}>Reset</button>
          </vstack>
        </hstack>
      </vstack>
    );
  },
});

export default Devvit;
