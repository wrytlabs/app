import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAppKit, useAppKitState } from '@reown/appkit/react';
import Button from '@components/AppButton';
import { useIsConnectedToCorrectChain } from '../hooks/useWalletConnectStats';

interface Props {
	children?: React.ReactNode;
	label?: string;
	disabled?: boolean;
}

export default function WalletConnectGuard(props: Props) {
	const [requestedChange, setRequestedChange] = useState(false);

	const { isConnected } = useAccount();
	const Web3Modal = useAppKit();
	const Web3ModalState = useAppKitState();
	const isCorrectChain = useIsConnectedToCorrectChain();

	// to close modal after successful connection or change of chain
	useEffect(() => {
		if (requestedChange && isCorrectChain && Web3ModalState.open) {
			Web3Modal.close();
			setRequestedChange(false);
		}
	}, [requestedChange, isCorrectChain, Web3Modal, Web3ModalState]);

	// Check if wallet is disconnected
	if (!isConnected)
		return (
			<Button
				className="h-10"
				disabled={props.disabled}
				onClick={() => {
					Web3Modal.open();
					setRequestedChange(true);
				}}
			>
				{props?.label ?? 'Connect Wallet'}
			</Button>
		);

	// Check if wallet is connected to one of the available chains
	if (!isCorrectChain)
		return (
			<Button
				className="h-10"
				disabled={props.disabled}
				onClick={() => {
					Web3Modal.open({ view: 'Networks' });
					setRequestedChange(true);
				}}
			>
				{props?.label ?? 'Change Chain'}
			</Button>
		);

	// render children
	return <>{props.children}</>;
}
