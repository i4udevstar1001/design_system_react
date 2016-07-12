/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// # Picklist Component

// Implements the [Picklist design pattern](https://www.lightningdesignsystem.com/components/menus/#flavor-picklist) in React.

// ### React
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

// ### classNames
// [github.com/JedWatson/classnames](https://github.com/JedWatson/classnames)
// This project uses `classnames`, "a simple javascript utility for conditionally
// joining classNames together."
import classNames from 'classnames';

// ### shortid
// [npmjs.com/package/shortid](https://www.npmjs.com/package/shortid)
// shortid is a short, non-sequential, url-friendly, unique id generator
import shortid from 'shortid';

// ### isEqual
import isEqual from 'lodash.isequal';

// ### Children
import Popover from '../popover';
import Icon from '../icon';
import List from '../menu-list/list';
import ListItemLabel from '../menu-list/list-item-label';

// ### Traits

// #### KeyboardNavigable
import KeyboardNavigable from '../../utilities/keyboard-navigable';

import { KEYS, EventUtil } from '../../utilities';
import { MENU_PICKLIST } from '../../utilities/constants';

/**
 * The MenuPicklist component is a variant of the Lightning Design System Menu component.
 */
const MenuPicklist = React.createClass({
	// ### Display Name
	// Always use the canonical component name as the React display name.
	displayName: MENU_PICKLIST,

	mixins: [KeyboardNavigable],

	// ### Prop Types
	propTypes: {
		className: PropTypes.string,
		/**
		 * If true, renders checkmark icon on the selected Menu Item.
		 */
		checkmark: PropTypes.bool,
		disabled: PropTypes.bool,
		label: PropTypes.string,
		/**
		 * Custom element that overrides the default Menu Item component.
		 */
		listItemRenderer: PropTypes.func,
		/**
		 * If true, component renders specifically to work inside Modal.
		 */
		modal: PropTypes.bool,
		onClick: PropTypes.func,
		onSelect: PropTypes.func,
		/**
		 * Menu item data.
		 */
		options: PropTypes.array.isRequired,
		placeholder: PropTypes.string,
		required: PropTypes.bool,
		/**
		 * Current selected item.
		 */
		value: PropTypes.node
	},

	getDefaultProps () {
		return {
			constrainToScrollParent: false,
			disabled: false,
			inheritTargetWidth: true,
			modal: true,
			required: false,
			placeholder: 'Select an Option',
			checkmark: true
		};
	},

	getInitialState () {
		return {
			focusedIndex: -1,
			lastBlurredIndex: -1,
			lastBlurredTimeStamp: -1,
			selectedIndex: this.getIndexByValue(this.props.value)
		};
	},

	componentWillMount () {
		this.generatedId = shortid.generate();
	},

	componentDidUpdate (prevProps, prevState) {
		if (this.state.lastBlurredTimeStamp !== prevState.lastBlurredTimeStamp) {
			if (this.state.lastBlurredIndex === this.state.highlightedIndex) {
				this.handleClose();
			}
		}

		if (this.state.selectedIndex !== prevState.selectedIndex) {
			this.handleClose();
		} else if (this.state.isFocused && !prevState.isFocused) {
			this.setState({ isOpen: false });
		} else if (!this.state.isFocused && prevState.isFocused) {
			if (this.refs.list) {
				if (!this.isUnmounting && this.refs.list) {
					if (ReactDOM.findDOMNode(this.refs.list).contains(document.activeElement)) {
						return;
					}
					this.setState({ isOpen: false });
				}
			}
		}

		if (this.props.value !== prevProps.value ||
				!isEqual(this.props.options, prevProps.options)) {
			const newSelectedIndex = this.getIndexByValue(this.props.value);
			if (newSelectedIndex !== this.state.selectedIndex) {
				this.handleValueUpdate(newSelectedIndex);
			}
		}
	},

	componentWillUnmount () {
		this.isUnmounting = true;
	},

	getIndexByValue (value) {
		let foundIndex = -1;

		if (this.props.options && this.props.options.length) {
			this.props.options.some((element, index) => {
				if (element && element.value === value) {
					foundIndex = index;
					return true;
				}

				return false;
			});
		}

		return foundIndex;
	},

	getValueByIndex (index) {
		return this.props.options[index];
	},

	getListItemRenderer () {
		return this.props.listItemRenderer ? this.props.listItemRenderer : ListItemLabel;
	},

	handleSelect (index) {
		this.setState({ selectedIndex: index });
		this.setFocus();

		if (this.props.onSelect) {
			this.props.onSelect(this.getValueByIndex(index));
		}
	},

	handleValueUpdate (index) {
		this.setState({ selectedIndex: index });
	},

	handleClose () {
		this.setState({ isOpen: false });
	},

	handleClick () {
		if (!this.state.isOpen) {
			this.setState({ isOpen: true });
			this.setFocus();

			if (this.props.onClick) {
				this.props.onClick();
			}
		} else {
			this.handleClose();
		}
	},

	handleMouseDown (event) {
		if (event) {
			EventUtil.trapImmediate(event);
		}
	},

	handleBlur () {
		this.setState({ isFocused: false });
	},

	handleFocus () {
		this.setState({ isFocused: true });
	},

	setFocus () {
		if (!this.isUnmounting && this.button) {
			ReactDOM.findDOMNode(this.button).focus();
		}
	},

	handleKeyDown (event) {
		if (event.keyCode) {
			if (event.keyCode === KEYS.ENTER ||
					event.keyCode === KEYS.SPACE ||
					event.keyCode === KEYS.DOWN ||
					event.keyCode === KEYS.UP) {
				EventUtil.trap(event);
			}

			this.handleKeyboardNavigate({
				isOpen: this.state.isOpen || false,
				keyCode: event.keyCode,
				onSelect: this.handleSelect,
				toggleOpen: this.toggleOpen
			});
		}
	},

	handleListBlur () {
		this.setState({ isOpen: false });
	},

	handleListItemBlur (index) {
		this.setState({
			lastBlurredIndex: index,
			lastBlurredTimeStamp: Date.now()
		});
	},

	handleCancel () {
		this.setFocus();
	},

	renderPopoverContent () {
		return (
			<List
				checkmark={this.props.checkmark}
				getListItemId={this.getListItemId}
				itemRefs={this.saveRefToListItem}
				itemRenderer={this.getListItemRenderer()}
				onListBlur={this.handleListBlur}
				onListItemBlur={this.handleListItemBlur}
				onCancel={this.handleCancel}
				onSelect={this.handleSelect}
				options={this.props.options}
				ref={this.saveRefToList}
				selectedIndex={this.state.selectedIndex}
				triggerId={this.getId()}
			/>
		);
	},

	renderSimplePopover () {
		return (
			!this.props.disabled && this.state.isOpen
			? <div
				className="slds-dropdown slds-dropdown--menu slds-dropdown--left"
				style={{
					maxHeight: '20em',
					overflowX: 'hidden',
					minWidth: '100%'
				}}
			>
				{this.renderPopoverContent()}
			</div>
			: null
		);
	},

	renderModalPopover () {
		return (
			!this.props.disabled && this.state.isOpen
			? <Popover
				className="slds-dropdown slds-dropdown--menu slds-dropdown--left"
				closeOnTabKey
				constrainToScrollParent={this.props.constrainToScrollParent}
				dropClass="slds-picklist"
				flippable
				onClose={this.handleCancel}
				targetElement={this.button}
				inheritTargetWidth={this.props.inheritTargetWidth}
			>
				{this.renderPopoverContent()}
			</Popover>
			: null
		);
	},

	renderPlaceholder () {
		const option = this.props.options[this.state.selectedIndex];
		return (option && option.label) ? option.label : this.props.placeholder;
	},

	render () {
		const required = this.props.required ? <span style={{ color: 'red' }}>* </span> : null;
		const inputLabel = this.props.label
			? <label
				className="slds-form-element__label"
				htmlFor={this.getId()}
				style={{ width: '100%' }}
			>
				{required}{this.props.label}
			</label>
			: null;

		return (
			<div className={classNames('slds-picklist', this.props.className)} aria-expanded={this.state.isOpen}>
				{inputLabel}
				<button
					aria-haspopup="true"
					className="slds-button slds-button--neutral slds-picklist__label"
					id={this.getId()}
					onBlur={this.handleBlur}
					onClick={this.handleClick}
					onFocus={this.handleFocus}
					onKeyDown={this.handleKeyDown}
					onMouseDown={this.handleMouseDown}
					disabled={this.props.disabled}
					ref={(component) => { this.button = component; }}
					tabIndex={this.state.isOpen ? -1 : 0}
				>
					<span className="slds-truncate">{this.renderPlaceholder()}</span>
					<Icon name="down" category="utility" />
				</button>
				{this.props.modal ? this.getModalPopover() : this.renderSimplePopover()}
			</div>
		);
	}
});

module.exports = MenuPicklist;
module.exports.ListItemLabel = ListItemLabel;
