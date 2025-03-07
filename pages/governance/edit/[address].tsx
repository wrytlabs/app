'use client';

import CommingSoon from '@components/CommingSoon';
import AppPage from '@components/AppPage';
import AppTitle from '@components/AppTitle';
import { Address, isAddress, zeroAddress } from 'viem';
import { useRouter as useNavigation } from 'next/navigation';
import { useRouter } from 'next/router';
import MembershipEditRenounceTable from '../../../sections/governance/edit/MembershipEditRenouceTable';
import { shortenAddress } from '@utils';

export default function GovernanceEdit() {
	const router = useRouter();
	const navigate = useNavigation();

	const valid = isAddress(router.query.address?.toString() ?? '');
	if (!valid) navigate.push('/governance/list');

	const address = (router.query.address as Address) || zeroAddress;

	return (
		<AppPage>
			<AppTitle title="Renouce Your Role">
				<div className="text-text-secondary">
					Confirm renoucement of your role from membership contract <a className="font-semibold">{shortenAddress(address)}</a>
				</div>
			</AppTitle>

			<MembershipEditRenounceTable membership={address} />

			<CommingSoon
				className="mt-10 text-text-secondary"
				text={'Discover upcoming governance modules with advanced access control features'}
			/>
		</AppPage>
	);
}
