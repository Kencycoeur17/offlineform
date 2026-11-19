# Privacy and storage

Persistence is disabled by default. To enable browser localStorage, set `persistence: 'local'` explicitly. localStorage is shared by scripts on the same origin, may be cleared by the browser, and is not a secure vault. The library does not send data to a server. Avoid saving sensitive fields and consider explicit retention limits and user-facing draft deletion.
