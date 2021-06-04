const nearley = require("nearley");
const grammar = require("./grammar.js");
const lexer = require("./lex");
const argv = require("minimist")(process.argv.slice(2));
const readline = require("readline");

const treeMode = argv["t"];
const expr = argv["e"];

const compiledGrammar = nearley.Grammar.fromCompiled(grammar);

const parseLine = (line) => {
  line = line.replace(/\s+/g, "");
  console.log(line);
  if (treeMode) {
    lexer.reset(line);
    for (const token of lexer) {
      console.log(token);
    }
  } else {
    const parser = new nearley.Parser(compiledGrammar);
    parser.feed(line);
    console.log(parser.results);
  }
};

if (expr) {
  parseLine(expr);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  rl.on("line", function (line) {
    parseLine(line);
  });
}
