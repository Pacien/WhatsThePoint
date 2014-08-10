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

define([ "css!plugins/doge/doge" ], function () {

	var doge = {

		TAG: "d-doge",
		NUMBER: 2,
		INTERVAL: 4000,
		MAX_SIZE: 2,
		MIN_SIZE: 3,
		WORD: [ "wow", "so slides", "many points", "very slideshow", "such clear", "much serious" ],
		COLOURS: [ "red", "green", "orange", "violet", "aqua", "yellow", "slateblue", "purple", "pink", "lime", "fuchsia", "gold", "indigo" ],

		init: function () {
			this.woofs = [];
			this.c = 0;
			setInterval(doge.spawn, this.INTERVAL);
		},

		getRandomFromInterval: function (min, max) {
			return Math.random() * (max - min) + min;
		},

		getRandomFontSize: function () {
			return doge.getRandomFromInterval(doge.MIN_SIZE, doge.MAX_SIZE);
		},

		getRandomItem: function (items) {
			return items[Math.floor(Math.random() * items.length)];
		},

		getRandomColour: function () {
			return doge.getRandomItem(doge.COLOURS);
		},

		getRandomWord: function () {
			return doge.getRandomItem(doge.WORD);
		},

		woof: function () {
			var woof = document.createElement(doge.TAG);

			document.body.appendChild(woof);
			doge.woofs.push(woof);

			woof.appendChild(document.createTextNode(doge.getRandomWord()));

			woof.style.animationDuration = doge.NUMBER * doge.INTERVAL + "ms";
			woof.style.WebkitAnimationDuration = woof.style.animationDuration;

			woof.style.fontSize = doge.getRandomFontSize() + "em";
			woof.style.color = doge.getRandomColour();

			woof.style.top = doge.getRandomFromInterval(0, window.innerHeight - woof.offsetHeight) + "px";
			woof.style.left = doge.getRandomFromInterval(0, window.innerWidth - woof.offsetWidth) + "px";

		},

		spawn: function () {
			if (doge.woofs.length >= doge.NUMBER) {
				doge.woofs[0].remove();
				doge.woofs.splice(0, 1);
			}

			doge.woof();
		},

	};

	return doge;

});
