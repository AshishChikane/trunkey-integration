import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
const PUBLIC_KEY = import.meta.env.VITE_API_PUBLIC_KEY;
const PRIVATE_KEY = import.meta.env.VITE_API_PRIVATE_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_KEY = import.meta.env.VITE_API_BASE_KEY;
const DEFAULT_ORGANIZATION = import.meta.env.VITE_DEFAULT_ORGANIZATION_ID;

export default function Dashboard() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [subOrgName, setSubOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [subOrganizations, setSubOrganizations] = useState([]);
  const [username, setUsername] = useState("");
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(false);
  const stamper = new ApiKeyStamper({
    apiPublicKey: PUBLIC_KEY,
    apiPrivateKey: PRIVATE_KEY,
  });

  const httpClient = new TurnkeyClient({ baseUrl: API_BASE_KEY }, stamper);

  const getChildOrganizations = async () => {
    try {
      let sub_orgs = await httpClient.getSubOrgIds({
        organizationId: DEFAULT_ORGANIZATION,
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
    setLoading(true);
    try {
      const turnkey = new Turnkey({
        apiBaseUrl: API_BASE_KEY,
        defaultOrganizationId: DEFAULT_ORGANIZATION,
      });

      const passkeyClient = turnkey.passkeyClient();

      const credential = await passkeyClient.createUserPasskey({
        publicKey: {
          user: {
            name: username,
            displayName: username,
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
                authenticatorName: username,
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

      await axios.post(`${BACKEND_URL}/v2/organization/create-sub-organization`, {
        organizationBody: subOrganizationConfig,
      });

      await getChildOrganizations();
      setIsOpen(false);
      toast.success("Sub-organization created successfully!");
    } catch (error) {
      console.error("Error creating sub-organization:", error);
      toast.error("Failed to create sub-organization. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <Button label={loading ? "Creating..." : "Create"} type="submit" />
          </div>
        </form>
      </Dialog>
      {loading && <Loader />}
    </div>
  );
}
