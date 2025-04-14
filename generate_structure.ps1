# Save as update_directory.ps1
$projectRoot = "."
$outputFile = "./.notes/directory_structure.md"

# Common ignore patterns for TypeScript/JavaScript/Next.js projects
$ignorePatterns = @(
    "node_modules",
    ".next",
    "dist",
    "build",
    "out",
    ".vercel",
    ".netlify",
    ".cache",
    ".turbo",
    ".docusaurus",
    "coverage",
    ".nyc_output",
    "*.log",
    ".DS_Store",
    "*.local",
    ".env*",
    ".git",
    ".github",
    ".gitignore",
    ".gitattributes",
    ".gitmodules",
    ".vscode",
    ".idea",
    "*.swp",
    "*.swo",
    "*.swn",
    "*.bak",
    "*.tmp",
    "*.temp"
)

# Generate directory listing
function Get-FormattedDirectory {
    param (
        [string]$path,
        [int]$indent = 0
    )

    $indentString = "    " * $indent
    $content = ""

    foreach ($item in Get-ChildItem -Path $path -Force) {
        # Skip ignored patterns
        $shouldSkip = $false
        foreach ($pattern in $ignorePatterns) {
            if ($item.Name -like $pattern) {
                $shouldSkip = $true
                break
            }
        }
        if ($shouldSkip) { continue }

        if ($item.PSIsContainer) {
            $content += "$indentString- **$($item.Name)/**`n"
            $content += Get-FormattedDirectory -path $item.FullName -indent ($indent + 1)
        } else {
            $content += "$indentString- $($item.Name)`n"
        }
    }
    return $content
}

# Generate content for markdown file
$markdownContent = @"
# Current Directory Structure

## Core Components

```
$(Get-FormattedDirectory -path $projectRoot)
```
"@

# Output to file
$markdownContent | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "Directory structure updated in $($outputFile)"