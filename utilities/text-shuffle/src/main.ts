const randomCharacters: readonly string[] = [
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZaI",
  "Q93uNJw5CEWDh4yqKbLj2dV07crHk1BRaSTvomgIeszUptZPXMOAFnY68xGfliop",
  "NATqpnHvL3UmZYusBxXdfaOrt9JF6cC180RzSj5GlwP27MoiVWy4KDIEhbQkge7c",
  "EV1emAqU3uBxizd90jYPgnsv4cTfI7SXp2rtJbHahQD5NkLwyZoKF6COW8lMGRt9",
  "rCDXVGcdqF5uN4Oz67f32pyQ9i8etBjUIh0ALgoMkvEmbH1ZTwlYRPSsxJnaKW4c",
  "RJiEylGhS3nTNDpcsfAzIwWHx4r8jo7O1gP2ZQbatk6U0MqeXB9LvCdYF5muVK9i",
  "9YUQCy2lAweKVuzkFbx78fJcShTIRB43maHpPsW6GvXdq5NLZOiD0rEgjno1tMx4",
  "bsRQ54XtAJyqS9H1kacpfB62Ydw0hPmWjUi78xovErMFCeulzO3ZVDgIKGNnTLSh",
  "hM7GXvW6zDmSHdBRsYjEulqo81L4C5Fn3IpOyPt2ZVx0QKebJfiArcT9gkaNUwYd",
  "pKijhakuD3JeGqWXrCbNg509dHMsV8TI4YwBE2A1mQOtRSnPvofxlyzF6ZLc7U81",
  "rWJgCSxkVO87Gph41TQ0bqd5Ms9ZBFzYnE2utHKPXvLAa6RlyeUmIiw3cfNoDjdH",
  "6zX3PJ12fenb0WuNFRC7HTjlUOpdLBAchaKtYmG5v8SxMogi4yEw9rDsQkqZIVMs",
  "J3ElZYL9o28jhO0mK5UXMIvCitsNz4uWGarFSpQfyk16TwgnDVbdBAPReHx7cqUO",
  "cyfqptgkB6X3e1MRZEnzwiOa2LJbQNTdxAF9SGhsr85Km0V7IlojuvWPC4YHDUit",
  "DlPdQXbTCrHgAUWsFfcuL0Jj2Sz5RItKVNkpM3Oix4mB6EnyqZ7e18aoGvwh9Y2L",
  "qWze2COHbgEu4xURiTrV7tM9AI1DlKdGY30XfNmyBcFpavkwj8ZnSQLPs6hoJ52S",
] as const;

const space: string = " ";

/**
 * Recursive text shuffle effect going from left to right.
 * @param text The original text.
 * @param callback Resulting callback with a string parameter.
 * @param step Used internally for the recursion.
 */
export function start(
  text: string,
  callback: (result: string) => void,
  step: number = 0,
): void {
  if (step > text.length) return;

  const textLength = text.length;

  const left = text.slice(0, step);
  const right: string[] = new Array(textLength - step);

  for (let i = step; i < textLength; i++) {
    right[i - step] = text[i] === space ? space : randomCharacters[(i - step) & 0xf][i & 0x3f];
  }

  callback(left + right.join(""));

  setTimeout(() => {
    start(text, callback, step + 1);
  }, 0xf);
}
