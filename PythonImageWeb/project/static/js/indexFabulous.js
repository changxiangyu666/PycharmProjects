/**
 * fabulous.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
$(function() {

	'use strict';

	// taken from mo.js demos
	function isIOSSafari() {
		let userAgent;
		userAgent = window.navigator.userAgent;
		return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
	}

	// taken from mo.js demos
	function isTouch() {
		let isIETouch;
		isIETouch = navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
		return [].indexOf.call(window, 'ontouchstart') >= 0 || isIETouch;
	}

	// taken from mo.js demos
	let isIOS = isIOSSafari(),
		clickHandler = isIOS || isTouch() ? 'touchstart' : 'click';

	function extend( a, b ) {
		for( let key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function Animocon(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );

		this.checked = true;

		this.timeline = new mojs.Timeline();

		for(let i = 0, len = this.options.tweens.length; i < len; ++i) {
			this.timeline.add(this.options.tweens[i]);
		}

		let self = this;

		this.el.addEventListener(clickHandler, function() {
			if( self.checked ) {
				self.options.onUnCheck();
			}
			else {
				self.options.onCheck();
				self.timeline.start();
			}
			self.checked = !self.checked;
		});
	}

	Animocon.prototype.options = {
		tweens : [
			new mojs.Burst({
				shape : 'circle',
				isRunLess: true
			})
		],
		onCheck : function() { return false; },
		onUnCheck : function() { return false; }
	};

	function init() {
		let bSubmit = false;
		let el6 = document.querySelector('button.icobutton'), el6span = el6.querySelector('span');
		new Animocon(el6, {
			tweens: [
				// burst animation
				new mojs.Burst({
					parent: el6,
					duration: 1500,
					shape: 'circle',
					fill: 'white',
					x: '-22px',
					y: '15px',
					childOptions: {
						radius: {8: 0},
						type: 'line',
						stroke: '#ED4956',
						strokeWidth: 2
					},
					radius: {8: 28},
					count: 8,
					isRunLess: true,
					easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
				}),
				// ring animation
				new mojs.Transit({
					parent: el6,
					duration: 800,
					type: 'circle',
					radius: {4: 20},
					fill: 'transparent',
					stroke: '#ED4956',
					strokeWidth: {15: 0},
					x: '-20px',
					y: '13px',
					isRunLess: true,
					easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
				}),
				// icon scale animation
				new mojs.Tween({
					duration: 800,
					easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
					onUpdate: function (progress) {
						el6span.style.WebkitTransform = el6span.style.transform = 'scale3d(' + progress + ',' + progress + ',1)';
					}
				})
			],
			onCheck: function () {
				bSubmit = true;
				el6span.style.backgroundPosition="-58px 0";
				let sImageId=el6.getAttribute('id');
				$.ajax({
					url: '/add/fabulous/',
					type: 'post',
					dataType: 'json',
					data: {image_id: sImageId},
				})
			},
			onUnCheck: function () {
				bSubmit = true;
				el6span.style.backgroundPosition="-23px 0px";
				let sImageId=el6.getAttribute('id');
				$.ajax({
					url: '/delete/fabulous/',
					type: 'post',
					dataType: 'json',
					data: {image_id: sImageId},
				})
			}
		});
	}

	init();

});