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

export function lerp(text: string, step: number): string {
  if (step > 1) return text;

  const percent = step <= 0 ? 0 : Math.floor(text.length * step);

  const left = text.slice(0, percent);
  const right: string[] = [];

  for (let i = percent, r = 0; i < text.length; i++, r++) {
    right[i - percent] = text[i] === space ? space : randomCharacters[r & 0xf][i & 0x3f];
  }

  return left + right.join("");
}
