/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction, useEffect, useState } from 'react'
import { Alert, Button, Input, Table } from 'antd'
import { isValidAddress } from "@polkadot-ui/utils"
const { TextArea } = Input

import './App.css'
import { api, mapRawIdentity, columns, invColumns } from './consts'

export const App = () => {
  const [members, setMembers] = useState<string[]>([])
  const [idResults, setIdResults] = useState<object[]>([])
  const [loader, setLoader] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(true)
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

  const handleClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    members.length > 30 ? setVisible(true) : setVisible(false)
  }, [members])

  return (
    <>
      <h1>
        Polkadot Blockchain Academy
      </h1>
      <h2>On-Chain Identity Retrieve tool</h2>
      <div className="card">
        <Alert message="Do not add more than 30 comma-separated addresses" type="success" />
        <TextArea rows={10} onChange={(val) => {
          setMembers(val.target.value.replace(/\s/g, "").replace("\"", "").replace("'", "").replace("`", "").split(","))
        }} />
        {visible && (
          <Alert message="Please do not add more than 30 addresses" type="error" closable afterClose={handleClose} />
        )}
        <Button disabled={!members.length || members.length > 30} onClick={() => {
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