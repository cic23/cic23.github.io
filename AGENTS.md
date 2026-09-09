# CIC website

## Project intent

- Serve the CIC homepage at https://cic23.github.io/ from the cic23/cic23.github.io repository.
- Use Google Sheets as the database and Google Apps Script as the backend, managed with the user's existing clasp account.
- Follow the sample at https://cic-heritage-guide.donbkim.chatgpt.site/ and the requirements in https://chatgpt.com/c/6a9e4db6-0378-83ee-b9af-b8b5c2fe48b8 once their contents are available.
- Both reference URLs required login during initial inspection. Do not invent their contents or claim that a replacement reproduces the sample.
- The user supplied the complete reference/CIC_deployed_v2_source.zip. CRC and all 273 manifest hashes passed verification. The 18 original files match the bundled provenance for deployed version 2, source commit 2f9ad4c7a5b857e4ab513ab00c2b8b58bc896c67. The original is extracted under reference/extracted-v2/CIC-deployed-v2/CIC-original/. Preserve its design, text and images.
- Leave LLM-powered board translation for a subsequent phase. Preserve original post text when that feature is implemented.

## Working conventions

- Communicate with the user in Korean.
- Keep frontend assets suitable for static GitHub Pages hosting; keep server code in apps-script/.
- Keep credentials, OAuth tokens, API keys, and clasp authentication files out of Git and frontend code. Future LLM secrets belong in server-side Script Properties.
- Verify the active clasp account before creating or deploying Google resources.
- Keep database files private; expose only explicitly public content through the backend.
- Verify actual HTTP responses after deployment; deployment creation alone does not establish that the application is working.
- Record deployment instructions and unresolved prerequisites in README.md.
- Run node --test tests/backend.test.cjs tests/transport.test.cjs and syntax checks on dist/*.js before deployment.
- Keep reference/ local; it contains original archives and user-supplied documents, not publishing assets.
