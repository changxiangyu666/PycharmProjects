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
		var userAgent;
		userAgent = window.navigator.userAgent;
		return userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
	};

	// taken from mo.js demos
	function isTouch() {
		var isIETouch;
		isIETouch = navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
		return [].indexOf.call(window, 'ontouchstart') >= 0 || isIETouch;
	};
	
	// taken from mo.js demos
	var isIOS = isIOSSafari(),
		clickHandler = isIOS || isTouch() ? 'touchstart' : 'click';

	function extend( a, b ) {
		for( var key in b ) { 
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

		this.checked = false;

		this.timeline = new mojs.Timeline();
		
		for(var i = 0, len = this.options.tweens.length; i < len; ++i) {
			this.timeline.add(this.options.tweens[i]);
		}

		var self = this;
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


		/* Icon 6 */
		var sImageId = window.imageId;
		var bSubmit = false;
		var el6 = document.querySelector('button.icobutton'), el6span = el6.querySelector('span'),el10counter = document.querySelector('.comsp');
		var scaleCurve6 = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
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
						var scaleProgress = scaleCurve6(progress);
						el6span.style.WebkitTransform = el6span.style.transform = 'scale3d(' + progress + ',' + progress + ',1)';
					}
				})
			],
			onCheck: function () {
				bSubmit = true;
				el6span.style.backgroundPosition="-58px 0";
				$.ajax({
					url: '/add/fabulous/',
					type: 'post',
					dataType: 'json',
					data: {image_id: sImageId},
				}).done(function (oResult){
					if(oResult.user_id){

					}else {

					}
				})
			},
			onUnCheck: function () {
				bSubmit = true;
				el6span.style.backgroundPosition="-23px 0px";
				$.ajax({
					url: '/delete/fabulous/',
					type: 'post',
					dataType: 'json',
					data: {image_id: sImageId},
				}).done(function (oResult){
					if(oResult.user_id){

					}else {

					}
				})
			}
		});

		/* Icon 6 */
	}
	
	init();

});