const BASE_STOP_WORDS: string[] = [
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "you're",
  "you've",
  "you'll",
  "you'd",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "she's",
  "her",
  "hers",
  "herself",
  "it",
  "it's",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "that'll",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "should've",
  "now",
  "d",
  "ll",
  "m",
  "o",
  "re",
  "ve",
  "y",
  "ain",
  "couldn",
  "hadn",
  "hasn",
  "haven",
  "isn",
  "ma",
  "mightn",
  "mustn",
  "needn",
  "shan",
  "shouldn",
  "wasn",
  "weren",
  "won",
  "wouldn",
];

const NEGATIVE_STOPWORDS_TO_KEEP: Set<string> = new Set([
  "not",
  "no",
  "never",
  "don't",
  "doesn't",
  "isn't",
  "aren't",
  "couldn't",
  "didn't",
  "hadn't",
  "hasn't",
  "haven't",
  "mightn't",
  "mustn't",
  "needn't",
  "nor",
  "shan't",
  "shouldn't",
  "wasn't",
  "weren't",
  "won't",
  "wouldn't",
]);

// The final, filtered set of stopwords
const STOP_WORDS: Set<string> = new Set(
  BASE_STOP_WORDS.filter((word) => !NEGATIVE_STOPWORDS_TO_KEEP.has(word))
);

const toLowerCase = (text: string): string => text.toLowerCase();

const removeHtmlTagsRegex = (text: string): string => {
  // Equivalent of re.compile('<.*?>')
  return text.replace(/<.*?>/g, "");
};

const removeNotations = (text: string): string => {
  return text.replace(/@\S+\s/g, " ");
};

const removeUrls = (text: string): string => {
  const urlPattern = /https?:\/\/\S+/g;
  return text.replace(urlPattern, "");
};

const removePunctuations = (text: string): string => {
  return text.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");
};

const removeNonAscii = (text: string): string => {
  return text.replace(new RegExp("[^\\x00-\\x7F]", "g"), "");
};


const removeDigits = (text: string): string => {
  return text.replace(/[0-9]/g, "");
};


const removeStopwords = (text: string): string => {
  const tokens = text.split(/\s+/).filter(Boolean);
  const filteredTokens = tokens.filter((token) => !STOP_WORDS.has(token));
  return filteredTokens.join(" ");
};

const preprocessText = (text: string): string => {
  if (typeof text !== "string" || text === null) return "";
  text = toLowerCase(text);
  text = removeHtmlTagsRegex(text);
  text = removeNotations(text);
  text = removeUrls(text); // Moved up as it often contains punctuation/case issues
  text = removePunctuations(text);
  text = removeNonAscii(text);
  text = removeDigits(text);
  text = removeStopwords(text);
  text = text.trim().replace(/\s+/g, " ");
  return text;
};

export default preprocessText;
