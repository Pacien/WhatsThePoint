/*
 *	This file is part of "What's The Point" <https://github.com/Pacien/WhatsThePoint>
 *	Copyright (C) 2014  Pacien TRAN-GIRARD
 *
 *	"What's The Point" is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as
 *	published by the Free Software Foundation, either version 3 of the
 *	License, or (at your option) any later version.
 *
 *	"What's The Point" is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *
 *	You should have received a copy of the GNU Affero General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

requirejs.config({
	baseUrl: "point",
	paths: {

		/* file loaders */
		"text": "libs/text/text",
		"css": "libs/require-css/css.min",

		/* parsers and compilers */
		"js-yaml": "libs/js-yaml/js-yaml.min",

	},
});

var parameters = {
	configFile: "../point.yml",
	slides: true,
};

// parse url parameters
location.search.substring(1).split("&").forEach(function (kv) {
	var kvp = kv.split("=");
	parameters[kvp[0]] = kvp[1] === undefined ? true : kvp[1];
});

// parse configuration file
require([ "js-yaml", "text!" + parameters.configFile, "view/view", "control/control" ], function (jsyaml, config, view, control) {
	var settings = jsyaml.safeLoad(config);

	for (var k in view.VIEW) {
		var v = view.VIEW[k];
		if (parameters[v]) {
			settings.view = v;
			break;
		}
	}

	settings.key = parameters.key;
	if (settings.control == "local") {
		settings.mode = control.MODE.FREE;
	} else {
		if (settings.key === undefined) {
			settings.mode = control.MODE.SLAVE;
		} else {
			settings.mode = control.MODE.MASTER;
		}
	}

	// load theme and view
	if (settings.data.type !== "pdf") {
		require([ "css!theme/" + settings.theme ]);
	}
	require([ "css!view/" + settings.view ]);

	// apply slide dimension
	var screen = document.getElementsByTagName("p-screen")[0];
	screen.style.width = settings.dimension.width + "px";
	screen.style.height = settings.dimension.height + "px";

	require([ "data/renderSlide", "data/" + settings.data.type, "text!" + settings.data.file ], function (renderer, parser, data) {

		var exec = function (object) {
			object.init(settings);
		};

		exec(parser);
		exec(renderer);

		parser.parse(data, function (slidesData) {
			renderer.render(slidesData, function (renderedSlides) {

				document.getElementsByTagName("p-screen")[0].appendChild(renderedSlides);
				document.body.removeChild(document.getElementById("loadingclock"));

				// control
				var controls = [ "slide", "fullscreen" ];
				if (settings.mode !== control.MODE.SLAVE) {
					controls = controls.concat([ "layout" ]);
				}
				if (settings.mode === control.MODE.MASTER) {
					controls = controls.concat([ "network" ]);
				}
				for (var i = 0; i < controls.length; i++) {
					require([ "control/" + controls[i] ], exec);
				}

				// binding
				var bindings = [];

				if (settings.control.remote !== undefined) {
					bindings = bindings.concat([ "network" ]);
				}

				if (settings.mode !== control.MODE.SLAVE) {
					bindings = bindings.concat(settings.binding);
				}

				if (bindings !== undefined) {
					for (var i = 0; i < bindings.length; i++) {
						require([ "binding/" + bindings[i] ], exec);
					}
				}

				// load plug-ins
				if (settings.plugins !== undefined) {
					for (var i = 0; i < settings.plugins.length; i++) {
						require([ "plugins/" + settings.plugins[i] + "/" + settings.plugins[i] ], exec);
					}
				}

			});

		});

	});

});
