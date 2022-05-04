const VERIFICATION_SERVER = 'wss://vercors-server.apps.utwente.nl/';
const PROGRESS_BADGE = '[progress] ';

function setProgress(progress, text, icon) {
	progress.find('.fa').removeClass().addClass('fa').addClass('fa-' + icon);
	progress.find('.verification-progress-text').text(text);
}

$(function() { $('.code-run-button').click(function() {
	const self = $(this).closest('.verification-container');
	self.find('.plain-close').show();
	const log = self.find('.verification-log');
	const progress = self.find('.verification-progress');
	log.show().text('');
	progress.show();
	setProgress(progress, 'Connecting to verification server...', 'spinner');

	var ws = new WebSocket(VERIFICATION_SERVER, 'fmt-tool');

	ws.onerror = function(err) {
		progress.text('An error occurred: cannot connect to verification server');
		console.log(err);
	};

	ws.onmessage = function(e) {
		try {
			var message = JSON.parse(e.data);

			switch(message.type) {
				case 'error':
					setProgress(progress, 'An error occurred: ' + message.errorDescription, 'times');
					ws.close();
					break;
				case 'stdout':
				case 'stderr':
					var parts = message.data.split("\n");
					for(var i = 0; i < parts.length; i++) {
						if(parts[i] === '') {
							continue;
						}

						if(parts[i].startsWith(PROGRESS_BADGE)) {
							setProgress(progress, parts[i].substring(PROGRESS_BADGE.length), 'spinner');
						} else {
							log.text(log.text() + parts[i] + '\n');
						}
					}
					break;
				case 'finished':
					setProgress(progress, 'VerCors exited with exit code ' + message.exitCode, message.exitCode === 0 ? 'check' : 'times');
					ws.close();
					break;
			}
		} catch(err) {
			setProgress(progress, 'An error occurred: ' + err, 'times');
			console.log(err);
		}
	};

	ws.onopen = function(e) {
		setProgress(progress, 'Connected; sending file...', 'spinner');
		const fileName = 'test.' + self.find('[name=lang]').val();
		ws.send(JSON.stringify({
			type: 'submit',
			files: {
				[fileName]: self.find('textarea[name=examplecode]').val()
			},
			arguments: {
				'files': [fileName],
				'backend': 'silicon',
			}
		}));
	};
}) });
