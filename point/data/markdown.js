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
	shim: {
		"markdownjs": {
			exports: "markdown",
		},
	},
	paths: {
		"markdownjs": "libs/markdownjs/markdown.min",
	},
});

define(["js-yaml", "markdownjs"], function (jsyaml, markdownjs) {

	var markdown = {

		init: function () {
			return;
		},

		renderSlide: function (slide) {
			if (slide.content !== undefined) {
				slide.content = markdownjs.toHTML(slide.content);
			}
			if (slide.notes !== undefined) {
				slide.notes = markdownjs.toHTML(slide.notes);
			}
			return slide;
		},

		parse: function (rawData, callback) {
			var slides = [];

			jsyaml.safeLoadAll(rawData, function (slide) {
				slides.push(markdown.renderSlide(slide));
			});

			callback(slides);
		},
	};

	return markdown;

});
