# Synchronization roadmap

The MVP **does not submit or synchronize data**. Local draft persistence and server submission are separate operations. A future queue should include idempotency keys, server-side validation, explicit confirmation, retry backoff, and conflict handling. Never interpret a saved local draft as a successful server submission.
