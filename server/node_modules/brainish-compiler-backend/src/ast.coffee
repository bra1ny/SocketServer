class BrainStatement
  constructor: () ->

  apply: () ->

  deapply: () ->

class Program extends BrainStatement
  constructor: (@defs, @codes) ->

  push_def: (def) ->
    @defs.push def

  push_code: (code) ->
    @codes.push code

  apply: () ->
    ret = {
      "defs": []
      "codes": []
    }
    if @defs?
      for def in @defs
        ret.defs.push def.apply()

    if @codes?
      for code in @codes
        ret.codes.push code.apply()
    return ret

  deapply: (num) ->
    brainish = ''
    for def in @defs
      brainish = brainish+def.deapply(num)+'\n'
    for code in @codes
      brainish = brainish+code.deapply(num)+'\n'
    return brainish

class Def extends BrainStatement
  constructor: (@type, @inputs, @outputs, @bash) ->

  apply: () ->
    ret = {
      "type": @type
      "inputs": []
      "outputs": []
      "bash": @bash
    }
    if @inputs?
      for input in @inputs
        ret.inputs.push input.toString()

    if @outputs?
      for output in @outputs
        ret.outputs.push output.toString()

    return ret

  deapply: (num) ->
    for i in [0...@inputs.length]
      if (@inputs[i].match(/^#.*/)!=null)
        @inputs[i] = @inputs[i].substring(1,)
      else
        @inputs[i] = '\"'+@inputs[i]+'\"'

    input = @inputs.join(',')
    output = @outputs.join(',')
    indent = ''

    for [0...num]
      indent = indent+'  '
    num = num+1
    decodeStr = @type+' ('+@inputs+') : '+@outputs+' {\n  \"'+@bash+'\"\n}'
    return decodeStr



class Code extends BrainStatement
  constructor: (@id, @type, @inputs, @subs) ->

  push_input: (input) ->
    @inputs.push input

  push_sub: (sub) ->
    @subs.push sub

  apply: () ->
    ret = {
      "id": @id
      "type": @type
      "inputs": []
      "subs": []
    }
    if @inputs?
      for input in @inputs
        ret.inputs.push input.toString()

    if @subs?
      for sub in @subs
        ret.subs.push sub.apply()
    return ret

  deapply: (num) ->
    for i in [0...@inputs.length]
      if (@inputs[i].match(/^#.*/)!=null)
        @inputs[i] = @inputs[i].substring(1,)
      else
        @inputs[i] = '\"'+@inputs[i]+'\"'
    input = @inputs.join(',')
    indent = ''
    for [0...num]
      indent = indent+'  '
    num = num+1
    if JSON.stringify(@subs)=='[]'
      decodeStr = indent+@id+' : '+@type+' ('+input+') '
    else
      subs = ''
      for sub in @subs
        subs = subs+sub.deapply(num)+'\n'
      decodeStr = indent+@id+' : '+@type+' ('+input+') '+'{\n'+subs+'}'
    return decodeStr

module.exports = {
  Program: Program
  Def: Def
  Code: Code
}
