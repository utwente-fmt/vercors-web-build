function initCodeMirror(node) {
	const editor = CodeMirror.fromTextArea(node, {
		lineNumbers: true,
		matchBrackets: true,
		indentUnit: 2,
		indentWithTabs: true,
		theme: 'monokai'
	});
	editor.on('change', function(e) { e.save(); });
	editor.setSize(null, 500);
}

if(window.location.pathname === "/" && window.location.hash.startsWith("#")) {
	window.location.href = '/wiki/#' + window.location.hash.substring(1);
}

(function($) {
	$(function() {
		$('.data-table').each(function () {
			let self = $(this);
			let count = self.find('th').length;
			self.DataTable({
				lengthMenu: [[50, -1], [50, "All"]],
				columns: Array(count - 1).fill(null).concat([{orderable: false}]),
			});
		});

		$('[data-code-mirror=true]').each(function () {
			initCodeMirror(this);
		});

		$('.code-edit-button').click(function () {
			$(this).closest('.verification-text').hide();
			$(this).closest('.verification-container').find('.verification-widget').show();
			if (!$(this).closest('div').find('.CodeMirror').length) {
				initCodeMirror($(this).closest('div').find('textarea')[0]);
			}
		});

		$('.code-close-button').click(function () {
			const root = $(this).closest('.verification-container');
			root.find('.verification-non-plain').hide();
			root.find('.verification-text').show();
			root.find('.plain-close').hide();
		});

		const sideMenu = $('.wiki-side-menu');
		sideMenu.addClass('wiki-side-menu-js');
	});

	$(window).load(function() {
		const sideMenu = $('.wiki-side-menu');
		let offsets = [];
		sideMenu.find('a').each(function() {
			let self = $(this);
			offsets.push({
				y: $('#' + self.attr('href').split('#')[1]).offset().top,
				obj: self,
			});
		});

		const $window = $(window);

		$window.scroll(function() {
			const center = $window.scrollTop() + $window.height() / 2;
			sideMenu.find('.focus').removeClass('focus');

			let toSet = null;

			for(let {y, obj} of offsets) {
				if(y < center) {
					toSet = obj;
				}
			}

			if(toSet) {
				toSet.addClass('focus');
				toSet.parent('li').parent('ul').siblings('a').addClass('focus');
			}
		});

		$window.scroll();
	});
})(jQuery);