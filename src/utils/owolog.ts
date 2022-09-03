const kaomoji = [
  "(*^ω^)",
  "(◕‿◕✿)",
  "(◕ᴥ◕)",
  "ʕ•ᴥ•ʔ",
  "ʕ￫ᴥ￩ʔ",
  "(*^.^*)",
  "owo",
  "OwO",
  "(｡♥‿♥｡)",
  "uwu",
  "UwU",
  "(*￣з￣)",
  ">w<",
  "^w^",
  "(つ✧ω✧)つ",
  "(/ =ω=)/",
];

function owoify(text: string) {
  return text
    .replace(/(?:l|r)/g, "w")
    .replace(/(?:L|R)/g, "W")
    .replace(/n([aeiou])/g, "ny$1")
    .replace(/N([aeiou])|N([AEIOU])/g, "Ny$1")
    .replace(/ove/g, "uv")
    .replace(/nd(?= |$)/g, "ndo")
    .replace(/!+/g, " " + kaomoji[Math.floor(Math.random() * kaomoji.length)]);
}

const lawg = console.log.bind({});
console.log = (msg) => lawg(owoify(msg));
