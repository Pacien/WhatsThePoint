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

define(function () {

	var xml = {

		init: function () {
			return;
		},

		getProp: function (object, dom, property, method) {
			var elements = dom.getElementsByTagName(property);
			if (elements.length > 0) {
				object[property] = method(elements[0]);
			}
			return object;
		},

		getInnerText: function (object, dom, property) {
			return this.getProp(object, dom, property, function (element) {
				return element.textContent;
			});
		},

		getInnerHtml: function (object, dom, property) {
			return this.getProp(object, dom, property, function (element) {
				if (window.XMLSerializer !== undefined) {
					return (new window.XMLSerializer()).serializeToString(element);
				} else if (element.xml !== undefined) {
					return element.xml;
				}
				return element.innerHTML;
			});
		},

		parseSlide: function (domSlide) {
			var slide = {};

			["type", "title", "subtitle"].forEach(function (tag) {
				xml.getInnerText(slide, domSlide, tag);
			});

			["content", "notes"].forEach(function (tag) {
				xml.getInnerHtml(slide, domSlide, tag);
			});

			return slide;
		},

		parseSlides: function (domSlides) {
			var slides = [];

			for (var i = 0; i < domSlides.length; i++) {
				slides.push(this.parseSlide(domSlides[i]));
			}

			return slides;
		},

		parse: function (rawData, callback) {
			var dom = new DOMParser().parseFromString(rawData, "text/xml");
			var domSlides = dom.getElementsByTagName("slide");

			callback(this.parseSlides(domSlides));
		},
	};

	return xml;

});
