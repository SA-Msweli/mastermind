// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { generateCode, isCorrectCorrect, isCorrectWrong } from './mastermind.js';

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
  height: 'regular',
  render: (_context) => {
    let codeNew = generateCode();
    const [attempts, setAttempts] = useState(0);
    const [guess, setGuess] = useState(``);
    const [code, setCode] = useState(codeNew[0]);
    const [hiddenCode, setHiddenCode] = useState(codeNew[1]);
    const [level, setLevel] = useState(0);
    const [difficulty, setDifficulty] = useState(1);

    return (
      <vstack height="100%" width="100%" gap="medium" alignment="start top">
        <image
          url="logo.png"
          description="logo"
          imageHeight={256}
          imageWidth={256}
          height="48px"
          width="48px"
        />
        <text size="medium">{`Here is your clue ${hiddenCode}`}:</text>
        <text size="medium">Enter your guess:</text>
        <text size="large">{`You have tried: ${attempts} time(s)`}</text>
        <button appearance="primary" onPress={() => {
          codeNew = generateCode();
          setCode(codeNew[0]);
          setHiddenCode(codeNew[1]);
        }}>
          Click me!
        </button>
      </vstack>
    );
  },
});

export default Devvit;
