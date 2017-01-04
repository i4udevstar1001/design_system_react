/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, { PropTypes } from 'react';
import Week from './week';
import { EventUtil, DateUtil, KEYS } from '../../../utilities';

const DatepickerCalendar = React.createClass({
	displayName: 'SLDSDatepickerCalendar',

	propTypes: {
		/**
		 * Three letter abbreviations of the days of the week, starting on Sunday.
		 */
		abbreviatedWeekDayLabels: PropTypes.array.isRequired,
		/**
     * Date used to create calendar that is displayed. This is typically the initial day focused when using the keyboard navigation. Focus will be set to this date if available.
     */
		initialDateForCalendarRender: PropTypes.instanceOf(Date).isRequired,
		/**
		 * Makes Monday the first day of the week
		 */
		isIsoWeekday: PropTypes.bool,
		/**
		 * Displayed calendar has changed or re-rendered
		 */
		onChangeMonth: PropTypes.func.isRequired,
		/**
		 * Triggered when the calendar is cancelled.
		 */
		onRequestClose: PropTypes.func.isRequired,
		/**
		 * Triggered when a date on the calendar is clicked.
		 */
		onSelectDate: PropTypes.func.isRequired,
		/**
		 * Currently selected date. This should be present in the input field.
		 */
		selectedDate: PropTypes.instanceOf(Date),
		/**
		 * Label of shortcut to jump to today within the calendar. This is also used for assistive text on today's date.
		 */
		todayLabel: PropTypes.string.isRequired,
		/**
		 * Names of the seven days of the week, starting on Sunday.
		 */
		weekDayLabels: PropTypes.array.isRequired
	},

	getInitialState () {
		return {
			focusedDate: DateUtil.firstDayOfMonth(this.props.initialDateForCalendarRender),
			hasFocus: true,
			todayFocus: false
		};
	},

	componentDidUpdate (prevProps) {
		this.setFocusedDate(prevProps);
	},

	setFocusedDate (prevProps) {
		// Set prop that sets focus in child component once it is rendered. This occurs when the month DOM has changed. This will trigger a re-render, but no DOM change will occur, just a DOM focus.
		if (!DateUtil.isEqual(this.props.initialDateForCalendarRender, prevProps.initialDateForCalendarRender)) {
			this.setState({ focusedDate: this.props.initialDateForCalendarRender });
		}
	},

	handleSelectDate (event, { date }) {
		this.setState({ selected: date });
		this.props.onSelectDate(event, { date });
	},

	handleRequestClose () {
		if (this.props.onRequestClose) {
			this.props.onRequestClose();
		}
	},

	handlePreviousDay (date) {
		const prevDate = DateUtil.addDays(date, -1);
		if (!DateUtil.isSameMonth(prevDate, date)) {
			this.props.onChangeMonth(prevDate);
		} else {
			this.setState({ focusedDate: prevDate });
		}
	},

	handleNextDay (date) {
		const nextDate = DateUtil.addDays(date, 1);
		if (!DateUtil.isSameMonth(nextDate, date)) {
			this.props.onChangeMonth(nextDate);
		} else {
			this.setState({ focusedDate: nextDate });
		}
	},

	handlePreviousWeek (date) {
		const prevDate = DateUtil.addDays(date, -7);
		if (!DateUtil.isSameMonth(prevDate, date)) {
			this.props.onChangeMonth(prevDate);
		} else {
			this.setState({ focusedDate: prevDate });
		}
	},

	handleNextWeek (date) {
		const nextDate = DateUtil.addDays(date, 7);
		if (!DateUtil.isSameMonth(nextDate, date)) {
			this.props.onChangeMonth(nextDate);
		} else {
			this.setState({ focusedDate: nextDate });
		}
	},

	handleTodayFocus () {
		this.state.todayFocus = true;
	},

	handleTodayBlur () {
		this.state.todayFocus = false;
	},

	handleKeyDown (event) {
		if (event.keyCode) {
			if (event.keyCode === KEYS.TAB) {
				if (!event.shiftKey) {
					EventUtil.trapEvent(event);
					if (this.props.onRequestClose) {
						this.props.onRequestClose();
					}
				}
			}
		}
	},

	render () {
		const sunday = (
			<th ref="Sunday">
				<abbr title={this.props.weekDayLabels[0]}>{this.props.abbreviatedWeekDayLabels[0]}</abbr>
			</th>
		);

		return (
			<div
				className="Calendar"
			>
				<table className="datepicker__month" role="grid" aria-labelledby="month">
					<thead>
						<tr ref="weekdays">
						{this.props.isIsoWeekday ? null : sunday}
							<th ref="Monday" scope="col">
								<abbr title={this.props.weekDayLabels[1]}>{this.props.abbreviatedWeekDayLabels[1]}</abbr>
							</th>
							<th ref="Tuesday" scope="col">
								<abbr title={this.props.weekDayLabels[2]}>{this.props.abbreviatedWeekDayLabels[2]}</abbr>
							</th>
							<th ref="Wednesday" scope="col">
								<abbr title={this.props.weekDayLabels[3]}>{this.props.abbreviatedWeekDayLabels[3]}</abbr>
							</th>
							<th ref="Thursday" scope="col">
								<abbr title={this.props.weekDayLabels[4]}>{this.props.abbreviatedWeekDayLabels[4]}</abbr>
							</th>
							<th ref="Friday" scope="col">
								<abbr title={this.props.weekDayLabels[5]}>{this.props.abbreviatedWeekDayLabels[5]}</abbr>
							</th>
							<th ref="Saturday" scope="col">
								<abbr title={this.props.weekDayLabels[6]}>{this.props.abbreviatedWeekDayLabels[6]}</abbr>
							</th>
							{this.props.isIsoWeekday && sunday}
						</tr>
					</thead>
					<tbody>

						{this.renderWeeks()}

						<tr>
							<td
								colSpan="7"
								role="gridcell"
							>
								<a
									href="javascript:void(0)"	// eslint-disable-line no-script-url
									// onFocus={this.handleTodayFocus}
									onBlur={this.handleTodayBlur}
									tabIndex="0"
									onKeyDown={this.handleKeyDown}
									className="slds-show--inline-block slds-p-bottom--x-small"
									onClick={(event) => { this.handleSelectDate(event, { date: new Date() }); }}
								>
									{this.props.todayLabel}
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	},

	renderWeeks () {
		const firstDayOfWeekOffset = this.props.isIsoWeekday ? 1 : 0;

		const firstDayOfMonth = DateUtil.firstDayOfMonth(this.props.initialDateForCalendarRender);

		let firstDayOfWeek;
		if (firstDayOfMonth.getDay() > firstDayOfWeekOffset) {
			const prevWeek = DateUtil.addWeeks(firstDayOfMonth, -1);
			firstDayOfWeek = DateUtil.nearestWeekDay(prevWeek, firstDayOfWeekOffset);
		} else {
			firstDayOfWeek = firstDayOfMonth;
		}

		const weeks = [];
		let done = false;

		let monthIndex = firstDayOfWeek.getMonth();
		let count = 0;

		while (!done) {
			weeks.push(<Week
				key={firstDayOfWeek.toString()}
				firstDayOfWeek={firstDayOfWeek}
				onSelectDate={this.handleSelectDate}
				selectedDate={this.props.selectedDate}
				initialDateForCalendarRender={this.props.initialDateForCalendarRender}
				focusedDate={this.state.focusedDate}
				onKeyboardNavigateToPreviousDay={this.handlePreviousDay}
				onKeyboardNavigateToNextDay={this.handleNextDay}
				onKeyboardNavigateToPreviousWeek={this.handlePreviousWeek}
				onKeyboardNavigateToNextWeek={this.handleNextWeek}
				calendarHasFocus={this.state.hasFocus}
				onRequestClose={this.handleRequestClose}
				todayLabel={this.props.todayLabel}
			/>);

			// create new weeks
			firstDayOfWeek = DateUtil.addWeeks(firstDayOfWeek, 1);
			done = count++ > 2 && monthIndex !== firstDayOfWeek.getMonth();
			monthIndex = firstDayOfWeek.getMonth();
		}
		let extraWeeks = 0;
		while (weeks.length < 6) {
			extraWeeks = extraWeeks + 1;
			weeks.push(<tr key={`extra_${extraWeeks}`} className="week">
				<td aria-disabled="true" aria-selected="false" className="slds-disabled-text">
					<span className="slds-day ">&nbsp;</span>
				</td>
			</tr>);
		}

		return weeks;
	}
});

module.exports = DatepickerCalendar;
