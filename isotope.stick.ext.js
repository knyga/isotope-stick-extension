/**
 * Oleksandr Knyga <oleksandrknyga@gmail.com>, 2014
 */
(function($) {

	$.fn.isotopeStick = function(settings) {
		var opts = $.extend({}, $.fn.isotopeStick.defaults, settings, $.fn.isotopeStick.prior);

		this.each(function() {
			var $this = $(this);
			var $items = $this.children();
			var itemWidth = -1;

			var calculateElementWidth = function() {
				if(-1 == itemWidth) {
					itemWidth = parseFloat($items.first().outerWidth(true));
				}
				return itemWidth;
			};
			var calculateParentWidth = function() {
				return parseFloat($this.width());
			};
			var getRightPosition = function() {
				console.log(calculateParentWidth() / calculateElementWidth() - 1);
				return Math.floor(calculateParentWidth() / calculateElementWidth() - 1);
			};
			var reindexPositions = function() {
				var rtp = getRightPosition();

				for(var i=0, j = 0;i<$items.length;i++) {
					if(rtp == i) {
						j++;
					}

					$items.eq(i).attr('data-pos', i+j);
				}

				$this.find('[data-align="right-top"]').attr('data-pos', rtp);
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