'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntryController = function () {
	function EntryController() {
		_classCallCheck(this, EntryController);

		this.dataStructure = '';
	}

	_createClass(EntryController, [{
		key: 'index',
		value: function index(req, res) {
			this.dataStructure = req.app.get('appData');
			if (!this.dataStructure.entries) {
				res.status(500).json({ error: 'Internal Server Error' });
			} else {
				res.status(200).json(this.dataStructure.entries);
			}
		}
	}, {
		key: 'show',
		value: function show(req, res) {
			this.dataStructure = req.app.get('appData');
			if (!this.dataStructure.entries) {
				res.status(500).json({ error: 'Internal Server Error!' });
			} else if (!Number.isInteger(Number(req.params.id))) {
				res.status(400).json({ error: 'Bad Request!' });
			} else if (this.dataStructure.entries === undefined || this.dataStructure.entries[req.params.id] === undefined) {
				res.status(404).json({ error: 'This entry cannot be found!' });
			} else {
				var entry = this.dataStructure.entries[req.params.id];
				res.status(200).json(entry);
			}
		}
	}, {
		key: 'create',
		value: function create(req, res) {
			this.dataStructure = req.app.get('appData');
			if (req.body.title === ' ' || req.body.description === ' ') {
				res.status(422).json({ error: 'Please fill in all the fields properly!' });
			} else if (!this.dataStructure.entries) {
				res.status(500).json({ error: 'Internal Server Error!' });
			} else if (req.body.title && req.body.description) {
				this.dataStructure.entries.push(req.body);
				res.status(201).json({ message: 'The entry has been created!' });
			} else {
				res.status(400).json({ error: 'Invalid request!' });
			}
		}
	}]);

	return EntryController;
}();

module.exports = EntryController;
//# sourceMappingURL=EntryController.js.map
