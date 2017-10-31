import React from 'react';
import Alert from '~/components/alert'; // `~` is replaced with design-system-react at runtime
import AlertContainer from '~/components/alert/container'; // `~` is replaced with design-system-react at runtime
import Icon from '~/components/icon'; // `~` is replaced with design-system-react at runtime
import Button from '~/components/button'; // `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings';

class Example extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isOpen: false
		};
	}

	render () {
		return (
			<IconSettings iconPath="/assets/icons">
				<AlertContainer>
					<Alert
						dismissible
						icon={<Icon category="utility" name="user" />}
						label={<span>Logged in as John Smith (johnsmith@acme.com). <a href="javascript:void(0);">Log out</a></span>}
						onRequestClose={() => { this.setState({ isOpen: false }); }}
					/>
				</AlertContainer>
			</IconSettings>
		);
	}
}

Example.displayName = 'AlertExample';

export default Example;	// export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
