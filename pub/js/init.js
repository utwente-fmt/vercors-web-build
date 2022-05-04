/*
	Horizons by TEMPLATED
    templated.co @templatedco
    Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

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

(function($) {
	$(function() {
		$('.data-table').each(function() {
			let self = $(this);
			let count = self.find('th').length;
			self.DataTable({
				lengthMenu: [[50, -1], [50, "All"]],
				columns: Array(count-1).fill(null).concat([{orderable: false}]),
			});
		});

		$('[data-code-mirror=true]').each(function() {
			initCodeMirror(this);
		});

		$('.code-edit-button').click(function() {
			$(this).closest('.verification-text').hide();
			$(this).closest('.verification-container').find('.verification-widget').show();
			if(!$(this).closest('div').find('.CodeMirror').length) {
				initCodeMirror($(this).closest('div').find('textarea')[0]);
			}
		});

		$('.code-close-button').click(function() {
			const root = $(this).closest('.verification-container');
			root.find('.verification-non-plain').hide();
			root.find('.verification-text').show();
			root.find('.plain-close').hide();
		});

		const sideMenu = $('.wiki-side-menu');
		let offsets = [];

		if(sideMenu.length) {
			sideMenu.addClass('wiki-side-menu-js');

			sideMenu.find('a').each(function() {
				let self = $(this);
				offsets.push({
					y: $('#' + self.attr('href').split('#')[1]).offset().top,
					obj: self,
				});
			});

			const $window = $(window);

			console.log(offsets);

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
		}

		// Forms (IE<10).
		var $form = $('form');
		if ($form.length > 0) {
			$form.find('.form-button-submit')
				.on('click', function() {
					$(this).parents('form').submit();
					return false;
				});

			if (skel.vars.IEVersion < 10) {
				$.fn.n33_formerize=function(){var _fakes=new Array(),_form = $(this);_form.find('input[type=text],textarea').each(function() { var e = $(this); if (e.val() == '' || e.val() == e.attr('placeholder')) { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).blur(function() { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).focus(function() { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); _form.find('input[type=password]').each(function() { var e = $(this); var x = $($('<div>').append(e.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text')); if (e.attr('id') != '') x.attr('id', e.attr('id') + '_fakeformerizefield'); if (e.attr('name') != '') x.attr('name', e.attr('name') + '_fakeformerizefield'); x.addClass('formerize-placeholder').val(x.attr('placeholder')).insertAfter(e); if (e.val() == '') e.hide(); else x.hide(); e.blur(function(event) { event.preventDefault(); var e = $(this); var x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } }); x.focus(function(event) { event.preventDefault(); var x = $(this); var e = x.parent().find('input[name=' + x.attr('name').replace('_fakeformerizefield', '') + ']'); x.hide(); e.show().focus(); }); x.keypress(function(event) { event.preventDefault(); x.val(''); }); });  _form.submit(function() { $(this).find('input[type=text],input[type=password],textarea').each(function(event) { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) e.attr('name', ''); if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); }).bind("reset", function(event) { event.preventDefault(); $(this).find('select').val($('option:first').val()); $(this).find('input,textarea').each(function() { var e = $(this); var x; e.removeClass('formerize-placeholder'); switch (this.type) { case 'submit': case 'reset': break; case 'password': e.val(e.attr('defaultValue')); x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } else { e.show(); x.hide(); } break; case 'checkbox': case 'radio': e.attr('checked', e.attr('defaultValue')); break; case 'text': case 'textarea': e.val(e.attr('defaultValue')); if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } break; default: e.val(e.attr('defaultValue')); break; } }); window.setTimeout(function() { for (x in _fakes) _fakes[x].trigger('formerize_sync'); }, 10); }); return _form; };
				$form.n33_formerize();
			}

		}
	});
})(jQuery);