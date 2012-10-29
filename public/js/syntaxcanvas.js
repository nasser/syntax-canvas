(function() {
  String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  var codeMirrors = [];
  var didIntroduction = false;

  function showIntroduction () {
    didIntroduction = true;
    $(".tab-content").append("<div id='introduction'><h1>Syntax Canvas</h1><h2>A tool for experiments in language design</h2></div>");
    $("#add-language").tooltip({trigger:'manual', title:'Click here to start your next language', placement:'left'});
    setTimeout(function() {$("#add-language").tooltip('show');}, 5000);
  }

  function refreshEditors() {
    var tabHeight = $(window).outerHeight() - $(".nav").outerHeight(true);
    $(".code .CodeMirror-scroll").height(tabHeight * 0.75);
    $(".parser .CodeMirror-scroll").height(tabHeight * 0.25 - 1);

    for (var i = codeMirrors.length - 1; i >= 0; i--) { codeMirrors[i].refresh(); };
  }

  function addLanguage (name, code, syntax) {
    $(".nav a").tooltip('destroy')

    var hash = name.hashCode();

    // create tab
    var tab = $("<li><a href=\"#tab-" + hash + "\" data-toggle=\"tab\">" + name + "</a></li>");

    // show tab on click
    $(tab).find("a").click(function (e) {
      e.preventDefault();
      $(this).tab('show');

      refreshEditors();
    });

    // edit language name on double click
    $(tab).find("a").dblclick(function (e) {
      e.preventDefault();
      var $this = $(this);

      $(".nav a").tooltip('destroy')

      // create input element
      var controls =  $("<input style='width:" + $this.width() + "px' placeholder='" + name + "'></input><i class=\"icon-remove icon-black\"></i>");
      var input = controls.eq(0);
      var remove = controls.eq(1);

      // escape or enter with no text resets name, enter with text sets new name
      input.keydown(function(k) {
        var code = k.keyCode || k.which;
        if(code == 27) { // escape
          k.preventDefault();
          $this.html(name);

        } else if(code == 13) { // enter
          k.preventDefault();
          if(input.val() == "") {
            $this.html(name);

          } else {
            var newName = input.val();
            $this.html(newName);
            localStorage.setItem(newName, localStorage.getItem(name));
            localStorage.removeItem(name);
          }
        }
      });

      // losing focus resets name
      input.blur(function () {
        // must timeout, otherwise clicking the remove button is impossible
        setTimeout(function() { $this.html(name); }, 100);
      });

      // remove button 
      remove.click(function (e) {
        tab.remove();
        $("#tab-" + hash).remove();
        localStorage.removeItem(name);

        if($(".nav a").size() == 0) {
            showIntroduction();
        } else {
          $(".nav a:first").click();
        }
      });

      $this.html(controls);
      input.focus();
    });

    // create tab content pane
    var tabPane = $("<div class=\"tab-pane\" id=\"tab-" + hash + "\"> <form class=\"code\"><textarea></textarea></form> <form class=\"parser\"><textarea></textarea></form> </div>");

    // add syntax editor
    var parser = CodeMirror.fromTextArea($(tabPane).find('.parser textarea').get(0), {
      theme:"ambiance",
      mode: "text/slymtax",
      smartIndent:false,
      onChange:function() {
        var Syntax = [];
        var syntaxLines = parser.getValue().split("\n");
        for (var i = syntaxLines.length - 1; i >= 0; i--) {
          try {
            var matches, token, styles;
            if(matches = /\/([^\/]+)\/\s*:\s*(.+)/.exec(syntaxLines[i])) {
              // regexp rule
              token = new RegExp("^" + matches[1].trim().replace(/ /g, "")); // whitespace replace, bad idea?
              styles = matches[2].trim().split(" ");
              
            } else if(matches = /'([^']+)'\s*:\s*(.+)/.exec(syntaxLines[i])) {
              // string rule
              token = matches[1].trim();
              styles = matches[2].trim().split(" ");

            } else {
              continue;
            }
            
            if(typeof styles != "undefined" && typeof token != "undefined") Syntax.push([token, styles]);

          } catch(e) {}
        }

        parser.syntax = Syntax;
        editor.setOption("mode", editor.getOption("mode")) // refresh editor
      }
    });
    parser.syntax = [];

    // add code editor
    var editor = CodeMirror.fromTextArea($(tabPane).find('.code textarea').get(0), {
      theme:"ambiance",
      mode: {
        name: "flexible",
        parser: parser
      },
      lineNumbers: true,

      onHighlightComplete:function() {
        localStorage.setItem(name, JSON.stringify({ code:editor.getValue(), syntax:parser.getValue() }));
      }
    });

    // populate editors
    editor.setValue(code);
    parser.setValue(syntax);

    // refresh editor
    editor.setOption("mode", editor.getOption("mode")); 

    // store editors for future
    codeMirrors.push(parser);
    codeMirrors.push(editor);

    // insert tab and content into dom
    $(".nav").append(tab);
    $(".tab-content").append(tabPane);

    if($(".nav a").size() == 1 && didIntroduction) {
      setTimeout(function() {
        $(".nav a:first").tooltip({trigger:'manual', title:'Double click to change the language\'s name or delete it.' , placement:'right'});
        $(".nav a:first").tooltip('show')
        setTimeout(function() { $(".nav a").tooltip('destroy')}, 8000);
      }, 5000);
    }
  }



  $(function() {
    $(window).resize(function() {
      refreshEditors();
    });

    $("#add-language").click(function () {
      $("#introduction").remove();
      $("#add-language").tooltip('destroy');

      addLanguage(
        NameGenerator.makeName("adjective%5 [animal name gem planet tree emotion letter] suffix%2"),
        "# Type your code here, and your syntax in the lower pane\n# \n# The syntax pane's syntax is MATCH : STYLE+\n# \n# MATCH is a single quoted string ('foo'), a simple\n# regex (/--.*/), or a regex with captures (/(\w+)=(\d+)/)\n# \n# STYLE is an unquoted style name, indicating\n# how to style the text. Available styles are: keyword, atom,\n# number, def, variable, variable-2 variable-3, property,\n# operator, comment, string, string-2 meta, error, qualifier,\n# builtin, bracket, tag, attribute header, quote, hr, link\n\nself.range = (10...32)\n",
        "/\\((\\d+)(...)(\\d+)\\)/ : number operator number\n/#.*/ : comment\n'self' : builtin")
      $(".nav a:last").click();
    });

    $("#help").click(function() {
      $("#help-window").modal();
    });

    for (var i = localStorage.length - 1; i >= 0; i--) {
      var name = localStorage.key(i);
      var data = JSON.parse(localStorage.getItem(name));
      if(data)
        addLanguage(name, data.code, data.syntax)
    }

    if($(".nav a").size() == 0) {
      showIntroduction();
    }

    $(".nav a:first").click();
    refreshEditors();
  });
}());