import css from "./Quotes.module.css";

export const Quotes = () => {
  return (
    <div class={css.container}>
      <button class={css.button}>Prev</button>
      <div class={css.content}>Some quote text here.</div>
      <button class={css.button}>Next</button>
    </div>
  );
};
