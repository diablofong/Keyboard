/*** This file is dynamically generated ***
█████▄ ▄████▄   █████▄ ▄████▄ ██████   ███████▄ ▄████▄ █████▄ ██ ██████ ██  ██
██  ██ ██  ██   ██  ██ ██  ██   ██     ██ ██ ██ ██  ██ ██  ██ ██ ██     ██  ██
██  ██ ██  ██   ██  ██ ██  ██   ██     ██ ██ ██ ██  ██ ██  ██ ██ ██▀▀   ▀▀▀▀██
█████▀ ▀████▀   ██  ██ ▀████▀   ██     ██ ██ ██ ▀████▀ █████▀ ██ ██     █████▀
*/
/*! jQuery UI Virtual Keyboard - ALL Extensions + Mousewheel */
/*! jQuery UI Virtual Keyboard Autocomplete v1.7 *//*
 * for Keyboard v1.18+ only (2/15/2015)
 *
 * By Rob Garrison (aka Mottie & Fudgey)
 * Licensed under the MIT License
 *
 * Use this extension with the Virtual Keyboard to get
 * the jQuery UI Autocomplete widget to work seamlessly
 *
 * Requires:
 *  jQuery
 *  jQuery UI & css
 *  Keyboard plugin : https://github.com/Mottie/Keyboard
 *
 * Setup:
 *  $('.ui-keyboard-input')
 *   .keyboard(options)
 *   .autocomplete(options)
 *   .addAutoComplete();
 *
 *  // or if targeting a specific keyboard
 *  $('#keyboard1')
 *   .keyboard(options)     // keyboard plugin
 *   .autocomplete(options) // jQuery UI autocomplete
 *   .addAutoComplete();    // this keyboard extension
 *
 */
/*jshint browser:true, jquery:true, unused:false */
(function($){
"use strict";
$.fn.addAutocomplete = function(){
	return this.each(function(){
		// make sure a keyboard is attached
		var base = $(this).data('keyboard');
		if (!base) { return; }

		// jQuery UI versions 1.9+ are different >= 1.9;
		base.autocomplete_new_version = (function(version) {
			version[0] = parseInt(version[0], 10);
			return (version[0] > 1) || (version[0] === 1 && parseInt(version[1], 10) >= 9);
		})($.ui.version.split("."));

		// Setup
		base.autocomplete_init = function(){

			// visible event is fired before this extension is initialized, so check!
			if (base.options.alwaysOpen && base.isVisible()) {
				base.autocomplete_setup();
			}

			base.$el
				.unbind('visible hidden autocompleteopen autocompleteselect '.split(' ').join('.keyboard-autocomplete '))
				.bind('visible.keyboard-autocomplete',function(){
					base.autocomplete_setup();
				})
				.bind('change.keyboard-autocomplete',function(e){
					if (base.hasAutocomplete && base.isVisible()) {
						base.$el
							.val(base.$preview.val())
							.trigger('keydown.autocomplete');
					}
				})
				.bind('hidden.keyboard-autocomplete', function(){
					base.$el.autocomplete('close');
				})
				.bind('autocompleteopen.keyboard-autocomplete', function() {
					if (base.hasAutocomplete){
						// reposition autocomplete window next to the keyboard
						base.$autocomplete.menu.element.position({
							of : base.$keyboard,
							my : 'right top',
							at : 'left top',
							collision: 'flip'
						});
					}
				})
				.bind('autocompleteselect.keyboard-autocomplete', function(e, ui){
					var v = ui.item && ui.item.value || '';
					if (base.hasAutocomplete && v !== ''){
						base.$preview
							.val( v )
							.focus();
						// see issue #95 - thanks banku!
						base.lastCaret = { start: v.length, end: v.length };
					}
				});
		};

		// set up after keyboard is visible
		base.autocomplete_setup = function(){
			// look for autocomplete
			base.$autocomplete = base.$el.data('autocomplete') || base.$el.data('uiAutocomplete') || base.$el.data('ui-autocomplete');
			base.hasAutocomplete = (typeof(base.$autocomplete) === 'undefined') ? false : (base.$autocomplete.options.disabled) ? false : true;
			// only bind to keydown once
			if (base.hasAutocomplete) {
				base.$preview.bind('keydown', function(e){
					// send keys to the autocomplete widget (arrow, pageup/down, etc)
					base.$el.val( base.$preview.val() ).triggerHandler(e);
				});
				base.$allKeys.bind('mouseup mousedown mouseleave touchstart touchend touchcancel',function(){
					clearTimeout( base.$autocomplete.searching );
					base.$autocomplete.searching = setTimeout(function() {
						// only search if the value has changed
						if ( base.$autocomplete.term !== base.$autocomplete.element.val() ) {
							base.$autocomplete.selectedItem = null;
							base.$autocomplete.search( null, event );
						}
					}, base.$autocomplete.options.delay );

				});
			}
		};

		base.origEscClose = base.escClose;

		// replace original function with this one
		base.escClose = function(e){
			// prevent selecting an item in autocomplete from closing keyboard
			if ( base.hasAutocomplete && (e.target.id === 'ui-active-menuitem' || $(e.target).closest('ul').hasClass('ui-autocomplete')) ) { return; }
			base.origEscClose(e);
		};

		base.autocomplete_init();

	});
};
})(jQuery);

