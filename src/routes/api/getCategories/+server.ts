import {json, type RequestHandler} from "@sveltejs/kit";

export let GET: RequestHandler = async () => {
    return json(['Tech', 'AI', 'Crypto'])
}
