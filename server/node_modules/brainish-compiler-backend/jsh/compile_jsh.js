(function() {
  var compile_jsh, get_var, illusions, j2b, print_error, process_bash, process_input;

  illusions = [];

  print_error = function(err) {
    return process.stderr.write(err + "\n");
  };

  get_var = function(illusion_id, var_name) {
    return illusion_id + "__" + var_name;
  };

  process_input = function(input_list) {
    var input_name, input_value, input_value_pieces;
    for (input_name in input_list) {
      input_value = input_list[input_name];
      if (input_value[0] === "#") {
        input_value_pieces = input_value.substring(1).split(".");
        input_value = "${" + get_var(input_value_pieces[0], input_value_pieces[1]) + "}";
      }
      input_list[input_name] = input_value;
    }
    return input_list;
  };

  process_bash = function(id, input, sub, bash) {
    var end, indent, indent_space, indented_janish, line, old_name, start, sub_janish, sub_name, _i, _len, _ref;
    while ((start = bash.indexOf("_var(")) >= 0) {
      end = bash.indexOf(")", start);
      old_name = bash.substring(start + 5, end);
      bash = bash.substring(0, start) + get_var(id, old_name) + bash.substring(end + 1);
    }
    while ((start = bash.indexOf("_input(")) >= 0) {
      end = bash.indexOf(")", start);
      old_name = bash.substring(start + 7, end);
      bash = bash.substring(0, start) + input[old_name] + bash.substring(end + 1);
    }
    while ((start = bash.indexOf("_sub(")) >= 0) {
      end = bash.indexOf(")", start);
      sub_name = bash.substring(start + 5, end);
      indent = 0;
      indent_space = "";
      while (bash.charAt(start - indent - 1) === " ") {
        indent++;
        indent_space += " ";
      }
      sub_janish = j2b(sub[sub_name]);
      indented_janish = "";
      _ref = sub_janish.trim().split("\n");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        indented_janish += indent_space + line + "\n";
      }
      bash = bash.substring(0, start - indent) + indented_janish + bash.substring(end + 1);
    }
    return bash;
  };

  j2b = function(janish) {
    var bash, id, illusion, input, j, output, sub, _i, _len;
    output = "";
    if (Array.isArray(janish)) {
      for (_i = 0, _len = janish.length; _i < _len; _i++) {
        j = janish[_i];
        output += j2b(j);
      }
    } else {
      output += "# Illusion " + janish["id"] + "(" + janish["illusion"] + ") begins\n";
      illusion = illusions[janish["illusion"]];
      if (illusion) {
        id = janish["id"];
        input = process_input(janish["input"]);
        sub = janish["sub"];
        bash = illusion["bash"];
        output += process_bash(id, input, sub, bash);
      }
      output += "\n# Illusion " + janish["id"] + "(" + janish["illusion"] + ") ends\n";
    }
    return output;
  };

  compile_jsh = function(janish) {
    var code;
    illusions = janish["illusion"];
    code = janish["janish"];
    return "#!/usr/bin/env bash\n" + j2b(code);
  };

  module.exports = compile_jsh;

}).call(this);
