{Program, Def, Code} = require '../jsh/ast'
stdlib = require './corelib/stdlib'

visitCode = (node) ->
  inputs = []
  subs = []
  
  for inputKey in Object.keys(node.input)
    inputs.push node.input[inputKey].toString()

  if node.sub != null && node.sub != undefined
    for subKey in Object.keys(node.sub)
      for sub in node.sub[subKey]
        subs.push visitCode(sub)

  deCode = new Code node.id, node.illusion, inputs, subs
  return deCode

visitDef = (illusionKey, illusions) ->
  inputs = []
  outputs = []
  if illusions[illusionKey].input != null && illusions[illusionKey].input != undefined
    for input in illusions[illusionKey].input
      inputs.push input
  if illusions[illusionKey].output != null && illusions[illusionKey].output != undefined
    for output in illusions[illusionKey].output
      outputs.push output
  deDef = new Def illusionKey, inputs, outputs, illusions[illusionKey].bash
  return deDef

decompile = (program) ->
  deProgram = new Program [], []
  num = 0
  illusions = program.illusion
  janish = program.janish

  for illusionKey in Object.keys(illusions)
    deDef = visitDef(illusionKey, illusions)
    deProgram.push_def(deDef)
  for node in janish
    deCode = visitCode(node)
    deProgram.push_code deCode

  console.log deProgram.deapply(num)   
module.exports = decompile
