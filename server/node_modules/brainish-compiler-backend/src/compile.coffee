stdlib = require './corelib/stdlib'

visit = (node, defs) ->
  code = {
    "id": node.id
    "illusion": node.type
    "input": {}
  }
  types = []

  type = null
  type = stdlib[node.type] if stdlib[node.type]?
  type = defs[node.type] if defs[node.type]?
  for i in [0..node.inputs.length-1]
    code.input[type.input[i]] = node.inputs[i]
    if node.inputs[i].indexOf(".") > 0
      code.input[type.input[i]] = '#' + node.inputs[i]

  types.push { "name": node.type, "define": type }

  if node.subs.length > 0
    code.sub = { "body": [] }
    for sub in node.subs
      obj = visit(sub, defs)
      code.sub.body.push obj.codes
      for subType in obj.types
        types.push {"name": subType.name, "define": subType.define}

  return { "types": types, codes: code }

compile = (program) ->
  ret = {
    "illusion": {}
    "janish": []
  }

  defs = {}

  for node in program.apply().defs
    defs[node.type] = {
      "input": node.inputs
      "sub": null
      "output": node.outputs
      "bash": node.bash
    }

  for node in program.apply().codes
    obj = visit(node, defs)
    for type in obj.types
      ret.illusion[type.name] = type.define
    ret.janish.push obj.codes

  return ret

module.exports = compile
