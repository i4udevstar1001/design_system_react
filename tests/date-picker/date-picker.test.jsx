/* Adds all of the Mocha (eg `it` and `should`) and sinon testing global
 * variables to the global namespace for eslint purposes.
 */
/* eslint-env mocha */
/* global sinon */

// Additional modifiers to [eslint-config-slds](https://github.com/salesforce-ux/eslint-config-slds) for convenience
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable react/display-name */

// Import your external dependencies
import React, { PropTypes } from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';

/* Enzyme Helpers that can mount and unmount React component instances to
 * the DOM and set `this.wrapper` and `this.dom` within Mocha's `this`
 * context [full source here](tests/enzyme-helpers.js). `this` can
 * only be referenced if inside `function () {}`.
 */
import { createMountNode, destroyMountNode } from '../enzyme-helpers';

// Import your internal dependencies (for example):
import Datepicker from '../../components/date-picker';
import Input from '../../components/forms/input';

/* Set Chai to use chaiEnzyme for enzyme compatible assertions:
 * https://github.com/producthunt/chai-enzyme
 */
chai.use(chaiEnzyme());

const defaultProps = {
	id: 'sample-datepicker',
	value: new Date(2007, 0, 6)
};

/* A re-usable demo component fixture outside of `describe` sections
 * can accept props within each test and be unmounted after each tests.
 * This wrapping component will be similar to your wrapping component
 * you will create in the React Storybook for manual testing.
 */
const DemoComponent = React.createClass({
	displayName: 'DatepickerDemoComponent',
	propTypes: {
		isOpen: PropTypes.bool
	},

	getDefaultProps () {
		return defaultProps;
	},

	getInitialState () {
		return {};
	},

	// event handlers

	render () {
		return (
			<Datepicker {...this.props} />
		);
	}
});

/* All tests for component being tested should be wrapped in a root `describe`,
 * which should be named after the component being tested.
 * When read aloud, the cumulative `describe` and `it` names should form a coherent
 * sentence, eg "Date Picker default structure and css is present with expected
 * attributes set". If you are having trouble constructing a cumulative short
 * sentence, this may be an indicator that your test is poorly structured.
 * String provided as first parameter names the `describe` section. Limit to nouns
 * as much as possible/appropriate.`
 */
