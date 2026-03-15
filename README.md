# JobAgent

Portfolio and agent for **Brandon Hixson — Full Stack Developer**. Includes a personal portfolio site and an agent for **job search** (e.g. LinkedIn, Dice) and **freelance work** (e.g. Upwork, Fiverr). Two tasks kept separate; checks for new postings every 12 hours; resume from a base file (latest `*_v<int>.doc*`), backed up to `/career/AgentSync`.

## Quick start

1. **Copy env**  
   `cp .env.example .env` — set `PRIMARY_EMAIL`; keep credentials in your vault, not in `.env`.

2. **Seed resume (optional)**  
   Put your base resume (e.g. `PortFolioBHixson_Resume_v25c.docx`) in `resumes/` so the image can use it, or bind-mount it at run.

3. **Build and run with Docker**  
   ```bash
   docker compose build
   docker compose up -d
   ```  
   Backup dir: mount a host path as `/career` so `AgentSync` persists (see below).

## Env vars

| Variable | Description | Default |
|----------|-------------|--------|
| `PRIMARY_EMAIL` | Account email for all sources | `brandon.hixson@aracnatech.com` |
| `RESUME_DIR` | In-image resume directory | `/app/resumes` |
| `CAREER_BACKUP_PATH` | Backup target (AgentSync parent) | `/career/AgentSync` |
| `BACKUP_QUEUE_MAX_GB` | Max queue size when backup unavailable | `1` |

| `FREELANCER_OAUTH_TOKEN` | OAuth token for Freelancer.com API | — |

Credentials for LinkedIn, Dice, Upwork, Fiverr, etc. must be supplied from your vault (e.g. env vars set at runtime); never commit them.

## Mounting `/career` for AgentSync

So backups persist on the host:

```bash
docker compose run -v ./career:/career jobagent
```

Or in `docker-compose.yml` (already present):

```yaml
volumes:
  - ./career:/career
```

Backup writes go to `/career/AgentSync`. If `/career` is unavailable, writes are queued (max 1 GB) until the connection is reestablished.

## Project layout

- `app/job_search/` — Task 1: job sources, scheduler, models.
- `app/freelance/` — Task 2: freelance sources, scheduler, models.
- `app/resume/` — Resume detector, storage, backup_sync (shared).
- `app/common/` — Config, logging.
- `config/` — `default.yaml`, `resume.yaml`.
- `resumes/` — In-image resume files (or mount at run).
- `data/` — Persistent store per task; backup queue when needed.

See **GUARDRAILS.md** for scope, file structure, and commitment.

## Freelancer.com integration

The first API-based source. Uses the official Freelancer.com REST API (no scraping).

**Setup:**

1. Register an app at [accounts.freelancer.com/settings/create_app](https://accounts.freelancer.com/settings/create_app)
2. Get your OAuth token after approval
3. Set `FREELANCER_OAUTH_TOKEN` in `.env` or supply from vault at runtime

**Configure** in `config/default.yaml`:

```yaml
freelancer:
  enabled: true
  search_queries:
    - "python"
    - "automation"
  min_budget: null       # optional USD filter
  max_budget: null
  results_per_query: 20
  max_age_hours: 24      # only projects updated in last N hours
```

`search_queries` is user-defined — add your own skills/keywords. The adapter iterates each query, deduplicates results, and persists new gigs to `data/freelance/` as timestamped JSON files. Previously seen projects are tracked in `data/freelance/freelancer_seen.json` to avoid duplicates across cycles.

**Run tests in Docker:**

```bash
docker compose run --rm --entrypoint sh \
  -v ./tests:/app/tests jobagent \
  -c "pip install -q pytest && python -m pytest tests/ -v"
```

## Test resume and backup

Create a test copy of the base resume (filename includes `_test`) and sync to backup:

```bash
# From project root; ensure a base resume exists in resumes/ (e.g. *_v25.docx)
python scripts/create_test_resume_and_backup.py
```

In Docker (with a base resume in the image or mounted at `/app/resumes`):

```bash
docker exec jobagent-jobagent-1 python /app/scripts/create_test_resume_and_backup.py
```

The script creates `{base_stem}_test{suffix}` (e.g. `PortFolioBHixson_Resume_v25c_test.docx`) and syncs all resume files to the backup dir. It prints the **exact backup path** and the list of files written there.

**Where to find the backup**
- **Default (until you change it):** **`/Volumes/MachineWorld/Career/AgentSync`** — set in `config/resume.yaml` and in Docker via the `CAREER_VOLUME_PATH` mount.
- **Docker:** The compose file mounts `/Volumes/MachineWorld/Career` at `/career` so backup in the container (`/career/AgentSync`) is the same path on your Mac. Override the host path with `CAREER_VOLUME_PATH` in `.env` if needed.
- **Local run:** Default backup is `/Volumes/MachineWorld/Career/AgentSync`. Override with `CAREER_BACKUP_PATH` in `.env`. Put a base resume in `resumes/` (or set `RESUME_DIR`).

**Backup only (no test file):**  
`python scripts/create_test_resume_and_backup.py --backup-only`  
Syncs whatever is in the resume dir to the backup path.

## Version

Track notable changes in **CHANGELOG.md**.
