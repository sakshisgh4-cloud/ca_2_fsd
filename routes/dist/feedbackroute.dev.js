"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
app.use(express.json());
app.post('/api/feedback', function _callee(req, res) {
  var _ref, studentName, courseName, message, rating, feedback;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref = req.body || {}, studentName = _ref.studentName, courseName = _ref.courseName, message = _ref.message, rating = _ref.rating;

          if (!(!studentName || !courseName || !message || rating === undefined)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'studentName, courseName, message, and rating are required.'
          }));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(Feedback.create({
            studentName: studentName,
            courseName: courseName,
            message: message,
            rating: rating
          }));

        case 5:
          feedback = _context.sent;
          return _context.abrupt("return", res.status(201).json(feedback));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.get('/api/feedback', function _callee2(req, res) {
  var page, limit, skip, _ref2, _ref3, feedback, totalRecords;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          page = req.query.page === undefined ? 1 : Number(req.query.page);
          limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

          if (!(!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'page and limit must be positive integers.'
          }));

        case 4:
          skip = (page - 1) * limit;

          if (Number.isSafeInteger(skip)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'The requested page offset is too large.'
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all([Feedback.find().sort({
            createdAt: -1
          }).skip(skip).limit(limit), Feedback.countDocuments()]));

        case 9:
          _ref2 = _context2.sent;
          _ref3 = _slicedToArray(_ref2, 2);
          feedback = _ref3[0];
          totalRecords = _ref3[1];
          return _context2.abrupt("return", res.json({
            feedback: feedback,
            currentPage: page,
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords / limit)
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.patch('/api/feedback/:id', function _callee3(req, res) {
  var _ref4, status, feedback;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (mongoose.isValidObjectId(req.params.id)) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Invalid feedback ID.'
          }));

        case 2:
          _ref4 = req.body || {}, status = _ref4.status;

          if (REVIEW_STATUSES.includes(status)) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "status must be one of: ".concat(REVIEW_STATUSES.join(', '), ".")
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(Feedback.findByIdAndUpdate(req.params.id, {
            status: status
          }, {
            "new": true,
            runValidators: true
          }));

        case 7:
          feedback = _context3.sent;

          if (feedback) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Feedback record not found.'
          }));

        case 10:
          return _context3.abrupt("return", res.json(feedback));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});
app.use(function (error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: error.message
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      message: 'Request body contains invalid JSON.'
    });
  }

  console.error(error);
  return res.status(500).json({
    message: 'An unexpected server error occurred.'
  });
});

if (require.main === module) {
  mongoose.connect(MONGODB_URI).then(function () {
    app.listen(PORT, function () {
      console.log("Student Feedback API listening on port ".concat(PORT));
    });
  })["catch"](function (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exitCode = 1;
  });
}

module.exports = app;