import MarkdownIt from "markdown-it";

function createNewRule(
  name: string,
  marker: string,
  replaceFn: (content: string) => string,
  tokens: any[],
  index: number,
  state: any,
) {
  const token = tokens[index];
  if (token.content.indexOf(marker) === 0) {
    token.tag = "View";
    token.attrSet("class", name);
    token.content = replaceFn(token.content);
    if (token.children) {
      for (const child of token.children) {
        child.content = replaceFn(child.content);
      }
    }

    const openToken = new state.Token(`${name}_open`, "div", 1);
    openToken.attrSet("class", name);

    const closeToken = new state.Token(`${name}_close`, "div", -1);
    tokens.splice(index, 1, openToken, token, closeToken);
  }
}

export default function (md: MarkdownIt) {
  md.core.ruler.after("block", "newrules", function (state) {
    let tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      createNewRule(
        "redblock",
        "^^",
        (content) => {
          let newContent = content;

          newContent = newContent.replace(/^\^\^/, "");
          newContent = newContent.replace(/\^\^$/, "");

          return newContent;
        },
        tokens,
        i,
        state,
      );

      createNewRule(
        "blueblock",
        "==",
        (content) => {
          let newContent = content;

          newContent = newContent.replace(/^==/, "");
          newContent = newContent.replace(/==$/, "");

          return newContent;
        },
        tokens,
        i,
        state,
      );
    }
  });
}
