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

	var slide = {

		init: function () {
			this.slideCount = document.getElementsByTagName("p-slide").length;
			this.start();
			this.bindEvent();
		},

		start: function () {
			var slideIndex = location.hash.substr(1);
			location.hash = 0;
			location.hash = 1;
			this.setCurrentSlide(slideIndex);
		},

		setCurrentSlide: function (slideIndex) {
			if (isNaN(slideIndex) || slideIndex < 1 || slideIndex > this.slideCount) {
				return false;
			}
			location.hash = slideIndex;
			return true;
		},

		getCurrentSlideIndex: function () {
			var hash = location.hash.substring(1);
			return isNaN(hash) || hash < 1 || hash > this.slideCount ? 0 : Number(hash);
		},

		shift: function (delta) {
			return this.getCurrentSlideIndex() + delta;
		},

		getIndex: function (target) {
			switch (target) {
				case control.GOTO.PREVIOUS_SLIDE:
					return this.shift(-1);

				case control.GOTO.NEXT_SLIDE:
					return this.shift(+1);

				case control.GOTO.FIRST_SLIDE:
					return 1;

				case control.GOTO.LAST_SLIDE:
					return this.slideCount;
			}
		},

		translate: function (target) {
			control.dispatchEvent(control.EVENT.SLIDE, this.getIndex(target));
		},

		bindEvent: function () {
			control.bindEvent(control.EVENT.GOTO, function (gotoEvent) {
				slide.translate(gotoEvent.detail);
			});

			control.bindEvent(control.EVENT.SLIDE, function (slideEvent) {
				slide.setCurrentSlide(slideEvent.detail);
			});
		},
	};

	return slide;

});
