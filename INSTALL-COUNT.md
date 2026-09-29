# Anonymous first-launch count

`POST /api/install` accepts an empty request body and increments one aggregate
counter in the Pages D1 binding named `INSTALLS_DB`. It returns `{"ok":true}`
when the counter is incremented, and a generic error response if the binding or
counter is unavailable. The handler does not inspect or store personal data.

This is a count of accepted first-launch reports, not verified unique users,
devices, or completed installations. A client can report more than once (for
example, after reinstalling or by making repeated requests). Cloudflare
processes network metadata, such as the request's source IP address, to handle
requests; this function does not write that metadata to D1.

## Initialize the D1 counter

In the D1 database Console, run:

```sql
CREATE TABLE IF NOT EXISTS install_counts (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0)
);

INSERT OR IGNORE INTO install_counts (id, total) VALUES (1, 0);
```

## Cloudflare setup

1. In the Cloudflare dashboard, open **Storage & databases → D1 SQL Database**
   and create a database. Use any database name you choose; no database
   credentials are needed for this binding.
2. Open the database's **Console** and run the SQL above.
3. Open **Workers & Pages**, select the Echo Pages project, then go to
   **Settings → Bindings → Add → D1 database bindings**.
4. Set **Variable name** to `INSTALLS_DB`, select the database you created,
   and save.
5. Deploy the site again so the binding is available to the Function.

## Deploying this Pages Function

This site uses Direct Upload, which does not compile a `functions/` directory
when deployed with dashboard drag-and-drop. The prepared deployment bundle has
the website in `public/` and the Function in `functions/`; deploy it with
Wrangler after connecting to Cloudflare (`npx wrangler login`):

```sh
npx wrangler pages deploy public --project-name echo
```

Run that command from the extracted `echo-pages-function-deploy` folder.
Wrangler uses the `functions/` directory at that folder's root. The project is
named `echo`; `echo-2ve.pages.dev` is its domain. After deployment, the endpoint
is:

```text
https://echo-2ve.pages.dev/api/install
```

If you later attach a custom domain, the endpoint will also be available at
`https://<your-custom-domain>/api/install`.
