import type {RequestHandler} from './$types'
import {ratelimit} from "../ratelimit";
import {json} from "@sveltejs/kit"
import {scrapeNext} from "../scrapeNext";
import {categories} from "../newsletterData";

// bro has lost his touch
// he is back in the saddle
// bro has a firm grip on his touch

interface RawNewsletter {
    date: string,
    subject: string,
    stories: Story[]
}

interface Story {
    id: number
    url: string
    title: string
    info: string
    tldr: string
    category: string
}

interface CategorizedNewsletter {
    date: string,
    subject: string
    categories: Array<{
        emoji: string,
        title: string,
        stories: CategorizedStory[]
    }>
}

interface CategorizedStory {
    url: string
    title: string
    info: string
    tldr: string
}

export let GET: RequestHandler = async ({getClientAddress, url}) => {
    ratelimit(getClientAddress())

    let nl = url.searchParams.get('nl')
    let date = url.searchParams.get('date')

    try {
        let res = await scrapeNext(`/${nl}/${date}`)

        let data = res.ssr_data.props.pageProps as RawNewsletter

        data.stories.forEach(e => {
            e.url = e.url.trim().replace(/&*utm_source=[^&]+/, '').replace(/\?$/, '')
            let infoMatch = e.title.match(/ \((.+?)\)$/)
            if (infoMatch) {
                e.info = infoMatch[1]
                e.title = e.title.replace(infoMatch[0], '')
            } else {
                e.title = ''
            }
        })

        let categorized: CategorizedNewsletter = {
            date: data.date, subject: data.subject, categories: []
        }

        let currentCat = '_'

        data.stories
            .filter(e => !e.category.toLowerCase().includes('sponsor') &&
                !e.info.toLowerCase().includes('sponsor'))
            .sort((a, b) => a.id - b.id)
            .forEach(e => {
                if (e.category !== currentCat) {
                    currentCat = e.category
                    categorized.categories.push({
                        ...(categories[e.category]),
                        stories: []
                    })
                }
                categorized.categories[categorized.categories.length - 1].stories.push({
                    url: e.url,
                    title: e.title,
                    tldr: e.tldr,
                    info: e.info
                })
            })

        return json(categorized)
    } catch (e) {
        console.log("err", e)
        let res: CategorizedNewsletter = {
            date: date || '(no date)',
            subject: "Could not load this newsletter :(",
            categories: []
        }
        return json(res)
    }
}
