{Program, Def, Code} = require '../jsh/ast'
compile = require '../jsh/compile'

program1 = do ->
  _ls = new Code "ls", "LS", ["."]
  _for_each = new Code "for_each", "FOR_EACH", ["ls.fileList"], [
    new Code "echo1", "ECHO", ["There is a file: "]
    new Code "echo2", "ECHO", ["for_each.iterator"]
  ]
  _program = new Program [], [_ls, _for_each]

console.log JSON.stringify(compile(program1))

exports.testListFile = (test) ->
  test.done()