/*! jQuery UI Virtual Keyboard for jQuery Mobile Themes v1.3 *//*
 * for Keyboard v1.18+ (updated 2/15/2015)
 *
 * By Rob Garrison (aka Mottie & Fudgey)
 * Licensed under the MIT License
 *
 * Use this extension with the Virtual Keyboard to apply
 * the necessary themes to make the keyboard compatible with
 * jQuery Mobile themes
 *
 * Requires:
 *  jQuery - http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js
 *  jQuery Mobile - http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.js
 *  jQuery Mobile themes -  http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.css
 *
 * Setup:
 *  $('.ui-keyboard-input')
 *   .keyboard(options)
 *   .addMobile(mobile-options);
 *
 *  // or if targeting a specific keyboard
 *  $('#keyboard1')
 *   .keyboard(options)     // keyboard plugin
 *   .addMobile(mobile-options);    // this keyboard extension
 *
 */
/*jshint browser:true, jquery:true, unused:false */
(function($){
$.fn.addMobile = function(options){

	var o, defaults = {
		// keyboard wrapper theme
		container    : { theme:'b', cssClass:'ui-body' },
		// keyboard duplicate input
		input        : { theme:'b', cssClass:'' },
		// theme added to all regular buttons
		buttonMarkup : { theme:'b', cssClass:'ui-btn', shadow:'true', corners:'true' },
		// theme added to all buttons when they are being hovered
		buttonHover  : { theme:'b', cssClass:'ui-btn-hover' },
		// theme added to action buttons (e.g. tab, shift, accept, cancel);
		// parameters here will override the settings in the buttonMarkup
		buttonAction : { theme:'b', cssClass:'ui-btn-active' },
		// theme added to button when it is active (e.g. shift is down)
		// All extra parameters will be ignored
		buttonActive : { theme:'b', cssClass:'ui-btn-active' },
		// if more than 3 mobile themes are used, add them here
		allThemes : 'a b c'
	};

	return this.each(function(){
		var base = $(this).data('keyboard');

		// Stop if no keyboard attached or if jQuery Mobile isn't loaded
		if (!base || typeof($.fn.textinput) === 'undefined') { return; }

		base.mobile_options = o = $.extend(true, {}, defaults, options);
		// create a list of theme class names to remove
		base.mobile_themes = $.trim(
			(' ' + o.allThemes).split(' ').join(' ' + o.buttonMarkup.cssClass + '-') +
			(' ' + o.allThemes).split(' ').join(' ' + o.buttonAction.cssClass + '-') +
			(' ' + o.allThemes).split(' ').join(' ' + o.buttonActive.cssClass + '-')
		);

		// save original action class because it gets removed when this theme switches swatches
		if (typeof base.options.mobile_savedActiveClass === 'undefined') {
			base.options.mobile_savedActiveClass = '' + base.options.css.buttonActive;
		}

		// Setup
		base.mobile_init = function() {

			// Add theme to input - if not already done through the markup
			$('.' + $.keyboard.css.input).textinput();

			// visible event is fired before this extension is initialized, so check!
			if (base.options.alwaysOpen && base.isVisible) {
				base.mobile_setup();
			}

			// Setup mobile theme on keyboard once it is visible.
			// Note: There is a 10ms delay after the keyboard is displayed before it actually fires 'visible.keyboard'.
			// Since we are restyling here, the user will experience FlashOfUnstyledContent (FOUC).
			// This is avoided by first setting the visibility to hidden, then after the mobile styles are applied we
			// set it visible.
			base.$el
				.unbind('beforeVisible.keyboard-mobile visible.keyboard-mobile')
				.bind('beforeVisible.keyboard-mobile', function() {
					base.$keyboard.css('visibility', 'hidden');
				})
				.bind('visible.keyboard-mobile', function() {
					base.mobile_setup();
					base.$keyboard.css('visibility', 'visible');
					base.$preview.focus();
				});

		};

		base.mobile_setup = function(){
			var p,
				kbcss = $.keyboard.css,
				opts = base.options,
				themes = base.mobile_themes;

			base.mobile_$actionKeys = base.$keyboard.find('.' + base.options.css.buttonAction);

			opts.css.buttonActive = opts.mobile_savedActiveClass + ' ' + base.modOptions(o.buttonActive, o.buttonMarkup);

			base.$keyboard
				// 'ui-body ui-body-a' classes to apply swatch theme
				.addClass( base.modOptions(o.container, o.container) )
				// preview input
				.find('.' + kbcss.preview)
				// removing 'ui-widget-content' will prevent jQuery UI theme from applying to the keyboard
				.removeClass('ui-widget ui-widget-content')
				.addClass( base.modOptions(o.input, o.input) ).end()
				// apply jQuery Mobile button markup
				// removed call to jQuery Mobile buttonMarkup function; replaced with base.modOptions
				.find('button')
				.removeClass( $.trim('ui-corner-all ui-state-default ' + themes) )
				.addClass( base.modOptions(o.buttonMarkup, o.buttonMarkup) )
				.not( base.mobile_$actionKeys )
				.hover(function(){
					$(this)
						.removeClass( themes )
						.addClass( base.modOptions(o.buttonHover, o.buttonMarkup) );
				},function(){
					$(this)
						.removeClass( themes + ' ' + o.buttonHover.cssClass )
						.addClass( base.modOptions(o.buttonMarkup, o.buttonMarkup) );
				});

				base.mobile_$actionKeys
					.removeClass( themes )
					.addClass( base.modOptions(o.buttonAction, o.buttonMarkup) );

			// update keyboard width if preview is showing... after applying mobile theme
			if (base.msie && base.$preview[0] !== base.el) {
				base.$preview.hide();
				base.$keyboard.css('width','');
				base.width = base.$keyboard.outerWidth();
				// add about 1em to input width for extra padding
				base.$keyboard.width(base.width + parseInt(base.$preview.css('fontSize'),10));
				base.$preview.width(base.width);
				base.$preview.show();
			}

			// adjust keyboard position after applying mobile theme
			if ($.ui && $.ui.position) {
				p = opts.position;
				p.of = p.of || base.$el.data('keyboardPosition') || base.$el;
				p.collision = p.collision || 'flipfit flipfit';
				base.$keyboard.position(p);
			}

		};

		base.modOptions = function(t, btn){
			var css = ' ' + ( t.cssClass || '' );
			// Using this instead of the jQuery Mobile buttonMarkup because it is expecting <a>'s instead of <button>
			// theme:'a', shadow:'true', inline:'true', corners:'false'
			return css + ' ' + (btn && btn.cssClass ? btn.cssClass + '-' + (t.theme || '') : '') +
				(t.shadow == 'true' ? ' ui-shadow' : '') +
				(t.corners == 'true' ? ' ui-corner-all' : '');
		};

		base.mobile_init();

	});
};
})(jQuery);

