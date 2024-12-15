import React, { useState, useEffect } from "react";
import Box from "../components/ui/Box";
import Button from "../components/ui/Button";
import { useParams } from "react-router";
import Dialog from "../components/ui/Dailog";
import { Input } from "../components/ui/Input";
import { useTurnkey } from "@turnkey/sdk-react";
import { TurnkeySigner } from "@turnkey/ethers";
import { ethers } from "ethers";

export default function WalletInformation() {
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
      client: authIframeClient,
      organizationId: id,
      signWith: walletData.addresses[0],
    });

    const provider = new ethers.JsonRpcProvider(
      "https://api.avax-test.network/ext/bc/C/rpc"
    );
    const connectedSigner = turnkeySigner.connect(provider);

    const transactionRequest = {
      to: recipientAddress,
      value: ethers.parseEther("0.0001"),
      type: 2,
    };
    const transactionResult = await connectedSigner.sendTransaction(
      transactionRequest
    );

    console.log(transactionResult);

    console.log("Sending crypto...");
    console.log("Recipient Address:", recipientAddress);
    console.log("Amount:", amount);

    // Close the dialog after handling send logic
    setIsDialogOpen(false);
  };

  return (
    <div className="my-8 mx-12">
      <Box>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
          <div className="text-lg font-medium">
            {walletData ? walletData?.walletId : "Loading..."}
          </div>
          <div className="text-lg font-medium">
            {walletData ? walletData?.addresses[0] : "Loading Address"}
          </div>

          <Button label="Send Crypto" onClick={() => setIsDialogOpen(true)} />
        </div>
      </Box>

      {/* Dialog */}
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
