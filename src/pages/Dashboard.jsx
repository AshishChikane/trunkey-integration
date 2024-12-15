import React, { useState, useEffect } from "react";

import Box from "../components/ui/Box";
import Button from "../components/ui/Button";
import { ApiKeyStamper } from "@turnkey/api-key-stamper";
import { TurnkeyClient } from "@turnkey/http";
import { Turnkey } from "@turnkey/sdk-browser";
import { DEFAULT_ETHEREUM_ACCOUNTS } from "@turnkey/sdk-server";
import axios from "axios";
import Dialog from "../components/ui/Dailog";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import Table from "../components/ui/Table";
import Loader from "../components/ui/Loader";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [subOrgName, setSubOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [subOrganizations, setSubOrganizations] = useState([]);
  const [username, setUsername] = useState("");
  const [walletName, setWalletName] = useState("");

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

  const getChildOrganizations = async () => {
    try {
      let sub_orgs = await httpClient.getSubOrgIds({
        organizationId: "ceddd4dd-272e-4e38-bd79-40401694ccef",
      });
      let arr = [];
      if (!sub_orgs.organizationIds.length) return arr;

      for (let i = 0; i < sub_orgs.organizationIds.length; i++) {
        let res = await httpClient.getOrganization({
          organizationId: sub_orgs.organizationIds[i],
        });
        arr.push(res.organizationData);
      }

      setSubOrganizations(arr);
      return arr;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChildOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const turnkey = new Turnkey({
      apiBaseUrl: "https://api.turnkey.com",
      defaultOrganizationId: "ceddd4dd-272e-4e38-bd79-40401694ccef",
    });

    const passkeyClient = turnkey.passkeyClient();

    const credential = await passkeyClient.createUserPasskey({
      publicKey: {
        user: {
          name: "Neel Non cust --- ",
          displayName: "Neel Kanani --- ",
        },
      },
    });

    const subOrganizationConfig = {
      subOrganizationName: subOrgName,
      rootUsers: [
        {
          userName: username,
          userEmail: email,
          apiKeys: [],
          authenticators: [
            {
              authenticatorName: "Neel Non cust ----",
              challenge: credential.encodedChallenge,
              attestation: credential.attestation,
            },
          ],
          oauthProviders: [],
        },
      ],
      rootQuorumThreshold: 1,
      wallet: {
        walletName: walletName,
        accounts: DEFAULT_ETHEREUM_ACCOUNTS,
      },
    };

    await axios.post(
      "https://f2a9-103-200-100-102.ngrok-free.app/create-sub-organization",
      {
        organizationBody: subOrganizationConfig,
      }
    );
    await getChildOrganizations();
    setIsOpen(false);
  };

  const handleRowClick = (id) => {
    navigate(`/dashboard/${id}`);
  };

  const header = (
    <>
      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        ID
      </th>
      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        Name
      </th>
      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        Organization ID
      </th>
      <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        Wallets
      </th>
    </>
  );

  const rows = subOrganizations.map((org, index) => (
    <tr
      key={index + 1}
      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
      onClick={() => handleRowClick(org.organizationId)}
    >
      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        {index + 1}
      </td>
      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        {org.name}
      </td>
      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        {org.organizationId}
      </td>
      <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
        {org.wallets.length}
      </td>
    </tr>
  ));

  return (
    <div className=" my-8 mx-12">
      <Box>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
          <h3 className="text-xl font-bold text-white transition-colors duration-300">
            Sub-Organization
          </h3>
          <Button label="Create Organization" onClick={() => setIsOpen(true)} />
        </div>
      </Box>
      {!subOrganizations.length ? (
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
            Add Sub-Organization
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create a new sub-organization for your wallet
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subOrgName">Sub-Organization Name</Label>
            <Input
              id="subOrgName"
              value={subOrgName}
              onChange={(e) => setSubOrgName(e.target.value)}
              placeholder="Enter sub-organization name"
              required
            />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
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
            <Button label="Create" type="submit" />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
