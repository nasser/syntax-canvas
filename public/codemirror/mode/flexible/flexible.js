CodeMirror.defineMode("flexible", function(config, mode) {
	return {
		startState: function() {
			return {
				parser: mode.parser,
				multiTokens: []
			};
		},

		token: function(stream, state) {

			var style;
			style = this.matchSyntax(stream, state); if(style) return style;
			style = this.matchMultiTokens(stream, state); if(style) return style;

			stream.next();
			return null;
		},


		// check any remaining multitokens
		matchMultiTokens: function(stream, state) {
			for (var i = 0; i < state.multiTokens.length; i++) {
				var token = state.multiTokens[i][0];
				var style = state.multiTokens[i][1];

				if(stream.match(token)) {
					state.multiTokens.splice(i,1);	
					return style;
				}
			}

			return null;
		},

		// check each syntax rule for a match. if a multi token rule matches,
		// populate state.multiTokens to match them on next iterations
		matchSyntax: function(stream, state, ignore) {
				var syntax = state.parser.syntax;
				for (var i = 0; i < syntax.length; i++) {
				var token = syntax[i][0];
				var styles = syntax[i][1].slice();

				if(token == ignore)
					continue;

				if(styles.length < 2) {
					// single token rule
					if(stream.match(token)) return styles[0];

				} else {
					// multi token rule
					var match = stream.match(token, false);
					if(match) {
						match.shift();
						while(match.length > 0)
							state.multiTokens.unshift([match.shift(), styles.shift()]);

						var style;
						style = this.matchSyntax(stream, state, token); if(style) return style;
						style = this.matchMultiTokens(stream, state); if(style) return style;
						return null;

					}
				}
			}

			return null;
		}

	}
});

CodeMirror.defineMIME("text/flexible", "flexible");