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

	var control = {

		MODE: {
			MASTER: "master",
			SLAVE: "slave",
			FREE: "free",
		},

		EVENT: {
			GOTO: "goTo",
			SLIDE: "slide",
			SHOW: "show",
			TOGGLE: "toggle",
			TRIGGER: "trigger",
		},

		SLIDE: {

		},

		GOTO: {
			PREVIOUS_SLIDE: "previousSlide",
			NEXT_SLIDE: "nextSlide",
			FIRST_SLIDE: "firstSlide",
			LAST_SLIDE: "lastSlide",
		},

		SHOW: {
			SLIDES: "slides",
			NOTES: "notes",
		},

		TOGGLE: {
			FULLSCREEN: "fullscreen",
		},

		TRIGGER: {

		},

		init: function () {
			return;
		},

		dispatchEvent: function (eventType, eventDetail, forward) {
			return document.dispatchEvent(new CustomEvent(eventType, {
				"detail": {
					"detail": eventDetail,
					"forward": forward !== undefined ? forward : true,
				},
			}));
		},

		bindEvent: function (eventType, eventListener) {
			document.addEventListener(eventType, function (event) {
				eventListener(event.detail);
			});
		},
	};

	return control;

});
