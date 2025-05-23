import TableRow from '@components/Table/TableRow';
import { shortenAddress, shortenHash } from '@utils';
import { Hash, zeroAddress } from 'viem';
import AppButton from '@components/AppButton';
import { useRouter as useNavigation } from 'next/navigation';
import { MembershipPermission, MembershipRoles } from '../../../hooks/useMembershipPermission';
import AddressLabel from '@components/AddressLabel';
import { TransactionLabel } from '@components/TransactionLabel';
import { TableRowEmptyRaw } from '@components/Table/TableRowEmpty';
import Link from 'next/link';

interface Props {
	headers: string[];
	tab: string;
	permission: MembershipPermission;
	counter: Map<`0x${string}`, number>;
}

export default function MembershipListRow({ headers, tab, permission, counter }: Props) {
	const navigate = useNavigation();
	const d = new Date(permission.createdAt * 1000).toLocaleString();
	const roles = Object.keys(MembershipRoles);
	const rolesHex = Object.values(MembershipRoles);
	const roleIdx = rolesHex.findIndex((r) => r == permission.role);

	// @dev: create new membership
	if (permission.address === zeroAddress) {
		return (
			<TableRowEmptyRaw>
				<div key="create" className="flex flex-col gap-4 items-center justify-center text-center">
					<p className="text-text-secondary">Create a permission contract to manage roles and permissions</p>
					<Link href="/governance/create" className="w-64 bg-button-disabled p-4 rounded-xl">
						Create
					</Link>
				</div>
			</TableRowEmptyRaw>
		);
	}

	// @dev: show permissions
	return (
		<TableRow
			headers={headers}
			tab={tab}
			actionCol={<AppButton onClick={() => navigate.push(`/governance/edit/${permission.address}`)}>Edit</AppButton>}
		>
			<AddressLabel address={permission.address} label={shortenAddress(permission.address)} showLink />

			<div className="">{counter.get(permission.address)}</div>

			<div className="">{d.split(', ')[0]}</div>

			<TransactionLabel hash={permission.txHash} label={shortenHash(permission.txHash as Hash)} isTextRight={true} showLink />
		</TableRow>
	);
}
