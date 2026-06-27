# Performance And Security Notes

## Performance

- Keep message list queries paginated.
- Avoid hydrating large histories into client state on first load.
- Send incremental socket updates for new messages instead of full room snapshots.
- Debounce or batch noisy client events such as typing indicators.

## Security

- Re-check room membership before reading history or broadcasting messages.
- Avoid exposing internal database identifiers when a stable public identifier is enough.
- Validate uploaded metadata and file references before storing or rendering them.
- Log sensitive failures on the server, but avoid leaking internals to the client response.
