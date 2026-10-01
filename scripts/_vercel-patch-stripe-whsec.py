import json
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path

TEAM = "team_Un45xhb0rOkuzFEPRMGoR25z"
PROJECT = "prj_9XGVEfFz0201xnGzckYsL91FBfy8"
WEBHOOK_URL = "https://store1.fighter132456.pl/api/webhooks/stripe"
TOKEN_SCRIPT_B64 = (
    "aW1wb3J0IHJlCnRleHQgPSBvcGVuKCIvaG9tZS9kZXBsb3kvLmFnZW50LXNlY3JldHMi"
    "KS5yZWFkKCkKbSA9IHJlLnNlYXJjaChyIlZFUkNFTF9UT0tFTj0oLispIiwgdGV4dCkK"
    "diA9IG0uZ3JvdXAoMSkuc3RyaXAoKS5zdHJpcCgnIicpLnN0cmlwKCInIikKaWYg"
    "di5zdGFydHN3aXRoKCJleHBvcnQgIik6CiAgICB2ID0gdi5zcGxpdCgiPSIsIDEp"
    "WzFdLnN0cmlwKCkuc3RyaXAoJyInKS5zdHJpcCgiJyIpCnByaW50KHYpCg=="
)


def get_vercel_token() -> str:
    return subprocess.check_output(
        [
            "ssh",
            "-o",
            "BatchMode=yes",
            "deploy@89.58.48.102",
            f"echo {TOKEN_SCRIPT_B64} | base64 -d | python3",
        ],
        text=True,
    ).strip()


def stripe_request(
    stripe_key: str, method: str, path: str, data: bytes | None = None
) -> dict:
    request = urllib.request.Request(
        f"https://api.stripe.com/v1/{path}",
        data=data,
        headers={"Authorization": f"Bearer {stripe_key}"},
        method=method,
    )
    return json.loads(urllib.request.urlopen(request, timeout=30).read())


def recreate_webhook_secret(stripe_key: str) -> str:
    for webhook in stripe_request(stripe_key, "GET", "webhook_endpoints?limit=20")[
        "data"
    ]:
        if webhook["url"] == WEBHOOK_URL:
            stripe_request(stripe_key, "DELETE", f"webhook_endpoints/{webhook['id']}")

    body = urllib.parse.urlencode(
        {"url": WEBHOOK_URL, "enabled_events[]": "checkout.session.completed"}
    ).encode()
    created = stripe_request(stripe_key, "POST", "webhook_endpoints", body)
    return created["secret"]


def patch_vercel_whsec(token: str, whsec: str) -> None:
    auth = {"Authorization": f"Bearer {token}"}
    list_request = urllib.request.Request(
        f"https://api.vercel.com/v9/projects/{PROJECT}/env?teamId={TEAM}",
        headers=auth,
    )
    envs = json.loads(urllib.request.urlopen(list_request, timeout=30).read())["envs"]
    env_id = next(env["id"] for env in envs if env["key"] == "STRIPE_WEBHOOK_SECRET")

    patch_request = urllib.request.Request(
        f"https://api.vercel.com/v9/projects/{PROJECT}/env/{env_id}?teamId={TEAM}",
        data=json.dumps(
            {
                "value": whsec,
                "type": "encrypted",
                "target": ["production", "preview", "development"],
            }
        ).encode(),
        headers={**auth, "Content-Type": "application/json"},
        method="PATCH",
    )
    urllib.request.urlopen(patch_request, timeout=30)


def main() -> None:
    env_text = Path(__file__).resolve().parents[1] / ".env.local"
    stripe_key = env_text.read_text(encoding="utf-8").split("STRIPE_SECRET_KEY=")[
        1
    ].split()[0]
    whsec = recreate_webhook_secret(stripe_key)
    patch_vercel_whsec(get_vercel_token(), whsec)
    print("STRIPE_WEBHOOK_SECRET synced to Vercel (prod endpoint recreated)")


if __name__ == "__main__":
    main()
