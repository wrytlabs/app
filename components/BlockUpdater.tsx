import { useAccount, useBlockNumber } from 'wagmi';
import { Address } from 'viem';
import { useEffect, useState } from 'react';
import { RootState, store } from '../redux/redux.store';
import { useIsConnectedToCorrectChain } from '../hooks/useWalletConnectStats';
import { WAGMI_CHAIN, CONFIG } from '../app.config';
import LoadingScreen from './LoadingScreen';

let initializing: boolean = false;
let initStart: number = 0;
let loading: boolean = false;

export default function BockUpdater({ children }: { children?: React.ReactElement | React.ReactElement[] }) {
	const { error, data } = useBlockNumber({ chainId: WAGMI_CHAIN.id, watch: true });
	const { address } = useAccount();
	const isConnectedToCorrectChain = useIsConnectedToCorrectChain();

	const [initialized, setInitialized] = useState<boolean>(false);
	const [latestHeight, setLatestHeight] = useState<number>(0);
	const [latestHeight10, setLatestHeight10] = useState<number>(0);
	const [latestConnectedToChain, setLatestConnectedToChain] = useState<boolean>(false);
	const [latestAddress, setLatestAddress] = useState<Address | undefined>(undefined);

	// const loadedEcosystem: boolean = useSelector((state: RootState) => state.ecosystem.loaded);
	// ...

	// --------------------------------------------------------------------------------
	// Init
	useEffect(() => {
		if (initialized) return;
		if (initializing) return;
		initializing = true;
		initStart = Date.now();

		console.log(`Init [BlockUpdater]: Start loading application data... ${initStart}`);
		// store.dispatch(fetchFunction());
	}, [initialized]);

	// --------------------------------------------------------------------------------
	// Init done
	useEffect(() => {
		if (initialized) return;
		if (/*loadedEcosystem*/ true) {
			console.log(`Init [BlockUpdater]: Done. ${Date.now() - initStart} ms`);
			setInitialized(true);
		}
	}, [initialized]);

	// --------------------------------------------------------------------------------
	// Bock update policies
	useEffect(() => {
		if (!initialized) return;
		if (loading) return;

		// verify
		if (!data || error) return;
		const fetchedLatestHeight: number = parseInt(data.toString());

		// New block? set new state
		if (fetchedLatestHeight <= latestHeight) return;
		loading = true;

		// Block update policy: EACH BLOCK
		setLatestHeight(fetchedLatestHeight);
		CONFIG.verbose && console.log(`Policy [BlockUpdater]: EACH BLOCK ${fetchedLatestHeight}`);
		// ...

		// Block update policy: EACH x BLOCKS
		if (fetchedLatestHeight >= latestHeight10 + 30) {
			CONFIG.verbose && console.log(`Policy [BlockUpdater]: EACH 30 BLOCKS ${fetchedLatestHeight}`);
			// ...
			setLatestHeight10(fetchedLatestHeight);
		}

		// Unlock block updates
		loading = false;
	}, [initialized, error, data, latestHeight, latestHeight10, latestAddress]);

	// --------------------------------------------------------------------------------
	// Connected to correct chain changes
	useEffect(() => {
		if (isConnectedToCorrectChain !== latestConnectedToChain) {
			CONFIG.verbose && console.log(`Policy [BlockUpdater]: Connected to correct chain changed: ${isConnectedToCorrectChain}`);
			setLatestConnectedToChain(isConnectedToCorrectChain);
		}
	}, [isConnectedToCorrectChain, latestConnectedToChain]);

	// --------------------------------------------------------------------------------
	// Address / User changes
	useEffect(() => {
		if (!address && latestAddress) {
			setLatestAddress(undefined);
			CONFIG.verbose && console.log(`Policy [BlockUpdater]: Address reset`);
			// ...
		} else if (address && (!latestAddress || address != latestAddress)) {
			setLatestAddress(address);
			CONFIG.verbose && console.log(`Policy [BlockUpdater]: Address changed to: ${address}`);
			// ...
		}
	}, [address, latestAddress]);

	// --------------------------------------------------------------------------------
	// Loading Guard
	if (initialized) {
		return <>{children}</>;
	} else {
		return <LoadingScreen />;
	}
}
