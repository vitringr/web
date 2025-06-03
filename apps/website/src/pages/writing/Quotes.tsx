import { createSignal } from "solid-js";

import { TextShuffle } from "@utilities/text-shuffle";

import css from "./Quotes.module.css";
import { quotesList } from "./quotes-data";

export const Quotes = () => {
  const [index, setIndex] = createSignal(
    Math.floor(Math.random() * quotesList.length),
  );

  const [quoteText, setQuoteText] = createSignal(quotesList[index()].text);
  const [quoteAuthor, setQuoteAuthor] = createSignal(
    quotesList[index()].author,
  );

  function shuffle() {
    const quote = quotesList[index()];

    setQuoteText(quote.text);
    setQuoteAuthor(quote.author);

    const duration = 1_000;
    const steps = 40;
    const increment = 1 / steps;

    let step = 0;
    const interval = setInterval(() => {
      if (step > 1) clearInterval(interval);
      setQuoteText(TextShuffle.lerp(quote.text, (step += 1 / steps)));
      setQuoteAuthor(TextShuffle.lerp(quote.author, (step += increment)));

      console.log(step.toFixed(2));
    }, duration / steps);

    // clearInterval(interval);
  }

  shuffle();

  return (
    <div class={css.container}>
      <button
        class={css.button}
        onclick={() => {
          setIndex((index() - 1) % quotesList.length);
          shuffle();
        }}
      />

      <div class={css.content}>
        <div>{quoteText()}</div>
        <br />
        <div>{quoteAuthor()}</div>
      </div>

      <button
        class={css.button}
        onclick={() => {
          setIndex((index() + 1) % quotesList.length);
          shuffle();
        }}
      />
    </div>
  );
};
