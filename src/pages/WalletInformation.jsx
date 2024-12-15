import React, { useState, useEffect } from "react";
import Box from "../components/ui/Box";
import Button from "../components/ui/Button";
import { useNavigate, useParams } from "react-router";
import Dialog from "../components/ui/Dailog";
import { Input } from "../components/ui/Input";
import { useTurnkey } from "@turnkey/sdk-react";
import { TurnkeySigner } from "@turnkey/ethers";
import { ethers } from "ethers";
import { ArrowLeft } from "lucide-react";

export default function WalletInformation() {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { id, walletId } = useParams();
  const { turnkey, passkeyClient, authIframeClient } = useTurnkey();

  useEffect(() => {
    const getWalletData = () => {
      try {
        const data = localStorage.getItem(walletId);
        if (data) {
          setWalletData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    getWalletData();
  }, [walletId]);

  const handleSendCrypto = async () => {
    if (!recipientAddress || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    const turnkeySigner = new TurnkeySigner({
      client:
        walletData?.walletType === "Passkey" ? passkeyClient : authIframeClient,
      organizationId: id,
      signWith: walletData.walletInfo.addresses[0],
    });

    const provider = new ethers.JsonRpcProvider(
      "https://api.avax-test.network/ext/bc/C/rpc"
    );
    const connectedSigner = turnkeySigner.connect(provider);

    const transactionRequest = {
      to: recipientAddress,
      value: amount,
      type: 2,
    };
    const transactionResult = await connectedSigner.sendTransaction(
      transactionRequest
    );

    console.log(transactionResult);

    setIsDialogOpen(false);
  };

  return (
    <div className="my-8 mx-12">
      <Box>
        <div className="flex flex-col w-full gap-4">
          {/* Title and Button in One Line */}
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => navigate(`/dashboard/${id}`)}
              className="flex items-center text-xl font-bold text-white transition-colors duration-300"
            >
              <ArrowLeft strokeWidth={2.5} className="h-5 w-5 mx-3" />
              {walletData ? walletData?.walletName : "Loading..."}
            </button>

            <Button label="Send Crypto" onClick={() => setIsDialogOpen(true)} />
          </div>

          {/* Balance and Wallet Address */}
          <div className="text-lg font-medium text-start">
            <div>Balance: 1.25 ETH</div>
            <div className="text-sm text-gray-400">
              {walletData
                ? walletData?.walletInfo?.addresses[0]
                : "Loading Address"}
            </div>
          </div>
        </div>
      </Box>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Send Crypto
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Note: Only Ether is available for now.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCrypto();
            }}
            className="space-y-4"
          >
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="address"
              >
                Recipient Address
              </label>
              <Input
                type="text"
                id="address"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="amount"
              >
                Amount (ETH)
              </label>
              <Input
                type="number"
                id="amount"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button label="Cancel" onClick={() => setIsDialogOpen(false)} />
              <Button label="Send" type="submit" />
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