describe('SLDSDatepicker', function () {
	let mountNode;
	let portalWrapper;
	let wrapper;

	describe('Assistive technology', () => {
		/* Detect if presence of accessibility features such as ARIA
		 * roles and screen reader text is present in the DOM.
		 */
		beforeEach(() => {
			mountNode = createMountNode({ context: this });
		});

		afterEach(() => {
			destroyMountNode({ wrapper, mountNode });
		});

		it('has aria-haspopup, correct aria-expanded on input trigger. also tests portalMount.', function (done) {
			wrapper = mount(<DemoComponent
				isOpen
				portalMount={(reactElement, domContainerNode) => {
					portalWrapper = mount(reactElement, { attachTo: domContainerNode });
				}}
				onOpen={() => {
					const inputTrigger = wrapper.find('.slds-input__icon');
					expect(inputTrigger.node.getAttribute('aria-haspopup')).to.equal('true');

					const ariaExpanded = inputTrigger.find('button').node.getAttribute('aria-expanded');
					expect(ariaExpanded).to.equal('true');
					done();
				}}
			/>, { attachTo: mountNode });
		});
	});

	// PROPS AND CHILDREN

	describe('Optional props', () => {
		const customPlaceholder = 'With custom Input';
		const optionalProps = {
			children: (<Input placeholder={customPlaceholder} value="" />)
		};

		beforeEach(() => {
			mountNode = createMountNode({ context: this });
		});

		afterEach(() => {
			destroyMountNode({ wrapper, mountNode });
		});

		it('has custom input with custom placeholder', function () {
			wrapper = mount(<DemoComponent
				{...optionalProps}
			/>, { attachTo: mountNode });

			expect(wrapper.find('input').node.getAttribute('placeholder')).to.equal(customPlaceholder);
		});
	});

	// EVENTS

	describe('onClose, onRequestClose, onOpen callbacks are set', function () {
		beforeEach(() => {
			mountNode = createMountNode({ context: this });
		});

		afterEach(() => {
			destroyMountNode({ wrapper, mountNode });
		});

		it('onOpen is executed when trigger is clicked, onClose is executed when date is selected', function (done) {
			wrapper = mount(<DemoComponent
				portalMount={(reactElement, domContainerNode) => {
					portalWrapper = mount(reactElement, { attachTo: domContainerNode });
				}}
				onClose={() => {
					setTimeout(() => {
						const month = portalWrapper.find('.datepicker__month');
						expect(month.node).to.not.exist;
						done();
					}, 0);
				}}
				onRequestClose={() => {
					const month = portalWrapper.find('.datepicker__month');
					expect(month.node).to.exist;
				}}
				onOpen={() => {
					const firstDayOfMonth = portalWrapper.find('.datepicker__month [aria-disabled=false]').first();
					expect(firstDayOfMonth).to.exist;
					firstDayOfMonth.simulate('click', {});
				}}
			/>, { attachTo: mountNode });

			const trigger = wrapper.find('.slds-input__icon');
			trigger.simulate('click', {});
		});

		it('onChange is triggered when date is selected', function (done) {
			wrapper = mount(<DemoComponent
				portalMount={(reactElement, domContainerNode) => {
					portalWrapper = mount(reactElement, { attachTo: domContainerNode });
				}}
				onChange={(event, data) => {
					setTimeout(() => {
						const input = wrapper.find('input');
						expect(input.node.value).to.equal('1/1/2007');

						// test callback parameters
						expect(String(data.date), 'utf-8').to.equal(String(new Date('1/1/2007'), 'utf-8'));
						expect(data.formattedDate).to.equal('1/1/2007');
						
						done();
					}, 0);
				}}
				onOpen={() => {
					const firstDayOfMonth = portalWrapper.find('.datepicker__month [aria-disabled=false]').first();
					expect(firstDayOfMonth).to.exist;
					firstDayOfMonth.simulate('click', {});
				}}
			/>, { attachTo: mountNode });

			const trigger = wrapper.find('.slds-input__icon');
			trigger.simulate('click', {});
		});
	});

	// describe('Mouse and keyboard interactions', () => {
	// 	/* Test event callback functions using Simulate. For more information, view
	// 	 * https://github.com/airbnb/enzyme/blob/master/docs/api/ReactWrapper/simulate.md
	// 	 */
	// 	describe('onClick', function () {
	// 		const triggerClicked = sinon.spy();

	// 		beforeEach(() => {
	// 			mountNode = createMountNode({ context: this });
	// 		});

	// 		afterEach(() => {
	// 			destroyMountNode({ wrapper, mountNode });
	// 		});

	// 		it('calls onClick handler on trigger, click on popover close closes', function (done) {
	// 			wrapper = mount(<DemoComponent
	// 				onClick={triggerClicked}
	// 				portalMount={(reactElement, domContainerNode) => {
	// 					portalWrapper = mount(reactElement, { attachTo: domContainerNode });
	// 				}}
	// 				onClose={() => {
	// 					setTimeout(() => {
	// 						const popover = portalWrapper.find(`#${defaultIds.popover}`);
	// 						expect(popover.node).to.not.exist;
	// 						done();
	// 					}, 0);
	// 				}}
	// 				onOpen={() => {
	// 					const popover = portalWrapper.find(`#${defaultIds.popover}`);

	// 					expect(popover).to.exist;
	// 					expect(triggerClicked.callCount).to.equal(1);

	// 					popover.find('.slds-popover__close').simulate('click', {});
	// 				}}
	// 			/>, { attachTo: mountNode });

	// 			const trigger = wrapper.find(`#${defaultIds.trigger}`);
	// 			trigger.simulate('click', {});
	// 		});

	// 		it('opens on click, closes on ESC', function (done) {
	// 			wrapper = mount(<DemoComponent
	// 				portalMount={(reactElement, domContainerNode) => {
	// 					portalWrapper = mount(reactElement, { attachTo: domContainerNode });
	// 				}}
	// 				onClose={() => {
	// 					setTimeout(() => {
	// 						const popover = portalWrapper.find(`#${defaultIds.popover}`);
	// 						expect(popover.node).to.not.exist;
	// 						done();
	// 					}, 0);
	// 				}}
	// 				onOpen={() => {
	// 					const popover = portalWrapper.find(`#${defaultIds.popover}`);
	// 					popover.simulate('keyDown', { key: 'Esc', keyCode: 27, which: 27 });
	// 				}}
	// 			/>, { attachTo: mountNode });

	// 			const trigger = wrapper.find(`#${defaultIds.trigger}`);
	// 			trigger.simulate('click', {});
	// 		});
	// 	});
	// });

	describe('Disabled', function () {
		const triggerClicked = sinon.spy();
		const dialogOpened = sinon.spy();

		beforeEach(() => {
			mountNode = createMountNode({ context: this });
		});

		afterEach(() => {
			destroyMountNode({ wrapper, mountNode });
		});

		it('onOpen is not called when disabled', function (done) {
			wrapper = mount(<DemoComponent
				disabled
				onClick={triggerClicked}
				onOpen={dialogOpened}
			/>, { attachTo: mountNode });

			const trigger = wrapper.find('#sample-datepicker');
			trigger.simulate('click', {});

			setTimeout(() => {
				expect(dialogOpened.callCount).to.equal(0);
				done();
			}, 200);
		});
	});
});
