/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Binary } from "polkadot-api"
import { DotQueries, dot } from '@polkadot-api/descriptors'
import { polkadotClient } from './clients'

export const columns = [
    {
        title: 'Has ID',
        dataIndex: 'hasId',
        key: 'hasId',
        render: (v: boolean) => v ? "✅" : "🚫",
        sorter: (a: { name: string | any[]; }, b: { name: string | any[]; }) => a.name.length - b.name.length,
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
    {
        title: 'Substrate Address',
        dataIndex: 'substrate',
        key: 'substrate',
    },
];

export const invColumns = [
    {
        title: 'Invalid Addresses',
        dataIndex: 'address',
        key: 'address',
    },
];


export const identityDataToString = (value: number | string | Binary | undefined) =>
    typeof value === "object" ? value.asText() : value ?? ""

export const mapRawIdentity = (
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

export const api = polkadotClient?.getTypedApi(dot)