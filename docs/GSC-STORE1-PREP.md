# GSC prep — store1.fighter132456.pl

**Status (2026-10-01):** org zone `fighter132456.pl` verified in GSC (`~/.agent-provisioned-gsc.json`).  
Store1 has a dedicated property in registry: `sc-domain:store1.fighter132456.pl`.

## CEO steps (DNS-only — no paid tools)

1. **Search Console** → Add property → **URL prefix**  
   `https://store1.fighter132456.pl/`
2. Verify via **HTML tag** or **DNS TXT** on subdomain (Cloudflare):
   - Type: `TXT`
   - Name: `store1` (or `@` if using URL-prefix HTML tag on Vercel instead)
   - Value: token from GSC verification wizard
3. After verified → **Sitemaps** → submit `https://store1.fighter132456.pl/sitemap.xml`
4. **Rich results:** homepage serves `FAQPage` JSON-LD (`/#faq`); validate in [Rich Results Test](https://search.google.com/test/rich-results). Product URLs emit `Product` + `Offer` when catalog is populated.
5. **Merchant Center:** not in pilot scope; when products go live, feed must match on-page `Product` schema (PLN, absolute image URLs ≥800px, `InStock`/`OutOfStock` aligned with inventory).
6. Optional auto path (when `AGENT_AUTO_PROVISION=1` + CF token set):

```bash
# On VPS — after projects.yaml gsc_property is real (not .example)
bash ~/agent-deploy/scripts/provision-gsc-property.sh --dry-run
bash ~/agent-deploy/scripts/provision-gsc-property.sh
```

## Notes

- Org-level `sc-domain:fighter132456.pl` covers subdomains for aggregate reporting; dedicated store1 property improves URL-level data.
- store2 stays paused until Vercel Pro + DNS — do not add `store2.fighter132456.pl` to GSC yet.
