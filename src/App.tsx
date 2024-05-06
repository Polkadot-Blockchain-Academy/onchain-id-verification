/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, useState } from 'react'
import type { Binary } from "polkadot-api"
import { Button, Input, Table } from 'antd'
import { isValidAddress } from "@polkadot-ui/utils"

const { TextArea } = Input

import './App.css'
import { DotQueries, dot } from '@polkadot-api/descriptors'
import { polkadotClient } from './clients'

const columns = [
  {
    title: 'Has ID',
    dataIndex: 'hasId',
    key: 'hasId',
    render: (v: boolean) => v ? "✅" : "🚫",
  },
  {
    title: 'Display Name',
    dataIndex: 'display',
    key: 'display',
  },
  {
    title: 'Legal Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Github',
    dataIndex: 'github',
    key: 'github',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

const invColumns = [
  {
    title: 'Invalid',
    dataIndex: 'address',
    key: 'address',
  },
];

const identityDataToString = (value: number | string | Binary | undefined) =>
  typeof value === "object" ? value.asText() : value ?? ""

const mapRawIdentity = (
  rawIdentity?: DotQueries["Identity"]["IdentityOf"]["Value"]
) => {
  if (!rawIdentity) return rawIdentity
  const {
    info: { additional, display, legal, email },
  } = rawIdentity[0]

  const display_id = identityDataToString(display.value)
  const legal_read = identityDataToString(legal.value)
  const email_read = identityDataToString(email.value)
  const additionalInfo = Object.fromEntries(
    additional.map(([key, { value }]) => [
      identityDataToString(key.value!),
      identityDataToString(value),
    ])
  )

  return { ...additionalInfo, display: display_id, name: legal_read, email: email_read }
}

const api = polkadotClient?.getTypedApi(dot)

export const App = () => {
  const [members, setMembers] = useState<string[]>([])
  const [idResults, setIdResults] = useState<object[]>([])
  const [loader, setLoader] = useState<boolean>(false)
  const [invalidAddresses, setInvalidAddresses] = useState<object[]>([])

  const getIdentities = async (addresses: string[]) => {
    try {
      const invAdd: SetStateAction<object[]> = []
      const checkIds = addresses.filter((id: string) => {
        console.log('isValidAddress(id)', id, isValidAddress(id))
        if (isValidAddress(id)) {
          return id
        } else {
          invAdd.push({ address: id })
        }
      })

      const identities = await Promise.all(checkIds.map(address => api.query.Identity.IdentityOf.getValue(address)))

      console.log("invalid", invAdd)
      console.log("identities", checkIds)
      const result = identities?.map((identity, idx) => ({
        address: addresses[idx],
        ...mapRawIdentity(identity),
      }))

      const dataSource: object[] = [];
      let i = 1;
      result?.forEach((r: { [s: string]: any }) => {
        let obj: any = {
          key: i++,
          address: '',
          github: '',
          email: '',
          name: '',
          display: ''
        }
        for (let [key, value] of Object.entries(r)) {
          obj[key] = value
          if (key === "display") {
            obj.hasId = true
          }
        }
        dataSource.push(obj)
      })
      setIdResults(dataSource)
      setLoader(false)
      setInvalidAddresses(invAdd)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <h1>
        Polkadot Blockchain Academy
      </h1>
      <h2>On-Chain Identity Retrieve tool</h2>
      <div className="card">
        <TextArea rows={10} onChange={(val) => {
          setMembers(val.target.value.replace(/\s/g, "").replace("\"", "").replace("'", "").replace("`", "").split(","))
        }} />
        <Button disabled={!members.length} onClick={() => {
          setIdResults([])
          setInvalidAddresses([])
          getIdentities(members)
          setLoader(true)
        }} loading={loader}
        >
          Request identities
        </Button>
      </div>
      <Table dataSource={idResults} columns={columns} />

      <Table dataSource={invalidAddresses} columns={invColumns} />
    </>
  )
}