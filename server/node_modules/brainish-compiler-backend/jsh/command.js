(function() {
  var Banner, OptParse, Options, Switches, compiler, fs, parserOptions;

  compiler = require('./jsh');

  fs = require('fs');

  OptParse = require('optparse');

  Switches = [["-h", "--help", "Display this help information"], ["-j", "--json", "Conmpile to JSON"]];

  Banner = "Usage: brainish [options] path/to/script.bysh -- [args]\nIf called without options, `lucy` will run your script.";

  Options = {
    toJSON: false,
    scriptPath: null,
    argv: []
  };

  parserOptions = function() {
    var Parser;
    Parser = new OptParse.OptionParser(Switches);
    Parser.banner = Banner;
    Parser.on("help", (function(_this) {
      return function() {
        console.log(Parser.toString());
        return process.exit(0);
      };
    })(this));
    Parser.on("json", (function(_this) {
      return function() {
        return Options.toJSON = true;
      };
    })(this));
    Parser.on(0, (function(_this) {
      return function(val) {
        Options.scriptPath = val;
        return Options.argv = process.argv.slice(3);
      };
    })(this));
    return Parser.parse(process.argv.slice(2));
  };

  exports.run = function() {
    var Parser;
    parserOptions();
    if (Options.toJSON) {
      return fs.readFile(Options.scriptPath, "utf8", (function(_this) {
        return function(err, data) {
          if (err) {
            throw err;
          }
          return console.log(compiler.compileJSON(data));
        };
      })(this));
    } else if (Options.scriptPath) {
      return fs.readFile(Options.scriptPath, "utf8", (function(_this) {
        return function(err, data) {
          if (err) {
            throw err;
          }
          return console.log(compiler.compileBash(data));
        };
      })(this));
    } else {
      Parser = new OptParse.OptionParser(Switches);
      Parser.banner = Banner;
      return console.log(Parser.toString());
    }
  };

}).call(this);
