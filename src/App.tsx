/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, useState } from 'react'
import { Button, Input, Table } from 'antd'
import { isValidAddress } from "@polkadot-ui/utils"
const { TextArea } = Input

import './App.css'
import { api, mapRawIdentity, columns, invColumns } from './consts'

export const App = () => {
  const [members, setMembers] = useState<string[]>([])
  const [idResults, setIdResults] = useState<any[]>([])
  const [loader, setLoader] = useState<boolean>(false)
  const [invalidAddresses, setInvalidAddresses] = useState<object[]>([])

  const getIdentities = async (addresses: string[]) => {
    try {
      const invAdd: SetStateAction<object[]> = []
      const checkIds = addresses.filter((id: string) => {
        if (isValidAddress(id)) {
          return id
        } else {
          invAdd.push({ address: id })
        }
      })

      const identities = await Promise.all(checkIds.map(address => api.query.Identity.IdentityOf.getValue(address)))
      const result = identities?.map((identity: any, idx: number) => ({
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