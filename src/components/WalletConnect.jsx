import { useState } from 'react';

export default function WalletConnect({ setWalletAddress }) {
  const [errorMessage, setErrorMessage] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        setErrorMessage('Error connecting wallet: ' + error.message);
      }
    } else {
      setErrorMessage('MetaMask is not installed');
    }
  };

  return (
    <div>
      <button className="connect-btn text-black" onClick={connectWallet}>
        Connect Wallet
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}
