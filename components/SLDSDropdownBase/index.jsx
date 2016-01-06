/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


import React from "react";
import SLDSPopover from "../SLDSPopover";
import SLDSButton from "../SLDSButton";

import chain from "../utils/create-chained-function";
import {List, ListItem, ListItemLabel, KEYS, EventUtil} from "../utils";
import omit from "lodash.omit";

const displayName = "SLDSDropdown";
const propTypes = {
  className: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  horizontalAlign: React.PropTypes.oneOf(["left", "right"]),
  hoverCloseDelay: React.PropTypes.number,
  initialFocus: React.PropTypes.bool,
  label: React.PropTypes.string,
  listClassName: React.PropTypes.string,
  listItemRenderer: React.PropTypes.func,
  /**
   * if modal, dropdown renders specifically to work inside a modal
   */
  modal: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onSelect: React.PropTypes.func.isRequired,
  onUpdateHighlighted: React.PropTypes.func,
  openOn: React.PropTypes.oneOf(["hover", "click"]),
  options: React.PropTypes.array,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string,
  /**
   * determines variant of button that triggers modal
   */
  variant: React.PropTypes.string,
};
const defaultProps = {
  className: "",
  disabled: false,
  horizontalAlign: "left",
  hoverCloseDelay: 300,
  initialFocus: false,
  label: "Dropdown",
  listClassName: "",
  modal: true,
  openOn: "hover",
  options: [],
  placeholder: "Select an Option",
  value: null,
  variant: "neutral",
};

/**
 * The SLDSDropdown component is a variant of the Menu component in SLDS. For more details, please reference <a href="http://www.lightningdesignsystem.com/components/menus#dropdown">Lightening Design System - Menus</a>.
 */
class SLDSDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: 0,
      isClosing: false,
      isFocused: false,
      isHover: false,
      isMounted: false,
      isOpen: false,
      lastBlurredIndex: -1,
      lastBlurredTimeStamp: -1,
      selectedIndex: this.getIndexByValue(this.props.value),
    };
  }

  componentDidMount(){
    this.setState({ isMounted: true });
    if(this.props.initialFocus){
      this.setFocus();
    }
    if(this.props.openOn === "hover"){
      //TODO:Add functionality here
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.lastBlurredTimeStamp !== prevState.lastBlurredTimeStamp){
      if(this.state.lastBlurredIndex === this.state.highlightedIndex){
        this.handleClose();
      }
    }

    if(this.state.isOpen && !prevState.isOpen){
      this.state.isClosing = false;
    }

    if(this.state.selectedIndex !== prevState.selectedIndex){
      this.handleClose();
    } else if(this.state.isFocused && !prevState.isFocused){
      this.setState({isOpen: false});
    } else if(!this.state.isFocused && prevState.isFocused){
      if (this.refs.list) {
        if (this.state.isMounted && this.refs.list) {
          if (React.findDOMNode(this.refs.list).contains(document.activeElement)) {
            return;
          }
          this.setState({ isOpen: false });
        }
      }
    } else if(this.state.isClosing && !prevState.isClosing){
      setTimeout(()=>{
        if(this.state.isClosing){
          this.setState({isOpen: false});
        }
      },this.props.hoverCloseDelay);
    }

    if(this.props.value !== prevProps.value){
      this.handleSelect(this.getIndexByValue(this.props.value));
    }
  }

  getIndexByValue(value){
    let foundIndex = -1;
    if(this.props.options && this.props.options.length){
      this.props.options.some((element, index, array)=>{
        if(element && element.value === value){
          foundIndex = index;
          return true;
        }
        return false;
      });
    }
    return foundIndex;
  }

  getValueByIndex(index){
    const option = this.props.options[index];
    if(option){
      return this.props.options[index];
    }
  }

  getListItemRenderer() {
    return this.props.listItemRenderer?this.props.listItemRenderer:ListItemLabel;
  }

  handleSelect(index){
    this.setState({selectedIndex: index})
    this.setFocus();
    if(this.props.onSelect){
      this.props.onSelect(this.getValueByIndex(index));
    }
  }

  handleClose(){
    this.setState({
      isOpen: false,
      isHover: false
    });
  }

  handleMouseEnter(){
    if(this.props.openOn === "hover"){
      this.state.isClosing = false;
      if(!this.state.isOpen){
        this.setState({
          isOpen: true,
          isHover: true
        });
      }
    }
  }

  handleMouseLeave(){
    if(this.props.openOn === "hover"){
      this.setState({isClosing: true});
    }
  }

  handleClick(event){
    EventUtil.trap(event);
    if(!this.state.isOpen){
      this.setState({isOpen: true});
      if(this.props.onClick){
        this.props.onClick();
      }
    }else{
      this.handleClose();
    }
  }

  handleMouseDown(event){
    EventUtil.trapImmediate(event);
  }

  handleBlur(e){
    this.setState({isFocused: false});
  }

  handleFocus(){
    this.setState({
      isFocused: true,
      isHover: false
    });
  }

  setFocus(){
    if(this.state.isMounted){
      React.findDOMNode(this.getButtonNode()).focus();
    }
  }

  getButtonNode(){
    return React.findDOMNode(this.refs.button);
  }

  handleKeyDown(event){
    if(event.keyCode){
      if(event.keyCode === KEYS.ENTER ||
          event.keyCode === KEYS.SPACE ||
          event.keyCode === KEYS.DOWN ||
          event.keyCode === KEYS.UP){
        EventUtil.trapEvent(event);

        this.setState({
          isOpen: true,
          highlightedIndex: 0
        });

      }
    }
  }

  handleUpdateHighlighted(nextIndex){
    this.setState({highlightedIndex: nextIndex});
  }

  handleListBlur(){
    this.setState({isOpen: false});
  }

  handleListItemBlur(index, relatedTarget){
    this.setState({
      lastBlurredIndex: index,
      lastBlurredTimeStamp: Date.now()
    });
  }

  handleCancel(){
    if(!this.state.isHover){
      this.setFocus();
    }
  }

  getPopoverContent(){
    return <List
            className={this.props.listClassName}
            highlightedIndex={this.state.highlightedIndex}
            isHover={this.state.isHover}
            itemRenderer={this.getListItemRenderer()}
            onListBlur={this.handleListBlur.bind(this)}
            onListItemBlur={this.handleListItemBlur.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            onMouseEnter={(this.props.openOn === "hover")?this.handleMouseEnter.bind(this):null}
            onMouseLeave={(this.props.openOn === "hover")?this.handleMouseLeave.bind(this):null}
            onSelect={this.handleSelect.bind(this)}
            onUpdateHighlighted={this.handleUpdateHighlighted.bind(this)}
            options={this.props.options}
            ref="list"
            selectedIndex={this.state.selectedIndex}
            />;
  }

  getSimplePopover(){
    return(
      !this.props.disabled && this.state.isOpen?
        <div
          className="slds-dropdown slds-dropdown--menu slds-dropdown--left"
          style={{maxHeight: "20em"}}>
          {this.getPopoverContent()}
        </div>:null
    );
  }

  getModalPopover(){
    const className = "slds-dropdown slds-dropdown--menu slds-dropdown--"+this.props.horizontalAlign;
    return(
      !this.props.disabled && this.state.isOpen?
        <SLDSPopover
          className={className}
          closeOnTabKey={true}
          horizontalAlign={this.props.horizontalAlign}
          onClose={this.handleCancel.bind(this)}
          targetElement={this.refs.button}
          >
          {this.getPopoverContent()}
        </SLDSPopover>:null
    );
  }

  getPlaceholder(){
    const option = this.props.options[this.state.selectedIndex];
    return (option && option.label)?option.label:this.props.placeholder;
  }

  render(){
    return <SLDSButton
        aria-haspopup="true"
        className={this.props.className}
        iconName={this.props.iconName}
        iconVariant={this.props.iconVariant}
        label={this.props.label}
        onBlur={ chain(this.props.onBlur, this.handleBlur.bind(this)) }
        onClick={ chain(this.props.onClick, this.handleClick.bind(this)) }
        onFocus={ chain(this.props.onFocus, this.handleFocus.bind(this)) }
        onKeyDown={ chain(this.props.onKeyDown, this.handleKeyDown.bind(this)) }
        onMouseDown={ chain(this.props.onMouseDown, this.handleMouseDown.bind(this)) }
        onMouseEnter={ chain(this.props.onMouseEnter, (this.props.openOn === "hover")?this.handleMouseEnter.bind(this):null) }
        onMouseLeave={ chain(this.props.onMouseLeave, (this.props.openOn === "hover")?this.handleMouseLeave.bind(this):null ) }
        ref="button"
        style={this.props.style}
        tabIndex={this.state.isOpen ? "-1" : "0"}
        variant={this.props.variant}
        >
        {this.props.modal?this.getModalPopover():this.getSimplePopover()}
      </SLDSButton>;
  }

}

SLDSDropdown.displayName = displayName;
SLDSDropdown.propTypes = propTypes;
SLDSDropdown.defaultProps = defaultProps;

module.exports = SLDSDropdown;
module.exports.ListItem = ListItem;
module.exports.ListItemLabel = ListItemLabel;

