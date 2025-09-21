// repository-item

import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js'
import picoStylesheet from './../pico.min.css' with { type: 'css' }
import tablerStylesheet from 'https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/3.35.0/tabler-icons.min.css' with {type: 'css'}

export class RepositoryItem extends LitElement {
    static styles = [
        picoStylesheet,
        tablerStylesheet,
        css`
            header {
                font-size: 140%;
            }

            footer {
                display: flex;
                justify-items: flex-start;
                column-gap: 24px;
            }

            .links-container {
                display: flex;
                justify-items: flex-start;
                column-gap: 24px;
            }

            .release-data {
                background-color: var(--pico-background-color);
                padding: 16px;
                margin: 16px 0;
            }
        `
    ]

    static properties = {
        name: { type: String },
        filename: { type: String },
        discussions: { type: String }
    }

    render() {
        const discussions_link = this.discussions === "true" ? html`<a href="https://github.com/scfmod/${this.name}/discussions" class="secondary discussions-link">
                        <i class="ti ti-messages"></i> Discussions
                    </a>` : ''

        return html`
            <article>
                <header>${this.name}</header>

                <a href="https://github.com/scfmod/${this.name}/releases/latest/download/${this.filename}" class="download-link">
                    <i class="ti ti-download"></i>
                    Download latest version
                </a>

                <div class="release-data">
                    <repository-release-data name="${this.name}" />
                </div>

                <footer>
                    <a href="https://github.com/scfmod/${this.name}" class="secondary repo-link">
                        <i class="ti ti-brand-github"></i> Repository
                    </a>
                    <a href="https://github.com/scfmod/${this.name}/issues" class="secondary issues-link">
                        <i class="ti ti-circle-dot"></i> Issues
                    </a>
                    ${discussions_link}
                    <a href="https://github.com/scfmod/${this.name}/releases" class="secondary releases-link">
                        <i class="ti ti-files"></i> Releases
                    </a>
                </footer>
            </article>
        `
    }
}

customElements.define('repository-item', RepositoryItem)