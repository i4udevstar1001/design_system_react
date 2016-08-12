/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// # Tree Branch Component

// Implements the [Tree design pattern](https://www.lightningdesignsystem.com/components/tree/) in React.

// ## Dependencies

// ### React
import React, { PropTypes } from 'react';

import Button from '../button';

// Child components
import Item from './item';

// ### reject
import reject from 'lodash.reject';

// ### omit
import omit from 'lodash.omit';

// ### find
import find from 'lodash.find';

// ### isArray
import isArray from 'lodash.isarray';

// ### isFunction
import isFunction from 'lodash.isfunction';

// ### Event Helpers
import { EventUtil } from '../../utilities';

// ### classNames
import classNames from 'classnames';

// ### shortid
import shortid from 'shortid';

// ## Constants
import { TREE_BRANCH } from '../../utilities/constants';


// Allow for predicatable DOM queries with `querySelectorAll(cssClasses.base)`
const cssClasses = {
	base: 'slds-item',
	tree: 'slds-tree'
};

const idSuffixes = {
	label: '__label'
};


/**
 * A Tree Item is a non-branching node in a hierarchical list.
 */
const Branch = (props) => {
	const isExpanded = function () {
		const node = omit(props.node, props.nodeKeys.nodes);
		return !!find(props.expanded, node);
	};

	const isLoading = function () {
		const node = omit(props.node, props.nodeKeys.nodes);
		return !!find(props.loading, node);
	};

	const isSelected = function () {
		const node = omit(props.node, props.nodeKeys.nodes);
		return !!find(props.selection, node);
	};

	const handleExpandClick = function (e) {
		EventUtil.trap(e);

		if (isFunction(props.onExpandClick)) {
			let expanded;
			const node = omit(props.node, props.nodeKeys.nodes);
			const isExpandedStored = isExpanded();

			if (!isExpandedStored) {
				expanded = [...props.expanded, node];
			} else {
				expanded = reject(props.expanded, node);
			}

			props.onExpandClick(expanded, node, treeIndex, e);
		}
	};

	const handleClick = function (e) {
		EventUtil.trap(e);
		if (isFunction(props.onClick)) {
			let selection;
			const node = omit(props.node, props.nodeKeys.nodes);
			const isSelectedStored = isSelected();

			if (!isSelectedStored) {
				selection = [...props.selection, node];
			} else {
				selection = reject(props.selection, node);
			}

			props.onClick(selection, node, e);
		}
	};

	const renderInitialNode = function (children) {
		const selectionID = [];
		props.selection.forEach((node) => {
			selectionID.push(node.id);
		});
		// id intentionally not rendered here, and is present on container
		return (
			<ul
				className={classNames('slds-tree', props.initalClassName)}
				role="tree"
				aria-labelledby={`${props.htmlId}__heading`}
				aria-activedescendant={selectionID.join(' ')}
			>
				{children}
			</ul>
		);
	};

	// Most of these props come from the nodes array, not from the Tree props
	const renderBranch = function (children) {
		const isExpandedStored = isExpanded();
		const isSelectedStored = isSelected();
		const isLoadingStored = isLoading();
		return (
			<li
				id={props.htmlId}
				role="treeitem"
				aria-level={props.level}
				aria-expanded={isExpandedStored ? 'true' : 'false'}
			>
				<div className={classNames('slds-tree__item', { 'slds-is-selected': isSelectedStored })} onClick={handleClick}>
					<Button
						assistiveText="Toggle"
						iconName="chevronright"
						iconSize="small"
						variant="icon"
						className="slds-m-right--small"
						aria-controls={props.htmlId}
						onClick={handleExpandClick}
					/>
					<a
						id={`${props.htmlId}__label`}
						href="#"
						tabIndex={-1}
						role="presentation"
						className="slds-truncate"
					>{props.label}{isLoadingStored ? ' [Loading]' : null}</a>
				</div>
				<ul
					className={classNames({ 'slds-is-expanded': isExpandedStored, 'slds-is-collapsed': !isExpandedStored })}
					role="group"
					aria-labelledby={`${props.htmlId}__label`}
				>{children}
				</ul>
			</li>
		);
	};

	let treeIndex = '';
	const children = [];
	const {
		level,
		onExpandClick,
		loading,
		selection
	} = props;

	if (isArray(props.node[props.nodeKeys.nodes])) {
		props.node[props.nodeKeys.nodes].forEach((node, index) => {
			const htmlId = `${props.htmlId}-${node.htmlId || index}`;
			treeIndex = `${index}`;
			if (props.treeIndex) {
				treeIndex = `${props.treeIndex}-${treeIndex}`;
			}

			if (node.type === 'folder') {
				children.push(
					<Branch
						expanded={props.expanded}
						htmlId={htmlId}
						key={shortid.generate()}
						label={node[props.nodeKeys.label]}
						level={level + 1}
						loading={loading}
						node={node}
						nodeKeys={props.nodeKeys}
						nodes={node[props.nodeKeys.nodes]}
						onClick={props.onClick}
						onExpandClick={onExpandClick}
						selection={selection}
						treeIndex={treeIndex}
					/>
				);
			} else {
				children.push(
					<Item
						{...node}
						label={node[props.nodeKeys.label]}
						htmlId={htmlId}
						key={shortid.generate()}
						level={level + 1}
						node={node}
						nodeKeys={props.nodeKeys}
						nodes={props.node[props.nodeKeys.nodes]}
						onClick={props.onClick}
						selection={selection}
						treeIndex={treeIndex}
					/>
				);
			}
		});
	}

	const branch = props.level === 0 ? renderInitialNode(children) : renderBranch(children);

	return branch;
};

// ### Display Name
// Always use the canonical component name as the React display name.
Branch.displayName = TREE_BRANCH;

// ### Prop Types
Branch.propTypes = {
	/**
	 * List of expanded branches. A list of each branches `id` object key,
	 * */
	expanded: PropTypes.array,
	/**
	 * HTML `id` of primary element that has `.slds-tree` on it. This component has a wrapping container element outside of `.slds-tree`.
	 */
	htmlId: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string]).isRequired,
	/**
	 * All tree nodes must have a unique HTML `id` for users of assistive technology. If no `id` key is present in the  is provided, one will be generated.
	 */
	index: PropTypes.number,
	/**
	 * Determines if nodes in the top-level of the tree.
	 */
	initial: PropTypes.bool,
	/*
	 * Class names to be added to the top-level `ul` element.
	 */
	initalClassName: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string]),
	/**
	 * The text of the tree item.
	 */
	label: PropTypes.string.isRequired,
	/**
	 * The number of nestings. Determines the ARIA level and style alignment.
	 */
	level: PropTypes.number.isRequired,
	/**
	 * The current node that is being rendered.
	 */
	node: PropTypes.object.isRequired,
	nodeKeys: React.PropTypes.shape({
		label: React.PropTypes.string,
		nodes: React.PropTypes.string
	}),
	/**
	 * Function that will run whenever an item or branch is clicked.
	 */
	onClick: PropTypes.func,
	/**
	 * This function triggers when the expand or collapse icon is clicked.
	 */
	onExpandClick: PropTypes.func.isRequired,
	/**
	 * An array of the currently selected items
	 */
	selection: PropTypes.array
},

Branch.getDefaultProps = {
	expanded: [],
	level: 0,
	loading: [],
	selection: []
};

module.exports = Branch;
module.exports.cssClasses = cssClasses;
module.exports.idSuffixes = idSuffixes;