/*! jQuery UI Virtual Keyboard Navigation v1.5 *//*
 * for Keyboard v1.18+ only (updated 2/15/2015)
 *
 * By Rob Garrison (aka Mottie & Fudgey)
 * Licensed under the MIT License
 *
 * Use this extension with the Virtual Keyboard to navigate
 * the virtual keyboard keys using the arrow, page, home and end keys
 * Using this extension WILL prevent keyboard navigation inside of all
 * input and textareas
 *
 * Requires:
 *  jQuery
 *  Keyboard plugin : https://github.com/Mottie/Keyboard
 *
 * Setup:
 *  $('.ui-keyboard-input')
 *   .keyboard(options)
 *   .addNavigation();
 *
 *  // or if targeting a specific keyboard
 *  $('#keyboard1')
 *   .keyboard(options)     // keyboard plugin
 *   .addNavigation();    // this keyboard extension
 *
 */
/*jshint browser:true, jquery:true, unused:false */
(function($){
"use strict";
$.keyboard = $.keyboard || {};

$.keyboard.navigationKeys = {
	// all keys
	toggle     : 112, // toggle key; F1 = 112 (event.which value for function 1 key)
	enter      : 13,
	pageup     : 33,
	pagedown   : 34,
	end        : 35,
	home       : 36,
	left       : 37,
	up         : 38,
	right      : 39,
	down       : 40,
	// move caret WITH navigate toggle active
	caretrt    : 45, // Insert key
	caretlt    : 46, // delete key

	// ** custom navigationKeys functions **
	// move caret without navigate toggle active
	caretrgt   : function(kb){
		// keyaction right does not actually set the caret, so we need to do it here
		$.keyboard.keyaction.right(kb);
		kb.$preview.focus().caret( kb.last );
	},
	caretlft   : function(kb){
		// keyaction left does not actually set the caret, so we need to do it here
		$.keyboard.keyaction.left(kb);
		kb.$preview.focus().caret( kb.last );
	}
};

$.fn.addNavigation = function(options){
	return this.each(function(){
		// make sure a keyboard is attached
		var o, k,
			base = $(this).data('keyboard'),
			opts = base.options,
			defaults = {
				position   : [0,0],     // set start position [row-number, key-index]
				toggleMode : false,     // true = navigate the virtual keyboard, false = navigate in input/textarea

				focusClass : 'hasFocus' // css class added when toggle mode is on
			};
		if (!base) { return; }

		base.navigation_options = o = $.extend({}, defaults, options);
		base.navigation_keys = k = $.extend({}, $.keyboard.navigationKeys);
		// save navigation settings - disabled when the toggled
		base.saveNav = [ base.options.tabNavigation, base.options.enterNavigation ];
		base.allNavKeys = $.map(k, function(v,i){ return v; });

		// Setup
		base.navigation_init = function(){
			var kbcss = $.keyboard.css;
			base.$keyboard.toggleClass(o.focusClass, o.toggleMode)
				.find('.' + kbcss.keySet + ':visible')
				.find('.' + kbcss.keyButton + '[data-pos="' + o.position[0] + ',' + o.position[1] + '"]')
				.addClass(opts.css.buttonHover);

			base.$preview
				.unbind('keydown.keyboardNav')
				.bind('keydown.keyboardNav',function(e){
					return base.checkKeys(e.which);
				});

		};

		base.checkKeys = function(key, disable){
			if (typeof(key) === "undefined") {
				return;
			}
			var k = base.navigation_keys,
				kbcss = $.keyboard.css;
			if (key === k.toggle || disable) {
				o.toggleMode = (disable) ? false : !o.toggleMode;
				base.options.tabNavigation = (o.toggleMode) ? false : base.saveNav[0];
				base.options.enterNavigation = (o.toggleMode) ? false : base.saveNav[1];
			}
			base.$keyboard.toggleClass(o.focusClass, o.toggleMode);
			if ( o.toggleMode && key === k.enter ) {
				base.$keyboard
					.find('.' + kbcss.keySet + ':visible')
					.find('.' + kbcss.keyButton + '[data-pos="' + o.position[0] + ',' + o.position[1] + '"]')
					.trigger('repeater.keyboard');
				return false;
			}
			if ( o.toggleMode && $.inArray(key, base.allNavKeys) >= 0 ) {
				base.navigateKeys(key);
				return false;
			}
		};

		base.navigateKeys = function(key, row, indx){
			indx = indx || o.position[1];
			row = row || o.position[0];
			var kbcss = $.keyboard.css,
				kbevents = $.keyboard.events,
				vis = base.$keyboard.find('.' + kbcss.keySet + ':visible'),
				maxRow = vis.find('.' + kbcss.endRow).length - 1,
				maxIndx = vis.find('.' + kbcss.keyButton + '[data-pos^="' + row + ',"]').length - 1,
				p = base.last,
				l = base.$preview.val().length,
				k = base.navigation_keys;

			switch(key){
				case k.pageup   : row = 0; break; // pageUp
				case k.pagedown : row = maxRow; break; // pageDown
				case k.end      : indx = maxIndx; break; // End
				case k.home     : indx = 0; break; // Home
				case k.left     : indx += (indx > 0) ? -1 : 0; break; // Left
				case k.up       : row += (row > 0) ? -1 : 0; break; // Up
				case k.right    : indx += 1; break; // Right
				case k.down     : row += (row + 1 > maxRow) ? 0 : 1; break; // Down
				case k.caretrt  : p.start++; break; // caret right
				case k.caretlt  : p.start--; break; // caret left
			}

			// move caret
			if (key === k.caretrt || key === k.caretlt) {
				p.start = p.start < 0 ? 0 : p.start > l ? l : p.start;
				base.last.start = base.last.end = p.end = p.start;
				base.$preview.focus().caret( base.last );
			}

			// get max index of new row
			maxIndx = vis.find('.' + kbcss.keyButton + '[data-pos^="' + row + ',"]').length - 1;
			if (indx > maxIndx) { indx = maxIndx; }

			vis.find('.' + opts.css.buttonHover).removeClass(opts.css.buttonHover);
			vis.find('.' + kbcss.keyButton + '[data-pos="' + row + ',' + indx + '"]').addClass(opts.css.buttonHover);
			o.position = [ row, indx ];
		};

		// visible event is fired before this extension is initialized, so check!
		if (base.options.alwaysOpen && base.isVisible) {
			base.$keyboard.find('.' + opts.css.buttonHover).removeClass(opts.css.buttonHover);
			base.navigation_init();
		}
		// capture and simulate typing
		base.$el
			.bind(kbevents.kbVisible + '.keyboardNav', function(e){
				base.$keyboard.find('.' + opts.css.buttonHover).removeClass(opts.css.buttonHover);
				base.navigation_init();
			})
			.bind(kbevents.kbInactive + ' ' + kbevents.kbHidden, function(e){
				base.checkKeys(e.which, true); // disable toggle mode & revert navigation options
			})
			.bind(kbevents.kbKeysetChange, function(){
				base.navigateKeys(null);
			})
			.bind('navigate navigateTo', function(e, row, indx){
				var key;
				// no row given, check if it's a navigation key or keyaction
				row = isNaN(row) ? row.toLowerCase() : row;
				if (row in base.navigation_keys) {
					key = base.navigation_keys[row];
					if (isNaN(key) && key in $.keyboard.keyaction) {
						// defined navigation_keys string name is a defined keyaction
						$.keyboard.keyaction[key]( base, this, e );
					} else if ($.isFunction(key)) {
						// custom function defined in navigation_keys
						key(base);
					} else {
						// key (e.which value) is defined in navigation_keys
						base.checkKeys(key);
					}
				} else if ( typeof row === 'string' && row in $.keyboard.keyaction ) {
					// navigate called directly with a keyaction name
					$.keyboard.keyaction[row]( base, this, e );
				} else {
					base.navigateKeys(null, row, indx);
				}
			});

	});
};
})(jQuery);

