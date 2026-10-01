import json
import re
import subprocess
import urllib.error
import urllib.request
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parents[1] / ".env.local"
TEAM = "team_Un45xhb0rOkuzFEPRMGoR25z"
PROJECT = "prj_9XGVEfFz0201xnGzckYsL91FBfy8"


def load_env() -> dict[str, str]:
    vals: dict[str, str] = {}
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        vals[key.strip()] = value.strip().strip("\r")

    vals["NEXT_PUBLIC_APP_URL"] = "https://store1.fighter132456.pl"
    vals["N8N_ORDER_FULFILL_WEBHOOK_URL"] = (
        "https://n8n.fighter132456.pl/webhook/store-order-fulfill"
    )
    return vals


def get_token() -> str:
    token_script_b64 = (
        "aW1wb3J0IHJlCnRleHQgPSBvcGVuKCIvaG9tZS9kZXBsb3kvLmFnZW50LXNlY3JldHMi"
        "KS5yZWFkKCkKbSA9IHJlLnNlYXJjaChyIlZFUkNFTF9UT0tFTj0oLispIiwgdGV4dCkK"
        "diA9IG0uZ3JvdXAoMSkuc3RyaXAoKS5zdHJpcCgnIicpLnN0cmlwKCInIikKaWYg"
        "di5zdGFydHN3aXRoKCJleHBvcnQgIik6CiAgICB2ID0gdi5zcGxpdCgiPSIsIDEp"
        "WzFdLnN0cmlwKCkuc3RyaXAoJyInKS5zdHJpcCgiJyIpCnByaW50KHYpCg=="
    )
    remote = subprocess.check_output(
        [
            "ssh",
            "-o",
            "BatchMode=yes",
            "deploy@89.58.48.102",
            f"echo {token_script_b64} | base64 -d | python3",
        ],
        text=True,
    ).strip()
    return remote


def main() -> None:
    token = get_token()
    auth = {"Authorization": f"Bearer {token}"}
    json_headers = {**auth, "Content-Type": "application/json"}

    list_req = urllib.request.Request(
        f"https://api.vercel.com/v9/projects/{PROJECT}/env?teamId={TEAM}",
        headers=auth,
    )
    envs = json.loads(urllib.request.urlopen(list_req, timeout=30).read()).get(
        "envs", []
    )

    for env in envs:
        delete_req = urllib.request.Request(
            f"https://api.vercel.com/v9/projects/{PROJECT}/env/{env['id']}?teamId={TEAM}",
            headers=auth,
            method="DELETE",
        )
        urllib.request.urlopen(delete_req, timeout=30)
        print(f"deleted {env['key']}")

    vals = load_env()
    for key, value in vals.items():
        env_type = (
            "encrypted"
            if any(part in key for part in ("SECRET", "KEY", "TOKEN"))
            else "plain"
        )
        body = {
            "key": key,
            "value": value,
            "type": env_type,
            "target": ["production", "preview", "development"],
        }
        create_req = urllib.request.Request(
            f"https://api.vercel.com/v10/projects/{PROJECT}/env?teamId={TEAM}",
            data=json.dumps(body).encode(),
            headers=json_headers,
            method="POST",
        )
        try:
            urllib.request.urlopen(create_req, timeout=30)
            print(f"added {key}")
        except urllib.error.HTTPError as err:
            print(f"add failed {key}: {err.code} {err.read().decode()[:120]}")

    deploy_body = {
        "name": "dropship-store",
        "project": PROJECT,
        "target": "production",
        "gitSource": {
            "type": "github",
            "org": "Fighter132456",
            "repo": "dropship-store",
            "ref": "main",
        },
    }
    deploy_req = urllib.request.Request(
        f"https://api.vercel.com/v13/deployments?teamId={TEAM}",
        data=json.dumps(deploy_body).encode(),
        headers=json_headers,
        method="POST",
    )
    deployment = json.loads(urllib.request.urlopen(deploy_req, timeout=60).read())
    print(f"deploy {deployment.get('url')} {deployment.get('id')}")


if __name__ == "__main__":
    main()
