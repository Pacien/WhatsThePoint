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

define(["libs/hammerjs/hammer.min", "control/control"], function (hammer, control) {

	var touch = {

		ACTION: {
			SWIPE: "swipe",
			DOUBLETAP: "doubletap",
			TOUCHMOVE: "touchmove",
			DRAG: "drag",
		},

		DIRECTION: {
			DOWN: "down",
			LEFT: "left",
			UP: "up",
			RIGHT: "right",
		},

		init: function (settings) {
			this.touchZone = document.body;

			this.hammerElement = hammer(this.touchZone);

			this.hammerElement.options.drag = true;
			this.hammerElement.options.dragBlockHorizontal = true;
			this.hammerElement.options.dragBlockVertical = true;
			this.hammerElement.options.dragLockMinDistance = 20;

			this.disableSelect();
			this.bindEvent();
		},

		disableSelect: function () {
			this.touchZone.style.WebkitTouchCallout = "none";
			this.touchZone.style.WebkitUserSelect = "none";
			this.touchZone.style.KhtmlUserSelect = "none";
			this.touchZone.style.MozUserSelect = "none";
			this.touchZone.style.msUserSelect = "none";
			this.touchZone.style.userSelect = "none";
		},

		translateSwipe: function (swipeDirection) {
			switch (swipeDirection) {
				case this.DIRECTION.LEFT:
					return control.dispatchEvent(control.EVENT.GOTO, control.GOTO.NEXT_SLIDE);

				case this.DIRECTION.RIGHT:
					return control.dispatchEvent(control.EVENT.GOTO, control.GOTO.PREVIOUS_SLIDE);

				case this.DIRECTION.UP:
					return control.dispatchEvent(control.EVENT.SHOW, control.SHOW.NOTES);

				case this.DIRECTION.DOWN:
					return control.dispatchEvent(control.EVENT.SHOW, control.SHOW.SLIDES);
			}
		},

		handleDoubletap: function () {
			control.dispatchEvent(control.EVENT.TOGGLE, control.TOGGLE.FULLSCREEN);
		},

		bindEvent: function () {
			this.hammerElement.on(this.ACTION.SWIPE, function (swipeEvent) {
				touch.translateSwipe(swipeEvent.gesture.direction);
			});

			this.hammerElement.on(this.ACTION.DOUBLETAP, function (doubletapEvent) {
				touch.handleDoubletap();
			});
		},
	};

	return touch;

});
