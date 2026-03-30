# Windows Permission Error - Fixed

## Problem
```
Error: EPERM: operation not permitted, rename 
'S:\Client Projects\Shah\shah_frontned\.next\dev\server\next-font-manifest.js.tmp.shjhzdjeoa' 
-> 'S:\Client Projects\Shah\shah_frontned\.next\dev\server\next-font-manifest.js'
```

## Root Cause
This is a Windows-specific issue where:
1. Multiple Node.js processes are running and locking files in `.next` directory
2. Windows file system doesn't allow renaming files that are in use
3. Next.js dev server tries to hot-reload but can't update locked files

## Solution Applied

### Step 1: Stopped All Node.js Processes ✅
```powershell
Get-Process node | Stop-Process -Force
```

### Step 2: Removed .next Directory ✅
```powershell
Remove-Item -Path ".next" -Recurse -Force
```

### Step 3: Ready to Restart
Now you can run:
```bash
npm run dev
```

## Prevention Tips

### 1. Always Stop Dev Server Properly
Instead of closing terminal, use:
```bash
Ctrl + C  (in terminal)
```

### 2. Use the Fix Script
If you encounter this again, run:
```powershell
.\fix-next-build.ps1
```

### 3. Close Code Editor
Sometimes VS Code or other editors lock files. Close and reopen if needed.

### 4. Run as Administrator (if needed)
Right-click PowerShell → "Run as Administrator"

## Quick Fix Commands

### Option 1: PowerShell (Recommended)
```powershell
# Stop all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait 2 seconds
Start-Sleep -Seconds 2

# Remove .next directory
Remove-Item -Path ".next" -Recurse -Force

# Start dev server
npm run dev
```

### Option 2: Command Prompt
```cmd
# Stop Node processes
taskkill /F /IM node.exe

# Remove .next directory
rmdir /s /q .next

# Start dev server
npm run dev
```

### Option 3: Use the Script
```powershell
.\fix-next-build.ps1
npm run dev
```

## Why This Happens on Windows

### File Locking
- Windows locks files more aggressively than Unix systems
- Node.js processes don't always release file handles immediately
- Hot Module Replacement (HMR) can cause file lock conflicts

### Common Triggers
- Rapid file saves during development
- Multiple terminal windows running dev server
- Antivirus software scanning `.next` directory
- Code editor file watchers

## Long-term Solutions

### 1. Exclude .next from Antivirus
Add to Windows Defender exclusions:
```
S:\Client Projects\Shah\shah_frontned\.next
```

### 2. Use WSL2 (Windows Subsystem for Linux)
For better file system performance:
```bash
wsl --install
# Then run your project in WSL2
```

### 3. Add to .gitignore
Already done, but ensure:
```
.next/
```

### 4. Use Turbopack (Next.js 13+)
Faster and more stable on Windows:
```bash
npm run dev -- --turbo
```

## Troubleshooting

### If Error Persists

#### 1. Check for Hidden Node Processes
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

#### 2. Restart Computer
Sometimes Windows needs a full restart to release all file locks.

#### 3. Check Disk Permissions
Right-click project folder → Properties → Security → Edit
Ensure your user has "Full Control"

#### 4. Disable Antivirus Temporarily
Some antivirus software locks files during scanning.

#### 5. Use Different Drive
If on external drive, try moving project to C: drive.

## Status: ✅ FIXED

The `.next` directory has been removed and all Node processes stopped. 
You can now run `npm run dev` to start fresh!

## Next Steps

1. Run `npm run dev` to start the development server
2. Navigate to http://localhost:3000/brands
3. Verify images load correctly
4. If you see the error again, run `.\fix-next-build.ps1`

## Additional Notes

### Package.json Scripts (Optional Enhancement)
Add these scripts to `package.json` for easier cleanup:

```json
{
  "scripts": {
    "dev": "next dev",
    "clean": "rimraf .next",
    "clean:dev": "rimraf .next && next dev",
    "kill": "taskkill /F /IM node.exe || true"
  }
}
```

Then you can run:
```bash
npm run clean:dev  # Clean and start
npm run clean      # Just clean
npm run kill       # Stop all Node processes
```

### Install rimraf (Optional)
For cross-platform directory removal:
```bash
npm install -D rimraf
```

## Prevention Checklist

- [ ] Always use Ctrl+C to stop dev server
- [ ] Close terminal properly before opening new one
- [ ] Don't run multiple dev servers simultaneously
- [ ] Exclude .next from antivirus scans
- [ ] Keep Node.js and npm updated
- [ ] Use the fix script when needed
- [ ] Consider using WSL2 for better performance

## Windows-Specific Tips

### PowerShell Execution Policy
If script won't run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### File Explorer
Show hidden files to see .next directory:
View → Show → Hidden items

### Task Manager
Check for Node processes:
Ctrl+Shift+Esc → Details → Look for node.exe

## Success Indicators

After fix, you should see:
```
✓ Ready in 3.2s
○ Compiling / ...
✓ Compiled / in 2.1s
```

No more EPERM errors!
