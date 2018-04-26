import React from 'react';
import moment from 'moment';

import values from 'object.values';

import isTouchDevice from 'is-touch-device';

import isNextDay from '../utils/isNextDay';
import isSameDay from '../utils/isSameDay';
import isAfterDay from '../utils/isAfterDay';
import isBeforeDay from '../utils/isBeforeDay';

import getVisibleDays from '../utils/getVisibleDays';
import isDayVisible from '../utils/isDayVisible';

import toISODateString from '../utils/toISODateString';
import toISOMonthString from '../utils/toISOMonthString';

import DayPicker, { defaultProps as DayPickerDefaultProps } from './DayPicker';

import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_SCROLLABLE,
} from '../../constants';

const defaultProps = {
  onDatesChange() {},

  focused: false,
  onFocusChange() {},
  onClose() {},

  keepOpenOnDateSelect: false,
  minimumNights: 1,
  isOutsideRange() {},
  isDayBlocked() {},
  isDayHighlighted() {},

  // DayPicker props
  renderMonth: null,
  enableOutsideDays: false,
  numberOfMonths: 1,
  orientation: HORIZONTAL_ORIENTATION,
  withPortal: false,
  hideKeyboardShortcutsPanel: false,
  initialVisibleMonth: DayPickerDefaultProps.initialVisibleMonth,
  daySize: 39,

  navPrev: null,
  navNext: null,

  onPrevMonthClick() {},
  onNextMonthClick() {},
  onOutsideClick() {},

  renderDay: null,
  renderCalendarInfo: null,

  // accessibility
  onBlur() {},
  isFocused: false,
  showKeyboardShortcuts: true,

  // i18n
  monthFormat: 'MMMM YYYY',

  isRTL: false,
};

export default class DayPickerRangeController extends React.Component {
  constructor(props) {
    super(props);

    this.isTouchDevice = isTouchDevice();
    this.today = moment();
    this.modifiers = {
      today: day => this.isToday(day),
      blocked: day => this.isBlocked(day),
      'blocked-calendar': day => props.isDayBlocked(day),
      'blocked-out-of-range': day => props.isOutsideRange(day),
      'highlighted-calendar': day => props.isDayHighlighted(day),
      valid: day => !this.isBlocked(day),
      selected: day => this.isSelectedDate(day),
      startDate: day => this.isStartDate(day),
      endDate: day => this.isEndDate(day),
      dateInRange: day => this.isInSelectedSpan(day),
      hovered: day => this.isHovered(day),
    };

    const { currentMonth, visibleDays } = this.getStateForNewMonth(props);

    this.state = {
      hoverDate: null,
      currentMonth,
      visibleDays,
    };

    this.onDayClick = this.onDayClick.bind(this);
    this.onDayClick = this.onDayClick.bind(this);
    this.onDayMouseEnter = this.onDayMouseEnter.bind(this);
    this.onDayMouseLeave = this.onDayMouseLeave.bind(this);
    this.onPrevMonthClick = this.onPrevMonthClick.bind(this);
    this.onNextMonthClick = this.onNextMonthClick.bind(this);
    this.onMultiplyScrollableMonths = this.onMultiplyScrollableMonths.bind(this);
    this.getFirstFocusableDay = this.getFirstFocusableDay.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
            date,
            startDate,
            endDate,
            focused,
            isOutsideRange,
            isDayBlocked,
            isDayHighlighted,
            initialVisibleMonth,
            numberOfMonths,
            enableOutsideDays,
        } = nextProps;

    let { visibleDays } = this.state;

    if (isOutsideRange !== this.props.isOutsideRange) {
      this.modifiers['blocked-out-of-range'] = day => isOutsideRange(day);
    }

    if (isDayBlocked !== this.props.isDayBlocked) {
      this.modifiers['blocked-calendar'] = day => isDayBlocked(day);
    }

    if (isDayHighlighted !== this.props.isDayHighlighted) {
      this.modifiers['highlighted-calendar'] = day => isDayHighlighted(day);
    }
    const didStartDateChange = startDate !== this.props.startDate;
    const didEndDateChange = endDate !== this.props.endDate;
    const didDateChange = date !== this.props.date;
    const didFocusChange = focused !== this.props.focused;

