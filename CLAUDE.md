# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React SPA that displays rclone daily integration test results. Live at https://integration.rclone.org. Data is fetched from https://pub.rclone.org/integration-tests/ which serves directory listings as JSON.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — preview production build
- `./deploy.sh` — build and sync `dist/` to `integration.rclone.org` via rclone

## Architecture

React 19 + Vite + Ant Design (`antd`). No router — single-page with URL query params (`?filter=...&date=...`) for state sharing.

**DataContext** (`src/DataContext.jsx`) is the central data layer. It fetches all test run listings on mount, stores them in state, and exposes `data` (array of test runs), `selected` (current run), and `setSelected` via React context. All other components consume this via `useData()`.

**Component hierarchy** (all rendered inside `DataProvider`):
- **TestSelector** — tab bar (antd `Tabs`) for switching between test runs by date. Arrow keys navigate.
- **InfoTable** — summary table: version, branch, commit, Go version, duration, pass/fail count.
- **FailedTests** — filterable table of failed tests. Clicking any cell value (Backend, Remote, Path, FastList, test name) toggles it as a filter. Reads/writes `filter` and `date` URL params.
- **DiffTable** — compares selected run against the previous run, showing regressed/continued/fixed test tables.
- **HelpButton** — fixed-position help overlay.

**Data shape**: Each test run JSON has `DateTime`, `Version`, `Branch`, `Commit`, `GoVersion`, `GOOS`, `GOARCH`, `Duration` (nanoseconds), `Failed` (array of test objects), and `Passed` (array). Each failed test has `Backend`, `Remote`, `Path`, `FastList`, `FailedTests` (array of test names), and `TrialNames` (array of log filenames).
