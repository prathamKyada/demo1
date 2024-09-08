// "use client";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import WalletConnect from "../components/WalletConnect";
// import contractABI from "../constant/contractABI.json"; // ABI of the mining contract

// export default function Home() {
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [totalBlocksMined, setTotalBlocksMined] = useState(0);
//   const [statusMessage, setStatusMessage] = useState("");

//   // Replace with your deployed contract address
//   const contractAddress = "0x61525b1C0E41D440F4280A4C526937f8cC47782e";

//   // Check wallet connection
//   useEffect(() => {
//     if (walletAddress) {
//       getTotalMinedBlocks();
//     }
//   }, [walletAddress]);

//   // Fetch the total mined blocks
//   const getTotalMinedBlocks = async () => {
//     if (typeof window.ethereum !== "undefined") {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const contract = new ethers.Contract(contractAddress, contractABI, provider);
//       const totalBlocks = await contract.totalMinedBlocks();
//       setTotalBlocksMined(totalBlocks.toNumber());
//     }
//   };

//   // Mine a block
//   const mineBlock = async () => {
//     if (!walletAddress) {
//       setStatusMessage("Please connect your wallet first.");
//       return;
//     }

//     try {
//       setStatusMessage("Mining block...");
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(contractAddress, contractABI, signer);
//       const tx = await contract.mineBlock();
//       await tx.wait();

//       setStatusMessage("Block mined successfully!");
//       getTotalMinedBlocks();
//     } catch (error) {
//       setStatusMessage(`Mining error: ${error.message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
//         Mine Tokens and Earn Rewards
//       </h1>
//       <WalletConnect setWalletAddress={setWalletAddress} />
//       {walletAddress && (
//         <div className="text-center mt-4">
//           <p className="text-lg text-black mt-2">Connected Wallet: {walletAddress}</p>
//           <p className="text-lg text-black mt-2">Total Blocks Mined: {totalBlocksMined}</p>
//           <button
//             className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
//             onClick={mineBlock}
//           >
//             Mine Block
//           </button>
//         </div>
//       )}
//       {statusMessage && <p className="text-red-500 mt-4">{statusMessage}</p>}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnect from "../components/WalletConnect";
import contractABI from "../constant/contractABI.json";
import tokenAbi from "../constant/tokenAbi.json";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [totalBlocksMined, setTotalBlocksMined] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // Replace with your deployed contract address
  const contractAddress = "0x6964B1798329833d089f5AF5a6bcA0A4eC9e35B2";
  const tokenContractAddress = "0xCFAf402Eb32D5Bb044df1A4cD35b6aF06E4F777d";

  // Check wallet connection
  useEffect(() => {
    if (walletAddress) {
      getTotalMinedBlocks();
      getRewardBalance();
    }
  }, [walletAddress]);

  // Fetch the total mined blocks
  const getTotalMinedBlocks = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const totalBlocks = await contract.totalMinedBlocks();
      setTotalBlocksMined(totalBlocks.toNumber());
    }
  };

  // Fetch the user's reward balance
  const getRewardBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const balance = await contract.getRewardBalance(walletAddress);
      // console.log("Balance --> ", ethers.utils.formatUnits(balance, 18));

      setRewardBalance(ethers.utils.formatUnits(balance, 18)); // Convert from wei to tokens
    }
  };

  // const approveToken = async (rewardBalance) => {
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const contract = new ethers.Contract(
  //       tokenContractAddress,
  //       tokenAbi,
  //       signer
  //     );

  //     console.log("Token Contract => ", contract);

  //     const amount = ethers.utils
  //       .parseUnits(rewardBalance.toString(), 18)
  //       .toString();
  //     console.log("Amount ===> ", amount);
  //     const tx = await contract.approve(contractAddress, amount);
  //   } catch (error) {
  //     console.log("Error in approve", error);
  //   }
  // };

  // Mine a block
  const mineBlock = async () => {
    if (!walletAddress) {
      setStatusMessage("Please connect your wallet first.");
      return;
    }

    try {
      setStatusMessage("Mining block...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const tx = await contract.mineBlock();
      await tx.wait();

      setStatusMessage("Block mined successfully!");
      getTotalMinedBlocks();
      getRewardBalance(); // Update reward balance after mining
    } catch (error) {
      console.log("Error in mining -> ", error);
      setStatusMessage(`Mining error: ${error.message}`);
    }
  };

  // Withdraw mined tokens
  // const withdrawTokens = async () => {
  //   if (!walletAddress) {
  //     setStatusMessage("Please connect your wallet first.");
  //     return;
  //   }

  //   try {
  //     setStatusMessage("Withdrawing tokens...");
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(
  //       contractAddress,
  //       contractABI,
  //       signer
  //     );

  //     console.log("Amount in eth ===> ", rewardBalance);

  //     const amount = ethers.utils
  //       .parseUnits(rewardBalance.toString(), 18)
  //       .toString();
  //     console.log("Amount ===> ", amount);

  //     const tx = await contract.withdrawTokens(walletAddress, amount);
  //     await tx.wait();

  //     setStatusMessage("Tokens withdrawn successfully!");
  //     getRewardBalance(); // Update reward balance after withdrawal
  //   } catch (error) {
  //     console.log("error > ", error);
  //     setStatusMessage(`Withdrawal error: ${error.message}`);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Mine Tokens and Earn Rewards
      </h1>
      <WalletConnect setWalletAddress={setWalletAddress} />
      {walletAddress && (
        <div className="text-center mt-4">
          <p className="text-lg text-black mt-2">
            Connected Wallet: {walletAddress}
          </p>
          <p className="text-lg text-black mt-2">
            Total Blocks Mined: {totalBlocksMined}
          </p>
          <p className="text-lg text-black mt-2">
            Reward Balance: {rewardBalance} tokens
          </p>

          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            onClick={mineBlock}
          >
            Mine Block
          </button>

          {/* <button
            className="mt-6 ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            onClick={approveToken}
          >
            Approve Tokens
          </button>
          <button
            className="mt-6 ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            onClick={withdrawTokens}
          >
            Withdraw Tokens
          </button> */}
        </div>
      )}
      {statusMessage && <p className="text-red-500 mt-4">{statusMessage}</p>}
    </div>
  );
}
