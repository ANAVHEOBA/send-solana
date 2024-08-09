import { FC, ReactNode, useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const endpoint = clusterApiUrl('devnet');

    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }), // Use the enum value
    ], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <WalletConnector />
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

// Component to handle dynamic wallet selection, deep linking, and connection
const WalletConnector: FC = () => {
    const { connect, connected, disconnect } = useWallet();

    useEffect(() => {
        const detectAndConnectWallet = async () => {
            // List of potential wallets
            const availableWallets = ['Phantom', 'Solflare'];

            for (const wallet of availableWallets) {
                try {
                    // Open the Phantom app if it's available
                    if (wallet === 'Phantom' && window.solana?.isPhantom) {
                        // Open Phantom wallet using deep link
                        window.location.href = 'solana://?action=connect';
                        // Attempt to connect to Phantom
                        await connect();
                        break;
                    }
                    // Open the Solflare app if it's available
                    if (wallet === 'Solflare' && window.solflare) {
                        // Open Solflare wallet using deep link
                        window.location.href = 'solflare://connect';
                        // Attempt to connect to Solflare
                        await connect();
                        break;
                    }
                } catch (error) {
                    console.error(`Error connecting to ${wallet}:`, error);
                }
            }
        };

        if (!connected) {
            detectAndConnectWallet();
        }
    }, [connect, connected]);

    return null; // No need to render anything for this component
};

export default WalletContextProvider;

