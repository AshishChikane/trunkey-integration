import React, { useEffect, useState } from "react";
import { useTurnkey } from "@turnkey/sdk-react";
import { ApiKeyStamper } from "@turnkey/api-key-stamper";
import { TurnkeyClient } from "@turnkey/http";
import { Turnkey } from "@turnkey/sdk-browser";
import { DEFAULT_ETHEREUM_ACCOUNTS } from "@turnkey/sdk-server";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import Box from "../components/ui/Box";
import Table from "../components/ui/Table";
import { useNavigate, useParams } from "react-router";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import Dialog from "../components/ui/Dailog";
import axios from "axios";

export default function OrganizationWallets() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isOtpDialogOpen, setOtpDialogOpen] = useState(false);
  const [isSendOtpDialogOpen, setSendOtpDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [walletName, setWalletName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [wallets, setwallets] = useState([]);

  const { turnkey, passkeyClient, authIframeClient } = useTurnkey();

  const stamper = new ApiKeyStamper({
    apiPublicKey:
      "02969adf495407ebb2c60bd9b6745b0ab2a873734a8281c695076339dc0d3cec80",
    apiPrivateKey:
      "15aeb2b4f6947d5883dbbf7cc532b4787f7da83560792cf3fd1c9379ca03ca09",
  });

  const httpClient = new TurnkeyClient(
    { baseUrl: "https://api.turnkey.com" },
    stamper
  );

  const getAllWalletDetails = async () => {
    try {
      let walletInformation = await httpClient.getWallets({
        organizationId: id,
      });
      setwallets(walletInformation.wallets);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllWalletDetails();
  }, []);



  const createWallet = async () => {
    try {
      // const user = await turnkey.currentUserSession()
      const wallet = await passkeyClient.createWallet({
        walletName: walletName,
        accounts: DEFAULT_ETHEREUM_ACCOUNTS,
      });
      // console.log("wallet", wallet)
      localStorage.setItem(wallet.walletId, JSON.stringify(wallet));
      getAllWalletDetails();
      setIsOpen(false)

      // console.log("wallet", wallet);
    } catch (err) {
      console.log("err", err);
    }
  };

  const header = (
    <>
      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        ID
      </th>
      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        Wallet ID
      </th>
      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        Name
      </th>
      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        Date
      </th>
    </>
  );

  const rows = wallets.map((wallet, index) => (
    <tr
      key={index + 1}
      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
      onClick={() => navigate(`wallet/${wallet.walletId}`)}
    >
      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        {index + 1}
      </td>
      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        {wallet.walletId}
      </td>
      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        {wallet.walletName}
      </td>
      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        {new Date(wallet.createdAt.seconds * 1000).toLocaleDateString()}
      </td>
    </tr>
  ));

  //   otp feature
  const sendOtp = async () => {
    try {
      let response = await turnkey?.serverSign("otpAuth", [
        {
          email,
          targetPublicKey: authIframeClient.iframePublicKey,
          organizationId: id,
        },
      ]);

      setOtpId(response.data.otpId);
      setSendOtpDialogOpen(false);
      setOtpDialogOpen(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtpAndCreateWallet = async () => {
    try {
      const resp = await axios.post(
        "https://f2a9-103-200-100-102.ngrok-free.app/verify-otp",
        {
          otpId: otpId,
          otpCode: otp,
          organizationId: id,
          targetPublicKey: authIframeClient?.iframePublicKey,
        }
      );
      await authIframeClient.injectCredentialBundle(resp.data.credentialBundle);
      await authIframeClient.login();
      createwallerFromIframe();
      setOtpDialogOpen(false);
      setWalletName("");
      setEmail("");
      getAllWalletDetails();
      setOtp("");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const createwallerFromIframe = async () => {
    try {
      // const user = await turnkey.currentUserSession()
      const wallet = await authIframeClient.createWallet({
        walletName: walletName,
        accounts: DEFAULT_ETHEREUM_ACCOUNTS,
      });

      localStorage.setItem(wallet.walletId, JSON.stringify(wallet));
      getAllWalletDetails();
    } catch (err) {
      console.log("err", err);
    }
  };


  return (
    <div className="my-8 mx-12">
      <Box>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-xl font-bold text-white transition-colors duration-300"
          >
            <ArrowLeft strokeWidth={2.5} className="h-5 w-5 mx-3" />
            Org Wallets
          </button>

          <div className="flex gap-x-3">
            <Button
              label="Create Wallet with Passkey"
              onClick={() => setIsOpen(true)}
            />
            <Button
              label="Create Wallet with OTP"
              onClick={() => setSendOtpDialogOpen(true)}
            />
          </div>
        </div>
      </Box>
      {!wallets.length ? (
        <Loader />
      ) : (
        <div className="my-4">
          <Box>
            <div className="mt-6 w-full overflow-x-auto">
              <Table header={header} rows={rows} />
            </div>
          </Box>
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Wallet
          </h2>
          {/* <p className="text-sm text-gray-600 dark:text-gray-400">
            Create a new sub-organization for your wallet
          </p> */}
        </div>

        {/* <form onSubmit={createWallet} className="space-y-4"> */}
          <div>
            <Label htmlFor="walletName">Wallet Name</Label>
            <Input
              id="walletName"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="Enter wallet name"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button label="Create" type="button" onClick={createWallet} />
          </div>
        {/* </form> */}
      </Dialog>

      {/* Send OTP Dialog */}
      <Dialog open={isSendOtpDialogOpen} onOpenChange={setSendOtpDialogOpen}>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Wallet with OTP
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your email and wallet name to send OTP.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendOtp(); // Call sendOtp function on form submit
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="walletName">Wallet Name</Label>
            <Input
              id="walletName"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="Enter wallet name"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button label="Send OTP" type="submit" />
          </div>
        </form>
      </Dialog>

      {/* Verify OTP Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter the OTP sent to your email to create the wallet.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtpAndCreateWallet();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button label="Verify" type="submit" />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
