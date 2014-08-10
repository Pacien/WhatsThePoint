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

	var renderSlide = {

		init: function () {
			this.lastTitle = undefined;
		},

		appendNode: function (parent, tag, content, appendMethod) {
			var node = document.createElement(tag);
			appendMethod(node, content);
			parent.appendChild(node);
			return parent;
		},

		appendHtmlNode: function (parent, tag, htmlContent) {
			return this.appendNode(parent, tag, htmlContent, function (parent, htmlContent) {
				parent.innerHTML = htmlContent;
			});
		},

		appendObjectNode: function (parent, tag, node) {
			return this.appendNode(parent, tag, node, function (parent, node) {
				parent.appendChild(node);
			});
		},

		appendTextNode: function (parent, tag, text) {
			return this.appendObjectNode(parent, tag, document.createTextNode(text));
		},

		appendContentNode: function (parent, tag, content) {
			if (typeof (content) === "string") {
				this.appendHtmlNode(parent, tag, content);
			} else {
				this.appendObjectNode(parent, tag, content);
			}
		},

		renderTitle: function (slideData) {
			var title = slideData.title;
			var subtitle = slideData.subtitle;

			if (title !== undefined) {
				this.lastTitle = title;
			} else {
				if (subtitle !== undefined) {
					title = this.lastTitle;
				} else {
					this.lastTitle = undefined;
				}
			}

			var titleNode;
			if (title !== undefined || subtitle !== undefined) {
				titleNode = document.createElement("s-title");
			} else {
				titleNode = document.createDocumentFragment("s-title");
			}

			if (title !== undefined) {
				this.appendTextNode(titleNode, "h1", title);
			}

			if (subtitle !== undefined) {
				this.appendTextNode(titleNode, "h2", subtitle);
			}

			return titleNode;
		},

		renderBody: function (slideData) {
			var bodyNode = document.createDocumentFragment();
			//var bodyNode = document.createElement("s-body");

			if (slideData.content !== undefined) {
				this.appendContentNode(bodyNode, "s-content", slideData.content);
			}

			var notes = slideData.notes === undefined ? "" : slideData.notes;
			this.appendContentNode(bodyNode, "s-notes", notes);

			return bodyNode;
		},

		renderSlide: function (slideData, index) {
			var slide = document.createElement("p-slide");
			slide.setAttribute("id", index + 1);
			slide.appendChild(this.renderTitle(slideData));
			slide.appendChild(this.renderBody(slideData));
			return slide;
		},

		renderSlides: function (slidesData) {
			var slides = document.createDocumentFragment();
			for (var i = 0; i < slidesData.length; i++) {
				slides.appendChild(this.renderSlide(slidesData[i], i));
			}
			return slides;
		},

		render: function (slidesData, callback) {
			callback(this.renderSlides(slidesData));
		},
	};

	return renderSlide;

});
