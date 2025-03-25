import { Devvit, useState } from '@devvit/public-api';

export function NumPad({n}:{n:number}) {
  let [entry, setEntry] = useState("");
  const [numbers, setNumbers] = useState(Array.from({length: n}, (_, i) => (i + 1).toString()));
  
  function Button({text}:{text:string}) {
    return <button appearance='secondary' disabled={text === "*" || text === "#"}
    onPress={()=>{
      setEntry(entry=text);
    }}>{text}</button>;
  }

  function ButtonRow({row}:{row:string[]}) {
    return (
      <hstack gap='medium'>
        {row.map((button) => (
          <Button text={button.toString()}></Button>
        ))}
      </hstack>
    );
  }

  function ButtonGrid({numbers}:{numbers:string[]}) {
    return (
      <vstack gap='medium'>
        <ButtonRow row={numbers.slice(0, 3)}></ButtonRow>
        <ButtonRow row={numbers.slice(3, 6)}></ButtonRow>
        <ButtonRow row={numbers.slice(6, 9)}></ButtonRow>
        <ButtonRow row={["*","0","#"]}></ButtonRow>
      </vstack>
    );
  }

  return (
    ButtonGrid({numbers: numbers})
  );
}