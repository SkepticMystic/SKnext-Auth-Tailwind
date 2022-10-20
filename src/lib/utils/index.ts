export const getProps = () => ({
    err: '',
    suc: '',
    loading: false,
    disabled: false,
})

export const fetchJson = async (
    url: string,
    options: RequestInit & {
        form?: boolean
    }
) => {
    const res = await fetch(url, options)
    const json = await res.json()
    return json
}