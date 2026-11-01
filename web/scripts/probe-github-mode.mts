// What docugoat-classic shows in GitHub mode (as the Pages build is configured) with no sign-in.
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body><div id=root></div></body></html>", { url: "https://redcloudinfosec.com/docugoat-classic/new", pretendToBeVisual: true });
const W: any = dom.window;
for (const k of ["window", "document", "EventTarget", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement", "Node", "Element", "Text", "Range", "DOMParser", "MutationObserver", "getComputedStyle", "DocumentFragment", "NodeFilter", "Selection", "Event", "CustomEvent", "KeyboardEvent", "MouseEvent", "navigator", "localStorage", "sessionStorage", "location"]) { try { Object.defineProperty(globalThis, k, { value: W[k], configurable: true, writable: true }); } catch {} }
(globalThis as any).requestAnimationFrame = (cb: () => void) => setTimeout(cb, 0); (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
W.document.createRange = () => ({ setStart() {}, setEnd() {}, getBoundingClientRect: () => ({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 }), getClientRects: () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} }) });
W.scrollTo = () => {}; W.HTMLElement.prototype.scrollIntoView = () => {};
const calls: string[] = [];
globalThis.fetch = (async (url: any) => { calls.push(String(url)); return new Response(JSON.stringify({ error: "should not be called" }), { status: 500 }); }) as any;

const React = await import("react"); const { act } = React as any;
const { createRoot } = await import("react-dom/client");
const { createMemoryRouter, RouterProvider } = await import("react-router-dom");
const { AppShell } = await import("../src/components/AppShell");
const { Compose } = await import("../src/pages/Compose");
const { Account } = await import("../src/pages/Account");
const { BACKEND, GH_BASE } = await import("../src/lib/config");
console.log("BACKEND =", BACKEND, "store =", `${GH_BASE.owner}/${GH_BASE.repo}`);
const routes = [{ element: React.createElement(AppShell), children: [{ path: "/new", element: React.createElement(Compose) }, { path: "/account", element: React.createElement(Account) }] }];
const router = createMemoryRouter(routes, { initialEntries: ["/new"] });
const container = W.document.getElementById("root"); const root = createRoot(container);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
await act(async () => { root.render(React.createElement(RouterProvider, { router })); await sleep(300); });
const text = () => container.textContent ?? "";
const links = [...container.querySelectorAll("a")].map((a) => a.textContent?.trim());
console.log("nav links:", links.filter(Boolean).join(" | "));
assert.ok(links.some((l) => /Sign in/.test(l ?? "")), "Sign in link in nav");
const seal = [...container.querySelectorAll("button")].find((b) => /Seal & get codes/.test(b.textContent ?? ""))!;
await act(async () => { seal.click(); await sleep(200); });
console.log("after Seal click, toast/banner text:", /Sign in first[^.]*\./.exec(text())?.[0] ?? "(none)");
console.log("network calls made:", calls.length);
assert.match(text(), /Sign in first/); assert.equal(calls.length, 0);
console.log("\nCLASSIC GITHUB MODE: Sign in link present; Seal without sign-in shows the sign-in prompt and touches no relay");
await act(async () => root.unmount()); process.exit(0);
