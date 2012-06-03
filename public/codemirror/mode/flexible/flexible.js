CodeMirror.defineMode("flexible", function(config) {
	return {
		token: function(stream, state) {
			for (var i = 0; i < Syntax.length; i++) {
				var token = Syntax[i][0];
				var style = Syntax[i][1];

				if (stream.match(token)) { return style; }
				
			}

			stream.next(); return null;
		}
	}
});

CodeMirror.defineMIME("text/flexible", "flexible");