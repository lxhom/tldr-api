import {JSDOM} from "jsdom";
import {init} from "svelte/internal";

let baseURL = 'https://tldr.tech'

let cache: Map<string, {content: string, date: Date}> = new Map
let TTL = 1000 * 60 * 60

export async function scrapeNext(url: string) {
    let init_text = ""
    let cache_hit = cache.get(url)
    if (cache_hit && Math.abs(cache_hit.date.valueOf() - Date.now()) < TTL) {
        init_text = cache_hit.content
    } else {
        let res = await fetch(baseURL + url)
        init_text = await res.text()
        cache.set(url, {date: new Date, content: init_text})
    }

    let init_dom = new JSDOM(init_text)

    function query(q: string) {
        return init_dom.window.document.querySelector(q);
    }

    let rendered_html = query("#__next")!
    let ssr_data = JSON.parse(query("#__NEXT_DATA__")!.textContent!)

    return {rendered_html, ssr_data}
}
