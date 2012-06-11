CodeMirror.defineMode("slymtax", function(config) {
	return {
		token: function(stream, state) {

			if (stream.match(/'[^']*'/)) 	return "string";
			if (stream.match(/\/[^\/]*\//)) return "string-2";
			if (stream.match(":")) 			return "operator";
			if (stream.match(/\w+/)) 		return "property";

			stream.next();
			return null;
		}
	}
});

CodeMirror.defineMIME("text/slymtax", "slymtax");