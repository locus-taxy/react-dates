Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _object = require('object.assign');

var _object2 = _interopRequireDefault(_object);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _object3 = require('object.values');

var _object4 = _interopRequireDefault(_object3);

var _isTouchDevice = require('../utils/isTouchDevice');

var _isTouchDevice2 = _interopRequireDefault(_isTouchDevice);

var _isNextDay = require('../utils/isNextDay');

var _isNextDay2 = _interopRequireDefault(_isNextDay);

var _isSameDay = require('../utils/isSameDay');

var _isSameDay2 = _interopRequireDefault(_isSameDay);

var _isAfterDay = require('../utils/isAfterDay');

var _isAfterDay2 = _interopRequireDefault(_isAfterDay);

var _isBeforeDay = require('../utils/isBeforeDay');

var _isBeforeDay2 = _interopRequireDefault(_isBeforeDay);

var _getVisibleDays = require('../utils/getVisibleDays');

var _getVisibleDays2 = _interopRequireDefault(_getVisibleDays);

var _isDayVisible = require('../utils/isDayVisible');

var _isDayVisible2 = _interopRequireDefault(_isDayVisible);

var _toISODateString = require('../utils/toISODateString');

var _toISODateString2 = _interopRequireDefault(_toISODateString);

var _toISOMonthString = require('../utils/toISOMonthString');

var _toISOMonthString2 = _interopRequireDefault(_toISOMonthString);

var _DayPicker = require('./DayPicker');

var _DayPicker2 = _interopRequireDefault(_DayPicker);

var _constants = require('../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultProps = {
  onDatesChange: function () {
    function onDatesChange() {}

    return onDatesChange;
  }(),


  focused: false,
  onFocusChange: function () {
    function onFocusChange() {}

    return onFocusChange;
  }(),
  onClose: function () {
    function onClose() {}

    return onClose;
  }(),


  keepOpenOnDateSelect: false,
  minimumNights: 1,
  isOutsideRange: function () {
    function isOutsideRange() {}

    return isOutsideRange;
  }(),
  isDayBlocked: function () {
    function isDayBlocked() {}

    return isDayBlocked;
  }(),
  isDayHighlighted: function () {
    function isDayHighlighted() {}

    return isDayHighlighted;
  }(),


  // DayPicker props
  renderMonth: null,
  enableOutsideDays: false,
  numberOfMonths: 1,
  orientation: _constants.HORIZONTAL_ORIENTATION,
  withPortal: false,
  hideKeyboardShortcutsPanel: false,
  initialVisibleMonth: _DayPicker.defaultProps.initialVisibleMonth,
  daySize: 39,

  navPrev: null,
  navNext: null,

  onPrevMonthClick: function () {
    function onPrevMonthClick() {}

    return onPrevMonthClick;
  }(),
  onNextMonthClick: function () {
    function onNextMonthClick() {}

    return onNextMonthClick;
  }(),
  onOutsideClick: function () {
    function onOutsideClick() {}

    return onOutsideClick;
  }(),


  renderDay: null,
  renderCalendarInfo: null,

  // accessibility
  onBlur: function () {
    function onBlur() {}

    return onBlur;
  }(),

  isFocused: false,
  showKeyboardShortcuts: true,

  // i18n
  monthFormat: 'MMMM YYYY',

  isRTL: false
};

