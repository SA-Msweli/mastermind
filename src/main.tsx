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
    const [level, setLevel] = useState(0);
    const [difficulty, setDifficulty] = useState(1);
    let [timer, setTimer] = useState(60);
    let [tried, setTried] = useState(false);
    let [guess, setGuess] = useState("");
    let [message1, setMessage1] = useState("");
    let [message2, setMessage2] = useState("");
    let [message, setMessage] = useState("");

    let codeNew = generateCode(words, level, difficulty);
    const [code, setCode] = useState(codeNew[0]);
    const [hiddenCode, setHiddenCode] = useState(codeNew[1]);

    function NumPad({ n }: { n: number }) {
      const [numbers, setNumbers] = useState(Array.from({ length: n }, (_, i) => (i + 1).toString()));

      function Button({ text }: { text: string }) {
        return <button appearance='secondary' disabled={text === "*" || text === "#"}
          onPress={() => {
            setGuess(guess + text);
            if (guess.length === guess.length)
              checkAttemp()
            else {
              if (tried) {
                setTried(false);
                setGuess(text);
              }
            }
          }}>{text}</button>;
      }

      function ButtonRow({ row }: { row: string[] }) {
        return (
          <hstack gap='medium'>
            {row.map((button) => (
              <Button text={button.toString()}></Button>
            ))}
          </hstack>
        );
      }

      function ButtonGrid({ numbers }: { numbers: string[] }) {
        return (
          <vstack gap='medium'>
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

    function evalGuess() {
    }

    function checkAttemp() {
      if (code === guess) {
        setMessage("Congatulations you WIN!")
      } else {
        setMessage1(`${isCorrectCorrect(code, guess)}`);
        setMessage2(`${isCorrectWrong(code, guess)}`);
      }
    }

    return (
      <vstack height="100%" width="100%" gap="small" alignment="center top">

        <hstack gap="large">
          <image
            url="logo.png"
            description="logo"
            imageHeight={256}
            imageWidth={256}
            height="60px"
            width="60px" />
          <vstack gap="small">
            <text size="large" wrap={true} alignment='start middle'>Break the code before time runs out!</text>
            <text size="xxlarge">{timer}</text>
          </vstack>
        </hstack>

        <text size="xxlarge">{hiddenCode}</text>
        <text size="xxlarge">{guess}</text>
        <text size='large'>{message}</text>
        <text size='large'>{message1}</text>
        <text size='large'>{message2}</text>
        <NumPad n={9}></NumPad>
      </vstack>
    );
  },
});

export default Devvit;
