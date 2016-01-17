(function() {

var inp = document.getElementById('input');
var outp = document.getElementById('output');
var md = markdownit();

var open = IncrementalDOM.elementOpen,
  close = IncrementalDOM.elementClose,
  elementVoid = IncrementalDOM.elementVoid,
  text = IncrementalDOM.text;

var patch = IncrementalDOM.patch;

function update() {
  var tokens = md.parse(inp.value);

  patch(outp, function() {
    renderTokens(tokens);
  })
}

function renderTokens(tokens) {
  for (var i=0, len=tokens.length; i<len; i++) {
    var token = tokens[i];
    if (token.tag) {
      if (token.nesting === 1) {
        open(token.tag);
      } else if (token.nesting === -1) {
        close(token.tag);
      }
    }
    if (token.type === 'text') {
      text(token.content);
    }
    if (token.children && token.children.length) {
      renderTokens(token.children);
    }
  }
}

inp.onkeyup = update;
inp.onblur = update;
update();


})();
