import GlobalHeader from '~/components/global-header';
import GlobalHeaderButton from '~/components/global-header/button';
import GlobalHeaderDropdown from '~/components/global-header/dropdown';
import GlobalHeaderProfile from '~/components/global-header/profile';
import GlobalHeaderSearch from '~/components/global-header/search';

<GlobalHeader
	logoSrc="/images/logo.svg"
	onSkipToContent={function () { console.log('>>> Skip to Content Clicked'); }}
	onSkipToNav={function () { console.log('>>> Skip to Nav Clicked'); }}
>
	<GlobalHeaderSearch
		onSelect={function () { console.log('>>> onSelect'); }}
		options={[
			{ label: 'Email' },
			{ label: 'Mobile' }
		]}
	/>
	<GlobalHeaderButton
		className="slds-m-right--small"
		iconVariant={null}
		label="Feedback"
		onClick={function () { console.log('>>> onClick'); }}
		variant="neutral"
	/>
	<GlobalHeaderDropdown
		assistiveText="Global Actions"
		iconCategory="utility"
		iconName="add"
		onSelect={function () { console.log('>>> onSelect'); }}
		options={[
			{ label: 'New Note' },
			{ label: 'Log a Call' }
		]}
	/>
	<GlobalHeaderButton
		assistiveText="Help and Training"
		iconName="question"
		onClick={function () { console.log('>>> onClick'); }}
	/>
	<GlobalHeaderButton
		assistiveText="Setup"
		iconName="settings"
		onClick={function () { console.log('>>> onClick'); }}
	/>
	<GlobalHeaderProfile
		avatar="/images/avatar2.jpg"
		onClick={function () { console.log('>>> onClick'); }}
		onSelect={function () { console.log('>>> onSelect'); }}
		options={[
			{ label: 'Profile Menu' }
		]}
	/>
</GlobalHeader>
