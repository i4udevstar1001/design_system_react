/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, { Component } from 'react';
import Menu from './Menu';
import {InputIcon, ButtonIcon} from "./../SLDSIcons";
import {Icon} from "../SLDSIcons";
import _ from "lodash";
import {KEYS,EventUtil} from '../utils';

const defaultFilter = (term, item) => {
  if(!term) return true;
  return item.match(new RegExp(_.escapeRegExp(term), 'ig'));
};

class SLDSLookup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      isOpen:false,
      selectedItem: null,
      activeIndex:0,
    };
  }

  //=================================================
  // Set Active Descendant (currently focused/hovered item in list)
  increaseIndex(){
    this.setState({
      activeIndex: this.state.activeIndex <= this.props.items.length ? this.state.activeIndex + 1 : 0
    })
  }

  decreaseIndex(){
    this.setState({
      activeIndex: this.state.activeIndex >= 0 ? this.state.activeIndex - 1 : this.props.items.length
    })
  }

  //=================================================
  // Basic Event Listeners on Input
  handleClose() {
    this.setState({isOpen:false})
  }

  handleClick() {
    this.setState({isOpen:true})
  }

  handleBlur() {
    this.setState({isOpen:false})
  }

  handleFocus() {
    this.setState({ isOpen:true });
  }

  handleChange(event) {
    const target = event.target || event.currentTarget;
    this.setState({ searchTerm: target.value });
  }

  handleKeyDown(event) {
    if(event.keyCode){
      //If user hits esc key, close menu
      event.keyCode === KEYS.ESCAPE ? this.handleClose() : this.handleClick();

      //If user hits tab key, move aria activedescendant to first menu item
      if(event.keyCode === KEYS.TAB){
        EventUtil.trapImmediate(event);
      }
      //If user hits down key, advance aria activedescendant to next item
      else if(event.keyCode === KEYS.DOWN){
        EventUtil.trapImmediate(event);
        this.increaseIndex();
      }
      //If user hits up key, advance aria activedescendant to previous item
      else if(event.keyCode === KEYS.UP){
        EventUtil.trapImmediate(event);
        this.decreaseIndex();
      }

      else if(event.keyCode === KEYS.ENTER){
        EventUtil.trapImmediate(event);
      }
    }
  }

  //=================================================
  // Rendering Things
  renderMenu(){
    if(this.state.isOpen){
      return <Menu
        searchTerm={this.state.searchTerm}
        filterWith={this.props.filterWith}
        label={this.props.label}
        items={this.props.items}
        activeIndex={this.state.activeIndex}/>;
    }else{
      return null;
    }
  }

  render(){
    return (
      <div className="slds-lookup ignore-react-onclickoutside" data-select="multi" data-scope="single" data-typeahead="true">
        <section className="slds-form-element">
          <label className="slds-form-element__label" forHTML="lookup">{this.props.label}</label>

          <div className="slds-lookup__control slds-input-has-icon slds-input-has-icon--right">
            { this.state.currentSelectedItem ? this.state.currentSelectedItem : null }
            <InputIcon name="search"/>
            <input
              id="lookup"
              className={'slds-input'}
              type="text"
              aria-label="lookup"
              aria-haspopup="true"
              aria-autocomplete="list"
              aria-activedescendant={"item-" + this.state.activeIndex}
              aria-expanded={this.state.isOpen}
              role="combobox"
              onChange={this.handleChange.bind(this)}
              onFocus={this.handleFocus.bind(this)}
              onClick={this.handleClick.bind(this)}
              onKeyDown={this.handleKeyDown.bind(this)}
              value={this.state.searchTerm} />
          </div>

          {this.renderMenu()}
        </section>
      </div>
    );
  }
}

SLDSLookup.defaultProps = {
  filterWith: defaultFilter,
  onItemSelect: function(item){
    //console.log('onItemSelect should be defined');
  }
};
module.exports = SLDSLookup;

