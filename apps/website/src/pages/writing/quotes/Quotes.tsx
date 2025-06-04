import { createSignal } from "solid-js";

import { TextShuffle } from "@utilities/text-shuffle";

import css from "./Quotes.module.css";
import { quotesList } from "./quotes-data";

const config = {
  duration: 1_000,
  steps: 18,
};

export const Quotes = () => {
  const [index, setIndex] = createSignal(
    Math.floor(Math.random() * quotesList.length),
  );

  const [quoteText, setQuoteText] = createSignal(quotesList[index()].text);
  const [quoteAuthor, setQuoteAuthor] = createSignal(
    quotesList[index()].author,
  );

  let intervalID: number;

  function reShuffle() {
    const quote = quotesList[index()];

    setQuoteText(quote.text);
    setQuoteAuthor(quote.author);

    clearInterval(intervalID);

    let step = 0;
    const increment = 1 / config.steps;
    intervalID = setInterval(() => {
      if (step > 1) clearInterval(intervalID);
      setQuoteText(TextShuffle.lerp(quote.text, (step += increment)));
      setQuoteAuthor(TextShuffle.lerp(quote.author, (step += increment)));
    }, config.duration / config.steps);
  }

  reShuffle();

  return (
    <div class={css.container}>
      <button
        class={css.button}
        onclick={() => {
          setIndex(index() - 1 < 0 ? quotesList.length - 1 : index() - 1);
          reShuffle();
        }}
      />

      <div class={css.content}>
        <span class={css.text}>{quoteText()}</span>
        <br />
        <span class={css.text}>{quoteAuthor()}</span>
      </div>

      <button
        class={css.button}
        onclick={() => {
          setIndex((index() + 1) % quotesList.length);
          reShuffle();
        }}
      />
    </div>
  );
};
