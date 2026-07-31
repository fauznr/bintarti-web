$logFile = "C:\Users\Administrator\.gemini\antigravity\brain\67233b6e-edc7-47f5-bb69-c9cc23439e69\.system_generated\logs\transcript_full.jsonl"

# Read all lines from transcript
$lines = Get-Content $logFile

# Find last USER_INPUT line with base64 image
$targetLine = $null
$targetLineNum = -1
for ($i = $lines.Count - 1; $i -ge 0; $i--) {
    $line = $lines[$i]
    if ($line -match '"type":"USER_INPUT"' -and $line -match 'data:image/jpeg;base64,') {
        $targetLine = $line
        $targetLineNum = $i
        Write-Output "Found at line $i in USER_INPUT"
        break
    }
}

if ($null -eq $targetLine) {
    for ($i = $lines.Count - 1; $i -ge 0; $i--) {
        $line = $lines[$i]
        if ($line -match 'data:image/jpeg;base64,') {
            $targetLine = $line
            $targetLineNum = $i
            Write-Output "Found at line $i in general lines"
            break
        }
    }
}

if ($null -ne $targetLine) {
    Write-Output "Line length: $($targetLine.Length)"
    
    # Let's inspect the matches of data:image/jpeg;base64
    $pattern = "data:image/jpeg;base64,([^`"]+)"
    if ($targetLine -match $pattern) {
        $b64 = $Matches[1]
        Write-Output "Extracted base64 length: $($b64.Length)"
        Write-Output "First 50 chars of b64: $($b64.Substring(0, [Math]::Min(50, $b64.Length)))"
        Write-Output "Last 100 chars of b64: $($b64.Substring($b64.Length - [Math]::Min(100, $b64.Length)))"
    } else {
        Write-Output "Pattern match failed"
    }
} else {
    Write-Output "No line found containing data:image/jpeg;base64"
}
