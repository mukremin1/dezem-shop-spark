# pin-actions-shas.ps1
# Açıklama: actions/* tag'lerini full commit SHA'larına çevirir,
# .github/workflows/deploy.yml dosyasını yedekleyip günceller,
# yeni branch oluşturur, commit/push yapar ve gh CLI varsa PR açar.
# Kullanım (repo kökünde PowerShell ile):
#   Optional: $env:GITHUB_TOKEN = "ghp_..."  # opsiyonel, rate limit ve erişim için
#   PowerShell -ExecutionPolicy Bypass -File .\pin-actions-shas.ps1

function Invoke-GhApi {
    param([string]$Url)
    $headers = @{ 'User-Agent' = 'pwsh-pin-script' }
    if ($env:GITHUB_TOKEN -and $env:GITHUB_TOKEN.Trim() -ne '') {
        $headers['Authorization'] = "Bearer $($env:GITHUB_TOKEN)"
    }
    return Invoke-RestMethod -Uri $Url -Headers $headers -ErrorAction Stop
}

function Get-FullCommitSha {
    param([string]$Owner, [string]$Repo, [string]$Tag)
    Write-Host "Resolving $Owner/$Repo@$Tag ..." -ForegroundColor Cyan
    try {
        $ref = Invoke-GhApi "https://api.github.com/repos/$Owner/$Repo/git/refs/tags/$Tag"
    } catch {
        Write-Host "ERROR: tag $Tag not found for $Owner/$Repo" -ForegroundColor Red
        return $null
    }
    $objectSha = $ref.object.sha

    try {
        $tagObj = Invoke-GhApi "https://api.github.com/repos/$Owner/$Repo/git/tags/$objectSha"
        if ($null -ne $tagObj.object -and $tagObj.object.sha) {
            $commitSha = $tagObj.object.sha
            Write-Host " -> annotated tag resolved to commit $commitSha"
            return $commitSha
        } else {
            Write-Host " -> lightweight tag, commit $objectSha"
            return $objectSha
        }
    } catch {
        Write-Host " -> using ref sha $objectSha (couldn't resolve annotated tag object)"
        return $objectSha
    }
}

# --- Tags to resolve (adjust if you use different tags) ---
$lookups = @(
    @{ owner='actions'; repo='checkout'; tag='v4' },
    @{ owner='actions'; repo='setup-node'; tag='v4.11.0' },  # preferred
    @{ owner='actions'; repo='setup-node'; tag='v4' },       # fallback
    @{ owner='actions'; repo='upload-pages-artifact'; tag='v1' },
    @{ owner='actions'; repo='deploy-pages'; tag='v1' }
)

$results = @{}
foreach ($entry in $lookups) {
    $repoKey = "$($entry.owner)/$($entry.repo)"
    if ($results.ContainsKey($repoKey)) { continue }
    $sha = Get-FullCommitSha -Owner $entry.owner -Repo $entry.repo -Tag $entry.tag
    if ($sha) { $results[$repoKey] = $sha } else { Write-Warning "Could not resolve $repoKey@$($entry.tag)" }
}

if ($results.Count -eq 0) { Write-Error "No SHAs resolved. Aborting."; exit 1 }

Write-Host "`nResolved SHAs:"
$results.GetEnumerator() | ForEach-Object { Write-Host "$($_.Key) -> $($_.Value)" }

# --- Update workflow file ---
$workflowPath = ".github/workflows/deploy.yml"
if (-not (Test-Path $workflowPath)) { Write-Error "Workflow file not found at $workflowPath. Run this script from the repo root."; exit 1 }

$content = Get-Content $workflowPath -Raw

# Ensure dist is used
if ($content -notmatch 'path:\s*\.\/dist') {
    # Replace build -> dist if present
    $content = $content -replace 'path:\s*\.\/build', 'path: ./dist'
}

# Replace short uses with resolved SHAs
if ($results.ContainsKey('actions/checkout')) {
    $content = $content -replace 'actions/checkout@[^\s\r\n]+', "actions/checkout@$($results['actions/checkout'])"
}
if ($results.ContainsKey('actions/setup-node')) {
    $content = $content -replace 'actions/setup-node@[^\s\r\n]+', "actions/setup-node@$($results['actions/setup-node'])"
}
if ($results.ContainsKey('actions/upload-pages-artifact')) {
    $content = $content -replace 'actions/upload-pages-artifact@[^\s\r\n]+', "actions/upload-pages-artifact@$($results['actions/upload-pages-artifact'])"
}
if ($results.ContainsKey('actions/deploy-pages')) {
    $content = $content -replace 'actions/deploy-pages@[^\s\r\n]+', "actions/deploy-pages@$($results['actions/deploy-pages'])"
}

# Backup and write
$bak = "$workflowPath.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))"
Copy-Item $workflowPath $bak -Force
Set-Content -Path $workflowPath -Value $content -Encoding utf8
Write-Host "Workflow updated and backup saved to $bak" -ForegroundColor Green

# --- Git operations ---
$branchName = "ci/pin-actions-sha"
git fetch origin
# create or checkout branch from main
if ((git ls-remote --heads origin $branchName) -ne $null) {
    git checkout $branchName
} else {
    git checkout -b $branchName
}

git add $workflowPath
git commit -m "ci: pin actions to full commit SHAs to satisfy repo policy" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "No changes to commit (maybe already updated)." -ForegroundColor Yellow
} else {
    git push -u origin $branchName
    Write-Host "Pushed branch $branchName to origin." -ForegroundColor Green
}

# --- Create PR if gh CLI available ---
if (Get-Command gh -ErrorAction SilentlyContinue) {
    try {
        gh pr create --title "ci: pin actions to full commit SHAs" `
                     --body "Pin actions to full SHAs to satisfy repo policy and avoid tarball resolution errors." `
                     --base main --head $branchName
        Write-Host "PR created via gh CLI (or interactive prompt shown)." -ForegroundColor Green
    } catch {
        Write-Warning "gh pr create failed or requires interactive auth. Branch pushed; create PR in web UI."
    }
} else {
    Write-Host "gh CLI not found. Branch pushed but PR not created. Open a PR in the web UI from $branchName to main." -ForegroundColor Yellow
}
