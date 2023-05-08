import type {RequestHandler} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";
import {ratelimit} from "../ratelimit";
import {scrapeNext} from "../scrapeNext";

export let GET: RequestHandler = async ({getClientAddress, url}) => {
    ratelimit(getClientAddress())
    let nl = url.searchParams.get('nl')

    try {
        let res = await scrapeNext(`/${nl}/archives`)
        if (res.ssr_data.page === '/404') return json([])
        return json(res.ssr_data.props.pageProps.campaigns.map((e: any) => ({
            subject: e.subject,
            date: e.date
        })))
    } catch (e) {
        return json([])
    }
}
