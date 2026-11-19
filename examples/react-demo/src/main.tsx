import React from "react";
import { createRoot } from "react-dom/client";
import { useOfflineForm } from "../../../src/useOfflineForm";
import "./style.css";

function App() {
  const form = useOfflineForm({
    key: "offlineform-demo-v1",
    initialValues: { name: "", message: "" },
    persistence: "local",
    maxAgeMs: 7 * 24 * 60 * 60 * 1000
  });
  const [submitted, setSubmitted] = React.useState(false);
  if (!form.ready) return <main><p>Restoring draft…</p></main>;
  return <main>
    <header><span className="eyebrow">BRAINTECHKEN / OPEN SOURCE</span><h1>OfflineForm</h1><p>Write something. Refresh. Your draft survives.</p></header>
    <section className="panel">
      <div className="status" role="status"><span className="dot"/> {form.status === "saved" ? "Draft saved on this device" : form.status === "error" ? "Draft could not be saved" : "Ready to write"}</div>
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
        <label htmlFor="name">Your name</label>
        <input id="name" value={form.values.name} placeholder="Alex" onChange={e => {form.setValue("name",e.target.value);setSubmitted(false);}}/>
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={6} value={form.values.message} placeholder="Write a draft…" onChange={e => {form.setValue("message",e.target.value);setSubmitted(false);}}/>
        <div className="actions"><button type="submit">Preview submission</button><button type="button" className="secondary" onClick={() => {form.clearDraft();setSubmitted(false);}}>Discard draft</button></div>
      </form>
      {submitted && <p className="notice" role="status">Demo only — no data was sent to a server.</p>}
    </section>
    <p className="footnote">Drafts are stored in this browser using localStorage. Do not enter sensitive information. Saving a draft is not a server submission.</p>
    <a href="https://github.com/Kencycoeur17/offlineform">View source on GitHub</a>
  </main>;
}
createRoot(document.getElementById("root")!).render(<App />);
