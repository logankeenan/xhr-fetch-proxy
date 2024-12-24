# xhr-fetch-proxy

A proxy for XMLHttpRequest (XHR) that uses the Fetch API under the hood

## Why does this even exist?

htmx uses XHR to make network requests. This becomes a problem if you want to allow htmx
to call an async function instead of making a network call. By proxying XHR with fetch, we can intercept network calls
and call an async function instead of making the network call.

## But why would you even want that?

This allows you to use htmx with a local-first "backend" without Internet. It also enables you to use htmx when
integrating with Tauri and Axum.