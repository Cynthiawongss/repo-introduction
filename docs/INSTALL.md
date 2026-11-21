# Install / 安装

[English home](../README.md) · [简体中文](../README.zh-CN.md)

The skill is the folder `skills/repo-introduction/`: `SKILL.md` plus `references/`, `templates/` and `scripts/`. Install that folder, not the whole repository.

## Claude Code

```sh
git clone https://github.com/Cynthiawongss/repo-introduction.git
cp -R repo-introduction/skills/repo-introduction ~/.claude/skills/
```

For one project only, copy it into that project's `.claude/skills/` instead. Start a new session; the skill appears in the skill list and is used when you ask for a README or project introduction, or when you type `/repo-introduction`.

To update, pull the repository and copy the folder again. To keep a local edit (for example your own preferences file), keep it outside the folder or re-apply it after copying.

## Claude apps (claude.ai, desktop)

Download `repo-introduction-skill.zip` from the [latest release](https://github.com/Cynthiawongss/repo-introduction/releases/latest) and upload it under Settings → Capabilities → Skills. The scripts need a code-execution environment with Node 22+ and Chrome; without one the written method still applies, but screenshots and checks must be done another way.

## Codex and other agents that read SKILL.md

Copy the same folder into the host's skills directory (for Codex: a project's `.agents/skills/` or `~/.agents/skills/`).

## Requirements for the scripts

- `scripts/shoot.mjs`: Node 22 or newer, and Chrome, Chromium, Edge or Brave. Set `CHROME_PATH` if the browser is somewhere unusual.
- `scripts/check_readme.py`: Python 3.8 or newer.
- No npm or pip packages.

---

## 中文

skill 本体是 `skills/repo-introduction/` 这个文件夹（`SKILL.md`、`references/`、`templates/`、`scripts/`）。安装这个文件夹，不是整个仓库。

**Claude Code：** 运行上面两行命令，把文件夹复制到 `~/.claude/skills/`。只给某个项目用的话，复制到那个项目的 `.claude/skills/`。新开一个会话就能用：让它写 README、项目说明时会自动调用，也可以输入 `/repo-introduction`。更新时重新拉取仓库再复制一次。

**Claude 应用：** 在最新发布页下载 `repo-introduction-skill.zip`，在 设置 → Capabilities → Skills 上传。脚本需要能运行代码、有 Node 22+ 和 Chrome 的环境；没有的话方法本身照样适用，只是截图和检查要换别的方式做。

**Codex 等：** 把同一个文件夹复制到对应的 skills 目录（Codex 为项目里的 `.agents/skills/` 或 `~/.agents/skills/`）。
