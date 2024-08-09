import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
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

    const openPhantomWallet = () => {
        // Attempt to open the Phantom wallet app
        const isPhantomInstalled = navigator.userAgent.includes('Phantom'); // Simple check

        if (isPhantomInstalled) {
            window.location.href = 'phantom://';
        } else {
            // Fallback: Open Phantom's website or show a message
            window.location.href = 'https://phantom.app/';
        }
    };

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <button onClick={openPhantomWallet} style={{ margin: '10px' }}>
                        Open Phantom Wallet
                    </button>
                    <WalletMultiButton />
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;
