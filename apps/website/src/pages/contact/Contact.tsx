import { Links } from "../../links";

export const Contact = () => {
  return (
    <div class="page">
      <h1>Contact</h1>
      <p>Contact page text.</p>

      <div>
        <a href={Links.contact.mail}>Mail</a>
      </div>

      <div>
        <a href={Links.contact.github}>GitHub</a>
      </div>

      <div>
        <a href={Links.contact.twitter}>X</a>
      </div>
    </div>
  );
};