/*! jQuery UI Virtual Keyboard previewKeyset v1.0 *//*
 * for Keyboard v1.18+ only (updated 2/15/2015)
 *
 * By Rob Garrison (aka Mottie & Fudgey)
 * Licensed under the MIT License
 *
 * Use this extension with the Virtual Keyboard to add a preview
 * of other keysets to the main keyboard.
 *
 * Requires:
 *  jQuery
 *  Keyboard plugin : https://github.com/Mottie/Keyboard
 *
 * Setup:
 *  $('.ui-keyboard-input')
 *   .keyboard(options)
 *   .previewKeyset();
 *
 *  // or if targeting a specific keyboard
 *  $('#keyboard1')
 *   .keyboard(options)     // keyboard plugin
 *   .previewKeyset();    // this keyboard extension
 *
 */
/*jshint browser:true, jquery:true, unused:false */
(function($){
'use strict';
$.keyboard = $.keyboard || {};

$.fn.previewKeyset = function( options ) {
	return this.each( function() {
		// make sure a keyboard is attached
		var base = $( this ).data( 'keyboard' ),
			defaults = {
				sets : [ 'normal', 'shift', 'alt', 'alt-shift' ]
			};

		if ( !base ) { return; }

		base.previewKeyset_options = $.extend( {}, defaults, options );

		base.previewKeyset = function() {
			var kbcss = $.keyboard.css,
				sets = base.previewKeyset_options.sets,
				// only target option defined sets
				$sets = base.$keyboard.find( '.' + kbcss.keySet ).filter( '[name="' + sets.join('"],[name="') + '"]' );
			if ( $sets.length > 1 ) {
				// start with normal keyset & find all non-action buttons
				$sets.eq( 0 ).find( '.' + kbcss.keyButton ).not( '.' + kbcss.keyAction ).each(function(){
					var indx, nam,
						data = {},
						len = sets.length,
						// find all keys with the same position
						$sibs = $sets.find( 'button[data-pos="' + $(this).attr('data-pos') + '"]' );
					for ( indx = 0; indx < len; indx++ ) {
						nam = $sibs.eq( indx ).parent().attr( 'name' );
						if ( $.inArray( nam, sets ) >= 0 ) {
							data[ 'data-' + nam ] = $sibs.eq( indx ).find( '.' + kbcss.keyText ).text();
						}
					}
					$sibs.attr( data );
				});
			}
		};

		base.$el.bind($.keyboard.events.kbBeforeVisible, function() {
			base.previewKeyset();
		});

	});
};
})( jQuery );

