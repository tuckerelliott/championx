import { createOptimizedPicture } from '../../scripts/aem.js'

export default async function decorate(block) {
    const { href } = block.firstElementChild.querySelector('a')
    const resp = await fetch(href) 
    if (resp.ok) {
        const { data } = await resp.json()
        const teasers = data.map(({ path, image, lastModified, title, description, theme}) => {
            const picture = createOptimizedPicture(image, '', false, [{ width: 400 }])
            return `
                <a href="${path}" title="${title}" class="recent-article">
                    <h3>NEWS</h3>
                    <h4>${title}</h4>
                    <p>${description}</p>
                </a>`
        });
       block.innerHTML = `<ul>${teasers.map(teaser => `<br><li>${teaser}</li>`).join('\n')}</ul>`
     //   block.innerHTML = `<div>${teasers.map(teaser => `<div>${teaser}<//div>`).join('\n')}</div>`
    } else {
        block.remove()
    }
}