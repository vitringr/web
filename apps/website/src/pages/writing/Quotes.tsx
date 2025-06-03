import { createSignal } from "solid-js";
import css from "./Quotes.module.css";


export const Quotes = () => {
  const [shuffleText, setShuffleText] = createSignal(
    "By the 16th century, the present set of 26 letters had largely stabilised.",
  );

  // shuffle(shuffleText(), 0, setShuffleText);

  return (
    <div class={css.container}>
      <button class={css.button}>Prev</button>
      <div class={css.content}>{shuffleText()}</div>
      <button class={css.button}>Next</button>
    </div>
  );
};