/*
 * jQuery UI Virtual Keyboard Scramble Extension v1.5 for Keyboard v1.18+ (updated 2/15/2015)
 *
 * By Rob Garrison (aka Mottie & Fudgey)
 * Licensed under the MIT License
 *
 * Use this extension with the Virtual Keyboard to scramble the
 * specified keyboard keys
 *
 * Requires:
 *  jQuery v1.4.4+
 *  Keyboard v1.17.14+ - https://github.com/Mottie/Keyboard
 *
 * Setup:
 *  $('.ui-keyboard-input')
 *   .keyboard(options)
 *   .addScramble();
 *
 *  // or if targeting a specific keyboard
 *  $('#keyboard1')
 *   .keyboard(options) // keyboard plugin
 *   .addScramble();    // this keyboard extension
 *
 */
/*jshint browser:true, jquery:true, unused:false */
(function($) {
"use strict";
$.keyboard = $.keyboard || {};
	$.fn.addScramble = function(options) {
		//Set the default values, use comma to separate the settings, example:
		var defaults = {
			targetKeys    : /[a-z\d]/i, // keys to randomize
			byRow         : true, // randomize by row, otherwise randomize all keys
			byKeySet      : false,// if true, randomize one keyset & duplicate
			randomizeOnce : true  // if true, randomize only once on keyboard visible
		};
		return this.each(function() {
			// make sure a keyboard is attached
			var o,
				base = $(this).data('keyboard'),
				opts = base.options;

			if (!base || base.scramble_options) { return; }
			o = base.scramble_options = $.extend({}, defaults, options);

			base.scramble_setup = function($keyboard) {
				var $sets, set, $keys, key, index, tmp,
					rowIndex, keyboardmap, map, keyboard, row;
				$sets = $keyboard.find('.' + $.keyboard.css.keySet);
				if ($keyboard.length) {
					if (o.byKeySet) {
						$sets = $sets.eq(0);
					}
					for (set = 0; set < $sets.length; set++) {
						/*jshint loopfunc:true */
						$keys = $sets.eq(set);
						rowIndex = 0;
						row = [];
						map = [];
						keyboardmap = [];
						keyboard = [];
						$keys.children('button, span, br').each(function() {
							if (this.tagName === 'BR') {
								if (o.byRow) {
									row.push(this);
									map.push(false);
									keyboard[rowIndex] = row;
									keyboardmap[rowIndex] = map;
									row = [];
									map = [];
									rowIndex++;
								} else {
									keyboard[rowIndex] = this;
									keyboardmap[rowIndex] = false;
									rowIndex++;
								}
							} else {
								tmp = $(this).attr('data-value') || '';
								tmp = tmp.length === 1 && o.targetKeys.test(tmp) ? tmp : false;
								if (o.byRow) {
									row.push( this );
									map.push ( tmp );
								} else {
									keyboard[rowIndex] = this;
									keyboardmap[rowIndex] = tmp;
									rowIndex++;
								}
							}
						});
						// remove original <br> elements
						$keys.find('.' + $.keyboard.css.endRow).remove();
						// re-map keys
						if (!o.byRow) {
							row = base.shuffle( keyboard, keyboardmap );
							for (key = 0; key < row.length; key++) {
								$keys.append(row[key]);
							}
						} else {
							for (index = 0; index < keyboard.length; index++) {
								row = base.shuffle( keyboard[index], keyboardmap[index] );
								for (key = 0; key < row.length; key++) {
									$keys.append(row[key]);
								}
							}
						}
					}
					if (o.byKeySet) {
						$keyboard = base.realign($keyboard);
					}
					return $keyboard;
				}
			};

			// modified from Fisher-Yates shuffle ( http://bost.ocks.org/mike/shuffle/ )
			// to allow not shuffling specifically mapped array elements
			base.shuffle = function(array, map) {
				var swap, random,
					index = array.length;
				// While there remain elements to shuffle...
				while (index > 0) {
					// Pick a remaining element...
					random = Math.floor(Math.random() * index);
					if (map[index - 1] === false) {
						index--;
					}
					// skip elements that are mapped to false
					if (map[index - 1] !== false && map[random] !== false) {
						// And swap it with the current element
						index--;
						swap = array[index];
						array[index] = array[random];
						array[random] = swap;
					}
				}
				return array;
			};

			// make other keysets "line-up" with scrambled keyset
			base.realign = function($keyboard) {
				var selector, typ, pos,
					$sets = $keyboard.find('.' + $.keyboard.css.keySet),
					$orig = $sets.eq(0);
				$sets = $sets.filter(':gt(0)');
				$orig.children().each(function(i, cell){
					typ = cell.tagName === 'BR';
					pos = $(cell).attr('data-pos');
					/*jshint loopfunc:true */
					$sets.each(function(j, k){
						selector = typ ? 'br:first' : 'button[data-pos="' + pos + '"]';
						$(k).find(selector).appendTo( k );
					});
				});
				return $keyboard;
			};

			// create scrambled keyboard layout
			opts.create = function() {
				var layout = opts.layout;
				$.keyboard.builtLayouts[layout] = {
					mappedKeys   : {},
					acceptedKeys : [],
					$keyboard: null
				};
				if ( typeof $.keyboard.builtLayouts[base.orig_layout] === 'undefined' ) {
					base.layout = opts.layout = base.orig_layout;
					// build original layout, if not already built, e.g. "qwerty"
					base.buildKeyboard();
					base.layout = opts.layout = layout;
				}
				// clone, scramble then save layout
				$.keyboard.builtLayouts[layout] = $.extend(true, {}, $.keyboard.builtLayouts[base.orig_layout]);
				if (o.randomizeOnce) {
					$.keyboard.builtLayouts[layout].$keyboard = base.scramble_setup( $.keyboard.builtLayouts[base.orig_layout].$keyboard.clone() );
				}
				base.$keyboard = $.keyboard.builtLayouts[layout].$keyboard;
				if ( !o.randomizeOnce ) {
					base.$el.bind($.keyboard.events.kbBeforeVisible, function(e, kb) {
						kb.$keyboard = kb.scramble_setup(kb.$keyboard);
					});
				}
			};

			// scrambled layout already initialized
			if (!/^scrambled/.test(base.options.layout)) {
				base.orig_layout = base.options.layout;
				base.options.layout = "scrambled" + Math.round(Math.random() * 10000);
			}

			// special case when keyboard is set to always be open
			if (opts.alwaysOpen && base.$keyboard.length) {
				setTimeout(function(){
					base.$keyboard = base.scramble_setup(base.$keyboard);
				}, 0);
			}

		});
	};
})(jQuery);

