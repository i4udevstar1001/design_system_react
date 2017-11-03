import React from 'react';
import Toast from '~/components/toast'; // `~` is replaced with design-system-react at runtime
import ToastContainer from '~/components/alert/container'; // `~` is replaced with design-system-react at runtime
import Icon from '~/components/icon'; // `~` is replaced with design-system-react at runtime
import IconSettings from '~/components/icon-settings';

class Example extends React.Component {
	render () {
		return (
			<IconSettings iconPath="/assets/icons">
				<ToastContainer>
					<Toast
						labels={{
							heading: ['Account ', <a key="acme-100" href="javascript:void(0);">ACME - 100</a>, ' widgets was created.']
						}}
						variant="success"
					/>
				</ToastContainer>
			</IconSettings>
		);
	}
}

Example.displayName = 'AlertExample';

export default Example;	// export is replaced with `ReactDOM.render(<Example />, mountNode);` at runtime
