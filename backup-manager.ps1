# Hotstar Extended - Backup Manager
# Interactive backup management system

param(
    [string]$Action = "menu"
)

function Show-Menu {
    Clear-Host
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "   Hotstar Extended - Backup Manager" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "1. Create new backup" -ForegroundColor Cyan
    Write-Host "2. List existing backups" -ForegroundColor Cyan
    Write-Host "3. Restore from backup" -ForegroundColor Cyan
    Write-Host "4. Delete old backups" -ForegroundColor Cyan
    Write-Host "5. Schedule automatic backups" -ForegroundColor Cyan
    Write-Host "6. Exit" -ForegroundColor Cyan
    Write-Host ""
}

function Create-Backup {
    Write-Host "Creating new backup..." -ForegroundColor Green
    
    $includeNodeModules = Read-Host "Include node_modules? (y/N)"
    $includeDist = Read-Host "Include dist folder? (Y/n)"
    $compress = Read-Host "Compress backup? (Y/n)"
    
    $params = @()
    if ($includeNodeModules -eq "y" -or $includeNodeModules -eq "Y") {
        $params += "-IncludeNodeModules"
    }
    if ($includeDist -ne "n" -and $includeDist -ne "N") {
        $params += "-IncludeDist"
    }
    if ($compress -ne "n" -and $compress -ne "N") {
        $params += "-Compress"
    }
    
    $command = ".\backup-script.ps1 $($params -join ' ')"
    Invoke-Expression $command
    
    Write-Host ""
    Read-Host "Press Enter to continue"
}

function List-Backups {
    Write-Host "Existing backups:" -ForegroundColor Green
    Write-Host ""
    
    $backups = Get-ChildItem -Path "." -Name "backup_*" | Sort-Object -Descending
    
    if ($backups.Count -eq 0) {
        Write-Host "No backups found." -ForegroundColor Yellow
    } else {
        $index = 1
        foreach ($backup in $backups) {
            $item = Get-Item $backup
            $size = if ($item.PSIsContainer) {
                $folderSize = (Get-ChildItem $backup -Recurse | Measure-Object -Property Length -Sum).Sum
                "$([math]::Round($folderSize / 1MB, 2)) MB"
            } else {
                "$([math]::Round($item.Length / 1MB, 2)) MB"
            }
            
            $type = if ($backup.EndsWith(".zip")) { "ZIP" } else { "FOLDER" }
            
            Write-Host "$index. $backup" -ForegroundColor Cyan
            Write-Host "   Size: $size | Type: $type | Modified: $($item.LastWriteTime)" -ForegroundColor Gray
            Write-Host ""
            $index++
        }
    }
    
    Read-Host "Press Enter to continue"
}

function Restore-FromBackup {
    Write-Host "Available backups:" -ForegroundColor Green
    
    $backups = Get-ChildItem -Path "." -Name "backup_*" | Sort-Object -Descending
    
    if ($backups.Count -eq 0) {
        Write-Host "No backups found." -ForegroundColor Yellow
        Read-Host "Press Enter to continue"
        return
    }
    
    $index = 1
    foreach ($backup in $backups) {
        Write-Host "$index. $backup" -ForegroundColor Cyan
        $index++
    }
    
    Write-Host ""
    $selection = Read-Host "Select backup to restore (1-$($backups.Count)) or 0 to cancel"
    
    if ($selection -eq "0" -or $selection -eq "") {
        return
    }
    
    try {
        $selectedBackup = $backups[$selection - 1]
        Write-Host "Restoring from: $selectedBackup" -ForegroundColor Yellow
        
        .\restore-backup.ps1 -BackupPath $selectedBackup
    } catch {
        Write-Host "Invalid selection." -ForegroundColor Red
    }
    
    Read-Host "Press Enter to continue"
}

function Delete-OldBackups {
    Write-Host "Delete old backups" -ForegroundColor Green
    Write-Host ""
    
    $backups = Get-ChildItem -Path "." -Name "backup_*" | Sort-Object -Descending
    
    if ($backups.Count -eq 0) {
        Write-Host "No backups found." -ForegroundColor Yellow
        Read-Host "Press Enter to continue"
        return
    }
    
    $daysOld = Read-Host "Delete backups older than how many days? (default: 30)"
    if ([string]::IsNullOrEmpty($daysOld)) { $daysOld = 30 }
    
    $cutoffDate = (Get-Date).AddDays(-$daysOld)
    $oldBackups = $backups | Where-Object { (Get-Item $_).LastWriteTime -lt $cutoffDate }
    
    if ($oldBackups.Count -eq 0) {
        Write-Host "No backups older than $daysOld days found." -ForegroundColor Yellow
    } else {
        Write-Host "Found $($oldBackups.Count) backups older than $daysOld days:" -ForegroundColor Yellow
        foreach ($backup in $oldBackups) {
            Write-Host "  $backup" -ForegroundColor Gray
        }
        
        $confirm = Read-Host "Delete these backups? (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            foreach ($backup in $oldBackups) {
                Remove-Item $backup -Recurse -Force
                Write-Host "Deleted: $backup" -ForegroundColor Red
            }
            Write-Host "Cleanup completed." -ForegroundColor Green
        }
    }
    
    Read-Host "Press Enter to continue"
}

function Schedule-AutoBackups {
    Write-Host "Schedule automatic backups" -ForegroundColor Green
    Write-Host ""
    Write-Host "This feature would require Windows Task Scheduler integration." -ForegroundColor Yellow
    Write-Host "For now, you can manually run backups or set up a scheduled task." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Suggested scheduled task command:" -ForegroundColor Cyan
    Write-Host "powershell.exe -ExecutionPolicy Bypass -File `"$(Get-Location)\backup-script.ps1`" -Compress" -ForegroundColor White
    Write-Host ""
    
    Read-Host "Press Enter to continue"
}

# Main execution
if ($Action -eq "menu") {
    do {
        Show-Menu
        $choice = Read-Host "Select an option (1-6)"
        
        switch ($choice) {
            "1" { Create-Backup }
            "2" { List-Backups }
            "3" { Restore-FromBackup }
            "4" { Delete-OldBackups }
            "5" { Schedule-AutoBackups }
            "6" { 
                Write-Host "Goodbye!" -ForegroundColor Green
                exit 0 
            }
            default { 
                Write-Host "Invalid option. Please try again." -ForegroundColor Red
                Start-Sleep 2
            }
        }
    } while ($true)
}