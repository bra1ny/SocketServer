grammar = require '../jsh/grammar'
compile = require '../jsh/compile'

exports.testParser = (test) ->
  brainish =
    """
    PRINT (content) : output {
      '_var(output)=$(echo _input(content))'
    }

    ls : LS ("-al Document/GitHub/");
    for_each : FOR_EACH (ls.fileList) {
      echo : ECHO (for_each.iterator);
    }
    """
  program = grammar.parse(brainish)
  json = compile(program)
  test.equal 3, Object.keys(json.illusion).length
  test.equal 2, Object.keys(json.janish).length
  test.done()
