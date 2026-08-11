function detectAceModeFromLanguage(language) {
	switch ((language || '').toLowerCase()) {
	case 'java':
		return 'ace/mode/annotated_java';
	case 'pvl':
		return 'ace/mode/pvl';
	case 'c':
			return 'ace/mode/annotated_c';
	case 'cu':
	case 'cuda':
		return 'ace/mode/annotated_cuda';
	case 'cpp':
	case 'sycl':
		return 'ace/mode/annotated_sycl';
	case 'cl':
	case 'opencl':
		return 'ace/mode/annotated_opencl';
	case 'vpr':
	case 'viper':
		return 'ace/mode/viper';
	default:
		return 'ace/mode/text';
	}
}

function detectAceModeFromClass(codeNode) {
	const className = codeNode.getAttribute('class') || '';
	const match = className.match(/(?:^|\s)language-([a-zA-Z0-9_+-]+)/);
	return detectAceModeFromLanguage(match ? match[1] : '');
}

function getOrCreateAceEditor(editorNode) {
	if (editorNode.env?.editor) {
		return editorNode.env.editor;
	}

	return window.ace.edit(editorNode);
}

function configureAceEditor(editor, mode) {
	editor.setOptions({
		highlightActiveLine: false,
		showPrintMargin: false,
		showLineNumbers: true,
		showGutter: true,
		maxLines: 30,
		fontSize: '0.875em'
	});
	editor.$blockScrolling = Infinity;
	editor.getSession().setUseSoftTabs(false);
	editor.getSession().setTabSize(2);
	editor.getSession().setMode(mode);
	editor.setTheme("ace/theme/chrome");
}

function initAceOnDemand(codeNode) {
	if (!window.ace) {
		return null;
	}

	if (codeNode.dataset && codeNode.dataset.aceInitialized === '1') {
		return getOrCreateAceEditor(codeNode);
	}

	// codeNode.classList.add('editable');
	const editor = getOrCreateAceEditor(codeNode);
	configureAceEditor(editor, detectAceModeFromClass(codeNode));
	if (codeNode.classList.contains('read-only')) {
		editor.setReadOnly(true);
		editor.setHighlightGutterLine(false);
		const value = editor.getValue();
		if (value.endsWith('\n')) {
			editor.setValue(value.replace(/\n$/, ''), -1);
		}
		// editor.setHighlightIndentGuides(false);
	}
	if(typeof editor.originalCode === 'undefined') {
		editor.originalCode = editor.getValue();
	}
	if (codeNode.dataset) {
		codeNode.dataset.aceInitialized = '1';
	}
	return editor;
}

function initVerificationPlaygroundEditors() {
		$('.ace_editor').each(function () {
		initAceOnDemand(this);
	});

	$('.verification-container pre.playground code.editable').each(function () {
		initAceOnDemand(this);
	});
}

if(window.location.pathname === "/" && window.location.hash.startsWith("#")) {
	window.location.href = '/wiki/#' + window.location.hash.substring(1);
}

(($) => {
	$(() => {
		$('.data-table').each(function () {
			const self = $(this);
			const count = self.find('th').length;
			self.DataTable({
				lengthMenu: [[50, -1], [50, "All"]],
				columns: Array(count - 1).fill(null).concat([{orderable: false}]),
			});
		});
	});

	$(window).load(() => {
		initVerificationPlaygroundEditors();
	});
})(jQuery);