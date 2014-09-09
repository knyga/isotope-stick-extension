/**
 * Oleksandr Knyga <oleksandrknyga@gmail.com>, 2014
 */
(function($) {

	$.fn.isotopeStick = function(settings) {
		var opts = $.extend({}, $.fn.isotopeStick.defaults, settings, $.fn.isotopeStick.prior);

		this.each(function() {
			var $this = $(this);
			var $items = $this.children();
			 var itemMinWidth = -1;

			var updateMargin = function($el) {
				var width = $el.width(),
					pWidth = $el.parent().width();
				$el.css({
					'margin-left': (pWidth-width)/2
				});
			};
			var calculateElementMinWidth = function() {
				if(-1 == itemMinWidth) {
					itemMinWidth = $items.first().outerWidth(true);
					$items.each(function(item) {
						var width = $(this).outerWidth(true);

						if(width < itemMinWidth) {
							itemMinWidth = width;
						}
					});
					itemMinWidth = parseFloat(itemMinWidth);
				}
				return itemMinWidth;
			};
			var calculateParentWidth = function() {
				return parseFloat($this.width());
			};
			var getRightPosition = function() {
				// var pos = 0,
				// 	sumWidth = 0,
				// 	pw = calculateParentWidth() - calculateElementMinWidth(),
				// 	biggerThanMinSum = 0;

				// $items.each(function(i) {
				// 	if(sumWidth <= pw) {
				// 		width = $(this).outerWidth(true);
				// 		sumWidth += width;
				// 		pos = i;

				// 		console.log(width, $(this).attr('data-pos'));

				// 		if(sumWidth <= pw) {
				// 			if(width > calculateElementMinWidth()) {
				// 				biggerThanMinSum += (width - calculateElementMinWidth());
				// 			}
				// 		}
				// 	}
				// });

				// return pos - 1;

				return Math.floor(calculateParentWidth() / calculateElementMinWidth() - 1);
			};
			var getWidth = function() {
				var pw = parseInt($items.eq(0).css('margin-left'));

				$items.each(function() {
					if(parseInt($(this).css('top')) == 0) {
						pw += $(this).outerWidth(true);
					}
				});

				return pw;
			};
			var isFirst = true;
			var reindexPositions = function() {
				var rtp = getRightPosition();

				for(var i=0, j = 0;i<$items.length;i++) {
					if(i < rtp && $items.eq(i).outerWidth(true) > calculateElementMinWidth()) {
						rtp--;
					}

					if(rtp == i) {
						j++;
					}

					$items.eq(i).attr('data-pos', i+j);//.text(i+j)
				}

				//replacement rule for double element
				var $bi = $this.find('[data-pos="'+(rtp+1)+'"]');
				var biOuterWidth = $bi.outerWidth(true);
				if($bi.length > 0 && biOuterWidth > calculateElementMinWidth()
					&& calculateParentWidth() > biOuterWidth*2) {
					rtp++;
					$this.find('[data-pos="'+(rtp+1)+'"]').attr('data-pos', rtp-1); //.text(rtp-1);
				}

				if(isFirst) {
					rtp++;
					isFirst = false;
				}

				//detect if last element is not with align and swap
				$this.find('[data-align="right-top"]').attr('data-pos', rtp); //.text(rtp);
				
			};

			var update = function() {
				if(opts.isSetWidth) {
					$this.css('width', '');
				}

				if(opts.isSetParentWidth) {
					$this.parent().css('width', '');
				}

				reindexPositions();
				$this.isotope('updateSortData').isotope();
				$this.isotope({
					sortBy: 'pos'
				});
			};
			
			reindexPositions();
			$this.isotope(opts);

			if(opts.isSetWidth) {
				$this.css('width', getWidth());

				$this.isotope('on', 'layoutComplete', function() {
					$this.css('width', getWidth());
				});
			}

			if(opts.isSetParentWidth) {
				$this.parent().css('width', getWidth());

				if(opts.isMarginParentCenter) {
					updateMargin($this.parent());
				}

				$this.isotope('on', 'layoutComplete', function() {
					$this.parent().css('width', getWidth());

					if(opts.isMarginParentCenter) {
						updateMargin($this.parent());
					}
				});
			}

			$(window).resize(update);
			$(document).ready(update);
		});
	};

	$.fn.isotopeStick.defaults = {
		isSetWidth: false,
		isSetParentWidth: false,
		isMarginParentCenter: false
	};

	$.fn.isotopeStick.prior = {
		getSortData: {
			pos: '[data-pos] parseInt'
		},
		sortBy: 'pos'
	};
})(jQuery);
