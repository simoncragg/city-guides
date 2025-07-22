import { useRef } from "react";

type Pattern = {
  head: string;
  sequences: string[];
};

const IMAGE: Pattern = { head: "![", sequences: ["![]()"] };
const LINK: Pattern = { head: "[", sequences: ["[]()", "[****]()", "[![]()]()"] };
const BOLD: Pattern = { head: "**", sequences: ["****"] };

const patternsOfInterst: Pattern[] = [IMAGE, LINK, BOLD];
const charactersOfInterest = new Set(["*", "!", "[", "]", "(", ")"]);

const useMarkdownDeferrer = () => {
  const buffer = useRef<string>("");
  const activePattern = useRef<Pattern | null>(null);
  const deferOnce = useRef<string>("");

  const deferIncompleteMarkdown = (delta: string): string => {
    const combinedDelta = deferOnce.current + delta;
    deferOnce.current = "";
    return processDelta(combinedDelta);
  };

  const processDelta = (delta: string): string => {
    if (buffer.current === "") {
      if (delta === "!" || delta === " !") {
        deferOnce.current = delta;
        return "";
      }

      let headIndex = -1;
      for (let i = 0; i < patternsOfInterst.length; i++) {
        const pattern = patternsOfInterst[i];
        headIndex = delta.indexOf(pattern.head);
        if (headIndex > -1) {
          buffer.current += delta.substring(headIndex);
          activePattern.current = pattern;
          break;
        }
      }

      return headIndex > -1
        ? delta.substring(0, headIndex)
        : delta;
    }

    buffer.current += delta;
    const seq = extractSequence(buffer.current);

    for (let i = 0; i < activePattern.current!.sequences.length; i++) {
      if (seq === activePattern.current!.sequences[i]) {
        return flush();
      }
    }

    return "";
  };

  const extractSequence = (input: string): string => {
    let sequence = "";
    for (let i = 0; i < input.length; i++) {
      if (charactersOfInterest.has(input[i])) {
        if (input[i] === "!" && sequence.slice(-1) === "(") {
          continue;
        }
        sequence += input[i];
      }
    }
    return sequence;
  };

  const flush = () => {
    const output = buffer.current + deferOnce.current;
    buffer.current = "";
    activePattern.current = null;
    deferOnce.current = "";
    return output;
  };

  return { deferIncompleteMarkdown, flush };
};

export default useMarkdownDeferrer;
