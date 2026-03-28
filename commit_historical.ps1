$ErrorActionPreference = "Stop"

$statusOutput = git status --porcelain
foreach ($line in $statusOutput) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $file = $line.Substring(3).Trim()
    
    if ($file.StartsWith('"') -and $file.EndsWith('"')) {
        $file = $file.Substring(1, $file.Length - 2)
    }

    if (Test-Path $file) {
        $lastWrite = (Get-Item $file).LastWriteTime
        $dateString = $lastWrite.ToString("s") # ISO 8601 string sortable
        $rfc2822Date = $lastWrite.ToString('r') # RFC1123 format which git accepts nicely
        
        Write-Host "Committing $file with date $rfc2822Date"
        
        git add $file
        
        $env:GIT_AUTHOR_DATE = $dateString
        $env:GIT_COMMITTER_DATE = $dateString
        
        $commitMsg = "Update $file based on historical changes"
        
        git commit -m $commitMsg --date="$dateString"
    }
}

git push origin HEAD
