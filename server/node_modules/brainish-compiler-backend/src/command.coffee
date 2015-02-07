compiler = require './jsh'
fs = require 'fs'
OptParse = require 'optparse'

Switches = [
  ["-h", "--help", "Display this help information"]
  ["-j", "--json", "Conmpile to JSON"]
]

Banner =
  """
  Usage: brainish [options] path/to/script.bysh -- [args]
  If called without options, `lucy` will run your script.
  """

Options = {
  toJSON: false
  scriptPath: null
  argv: []
}

parserOptions = () ->
  Parser = new OptParse.OptionParser Switches
  Parser.banner = Banner

  Parser.on "help", () =>
    console.log Parser.toString()
    process.exit 0

  Parser.on "json", () =>
    Options.toJSON = true

  Parser.on 0, (val) =>
    Options.scriptPath = val
    Options.argv = process.argv.slice 3

  Parser.parse process.argv.slice(2)

exports.run = () ->
  parserOptions()
  if Options.toJSON
    fs.readFile Options.scriptPath, "utf8", (err, data) =>
      throw err if err
      console.log compiler.compileJSON data
  else if Options.scriptPath
    fs.readFile Options.scriptPath, "utf8", (err, data) =>
      throw err if err
      console.log compiler.compileBash data
  else
    Parser = new OptParse.OptionParser Switches
    Parser.banner = Banner
    console.log Parser.toString()
