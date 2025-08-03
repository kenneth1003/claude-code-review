# CCR - Claude Code Review

使用本地 Claude Code 進行 Code Review 的 CLI 工具。透過 Git diff 分析，自動生成 Code Review 報告。

## ✨ 特色

- 🤖 使用本地 Claude Code 進行智能代碼審查
- 🔍 自動生成 Git 分支間的差異並進行深度分析
- 🌐 多語言支援
- 📊 提供簡潔版、詳細版 Review模式
- 📝 生成結構化的 Markdown 報告

## 📋 預備條件

1. **本地安裝 Claude Code**
   - 安裝指南: https://docs.anthropic.com/en/docs/claude-code/setup

2. **本地安裝 Node.js** (v14+)
   - 安裝指南: https://nodejs.org/en/download/
   - CLI 透過 npx 執行，使用 Node.js 運行

3. **Git 儲存庫**
   - 專案必須是 Git 儲存庫
   - 需要有網路連線以取得遠端分支
   - Github, Gitlab 等 Git 儲存庫皆可

## 🚀 快速開始

### 1. 初始化專案

```bash
npm install -g claude-code-review

cd <your-project-directory>
npx ccr init
```

這將建立 `.ccr.json` 設定檔：

```json
{
  "language": "zh",
  "outputDir": "./reviews",
  "remote": "origin"
}
```

### 2. 執行程式碼審查

```bash
# 基本用法
npx ccr review <source-branch> <target-branch>

# 範例：審查 feature 分支對 main 的變更
npx ccr review feature/user-auth main

# 指定語言（覆蓋預設設定）
npx ccr review feature/payment main -l zh

# 使用詳細審查模式
npx ccr review feature/api-update main --detail
```

### 3. 查看審查結果

```bash
# 審查報告將儲存在 reviews 目錄
cat reviews/2025-07-24-10:00-review.md
```

## 📖 使用指南

### 指令列表

```bash
# 查看所有可用指令
npx ccr --help

# 初始化設定
npx ccr init [options]
  -l, --language <language>  輸出語言 (ex: English, 繁體中文)，預設: English

# 執行程式碼審查
npx ccr review <source> <target> [options]
  -l, --language <language>  輸出語言 (ex: English, 繁體中文)
  --detail                   使用詳細審查模式
```

### 審查模式

1. **標準模式**：提供簡潔的問題描述和建議
2. **詳細模式**（--detail）：包含深入的技術分析、影響評估和實作範例

### 輸出格式範例

```markdown
1. src/api/user.js
[🔴 Critical][security]: 
- Description: SQL injection vulnerability in user query on line 45
- Suggestion: Use parameterized queries or prepared statements
```

## 🔧 進階設定

### 自訂設定檔

`.ccr.json` 支援以下選項：

```json
{
  "language": "zh",          // 預設輸出語言
  "outputDir": "./reviews",  // 審查報告輸出目錄
  "remote": "origin"         // Git 遠端名稱（預設: origin）
}
```

## 🔄 工作流程

1. **初始化**：執行 `ccr init` 建立專案設定
2. **取得分支**：自動從遠端取得指定分支的最新版本
3. **生成差異**：建立目標分支與來源分支之間的 Git diff
4. **AI 分析**：使用本地 Claude Code 進行深度程式碼審查
5. **報告生成**：輸出結構化的 Markdown 審查報告

## 📊 審查類別

- **Security**：安全漏洞、認證授權問題
- **Performance**：效能瓶頸、資源使用優化
- **Bug**：邏輯錯誤、潛在問題
- **Architecture**：架構設計、模組化問題
- **Maintainability**：程式碼可讀性、命名規範
- **Testing**：測試覆蓋率、測試品質
- **Documentation**：文件完整性、註解品質

## 💬 支援與回饋

- 問題回報：請在 GitHub Issues 中建立議題
- 功能建議：歡迎提交 Pull Request

## 🔎 常見問題

1. 如何修改 code review 的 prompt?
A: 在 `.claude/commands/` 目錄下找到 `ccr-review.md` 和 `ccr-review-detail.md` 檔案，進行修改。