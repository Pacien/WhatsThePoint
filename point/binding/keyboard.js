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

define(["control/control"], function (control) {

	var keyboard = {

		KEYCODE: {
			BACKSPACE: 8,
			ENTER: 13,
			SPACE: 32,
			END: 35,
			HOME: 36,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
		},

		init: function (settings) {
			this.bindEvent();
		},

		translate: function (keyCode) {
			var gotoEvent;
			switch (keyCode) {
				case this.KEYCODE.LEFT:
				case this.KEYCODE.BACKSPACE:
					return control.dispatchEvent(control.EVENT.GOTO, control.GOTO.PREVIOUS_SLIDE);

				case this.KEYCODE.RIGHT:
				case this.KEYCODE.ENTER:
				case this.KEYCODE.SPACE:
					return control.dispatchEvent(control.EVENT.GOTO, control.GOTO.NEXT_SLIDE);

				case this.KEYCODE.HOME:
					return control.dispatchEvent(control.EVENT.GOTO, control.GOTO.FIRST_SLIDE);

				case this.KEYCODE.END:
					return control.dispatchEvent(control.EVENT.GOTO, control.GOTO.LAST_SLIDE);
			}

		},

		bindEvent: function () {
			document.addEventListener("keydown", function (keydownEvent) {
				// TODO: ignore if focus in form
				keyboard.translate(keydownEvent.keyCode);
			});
		},
	};

	return keyboard;

});
