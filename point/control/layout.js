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

	var layout = {

		init: function () {
			this.screen = document.getElementsByTagName("p-screen")[0];
			this.bindEvent();
		},

		CLASS: {
			SLIDES: "slides",
			NODES: "notes",
		},

		reset: function () {
			for (var className in this.CLASS) {
				this.screen.classList.remove(this.CLASS[className]);
			}
		},

		show: function (element) {
			this.reset();
			switch (element) {
				case control.SHOW.SLIDES:
					this.screen.classList.add("slides");
					break;

				case control.SHOW.NOTES:
					this.screen.classList.add("notes");
					break;
			}
		},

		bindEvent: function () {
			control.bindEvent(control.EVENT.SHOW, function (showEvent) {
				layout.show(showEvent.detail);
			});
		},
	};

	return layout;

});
