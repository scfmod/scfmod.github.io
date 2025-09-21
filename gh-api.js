const CACHE_LIFE = 3600

/**
 * @param {string} name 
 * @returns {Object|null}
 */
const getCachedData = (name) => {
    try {
        const str = localStorage.getItem(`cache_${name}`)

        if (str) {
            const item = JSON.parse(str)

            if (item.data && item.time) {
                const current_time = Date.now() / 1000
                if (current_time - item.time < CACHE_LIFE) {
                    return item.data
                }
            }
        }
    }
    catch (err) {
        console.log(err)
    }

    return null
}

/**
 * @param {string} name 
 * @param {Object} data 
 */
const setCachedData = (name, data) => {
    try {
        const str = JSON.stringify({ data, time: Date.now() / 1000 })
        localStorage.setItem(`cache_${name}`, str)
    }
    catch (err) {
        console.log(err)
    }
}

/**
 * @param {string} name Repository name
 * @returns {Promise<Object>}
 */
export const getReleaseData = async (name) => {
    const cached_data = getCachedData(name)

    if (cached_data)
        return cached_data

    let res = await fetch(`https://api.github.com/repos/scfmod/${name}/releases/latest`)
    if (!res.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
    }
    const res_data = await res.json()
    const data = {
        name: res_data.name,
        published_at: res_data.published_at,
        body: res_data.body,
    }

    setCachedData(name, data)

    return data
}