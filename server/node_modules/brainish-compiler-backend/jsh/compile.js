(function() {
  var compile, stdlib, visit;

  stdlib = require('./corelib/stdlib');

  visit = function(node, defs) {
    var code, i, obj, sub, subType, type, types, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
    code = {
      "id": node.id,
      "illusion": node.type,
      "input": {}
    };
    types = [];
    type = null;
    if (stdlib[node.type] != null) {
      type = stdlib[node.type];
    }
    if (defs[node.type] != null) {
      type = defs[node.type];
    }
    for (i = _i = 0, _ref = node.inputs.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      code.input[type.input[i]] = node.inputs[i];
      if (node.inputs[i].indexOf(".") > 0) {
        code.input[type.input[i]] = '#' + node.inputs[i];
      }
    }
    types.push({
      "name": node.type,
      "define": type
    });
    if (node.subs.length > 0) {
      code.sub = {
        "body": []
      };
      _ref1 = node.subs;
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        sub = _ref1[_j];
        obj = visit(sub, defs);
        code.sub.body.push(obj.codes);
        _ref2 = obj.types;
        for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
          subType = _ref2[_k];
          types.push({
            "name": subType.name,
            "define": subType.define
          });
        }
      }
    }
    return {
      "types": types,
      codes: code
    };
  };

  compile = function(program) {
    var defs, node, obj, ret, type, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    ret = {
      "illusion": {},
      "janish": []
    };
    defs = {};
    _ref = program.apply().defs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      defs[node.type] = {
        "input": node.inputs,
        "sub": null,
        "output": node.outputs,
        "bash": node.bash
      };
    }
    _ref1 = program.apply().codes;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      node = _ref1[_j];
      obj = visit(node, defs);
      _ref2 = obj.types;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        type = _ref2[_k];
        ret.illusion[type.name] = type.define;
      }
      ret.janish.push(obj.codes);
    }
    return ret;
  };

  module.exports = compile;

}).call(this);
