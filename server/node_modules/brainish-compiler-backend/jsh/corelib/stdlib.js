(function() {
  module.exports = {
    "ECHO": {
      "input": ["content"],
      "sub": null,
      "output": [],
      "bash": "echo \"_input(content)\""
    },
    "PRINTF": {
      "input": ["content"],
      "sub": "null",
      "output": [],
      "bash": "printf \"_input(content)\""
    },
    "LS": {
      "input": ["path"],
      "sub": null,
      "output": ["fileList"],
      "bash": "_var(fileList)=$(ls _input(path))"
    },
    "CAT": {
      "input": ["file"],
      "sub": null,
      "output": ["content"],
      "bash": "_var(content)=`cat _input(file)`"
    },
    "FOR_EACH": {
      "input": ["list"],
      "sub": {
        "body": "iterator"
      },
      "bash": "for _var(iterator) in _input(list); do\n    _sub(body)done;"
    },
    "GOOGLE_SEARCH_URL": {
      "input": ["keyword"],
      "sub": null,
      "output": ["url"],
      "bash": "_var(replaced)=\"_input(keyword)\"\n_var(replaced)=${_var(replaced)// /+}\n_var(url)=\"https://www.google.com/search?q=\"$_var(replaced)"
    },
    "GOOGLE_SEARCH": {
      "input": ["url"],
      "sub": null,
      "output": ["result"],
      "bash": "_var(result)=$(wget -U firefox -O - _input(url) 2>/dev/null | grep -o '<a href=\"/url?q=[^\"'\"'\"']*&amp;sa' | sed -e 's/^<a href=[\"'\"'\"']\\\/url?q=//' -e 's/&amp;sa$//')"
    }
  };

}).call(this);