/*! jQuery UI Virtual Keyboard Typing Simulator v1.7 *//*
 * for Keyboard v1.18+ only (2/15/2015)
 *
 * By Rob Garrison (aka Mottie & Fudgey)
 * Licensed under the MIT License
 *
 * Use this extension with the Virtual Keyboard to simulate
 * typing for tutorials or whatever else use you can find
 *
 * Requires:
 *  jQuery
 *  Keyboard plugin : https://github.com/Mottie/Keyboard
 *
 * Setup:
 *  $('.ui-keyboard-input')
 *   .keyboard(options)
 *   .addTyping(typing-options);
 *
 *  // or if targeting a specific keyboard
 *  $('#keyboard1')
 *   .keyboard(options)
 *   .addTyping(typing-options);
 *
 * Basic Usage:
 *  // To disable manual typing on the virtual keyboard, just set "showTyping" option to false
 *  $('#keyboard-input').keyboard(options).addTyping({ showTyping: false });
 *
 *  // Change the default typing delay (time the virtual keyboard highlights the manually typed key) - default = 250 milliseconds
 *  $('#keyboard-input').keyboard(options).addTyping({ delay: 500 });
 *
 *  // get keyboard object, open it, then start typing simulation
 *  $('#keyboard-input').getkeyboard().reveal().typeIn('Hello World', 700);
 *
 *  // get keyboard object, open it, type in "This is a test" with 700ms delay between types, then accept & close the keyboard
 *  $('#keyboard-input').getkeyboard().reveal().typeIn('This is a test', 700, function(){ $('#keyboard-input').getkeyboard().close(true); });
 */

