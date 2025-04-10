import Table from '@components/Table';
import TableHeader from '@components/Table/TableHead';
import TableBody from '@components/Table/TableBody';
import TableRowEmpty from '@components/Table/TableRowEmpty';
import { useEffect, useState } from 'react';
import LeverageMorphoRow from './LeverageMorphoRow';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/redux.store';
import { LeverageMorphoInstance } from '../../redux/slices/morpho.scale.types';

export default function LeverageMorphoTable() {
	const headers: string[] = ['Collateral', 'Equity', 'LTV / LLTV', 'Leverage'];
	const [tab, setTab] = useState<string>(headers[3]);
	const [reverse, setReverse] = useState<boolean>(false);
	const [list, setList] = useState<LeverageMorphoInstance[]>([]);

	const { factory } = useSelector((state: RootState) => state.morphoScale);
	const sorted = factory;

	useEffect(() => {
		const idList = list.map((l) => l.address).join('_');
		const idSorted = sorted.map((l) => l.address).join('_');
		if (idList != idSorted) setList(sorted);
	}, [list, sorted]);

	const handleTabOnChange = function (e: string) {
		if (tab === e) {
			setReverse(!reverse);
		} else {
			setReverse(false);
			setTab(e);
		}
	};

	return (
		<Table>
			<TableHeader headers={headers} tab={tab} reverse={reverse} tabOnChange={handleTabOnChange} actionCol />
			<TableBody>
				{sorted.length == 0 ? (
					<TableRowEmpty>{'There are no positions yet.'}</TableRowEmpty>
				) : (
					sorted.map((i, idx) => (
						<LeverageMorphoRow headers={headers} tab={tab} key={`LeverageMorphoRow_${i.address}`} instance={i} />
					))
				)}
			</TableBody>
		</Table>
	);
}
