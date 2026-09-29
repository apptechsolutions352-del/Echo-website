# Deploy Echo to Cloudflare Pages

This bundle includes the static website and both Linux downloads in `public/`,
plus its Pages Function in `functions/`. Extract the ZIP, open a terminal in
the extracted `echo-pages-function-deploy` folder, then run:

```sh
npx wrangler login
npx wrangler pages deploy public --project-name echo
```

The `INSTALLS_DB` D1 binding must first be configured on the Echo Pages project
in Cloudflare. See `INSTALL-COUNT.md` for the schema SQL and dashboard steps.

After a successful deployment, the Function endpoint is:

`https://echo-2ve.pages.dev/api/install`
