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

define([], function () {

	var autoscale = {

		init: function () {
			this.container = document.body;
			this.reference = document.getElementsByTagName("p-screen")[0];
			this.target = this.reference;

			this.centerTarget();
			this.bindEvent();
			this.resize();
		},

		centerTarget: function () {
			this.target.style.position = "absolute";
			this.target.style.top = "50%";
			this.target.style.left = "50%";
			this.target.style.marginTop = -this.target.offsetHeight / 2 + "px";
			this.target.style.marginLeft = -this.target.offsetWidth / 2 + "px";
			document.body.style.overflow = "hidden";
		},

		applyTransformation: function (transformation) {
			this.target.style.MozTransform = transformation;
			this.target.style.WebkitTransform = transformation;
			this.target.style.OTransform = transformation;
			this.target.style.msTransform = transformation;
			this.target.style.transform = transformation;
		},

		resize: function () {
			var widthRatio = this.container.offsetWidth / this.reference.offsetWidth;
			var heightRatio = this.container.offsetHeight / this.reference.offsetHeight;

			var scaleRatio = Math.min(widthRatio, heightRatio);
			scaleRatio = scaleRatio < 1 ? scaleRatio : 1;

			this.applyTransformation("scale(" + scaleRatio + ")");
		},

		bindEvent: function () {
			window.addEventListener("resize", function () {
				autoscale.resize();
			});
		},

	};

	return autoscale;

});