var DayPickerRangeController = function (_React$Component) {
  _inherits(DayPickerRangeController, _React$Component);

  function DayPickerRangeController(props) {
    _classCallCheck(this, DayPickerRangeController);

    var _this = _possibleConstructorReturn(this, (DayPickerRangeController.__proto__ || Object.getPrototypeOf(DayPickerRangeController)).call(this, props));

    _this.isTouchDevice = (0, _isTouchDevice2['default'])();
    _this.today = (0, _moment2['default'])();
    _this.modifiers = {
      today: function () {
        function today(day) {
          return _this.isToday(day);
        }

        return today;
      }(),
      blocked: function () {
        function blocked(day) {
          return _this.isBlocked(day);
        }

        return blocked;
      }(),
      'blocked-calendar': function () {
        function blockedCalendar(day) {
          return props.isDayBlocked(day);
        }

        return blockedCalendar;
      }(),
      'blocked-out-of-range': function () {
        function blockedOutOfRange(day) {
          return props.isOutsideRange(day);
        }

        return blockedOutOfRange;
      }(),
      'highlighted-calendar': function () {
        function highlightedCalendar(day) {
          return props.isDayHighlighted(day);
        }

        return highlightedCalendar;
      }(),
      valid: function () {
        function valid(day) {
          return !_this.isBlocked(day);
        }

        return valid;
      }(),
      selected: function () {
        function selected(day) {
          return _this.isSelectedDate(day);
        }

        return selected;
      }(),
      startDate: function () {
        function startDate(day) {
          return _this.isStartDate(day);
        }

        return startDate;
      }(),
      endDate: function () {
        function endDate(day) {
          return _this.isEndDate(day);
        }

        return endDate;
      }(),
      dateInRange: function () {
        function dateInRange(day) {
          return _this.isInSelectedSpan(day);
        }

        return dateInRange;
      }(),
      hovered: function () {
        function hovered(day) {
          return _this.isHovered(day);
        }

        return hovered;
      }()
    };

    var _this$getStateForNewM = _this.getStateForNewMonth(props),
        currentMonth = _this$getStateForNewM.currentMonth,
        visibleDays = _this$getStateForNewM.visibleDays;

    _this.state = {
      hoverDate: null,
      currentMonth: currentMonth,
      visibleDays: visibleDays
    };

    _this.onDayClick = _this.onDayClick.bind(_this);
    _this.onDayClick = _this.onDayClick.bind(_this);
    _this.onDayMouseEnter = _this.onDayMouseEnter.bind(_this);
    _this.onDayMouseLeave = _this.onDayMouseLeave.bind(_this);
    _this.onPrevMonthClick = _this.onPrevMonthClick.bind(_this);
    _this.onNextMonthClick = _this.onNextMonthClick.bind(_this);
    _this.onMultiplyScrollableMonths = _this.onMultiplyScrollableMonths.bind(_this);
    _this.getFirstFocusableDay = _this.getFirstFocusableDay.bind(_this);
    return _this;
  }

  _createClass(DayPickerRangeController, [{
    key: 'componentWillReceiveProps',
    value: function () {
      function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        var date = nextProps.date,
            startDate = nextProps.startDate,
            endDate = nextProps.endDate,
            focused = nextProps.focused,
            isOutsideRange = nextProps.isOutsideRange,
            isDayBlocked = nextProps.isDayBlocked,
            isDayHighlighted = nextProps.isDayHighlighted,
            initialVisibleMonth = nextProps.initialVisibleMonth,
            numberOfMonths = nextProps.numberOfMonths,
            enableOutsideDays = nextProps.enableOutsideDays;
        var visibleDays = this.state.visibleDays;


        if (isOutsideRange !== this.props.isOutsideRange) {
          this.modifiers['blocked-out-of-range'] = function (day) {
            return isOutsideRange(day);
          };
        }

        if (isDayBlocked !== this.props.isDayBlocked) {
          this.modifiers['blocked-calendar'] = function (day) {
            return isDayBlocked(day);
          };
        }

        if (isDayHighlighted !== this.props.isDayHighlighted) {
          this.modifiers['highlighted-calendar'] = function (day) {
            return isDayHighlighted(day);
          };
        }
        var didStartDateChange = startDate !== this.props.startDate;
        var didEndDateChange = endDate !== this.props.endDate;
        var didDateChange = date !== this.props.date;
        var didFocusChange = focused !== this.props.focused;

        if ((initialVisibleMonth !== this.props.initialVisibleMonth || numberOfMonths !== this.props.numberOfMonths || enableOutsideDays !== this.props.enableOutsideDays) && !this.props.focused && didFocusChange) {
          var newMonthState = this.getStateForNewMonth(nextProps);
          var currentMonth = { newMonthState: newMonthState };
          visibleDays = { newMonthState: newMonthState };
          this.setState({
            currentMonth: currentMonth,
            visibleDays: visibleDays
          });
        }

        var modifiers = {};

        if (didStartDateChange) {
          modifiers = this.deleteModifier(modifiers, this.props.startDate, 'startDate');
          modifiers = this.addModifier(modifiers, startDate, 'startDate');
        }

        if (didEndDateChange) {
          modifiers = this.deleteModifier(modifiers, this.props.endDate, 'endDate');
          modifiers = this.addModifier(modifiers, endDate, 'endDate');
        }

        if (didDateChange) {
          modifiers = this.deleteModifier(modifiers, this.props.date, 'selected');
          modifiers = this.addModifier(modifiers, date, 'selected');
        }

        if (didFocusChange) {
          (0, _object4['default'])(visibleDays).forEach(function (days) {
            Object.keys(days).forEach(function (day) {
              var momentObj = (0, _moment2['default'])(day);
              if (isDayBlocked(momentObj)) {
                modifiers = _this2.addModifier(modifiers, momentObj, 'blocked-calendar');
              } else {
                modifiers = _this2.deleteModifier(modifiers, momentObj, 'blocked-calendar');
              }

              if (isDayHighlighted(momentObj)) {
                modifiers = _this2.addModifier(modifiers, momentObj, 'highlighted-calendar');
              } else {
                modifiers = _this2.deleteModifier(modifiers, momentObj, 'highlighted-calendar');
              }
            });
          });
        }

        var today = (0, _moment2['default'])();
        if (!(0, _isSameDay2['default'])(this.today, today)) {
          modifiers = this.deleteModifier(modifiers, this.today, 'today');
          modifiers = this.addModifier(modifiers, today, 'today');
          this.today = today;
        }

        if (Object.keys(modifiers).length > 0) {
          this.setState({
            visibleDays: (0, _object2['default'])({}, visibleDays, modifiers)
          });
        }
      }

      return componentWillReceiveProps;
    }()
  }, {
    key: 'onDayClick',
    value: function () {
      function onDayClick(day, e) {
        var _props = this.props,
            keepOpenOnDateSelect = _props.keepOpenOnDateSelect,
            onBlur = _props.onBlur;

        if (e) e.preventDefault();
        if (this.isBlocked(day)) return;

        var _props2 = this.props,
            focused = _props2.focused,
            onFocusChange = _props2.onFocusChange,
            onClose = _props2.onClose,
            onDatesChange = _props2.onDatesChange;
        var date = this.props.date;

        if (focused) {
          date = day;
          if (!keepOpenOnDateSelect) {
            onFocusChange(null);
            onClose(date);
          }
        }
        onDatesChange(date);
        onBlur();
      }

      return onDayClick;
    }()
  }, {
    key: 'onDayMouseEnter',
    value: function () {
      function onDayMouseEnter(day) {
        if (this.isTouchDevice) return;
        var focused = this.props.focused;
        var _state = this.state,
            hoverDate = _state.hoverDate,
            visibleDays = _state.visibleDays;


        if (focused && hoverDate !== day) {
          var modifiers = {};
          modifiers = this.deleteModifier(modifiers, hoverDate, 'hovered');
          modifiers = this.addModifier(modifiers, day, 'hovered');

          this.setState({
            hoverDate: day,
            visibleDays: (0, _object2['default'])({}, visibleDays, modifiers)
          });
        }
      }

      return onDayMouseEnter;
    }()
  }, {
    key: 'onDayMouseLeave',
    value: function () {
      function onDayMouseLeave() {
        var _state2 = this.state,
            hoverDate = _state2.hoverDate,
            visibleDays = _state2.visibleDays;

        if (this.isTouchDevice || !hoverDate) return;

        var modifiers = {};
        modifiers = this.deleteModifier(modifiers, hoverDate, 'hovered');

        this.setState({
          hoverDate: null,
          visibleDays: (0, _object2['default'])({}, visibleDays, modifiers)
        });
      }

      return onDayMouseLeave;
    }()
  }, {
    key: 'onPrevMonthClick',
    value: function () {
      function onPrevMonthClick() {
        var _props3 = this.props,
            onPrevMonthClick = _props3.onPrevMonthClick,
            numberOfMonths = _props3.numberOfMonths,
            enableOutsideDays = _props3.enableOutsideDays;
        var _state3 = this.state,
            currentMonth = _state3.currentMonth,
            visibleDays = _state3.visibleDays;


        var newVisibleDays = {};
        Object.keys(visibleDays).sort().slice(0, numberOfMonths + 1).forEach(function (month) {
          newVisibleDays[month] = visibleDays[month];
        });

        var prevMonth = currentMonth.clone().subtract(2, 'months');
        var prevMonthVisibleDays = (0, _getVisibleDays2['default'])(prevMonth, 1, enableOutsideDays, true);

        this.setState({
          currentMonth: currentMonth.clone().subtract(1, 'month'),
          visibleDays: (0, _object2['default'])({}, newVisibleDays, this.getModifiers(prevMonthVisibleDays))
        });

        onPrevMonthClick();
      }

      return onPrevMonthClick;
    }()
  }, {
    key: 'onNextMonthClick',
    value: function () {
      function onNextMonthClick() {
        var _props4 = this.props,
            onNextMonthClick = _props4.onNextMonthClick,
            numberOfMonths = _props4.numberOfMonths,
            enableOutsideDays = _props4.enableOutsideDays;
        var _state4 = this.state,
            currentMonth = _state4.currentMonth,
            visibleDays = _state4.visibleDays;


        var newVisibleDays = {};
        Object.keys(visibleDays).sort().slice(1).forEach(function (month) {
          newVisibleDays[month] = visibleDays[month];
        });

        var nextMonth = currentMonth.clone().add(numberOfMonths + 1, 'month');
        var nextMonthVisibleDays = (0, _getVisibleDays2['default'])(nextMonth, 1, enableOutsideDays, true);

        this.setState({
          currentMonth: currentMonth.clone().add(1, 'month'),
          visibleDays: (0, _object2['default'])({}, newVisibleDays, this.getModifiers(nextMonthVisibleDays))
        });

        onNextMonthClick();
      }

      return onNextMonthClick;
    }()

    // only for VERTICAL_SCROLLABLE

  }, {
    key: 'onMultiplyScrollableMonths',
    value: function () {
      function onMultiplyScrollableMonths() {
        var _props5 = this.props,
            numberOfMonths = _props5.numberOfMonths,
            enableOutsideDays = _props5.enableOutsideDays;
        var _state5 = this.state,
            currentMonth = _state5.currentMonth,
            visibleDays = _state5.visibleDays;


        var numberOfVisibleMonths = Object.keys(visibleDays).length;
        var nextMonth = currentMonth.clone().add(numberOfVisibleMonths, 'month');
        var newVisibleDays = (0, _getVisibleDays2['default'])(nextMonth, numberOfMonths, enableOutsideDays, true);

        this.setState({
          visibleDays: (0, _object2['default'])({}, visibleDays, this.getModifiers(newVisibleDays))
        });
      }

      return onMultiplyScrollableMonths;
    }()
  }, {
    key: 'getFirstFocusableDay',
    value: function () {
      function getFirstFocusableDay(newMonth) {
        var _this3 = this;

        var _props6 = this.props,
            date = _props6.date,
            focused = _props6.focused,
            numberOfMonths = _props6.numberOfMonths;


        var focusedDate = newMonth.clone().startOf('month');
        if (focused && date) {
          focusedDate = date.clone();
        }

        if (this.isBlocked(focusedDate)) {
          var days = [];
          var lastVisibleDay = newMonth.clone().add(numberOfMonths - 1, 'months').endOf('month');
          var currentDay = focusedDate.clone();
          while (!(0, _isAfterDay2['default'])(currentDay, lastVisibleDay)) {
            currentDay = currentDay.clone().add(1, 'day');
            days.push(currentDay);
          }

          var viableDays = days.filter(function (day) {
            return !_this3.isBlocked(day);
          });

          if (viableDays.length > 0) {
            var _viableDays = _slicedToArray(viableDays, 1);

            focusedDate = _viableDays[0];
          }
        }

        return focusedDate;
      }

      return getFirstFocusableDay;
    }()
  }, {
    key: 'getModifiers',
    value: function () {
      function getModifiers(visibleDays) {
        var _this4 = this;

        var modifiers = {};
        Object.keys(visibleDays).forEach(function (month) {
          modifiers[month] = {};
          visibleDays[month].forEach(function (day) {
            modifiers[month][(0, _toISODateString2['default'])(day)] = _this4.getModifiersForDay(day);
          });
        });

        return modifiers;
      }

      return getModifiers;
    }()
  }, {
    key: 'getModifiersForDay',
    value: function () {
      function getModifiersForDay(day) {
        var _this5 = this;

        return new Set(Object.keys(this.modifiers).filter(function (modifier) {
          return _this5.modifiers[modifier](day);
        }));
      }

      return getModifiersForDay;
    }()
  }, {
    key: 'getStateForNewMonth',
    value: function () {
      function getStateForNewMonth(nextProps) {
        var initialVisibleMonth = nextProps.initialVisibleMonth,
            numberOfMonths = nextProps.numberOfMonths,
            enableOutsideDays = nextProps.enableOutsideDays,
            orientation = nextProps.orientation;

        var currentMonth = initialVisibleMonth();
        var withoutTransitionMonths = orientation === _constants.VERTICAL_SCROLLABLE;
        var visibleDays = this.getModifiers((0, _getVisibleDays2['default'])(currentMonth, numberOfMonths, enableOutsideDays, withoutTransitionMonths));
        return { currentMonth: currentMonth, visibleDays: visibleDays };
      }

      return getStateForNewMonth;
    }()
  }, {
    key: 'addModifier',
    value: function () {
      function addModifier(updatedDays, day, modifier) {
        var _props7 = this.props,
            numberOfMonths = _props7.numberOfMonths,
            enableOutsideDays = _props7.enableOutsideDays;
        var _state6 = this.state,
            currentMonth = _state6.currentMonth,
            visibleDays = _state6.visibleDays;

        if (!day || !(0, _isDayVisible2['default'])(day, currentMonth, numberOfMonths, enableOutsideDays)) {
          return updatedDays;
        }
        var monthIso = (0, _toISOMonthString2['default'])(day);
        var month = updatedDays[monthIso] || visibleDays[monthIso];
        var iso = (0, _toISODateString2['default'])(day);

        if (enableOutsideDays) {
          var startOfMonth = day.clone().startOf('month');
          var endOfMonth = day.clone().endOf('month');
          if ((0, _isBeforeDay2['default'])(startOfMonth, currentMonth.clone().startOf('month')) || (0, _isAfterDay2['default'])(endOfMonth, currentMonth.clone().endOf('month'))) {
            var _Object$keys$filter = Object.keys(visibleDays).filter(function (monthKey) {
              return monthKey !== monthIso && Object.keys(visibleDays[monthKey]).indexOf(iso) > -1;
            });

            var _Object$keys$filter2 = _slicedToArray(_Object$keys$filter, 1);

            monthIso = _Object$keys$filter2[0];

            month = updatedDays[monthIso] || visibleDays[monthIso];
          }
        }

        var modifiers = new Set(month[iso]);
        modifiers.add(modifier);
        return (0, _object2['default'])({}, updatedDays, _defineProperty({}, monthIso, (0, _object2['default'])({}, month, _defineProperty({}, iso, modifiers))));
      }

      return addModifier;
    }()
  }, {
    key: 'deleteModifier',
    value: function () {
      function deleteModifier(updatedDays, day, modifier) {
        var _props8 = this.props,
            numberOfMonths = _props8.numberOfMonths,
            enableOutsideDays = _props8.enableOutsideDays;
        var _state7 = this.state,
            currentMonth = _state7.currentMonth,
            visibleDays = _state7.visibleDays;

        if (!day || !(0, _isDayVisible2['default'])(day, currentMonth, numberOfMonths, enableOutsideDays)) {
          return updatedDays;
        }

        var monthIso = (0, _toISOMonthString2['default'])(day);
        var month = updatedDays[monthIso] || visibleDays[monthIso];
        var iso = (0, _toISODateString2['default'])(day);
        if (enableOutsideDays) {
          var startOfMonth = day.clone().startOf('month');
          var endOfMonth = day.clone().endOf('month');
          if ((0, _isBeforeDay2['default'])(startOfMonth, currentMonth.clone().startOf('month')) || (0, _isAfterDay2['default'])(endOfMonth, currentMonth.clone().endOf('month'))) {
            var _Object$keys$filter3 = Object.keys(visibleDays).filter(function (monthKey) {
              return monthKey !== monthIso && Object.keys(visibleDays[monthKey]).indexOf(iso) > -1;
            });

            var _Object$keys$filter4 = _slicedToArray(_Object$keys$filter3, 1);

            monthIso = _Object$keys$filter4[0];

            month = updatedDays[monthIso] || visibleDays[monthIso];
          }
        }

        var modifiers = new Set(month[iso]);
        modifiers['delete'](modifier);
        return (0, _object2['default'])({}, updatedDays, _defineProperty({}, monthIso, (0, _object2['default'])({}, month, _defineProperty({}, iso, modifiers))));
      }

      return deleteModifier;
    }()
  }, {
    key: 'isDayAfterHoveredStartDate',
    value: function () {
      function isDayAfterHoveredStartDate(day) {
        var _props9 = this.props,
            startDate = _props9.startDate,
            endDate = _props9.endDate,
            minimumNights = _props9.minimumNights;

        var _ref = this.state || {},
            hoverDate = _ref.hoverDate;

        return !!startDate && !endDate && !this.isBlocked(day) && (0, _isNextDay2['default'])(hoverDate, day) && minimumNights > 0 && (0, _isSameDay2['default'])(hoverDate, startDate);
      }

      return isDayAfterHoveredStartDate;
    }()
  }, {
    key: 'isHovered',
    value: function () {
      function isHovered(day) {
        var _ref2 = this.state || {},
            hoverDate = _ref2.hoverDate;

        var focused = this.props.focused;

        return !!focused && (0, _isSameDay2['default'])(day, hoverDate);
      }

      return isHovered;
    }()
  }, {
    key: 'isBlocked',
    value: function () {
      function isBlocked(day) {
        var _props10 = this.props,
            isDayBlocked = _props10.isDayBlocked,
            isOutsideRange = _props10.isOutsideRange;

        return isDayBlocked(day) || isOutsideRange(day);
      }

      return isBlocked;
    }()
  }, {
    key: 'isToday',
    value: function () {
      function isToday(day) {
        return (0, _isSameDay2['default'])(day, this.today);
      }

      return isToday;
    }()
  }, {
    key: 'isSelectedDate',
    value: function () {
      function isSelectedDate(day) {
        return (0, _isSameDay2['default'])(day, this.props.date);
      }

      return isSelectedDate;
    }()
  }, {
    key: 'isStartDate',
    value: function () {
      function isStartDate(day) {
        return (0, _isSameDay2['default'])(day, this.props.startDate);
      }

      return isStartDate;
    }()
  }, {
    key: 'isEndDate',
    value: function () {
      function isEndDate(day) {
        return (0, _isSameDay2['default'])(day, this.props.endDate);
      }

      return isEndDate;
    }()
  }, {
    key: 'isInSelectedSpan',
    value: function () {
      function isInSelectedSpan(day) {
        var _props11 = this.props,
            startDate = _props11.startDate,
            endDate = _props11.endDate;

        return day.isBetween(startDate, endDate);
      }

      return isInSelectedSpan;
    }()
  }, {
    key: 'render',
    value: function () {
      function render() {
        var _props12 = this.props,
            numberOfMonths = _props12.numberOfMonths,
            orientation = _props12.orientation,
            monthFormat = _props12.monthFormat,
            renderMonth = _props12.renderMonth,
            navPrev = _props12.navPrev,
            navNext = _props12.navNext,
            onOutsideClick = _props12.onOutsideClick,
            withPortal = _props12.withPortal,
            enableOutsideDays = _props12.enableOutsideDays,
            initialVisibleMonth = _props12.initialVisibleMonth,
            hideKeyboardShortcutsPanel = _props12.hideKeyboardShortcutsPanel,
            daySize = _props12.daySize,
            focused = _props12.focused,
            renderDay = _props12.renderDay,
            renderCalendarInfo = _props12.renderCalendarInfo,
            onBlur = _props12.onBlur,
            isFocused = _props12.isFocused,
            showKeyboardShortcuts = _props12.showKeyboardShortcuts,
            isRTL = _props12.isRTL;
        var _state8 = this.state,
            phrases = _state8.phrases,
            visibleDays = _state8.visibleDays;


        return _react2['default'].createElement(_DayPicker2['default'], {
          orientation: orientation,
          enableOutsideDays: enableOutsideDays,
          modifiers: visibleDays,
          numberOfMonths: numberOfMonths,
          onDayClick: this.onDayClick,
          onDayMouseEnter: this.onDayMouseEnter,
          onDayMouseLeave: this.onDayMouseLeave,
          onPrevMonthClick: this.onPrevMonthClick,
          onNextMonthClick: this.onNextMonthClick,
          onMultiplyScrollableMonths: this.onMultiplyScrollableMonths,
          monthFormat: monthFormat,
          renderMonth: renderMonth,
          withPortal: withPortal,
          hidden: !focused,
          initialVisibleMonth: initialVisibleMonth,
          daySize: daySize,
          onOutsideClick: onOutsideClick,
          navPrev: navPrev,
          navNext: navNext,
          renderDay: renderDay,
          renderCalendarInfo: renderCalendarInfo,
          hideKeyboardShortcutsPanel: hideKeyboardShortcutsPanel,
          isFocused: isFocused,
          getFirstFocusableDay: this.getFirstFocusableDay,
          onBlur: onBlur,
          showKeyboardShortcuts: showKeyboardShortcuts,
          phrases: phrases,
          isRTL: isRTL
        });
      }

      return render;
    }()
  }]);

  return DayPickerRangeController;
}(_react2['default'].Component);

exports['default'] = DayPickerRangeController;


DayPickerRangeController.defaultProps = defaultProps;