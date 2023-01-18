import type { ObjectId } from "mongoose"

export const getProps = <LoadKey extends string | number = string | number>(): {
    err: string,
    suc: string,
    loading: boolean,
    loadObj: Partial<Record<LoadKey, boolean>>
    disabled: boolean,
} => ({
    err: '',
    suc: '',
    loading: false,
    loadObj: {},
    disabled: false,
})

export const fetchJson = async (
    url: string,
    options?: RequestInit
) => {
    const res = await fetch(url, options)
    const json = await res.json()
    return json
}

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

export const trimISODate = (date: Date | undefined) => date ? date.toISOString().slice(0, 10) : ''

export const _idToString = <T extends { _id: string | ObjectId }>(doc: T) => {
    if (doc?._id) doc._id = doc._id.toString()
    return doc
}