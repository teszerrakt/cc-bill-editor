type Params = {
  lines: string[];
  index: number;
  patterns: RegExp[];
  separator?: string;
};

export const joinMultipleLines = ({
  lines,
  index,
  patterns,
  separator = "\t",
}: Params): string => {
  let line = lines[index];
  let nextLine = lines[index + 1];
  let isLastLine = !nextLine;
  let isMatch = patterns.some((pattern) => pattern.test(nextLine));

  while (!isLastLine && !isMatch) {
    line += `${separator}${nextLine}`;
    index++;
    nextLine = lines[index + 1];
    isLastLine = !nextLine;
    isMatch = patterns.some((pattern) => pattern.test(nextLine));
  }

  return line;
};
