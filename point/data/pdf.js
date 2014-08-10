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
		"pdfjs": {
			exports: "PDFJS",
		},
	},
	paths: {
		"pdfjs": "libs/pdfjs/pdf",
	},
});

define(["pdfjs"], function (pdfjs) {

	var pdf = {

		init: function (settings) {
			this.fileUrl = settings.data.file;
			this.width = settings.dimension.width;
			this.height = settings.dimension.height;

			this.slides = [];

			pdfjs.disableRange = true;
			pdfjs.workerSrc = "point/libs/pdfjs/pdf.worker.js";
		},

		makeCanvas: function () {
			var canvas = document.createElement("canvas");
			canvas.width = pdf.width;
			canvas.height = pdf.height;
			return canvas;
		},

		clearOutline: function (context, slideWidth, slideHeight, offsetX, offsetY) {
			context.clearRect(0, 0, offsetX, pdf.height);
			context.clearRect(offsetX + slideWidth, 0, offsetX, pdf.height);
			context.clearRect(0, 0, pdf.width, offsetY);
			context.clearRect(0, offsetY + slideHeight, pdf.width, offsetY);
			return context;
		},

		renderSlide: function (pdfDocument, slideIndex, callback) {
			pdfDocument.getPage(slideIndex).then(function (pdfPage) {

				var viewport = pdfPage.getViewport(1);
				var slideWidth = viewport.width / 2;
				var slideHeight = viewport.height;

				var widthRatio = pdf.width / slideWidth;
				var heightRatio = pdf.height / slideHeight;
				var scale = Math.min(widthRatio, heightRatio);
				slideWidth *= scale;
				slideHeight *= scale;

				var offsetX = (pdf.width - slideWidth) / 2;
				var offsetY = (pdf.height - slideHeight) / 2;

				var contentViewport = new pdfjs.PageViewport(pdfPage.view, scale, 0, offsetX, offsetY);
				var notesViewport = new pdfjs.PageViewport(pdfPage.view, scale, 0, -slideWidth + offsetX, offsetY);

				var contentCanvas = pdf.makeCanvas();
				var contentContext = contentCanvas.getContext("2d");

				var notesCanvas = pdf.makeCanvas();
				var notesContext = notesCanvas.getContext("2d");

				var contentRenderContext = {
					canvasContext: contentContext,
					viewport: contentViewport,
				};

				var notesRenderContext = {
					canvasContext: notesContext,
					viewport: notesViewport,
				};

				pdfPage.render(contentRenderContext).then(function () {
					pdf.clearOutline(contentContext, slideWidth, slideHeight, offsetX, offsetY);

					pdfPage.render(notesRenderContext).then(function () {
						pdf.clearOutline(notesContext, slideWidth, slideHeight, offsetX, offsetY);

						pdf.registerSlide(contentCanvas, notesCanvas, pdfDocument, slideIndex, callback);

					});
				});
			});
		},

		registerSlide: function (contentCanvas, notesCanvas, pdfDocument, slideIndex, callback) {
			pdf.slides[slideIndex - 1] = {
				content: contentCanvas,
				notes: notesCanvas,
			};

			if (slideIndex < pdfDocument.pdfInfo.numPages) {
				pdf.renderSlide(pdfDocument, slideIndex + 1, callback);
			} else {
				callback(pdf.slides);
			}
		},

		parse: function (rawData, callback) {
			pdfjs.getDocument(require.toUrl(this.fileUrl)).then(function (pdfDocument) {
				pdf.renderSlide(pdfDocument, 1, callback);
			});
		},
	};

	return pdf;

});
