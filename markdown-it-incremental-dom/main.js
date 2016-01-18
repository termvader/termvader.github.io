(function() {

var inp = document.getElementById('input');
var outp = document.getElementById('output');
var md = markdownit();

var openStart = IncrementalDOM.elementOpenStart,
  openEnd = IncrementalDOM.elementOpenEnd,
  open = IncrementalDOM.elementOpen,
  attr = IncrementalDOM.attr,
  close = IncrementalDOM.elementClose,
  elementVoid = IncrementalDOM.elementVoid,
  text = IncrementalDOM.text;

var patch = IncrementalDOM.patch;

function update() {
  var tokens = md.parse(inp.value, {});

  patch(outp, function() {
    renderTokens(tokens);
  })
}

function renderTokens(tokens) {
  for (var i=0, len=tokens.length; i<len; i++) {
    var token = tokens[i];
    if (token.tag && ((token.nesting === 1) || (token.nesting === 0))) {
      openStart(token.tag);
      if (token.attrs && token.attrs.length) {
        for (var j=0, lenj=token.attrs.length; j<lenj; j++) {
          attr(token.attrs[j][0], token.attrs[j][1]);
        }
      }
      openEnd(token.tag);
    }
    if (token.content && (token.type !== 'inline')) {
      text(token.content);
    }
    if (token.children && token.children.length) {
      renderTokens(token.children);
    }
    if (token.tag && ((token.nesting === -1) || (token.nesting === 0))) {
      close(token.tag);
    }
  }
}

inp.onkeyup = update;
inp.onblur = update;
update();


})();
