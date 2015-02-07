(function() {
  var BrainStatement, Code, Def, Program,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrainStatement = (function() {
    function BrainStatement() {}

    BrainStatement.prototype.apply = function() {};

    BrainStatement.prototype.deapply = function() {};

    return BrainStatement;

  })();

  Program = (function(_super) {
    __extends(Program, _super);

    function Program(defs, codes) {
      this.defs = defs;
      this.codes = codes;
    }

    Program.prototype.push_def = function(def) {
      return this.defs.push(def);
    };

    Program.prototype.push_code = function(code) {
      return this.codes.push(code);
    };

    Program.prototype.apply = function() {
      var code, def, ret, _i, _j, _len, _len1, _ref, _ref1;
      ret = {
        "defs": [],
        "codes": []
      };
      if (this.defs != null) {
        _ref = this.defs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          def = _ref[_i];
          ret.defs.push(def.apply());
        }
      }
      if (this.codes != null) {
        _ref1 = this.codes;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          code = _ref1[_j];
          ret.codes.push(code.apply());
        }
      }
      return ret;
    };

    Program.prototype.deapply = function(num) {
      var brainish, code, def, _i, _j, _len, _len1, _ref, _ref1;
      brainish = '';
      _ref = this.defs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        def = _ref[_i];
        brainish = brainish + def.deapply(num) + '\n';
      }
      _ref1 = this.codes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        code = _ref1[_j];
        brainish = brainish + code.deapply(num) + '\n';
      }
      return brainish;
    };

    return Program;

  })(BrainStatement);

  Def = (function(_super) {
    __extends(Def, _super);

    function Def(type, inputs, outputs, bash) {
      this.type = type;
      this.inputs = inputs;
      this.outputs = outputs;
      this.bash = bash;
    }

    Def.prototype.apply = function() {
      var input, output, ret, _i, _j, _len, _len1, _ref, _ref1;
      ret = {
        "type": this.type,
        "inputs": [],
        "outputs": [],
        "bash": this.bash
      };
      if (this.inputs != null) {
        _ref = this.inputs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          input = _ref[_i];
          ret.inputs.push(input.toString());
        }
      }
      if (this.outputs != null) {
        _ref1 = this.outputs;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          output = _ref1[_j];
          ret.outputs.push(output.toString());
        }
      }
      return ret;
    };

    Def.prototype.deapply = function(num) {
      var decodeStr, i, indent, input, output, _i, _j, _ref;
      for (i = _i = 0, _ref = this.inputs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.inputs[i].match(/^#.*/) !== null) {
          this.inputs[i] = this.inputs[i].substring(1);
        } else {
          this.inputs[i] = '\"' + this.inputs[i] + '\"';
        }
      }
      input = this.inputs.join(',');
      output = this.outputs.join(',');
      indent = '';
      for (_j = 0; 0 <= num ? _j < num : _j > num; 0 <= num ? _j++ : _j--) {
        indent = indent + '  ';
      }
      num = num + 1;
      decodeStr = this.type + ' (' + this.inputs + ') : ' + this.outputs + ' {\n  \"' + this.bash + '\"\n}';
      return decodeStr;
    };

    return Def;

  })(BrainStatement);

  Code = (function(_super) {
    __extends(Code, _super);

    function Code(id, type, inputs, subs) {
      this.id = id;
      this.type = type;
      this.inputs = inputs;
      this.subs = subs;
    }

    Code.prototype.push_input = function(input) {
      return this.inputs.push(input);
    };

    Code.prototype.push_sub = function(sub) {
      return this.subs.push(sub);
    };

    Code.prototype.apply = function() {
      var input, ret, sub, _i, _j, _len, _len1, _ref, _ref1;
      ret = {
        "id": this.id,
        "type": this.type,
        "inputs": [],
        "subs": []
      };
      if (this.inputs != null) {
        _ref = this.inputs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          input = _ref[_i];
          ret.inputs.push(input.toString());
        }
      }
      if (this.subs != null) {
        _ref1 = this.subs;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          sub = _ref1[_j];
          ret.subs.push(sub.apply());
        }
      }
      return ret;
    };

    Code.prototype.deapply = function(num) {
      var decodeStr, i, indent, input, sub, subs, _i, _j, _k, _len, _ref, _ref1;
      for (i = _i = 0, _ref = this.inputs.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (this.inputs[i].match(/^#.*/) !== null) {
          this.inputs[i] = this.inputs[i].substring(1);
        } else {
          this.inputs[i] = '\"' + this.inputs[i] + '\"';
        }
      }
      input = this.inputs.join(',');
      indent = '';
      for (_j = 0; 0 <= num ? _j < num : _j > num; 0 <= num ? _j++ : _j--) {
        indent = indent + '  ';
      }
      num = num + 1;
      if (JSON.stringify(this.subs) === '[]') {
        decodeStr = indent + this.id + ' : ' + this.type + ' (' + input + ') ';
      } else {
        subs = '';
        _ref1 = this.subs;
        for (_k = 0, _len = _ref1.length; _k < _len; _k++) {
          sub = _ref1[_k];
          subs = subs + sub.deapply(num) + '\n';
        }
        decodeStr = indent + this.id + ' : ' + this.type + ' (' + input + ') ' + '{\n' + subs + '}';
      }
      return decodeStr;
    };

    return Code;

  })(BrainStatement);

  module.exports = {
    Program: Program,
    Def: Def,
    Code: Code
  };

}).call(this);
