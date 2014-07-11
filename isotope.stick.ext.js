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
			var reindexPositions = function() {
				var rtp = getRightPosition();

				for(var i=0, j = 0;i<$items.length;i++) {
					if(i < rtp && $items.eq(i).outerWidth(true) > calculateElementMinWidth()) {
						rtp -= 1;
					}

					if(rtp == i) {
						j++;
					}

					$items.eq(i).attr('data-pos', i+j).text(i+j);
				}

				$this.find('[data-align="right-top"]').attr('data-pos', rtp).text(rtp);
			};

			reindexPositions();
			$this.isotope(opts);

			$(window).resize(function() {
				reindexPositions();
				$this.isotope('updateSortData').isotope();
				$this.isotope({
					sortBy: 'pos'
				});
			});
		});
	}

	$.fn.isotopeStick.defaults = {

	}

	$.fn.isotopeStick.prior = {
		getSortData: {
			pos: '[data-pos] parseInt'
		},
		sortBy: 'pos'
	};
})(jQuery);