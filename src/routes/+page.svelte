<script>
    import {onMount} from "svelte";

    let l = '[Loading...]'
    let cats = l
    let cat = l
    let eds = l
    let ed = l
    let news = l

    onMount(async () => {
        let cats_res = await fetch(`/api/getCategories`)
        cats = await cats_res.json()
        cat = cats[Math.floor(Math.random()*cats.length)]

        let eds_res = await fetch(`/api/getLatestEditions?nl=${cat}`)
        eds = await eds_res.json()
        ed = eds[Math.floor(Math.random() * eds.length)].date

        let news_res = await fetch(`/api/getNewsletter?nl=${cat}&date=${ed}`)
        news = await news_res.json()
    })
</script>

<h1>TL;DR API</h1>

<code>/api/getCategories</code>

<pre>{JSON.stringify(cats, null, 2)}</pre>

<code>/api/getLatestEditions?nl=<b>{cat}</b></code>

<pre>{JSON.stringify(eds, null, 2)}</pre>

<code>/api/getNewsletter?nl=<b>{cat}</b>&date=<b>{ed}</b></code>

<pre>{JSON.stringify(news, null, 2)}</pre>
