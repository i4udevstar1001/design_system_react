/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */
/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { normalize, schema } from 'normalizr';

import IconSettings from '../../icon-settings';
import { TREE } from '../../../utilities/constants';
import sampleNodesDynamicHashMap from './dynamic-hashmap';

import Tree from '../../tree';
import Search from '../../forms/input/search';

import DefaultExample from '../__examples__/default';

// View the generated hash map
// console.log(JSON.stringify(sampleNodesDynamicHashMap.base));
// console.log(JSON.stringify(sampleNodesDynamicHashMap.initialExpandedSelected));
// console.log(JSON.stringify(sampleNodesDynamicHashMap.large));

storiesOf(TREE, module)
	.addDecorator((getStory) => (
		<div className="slds-p-around--medium">{getStory()}</div>
	))
	.add('Base', () => <DefaultExample nodes={sampleNodesDynamicHashMap.base} action={action} />)
	.add('Base with stencil', () => (
		<DefaultExample action={action} loadingStencil />
	))
	.add('Initial Expanded/Selected', () => (
		<DefaultExample
			action={action}
			nodes={sampleNodesDynamicHashMap.initialExpandedSelected}
		/>
	))
	.add('No Branch Select', () => (
		<DefaultExample action={action} multipleSelection noBranchSelection />
	))
	.add('Multiple Selection', () => (
		<DefaultExample action={action} multipleSelection />
	))
	.add('Assistive Heading', () => (
		<DefaultExample
			action={action}
			noHeading
			assistiveText="Miscellaneous Foods"
		/>
	))
	.add('Overflow Hidden', () => (
		<DefaultExample
			action={action}
			listStyle={{
				height: '300px',
				overflowY: 'auto',
			}}
			nodes={sampleNodesDynamicHashMap.large}
		/>
	))
	.add('Large dataset (300+)', () => (
		<DefaultExample action={action} nodes={sampleNodesDynamicHashMap.large} />
	))
	.add('Highlighted Search', () => (
		<DefaultExample action={action} searchable />
	));
