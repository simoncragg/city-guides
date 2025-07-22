import { renderHook } from "@testing-library/react";

import useMarkdownDeferrer from "../useMarkdownDeferrer";

describe("useMarkdownDeferrer → deferIncompleteMarkdown", () => {
  let deferIncompleteMarkdown: (delta: string) => string;

  beforeEach(() => {
    const { result } = renderHook(useMarkdownDeferrer);
    deferIncompleteMarkdown = result.current.deferIncompleteMarkdown;
  });

  it.each([
    ["Hi"], 
    [" test"], 
    [". "]
  ])("passes through already complete markdown → '%s'", (delta) => {
    expect(deferIncompleteMarkdown(delta)).toEqual(delta);
  });

  it.each([
    [ ["**", "Hi", "**"], "**Hi**" ],
    [ ["[", "Hi", "]", "(", "url", ")"], "[Hi](url)" ],
    [ ["![", "Alt", "]", "(", "url", ")"], "![Alt](url)" ],
    [ ["[", "![", "Alt", "]", "(", "url", ")", "]", "(", "url", ")"], "[![Alt](url)](url)" ],
  ])(
    "buffers incomplete markdown until complete, then flushes → %#",
    (deltas, expected) => {
      const { leading, final } = splitDeltas(deltas);
      leading.forEach((delta) =>
        expect(deferIncompleteMarkdown(delta)).toBe("")
      );
      expect(deferIncompleteMarkdown(final)).toBe(expected);
    }
  );

  it.each([
    [" ab cd **", " ab cd "],
    [" xx [", " xx "],
    [" abc ![", " abc "],
    [" 1234 [", " 1234 "],
  ])(
    "passes through content preceding the incomplete markdown → %#",
    (delta, expected) => {
      expect(deferIncompleteMarkdown(delta)).toBe(expected);
    }
  );

  it.each([
    [ ["**", "Hi", "** there"], "**Hi** there" ],
    [ ["[", "Hi", "]", "(url) end"], "[Hi](url) trailing" ],
    [ ["[", "![", "Alt", "]", "(", "url", ")", "]", "(url) end"], "[![Alt](url)](url) trailing" ],
  ])(
    "flushes complete markdown AND trailing content → %#",
    (deltas, expected) => {
      const { leading, final } = splitDeltas(deltas);
      leading.forEach((delta) =>
        expect(deferIncompleteMarkdown(delta)).toBe("")
      );
      expect(deferIncompleteMarkdown(final)).toBe(expected);
    }
  );

  const splitDeltas = (deltas: string[]) => {
    const leading = deltas.slice(0, -1);
    const final = deltas.at(-1)!;
    return { leading, final };
  };
});

describe("useMarkdownDeferrer → flush", () => {
  it("flushes defer-once character '!'", () => {
    const { result } = renderHook(useMarkdownDeferrer);
    const { deferIncompleteMarkdown, flush } = result.current;
    expect(deferIncompleteMarkdown("!")).toEqual("");
    expect(flush()).toEqual("!");
  });
});
