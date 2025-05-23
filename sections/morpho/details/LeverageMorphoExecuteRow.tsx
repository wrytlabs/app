import TableRow from '@components/Table/TableRow';
import { formatUnits, parseUnits } from 'viem';
import {
	LeverageMorphoCollateralFlatRaw,
	LeverageMorphoExecuteFlatRaw,
	LeverageMorphoInstance,
} from '../../../redux/slices/morpho.scale.types';
import { formatCurrency } from '@utils';
import AppLink from '@components/AppLink';
import { useTxUrl } from '../../../hooks/useContractUrl';

interface Props {
	headers: string[];
	tab: string;
	instance: LeverageMorphoInstance;
	entry: LeverageMorphoExecuteFlatRaw;
}

export default function LeverageMorphoExecuteRow({ headers, tab, instance, entry }: Props) {
	const link = useTxUrl(entry.txHash);

	const swapInAmount = formatCurrency(formatUnits(entry.swapIn, entry.opcode == 0 ? instance.loanDecimals : instance.collateralDecimals));
	const swapOutAmount = formatCurrency(
		formatUnits(entry.swapOut, entry.opcode == 0 ? instance.collateralDecimals : instance.loanDecimals)
	);

	const swapLoan = entry.opcode == 0 ? entry.swapIn : entry.swapOut;
	const swapCollateral = entry.opcode == 0 ? entry.swapOut : entry.swapIn;
	const price =
		(BigInt(swapLoan) * parseUnits('1', instance.collateralDecimals)) /
		(BigInt(swapCollateral) * parseUnits('1', instance.loanDecimals));

	// increase: flash loan, swap loan -> coll
	// decrease: flash coll, swap coll -> loan
	// close: flash loan, swap coll -> loan

	return (
		<>
			<TableRow headers={headers} tab={tab} rawHeader={true}>
				<AppLink className="md:text-left" label={new Date(entry.createdAt * 1000).toDateString()} href={link} external={true} />

				<div className="flex flex-col">{entry.opcode == 0 ? 'Increase' : entry.opcode == 1 ? 'Decrease' : 'Close'}</div>

				<div className="flex flex-col">
					{swapInAmount} {entry.opcode == 0 ? instance.loanSymbol : instance.collateralSymbol}
				</div>

				<div className="flex flex-col">
					{swapOutAmount} {entry.opcode == 0 ? instance.collateralSymbol : instance.loanSymbol}
				</div>

				<div className="flex flex-col">
					{formatCurrency(String(price))} {instance.loanSymbol}
				</div>
			</TableRow>
		</>
	);
}