    if (
            (
                initialVisibleMonth !== this.props.initialVisibleMonth ||
                numberOfMonths !== this.props.numberOfMonths ||
                enableOutsideDays !== this.props.enableOutsideDays
            ) && (
                !this.props.focused &&
                didFocusChange
            )
        ) {
      const newMonthState = this.getStateForNewMonth(nextProps);
      const currentMonth = { newMonthState };
      (visibleDays = { newMonthState });
      this.setState({
        currentMonth,
        visibleDays,
      });
    }

    let modifiers = {};

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
      values(visibleDays).forEach((days) => {
        Object.keys(days).forEach((day) => {
          const momentObj = moment(day);
          if (isDayBlocked(momentObj)) {
            modifiers = this.addModifier(modifiers, momentObj, 'blocked-calendar');
          } else {
            modifiers = this.deleteModifier(modifiers, momentObj, 'blocked-calendar');
          }

          if (isDayHighlighted(momentObj)) {
            modifiers = this.addModifier(modifiers, momentObj, 'highlighted-calendar');
          } else {
            modifiers = this.deleteModifier(modifiers, momentObj, 'highlighted-calendar');
          }
        });
      });
    }

    const today = moment();
    if (!isSameDay(this.today, today)) {
      modifiers = this.deleteModifier(modifiers, this.today, 'today');
      modifiers = this.addModifier(modifiers, today, 'today');
      this.today = today;
    }

    if (Object.keys(modifiers).length > 0) {
      this.setState({
        visibleDays: {
          ...visibleDays,
          ...modifiers,
        },
      });
    }
  }

  onDayClick(day, e) {
    const { keepOpenOnDateSelect, onBlur } = this.props;
    if (e) e.preventDefault();
    if (this.isBlocked(day)) return;

    const { focused, onFocusChange, onClose, onDatesChange } = this.props;
    let { date } = this.props;
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

  onDayMouseEnter(day) {
    if (this.isTouchDevice) return;
    const { focused } = this.props;
    const { hoverDate, visibleDays } = this.state;

    if (focused && hoverDate !== day) {
      let modifiers = {};
      modifiers = this.deleteModifier(modifiers, hoverDate, 'hovered');
      modifiers = this.addModifier(modifiers, day, 'hovered');

      this.setState({
        hoverDate: day,
        visibleDays: {
          ...visibleDays,
          ...modifiers,
        },
      });
    }
  }

  onDayMouseLeave() {
    const { hoverDate, visibleDays } = this.state;
    if (this.isTouchDevice || !hoverDate) return;

    let modifiers = {};
    modifiers = this.deleteModifier(modifiers, hoverDate, 'hovered');

    this.setState({
      hoverDate: null,
      visibleDays: {
        ...visibleDays,
        ...modifiers,
      },
    });
  }

  onPrevMonthClick() {
    const { onPrevMonthClick, numberOfMonths, enableOutsideDays } = this.props;
    const { currentMonth, visibleDays } = this.state;

    const newVisibleDays = {};
    Object.keys(visibleDays).sort().slice(0, numberOfMonths + 1).forEach((month) => {
      newVisibleDays[month] = visibleDays[month];
    });

    const prevMonth = currentMonth.clone().subtract(2, 'months');
    const prevMonthVisibleDays = getVisibleDays(prevMonth, 1, enableOutsideDays, true);

    this.setState({
      currentMonth: currentMonth.clone().subtract(1, 'month'),
      visibleDays: {
        ...newVisibleDays,
        ...this.getModifiers(prevMonthVisibleDays),
      },
    });

    onPrevMonthClick();
  }

  onNextMonthClick() {
    const { onNextMonthClick, numberOfMonths, enableOutsideDays } = this.props;
    const { currentMonth, visibleDays } = this.state;

    const newVisibleDays = {};
    Object.keys(visibleDays).sort().slice(1).forEach((month) => {
      newVisibleDays[month] = visibleDays[month];
    });

    const nextMonth = currentMonth.clone().add(numberOfMonths + 1, 'month');
    const nextMonthVisibleDays = getVisibleDays(nextMonth, 1, enableOutsideDays, true);

    this.setState({
      currentMonth: currentMonth.clone().add(1, 'month'),
      visibleDays: {
        ...newVisibleDays,
        ...this.getModifiers(nextMonthVisibleDays),
      },
    });

    onNextMonthClick();
  }

    // only for VERTICAL_SCROLLABLE
  onMultiplyScrollableMonths() {
    const { numberOfMonths, enableOutsideDays } = this.props;
    const { currentMonth, visibleDays } = this.state;

    const numberOfVisibleMonths = Object.keys(visibleDays).length;
    const nextMonth = currentMonth.clone().add(numberOfVisibleMonths, 'month');
    const newVisibleDays = getVisibleDays(nextMonth, numberOfMonths, enableOutsideDays, true);

    this.setState({
      visibleDays: {
        ...visibleDays,
        ...this.getModifiers(newVisibleDays),
      },
    });
  }

  getFirstFocusableDay(newMonth) {
    const { date, focused, numberOfMonths } = this.props;

    let focusedDate = newMonth.clone().startOf('month');
    if (focused && date) {
      focusedDate = date.clone();
    }

    if (this.isBlocked(focusedDate)) {
      const days = [];
      const lastVisibleDay = newMonth.clone().add(numberOfMonths - 1, 'months').endOf('month');
      let currentDay = focusedDate.clone();
      while (!isAfterDay(currentDay, lastVisibleDay)) {
        currentDay = currentDay.clone().add(1, 'day');
        days.push(currentDay);
      }

      const viableDays = days.filter(day => !this.isBlocked(day));

      if (viableDays.length > 0) {
        [focusedDate] = viableDays;
      }
    }

    return focusedDate;
  }

  getModifiers(visibleDays) {
    const modifiers = {};
    Object.keys(visibleDays).forEach((month) => {
      modifiers[month] = {};
      visibleDays[month].forEach((day) => {
        modifiers[month][toISODateString(day)] = this.getModifiersForDay(day);
      });
    });

    return modifiers;
  }

  getModifiersForDay(day) {
    return new Set(Object.keys(this.modifiers).filter(modifier => this.modifiers[modifier](day)));
  }

  getStateForNewMonth(nextProps) {
    const { initialVisibleMonth, numberOfMonths, enableOutsideDays, orientation } = nextProps;
    const currentMonth = initialVisibleMonth();
    const withoutTransitionMonths = orientation === VERTICAL_SCROLLABLE;
    const visibleDays = this.getModifiers(
      getVisibleDays(currentMonth, numberOfMonths, enableOutsideDays, withoutTransitionMonths),
    );
    return { currentMonth, visibleDays };
  }

  addModifier(updatedDays, day, modifier) {
    const { numberOfMonths, enableOutsideDays } = this.props;
    const { currentMonth, visibleDays } = this.state;
    if (!day || !isDayVisible(day, currentMonth, numberOfMonths, enableOutsideDays)) {
      return updatedDays;
    }
    let monthIso = toISOMonthString(day);
    let month = updatedDays[monthIso] || visibleDays[monthIso];
    const iso = toISODateString(day);

    if (enableOutsideDays) {
      const startOfMonth = day.clone().startOf('month');
      const endOfMonth = day.clone().endOf('month');
      if (
        isBeforeDay(startOfMonth, currentMonth.clone().startOf('month')) ||
        isAfterDay(endOfMonth, currentMonth.clone().endOf('month'))
      ) {
        [monthIso] = Object.keys(visibleDays).filter(monthKey => (
          monthKey !== monthIso && Object.keys(visibleDays[monthKey]).indexOf(iso) > -1
        ));
        month = updatedDays[monthIso] || visibleDays[monthIso];
      }
    }


    const modifiers = new Set(month[iso]);
    modifiers.add(modifier);
    return {
      ...updatedDays,
      [monthIso]: {
        ...month,
        [iso]: modifiers,
      },
    };
  }

  deleteModifier(updatedDays, day, modifier) {
    const { numberOfMonths, enableOutsideDays } = this.props;
    const { currentMonth, visibleDays } = this.state;
    if (!day || !isDayVisible(day, currentMonth, numberOfMonths, enableOutsideDays)) {
      return updatedDays;
    }

    let monthIso = toISOMonthString(day);
    let month = updatedDays[monthIso] || visibleDays[monthIso];
    const iso = toISODateString(day);
    if (enableOutsideDays) {
      const startOfMonth = day.clone().startOf('month');
      const endOfMonth = day.clone().endOf('month');
      if (
        isBeforeDay(startOfMonth, currentMonth.clone().startOf('month')) ||
        isAfterDay(endOfMonth, currentMonth.clone().endOf('month'))
      ) {
        [monthIso] = Object.keys(visibleDays).filter(monthKey => (
          monthKey !== monthIso && Object.keys(visibleDays[monthKey]).indexOf(iso) > -1
        ));
        month = updatedDays[monthIso] || visibleDays[monthIso];
      }
    }

    const modifiers = new Set(month[iso]);
    modifiers.delete(modifier);
    return {
      ...updatedDays,
      [monthIso]: {
        ...month,
        [iso]: modifiers,
      },
    };
  }

  isDayAfterHoveredStartDate(day) {
    const { startDate, endDate, minimumNights } = this.props;
    const { hoverDate } = this.state || {};
    return !!startDate && !endDate && !this.isBlocked(day) && isNextDay(hoverDate, day) &&
      minimumNights > 0 && isSameDay(hoverDate, startDate);
  }

  isHovered(day) {
    const { hoverDate } = this.state || {};
    const { focused } = this.props;
    return !!focused && isSameDay(day, hoverDate);
  }


  isBlocked(day) {
    const { isDayBlocked, isOutsideRange } = this.props;
    return isDayBlocked(day) || isOutsideRange(day);
  }

  isToday(day) {
    return isSameDay(day, this.today);
  }

  isSelectedDate(day) {
    return isSameDay(day, this.props.date);
  }

  isStartDate(day) {
    return isSameDay(day, this.props.startDate);
  }

  isEndDate(day) {
    return isSameDay(day, this.props.endDate);
  }

  isInSelectedSpan(day) {
    const { startDate, endDate } = this.props;
    return day.isBetween(startDate, endDate);
  }

  render() {
    const {
          numberOfMonths,
          orientation,
          monthFormat,
          renderMonth,
          navPrev,
          navNext,
          onOutsideClick,
          withPortal,
          enableOutsideDays,
          initialVisibleMonth,
          hideKeyboardShortcutsPanel,
          daySize,
          focused,
          renderDay,
          renderCalendarInfo,
          onBlur,
          isFocused,
          showKeyboardShortcuts,
          isRTL,
        } = this.props;

    const { phrases, visibleDays } = this.state;

    return (
      <DayPicker
        orientation={orientation}
        enableOutsideDays={enableOutsideDays}
        modifiers={visibleDays}
        numberOfMonths={numberOfMonths}
        onDayClick={this.onDayClick}
        onDayMouseEnter={this.onDayMouseEnter}
        onDayMouseLeave={this.onDayMouseLeave}
        onPrevMonthClick={this.onPrevMonthClick}
        onNextMonthClick={this.onNextMonthClick}
        onMultiplyScrollableMonths={this.onMultiplyScrollableMonths}
        monthFormat={monthFormat}
        renderMonth={renderMonth}
        withPortal={withPortal}
        hidden={!focused}
        initialVisibleMonth={initialVisibleMonth}
        daySize={daySize}
        onOutsideClick={onOutsideClick}
        navPrev={navPrev}
        navNext={navNext}
        renderDay={renderDay}
        renderCalendarInfo={renderCalendarInfo}
        hideKeyboardShortcutsPanel={hideKeyboardShortcutsPanel}
        isFocused={isFocused}
        getFirstFocusableDay={this.getFirstFocusableDay}
        onBlur={onBlur}
        showKeyboardShortcuts={showKeyboardShortcuts}
        phrases={phrases}
        isRTL={isRTL}
      />
    );
  }
}

DayPickerRangeController.defaultProps = defaultProps;
