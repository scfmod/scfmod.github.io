import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js'
import { unsafeHTML } from 'https://cdn.jsdelivr.net/npm/lit-html@3.3.1/directives/unsafe-html.min.js'

import picoStylesheet from './../pico.min.css' with { type: 'css' }
import { getReleaseData } from '../gh-api.js'

const dateFormat = (value) => {
    const date = new Date(value)
    const minutes = Math.floor((Date.now() / 1000 - date.getTime() / 1000) / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 30)
        return date.toLocaleString()
    else if (days > 0)
        return html`${date.toLocaleString()} <span>(${days} days ago)</span>`
    else if (hours > 0)
        return html`${date.toLocaleString()} <span>(${hours} hours ago)</span>`
    else if (minutes > 0)
        return html`${date.toLocaleString()} <span>(${minutes} minutes ago)</span>`

    return `${date.toLocaleString()} (just now)`
}

export class RepositoryReleaseData extends LitElement {

    static styles = [
        picoStylesheet,
        css`

        .release-data {
            background-color: var(--pico-background-color);
            padding: 16px;
            margin: 16px 0;
        }

        .release-table {
            max-width: 500px;
            font-size: 80%;
        }

        .release-data-progress {
            margin-bottom: 2px;
        }

        .release-table th {
            font-weight: bold;
        }
        
        .release-table span {
            color: rgb(255,255,255,0.4);
        }
            
        .release-notes {
            font-size: 80%;
            padding-left: 16px;
            margin-bottom: 0;
        }

        .release-data-progress {
            margin-bottom: 2px;
        }

    `
    ]

    static properties = {
        name: { type: String },
        data: { type: Object },
        fetching: { type: Boolean },
        error: { type: Object },
    }

    constructor() {
        super()
        this.data = null
        this.fetching = true
        this.error = null
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchData()
    }

    async fetchData() {
        try {
            this.data = await getReleaseData(this.name)
        } catch (e) {
            this.error = e
        }
        this.fetching = false
    }

    render() {
        if (this.error) {
            return html`<div class="error">Could not retrieve information from GitHub: ${this.error.message}</div>`
        }
        if (this.fetching) {
            return html`<progress class="release-data-progress" />`
        }

        const release_date = dateFormat(this.data.published_at)
        const release_notes = this.data.body.replace(/\(https:\/\/github\.com\/.*?\)/g, '').replace(/\r\n/g, '<br>')

        return html`
            <div>
                <table class="release-table">
                    <tbody>
                        <tr>
                            <th>Version</th>
                            <td><a href="https://github.com/scfmod/${this.name}/releases/latest" class="secondary">${this.data.name}</a></td>
                        </tr>
                        <tr>
                            <th>Published</th>
                            <td>${release_date}</td>
                        </tr>
                    </tbody>
                </table>

                <p class="release-notes">
                    ${unsafeHTML(release_notes)}
                </p>
            </div >
    `
    }

}

customElements.define('repository-release-data', RepositoryReleaseData)