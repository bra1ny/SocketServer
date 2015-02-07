{Program, Def, Code} = require '../jsh/ast'

exports.testLS = (test) ->
  _ls = new Code "ls", "ListFile", ["."]
  compile = _ls.apply()
  test.equal "ls", compile.id
  test.equal "ListFile", compile.type
  test.equal ".", compile.inputs[0]
  test.equal 0, compile.subs.length
  test.done()

exports.testFOR = (test) ->
  _ls = new Code "ls", "LS", ["."]
  _for = new Code "for", "FOR", ["ls.fileList"], [
    new Code "echo", "ECHO", ["for.itertor"]
  ]
  compile = _for.apply()
  test.equal 1, compile.subs.length
  test.equal "echo", compile.subs[0].id
  test.equal "ECHO", compile.subs[0].type
  test.done()

exports.testDef = (test) ->
  _GOOGLE = new Def "GOOGLE", ["keywords"], ["url"], "_var(url)=\"www.google.com\"\n"
  compile = _GOOGLE.apply()
  test.equal "GOOGLE", compile.type
  test.done()

exports.testProgram = (test) ->
  _GOOGLE = new Def "GOOGLE", ["keywords"], ["url"], "_var(url)=\"www.google.com\"\n"
  _ls = new Code "ls", "LS", ["."]
  _for = new Code "for", "FOR", ["ls.fileList"], [
    new Code "echo", "ECHO", ["for.itertor"]
  ]
  _program = new Program [_GOOGLE], [_ls, _for]
  compile = _program.apply()
  test.equal 1, compile.defs.length
  test.equal 2, compile.codes.length
  test.done()