// EXAMPLES:
// $('#inter').getkeyboard().reveal().typeIn('\tHello \b\n\tWorld', 500);
// $('#meta').getkeyboard().reveal().typeIn('abCDd11123\u2648\u2649\u264A\u264B', 700, function(){ alert('all done!'); });
/*jshint browser:true, jquery:true, unused:false */
(function($){
	$.fn.addTyping = function(options){
		//Set the default values, use comma to separate the settings, example:
		var defaults = {
			showTyping : true,
			lockTypeIn : false,
			delay      : 250
		};
		return this.each(function(){
			// make sure a keyboard is attached
			var o, base = $(this).data('keyboard');
			if (!base) { return; }

			// variables
			o = base.typing_options = $.extend({}, defaults, options);
			base.typing_keymap = {
				' '  : 'space',
				'"'  : '34',
				"'"  : '39',
				'&nbsp;' : 'space',
				'\b' : 'bksp',
				'\n' : 'Enter',
				'\r' : 'Enter',
				'\t' : 'tab'
			};
			base.typing_xref = {
				8  : 'bksp',
				9  : 'tab',
				13 : 'enter',
				32 : 'space'
			};
			base.typing_event = false;
			// save lockInput setting
			o.savedLockInput = base.options.lockInput;

			base.typing_setup = function(){
				var el = (base.$preview) ? base.$preview : base.$el;

				el
				.unbind('keyup.keyboard-typing keydown.keyboard-typing keypress.keyboard-typing')
				.bind('keyup.keyboard-typing', function(e){
					if (o.init && o.lockTypeIn) { return false; }
					if (e.which >= 37 && e.which <=40) { return; } // ignore arrow keys
					if (e.which === 16) { base.shiftActive = false; }
					if (e.which === 18) { base.altActive = false; }
					if (e.which === 16 || e.which === 18) {
						base.showKeySet();
						setTimeout(function(){ base.$preview.focus(); }, 200); // Alt key will shift focus to the menu - doesn't work in Windows
						return;
					}
				})
				// change keyset when either shift or alt is held down
				.bind('keydown.keyboard-typing', function(e){
					if (o.init && o.lockTypeIn) { return false; }
					e.temp = false; // prevent repetitive calls while keydown repeats.
					if (e.which === 16) { e.temp = !base.shiftActive; base.shiftActive = true; }
					// it should be ok to reset e.temp, since both alt and shift will call this function separately
					if (e.which === 18) { e.temp = !base.altActive; base.altActive = true; }
					if (e.temp) {
						base.showKeySet();
						base.$preview.focus(); // Alt shift focus to the menu
					}
					base.typing_event = true;
					// Simulate key press for tab and backspace since they don't fire the keypress event
					if (e.which === 8 || e.which === 9) {
						base.typing_findKey( '', e ); // pass event object
					}

				})
				.bind('keypress.keyboard-typing', function(e){
					if (o.init && o.lockTypeIn) { return false; }
					// Simulate key press on virtual keyboard
					if (base.typing_event && !base.options.lockInput) {
						base.typing_findKey( '', e ); // pass event object
					}
				});
			};

			// Store typing text
			base.typeIn = function(txt, delay, callback, e){
				if (!base.isVisible()) {
					// keyboard was closed
					base.typing_event = o.init = false;
					base.options.lockInput = o.savedLockInput;
					clearTimeout(base.typing_timer);
					return;
				}
				if (!base.typing_event){

					if (o.init !== true) {
						o.init = true;
						base.options.lockInput = o.lockTypeIn;
						txt = o.text = txt || '';
						o.len = txt.length - 1;
						o.delay = delay || 300;
						o.current = 0; // position in text string
						if (callback) {
							o.callback = callback;
						}
					}
					// function that loops through and types each character
					txt = o.text.substring( o.current, ++o.current );
					base.typing_findKey( txt, e );
				} else if (typeof txt === 'undefined') {
					// typeIn called by user input
					base.typing_event = false;
					base.options.lockInput = o.savedLockInput;
					return;
				}

			};

			base.typing_findKey = function(txt, e){
				var tar, m, n, k, key, ks, meta, set,
					kbcss = $.keyboard.css,
					mappedKeys = $.keyboard.builtLayouts[base.layout].mappedKeys;
				ks = base.$keyboard.find('.' + kbcss.keySet);
				k = (base.typing_keymap.hasOwnProperty(txt)) ? base.typing_keymap[txt] : txt;

				// typing_event is true when typing on the actual keyboard - look for actual key
				// All of this breaks when the CapLock is on... unable to find a cross-browser method that works.
				tar = '.' + kbcss.keyButton + '[data-value="' + k + '"]';
				if (base.typing_event && e) {
					if (base.typing_xref.hasOwnProperty(e.keyCode || e.which)) {
						// special named keys: bksp, tab and enter
						tar = '.' + kbcss.keyPrefix + base.typing_xref[e.keyCode || e.which];
					} else {
						m = String.fromCharCode(e.charCode || e.which);
						tar = (mappedKeys.hasOwnProperty(m)) ?
							'.' + kbcss.keyButton + '[data-value="' + mappedKeys[m]  + '"]' :
							'.' + kbcss.keyPrefix + (e.charCode || e.which);
					}
				}
				// find key
				key = ks.filter(':visible').find(tar);
				if (key.length) {
					// key is visible, simulate typing
					base.typing_simulateKey(key,txt);
				} else {
					// key not found, check if it is in the keymap (tab, space, enter, etc)
					if (base.typing_event) {
						key = ks.find(tar);
					} else {
						// key not found, check if it is in the keymap (tab, space, enter, etc)
						n = (base.typing_keymap.hasOwnProperty(txt)) ? base.typing_keymap[txt] : txt.charCodeAt(0);
						if (n === 'bksp') { txt = n; }
						// find actual key on keyboard
						key = ks.find('.' + kbcss.keyPrefix + n);
					}

					// find the keyset
					set = key.closest('.' + kbcss.keySet);

					// figure out which keyset the key is in then simulate clicking on that meta key, then on the key
					if (set.attr('name')) {
						// get meta key name
						meta = set.attr('name');
						// show correct key set
						base.shiftActive = /shift/.test(meta);
						base.altActive = /alt/.test(meta);
						base.metaActive = base.last.keyset[2] = (meta).match(/meta\d+/) || false;
						// make the plugin think we're passing it a jQuery object with a name

						base.showKeySet({ name : base.metaActive});

						// Add the key
						base.typing_simulateKey(key,txt);
					} else {
						if (!base.typing_event) {
							// Key doesn't exist on the keyboard, so just enter it
							base.insertText(txt);
							base.checkCombos();
						}
					}

				}

				if (o.current <= o.len && o.len !== 0){
					if (!base.isVisible()) { return; } // keyboard was closed, abort!!
					setTimeout(function(){ base.typeIn(); }, o.delay);
				} else if (o.len !== 0){
					// o.len is zero when the user typed on the actual keyboard during simulation
					base.typing_event = o.init = false;
					base.options.lockInput = o.savedLockInput;
					o.len = o.current = 0;
					if ($.isFunction(o.callback)) {
						// ensure all typing animation is done before the callback
						setTimeout(function(){
							// if the user typed during the key simulation, the "o" variable may sometimes be undefined
							if ($.isFunction(o.callback)) {
								o.callback(base);
							}
						}, o.delay);
					}
					return;
				} else {
					o.len = o.current = 0;
					o.text = '';
					base.typing_event = o.init = false;
					base.options.lockInput = o.savedLockInput;
					// clearTimeout(base.typing_timer);
				}
			};

			// mouseover the key, add the text directly, then mouseout on the key
			base.typing_simulateKey = function(el,txt){
				var e = el.length;
				if (e) { el.filter(':visible').trigger('mouseenter.keyboard'); }
				base.typing_timer = setTimeout(function(){
					var e = el.length;
					if (e) { setTimeout(function(){ el.trigger('mouseleave.keyboard'); }, o.delay/3); }
					if (!base.isVisible()) { return; }
					if (!base.typing_event) {
						base.insertText(txt);
						base.checkCombos();
					}
				}, o.delay/3);
			};

			if (o.showTyping) {
				// visible event is fired before this extension is initialized, so check!
				if (base.options.alwaysOpen && base.isVisible()) {
					base.typing_setup();
				}
				// capture and simulate typing
				base.$el.bind('visible.keyboard', function(){
					base.typing_setup();
				});
			}

		});
	};
})(jQuery);

/* Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */
/*! Mousewheel version: 3.1.12 * (c) 2014 Brandon Aaron * MIT License */
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));
