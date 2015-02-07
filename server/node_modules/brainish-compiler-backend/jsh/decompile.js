(function() {
  var Code, Def, Program, decompile, stdlib, visitCode, visitDef, _ref;

  _ref = require('../jsh/ast'), Program = _ref.Program, Def = _ref.Def, Code = _ref.Code;

  stdlib = require('./corelib/stdlib');

  visitCode = function(node) {
    var deCode, inputKey, inputs, sub, subKey, subs, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
    inputs = [];
    subs = [];
    _ref1 = Object.keys(node.input);
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      inputKey = _ref1[_i];
      inputs.push(node.input[inputKey].toString());
    }
    if (node.sub !== null && node.sub !== void 0) {
      _ref2 = Object.keys(node.sub);
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        subKey = _ref2[_j];
        _ref3 = node.sub[subKey];
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          sub = _ref3[_k];
          subs.push(visitCode(sub));
        }
      }
    }
    deCode = new Code(node.id, node.illusion, inputs, subs);
    return deCode;
  };

  visitDef = function(illusionKey, illusions) {
    var deDef, input, inputs, output, outputs, _i, _j, _len, _len1, _ref1, _ref2;
    inputs = [];
    outputs = [];
    if (illusions[illusionKey].input !== null && illusions[illusionKey].input !== void 0) {
      _ref1 = illusions[illusionKey].input;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        input = _ref1[_i];
        inputs.push(input);
      }
    }
    if (illusions[illusionKey].output !== null && illusions[illusionKey].output !== void 0) {
      _ref2 = illusions[illusionKey].output;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        output = _ref2[_j];
        outputs.push(output);
      }
    }
    deDef = new Def(illusionKey, inputs, outputs, illusions[illusionKey].bash);
    return deDef;
  };

  decompile = function(program) {
    var deCode, deDef, deProgram, illusionKey, illusions, janish, node, num, _i, _j, _len, _len1, _ref1;
    deProgram = new Program([], []);
    num = 0;
    illusions = program.illusion;
    janish = program.janish;
    _ref1 = Object.keys(illusions);
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      illusionKey = _ref1[_i];
      deDef = visitDef(illusionKey, illusions);
      deProgram.push_def(deDef);
    }
    for (_j = 0, _len1 = janish.length; _j < _len1; _j++) {
      node = janish[_j];
      deCode = visitCode(node);
      deProgram.push_code(deCode);
    }
    return console.log(deProgram.deapply(num));
  };

  module.exports = decompile;

}).call(this);
