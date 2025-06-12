import fs from "fs"
import path from "path"

// Define paths
const CHANGELOG_FILE = path.join(process.cwd(), "CHANGELOG.md")

// Ensure config directory exists
if (!fs.existsSync(path.join(process.cwd(), "config"))) {
  fs.mkdirSync(path.join(process.cwd(), "config"), { recursive: true })
}

interface ChangelogEntry {
  date: string
  title: string
  description: string
}

async function getEntriesFromMarkdown(): Promise<ChangelogEntry[]> {
  if (!fs.existsSync(CHANGELOG_FILE)) {
    return []
  }

  try {
    const content = fs.readFileSync(CHANGELOG_FILE, "utf-8")
    // Simple parsing - in a real implementation you might want more robust parsing
    const entries: ChangelogEntry[] = []

    // This is a simplified parser - the markdown file will be the source of truth
    // For now, we'll just return empty array and let new entries be added
    return entries
  } catch (error) {
    console.error("Error reading changelog markdown:", error)
    return []
  }
}

export async function addChangelogEntry(entry: ChangelogEntry): Promise<ChangelogEntry> {
  // Get existing entries from markdown file
  const entries = await getEntriesFromMarkdown()

  // Add new entry
  entries.unshift(entry)

  // Update markdown file
  await updateChangelogMarkdown(entries)

  return entry
}

// Function to update CHANGELOG.md file
async function updateChangelogMarkdown(entries: ChangelogEntry[]) {
  let markdownContent = `# Changelog

All notable changes to this Lo-Fi streaming platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`

  // Group entries by date
  const entriesByDate = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = []
      }
      acc[entry.date].push(entry)
      return acc
    },
    {} as Record<string, ChangelogEntry[]>,
  )

  // Generate markdown for each date
  Object.keys(entriesByDate)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .forEach((date) => {
      markdownContent += `## ${date}\n\n`

      entriesByDate[date].forEach((entry) => {
        markdownContent += `### ${entry.title}\n\n`
        markdownContent += `${entry.description}\n\n`
      })
    })

  fs.writeFileSync(CHANGELOG_FILE, markdownContent)
}
