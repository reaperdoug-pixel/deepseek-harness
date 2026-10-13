---
description: "web GUI 的巴西葡萄牙语（pt-BR）语言包：用户如何选择、它翻译哪些命名空间，以及它如何接入 locale catalog。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-locale-pt-br

[English](README.md) | 中文

## 概述

使用 `dsh-client-locale-pt-br` 可用巴西葡萄牙语阅读 web GUI。本包是一个语言包：它向 [`dsh-client-locale`](../locale/README.zh.md) 持有的 catalog 添加 `pt-BR` 条目，并为已发布 client 插件翻译的每个命名空间注册一份 pt-BR 字典。在“设置 → 常规”中选择 Português (Brasil) 后，UI 文案无需重新加载即可切换；字典缺失的键会回退到英文。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与暂缓事项](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

在 web client 的组合中列出该插件即可启用，无需任何配置。加载后，该语言会出现在“设置 → 常规”的语言选择器中。

### 选择语言

打开“设置 → 常规”并选择 Português (Brasil)。UI 文案立即切换，`<html lang>` 变为 `pt-BR`，选择通过 locale 插件的偏好持久化。没有已存储偏好时，请求 `pt-BR` 或任意 `pt-*` 标签的浏览器会在首次加载时选中该语言。

### 命令名保持英文

`/goal`、`/plan`、`/feedback`、`/compact`、`/permission` 与 `/export` 的拼写就是已注册的命令名。因此本包让 `command` 命名空间的 `token.*` 条目与英文保持一致；翻译它们会产生命令解析无法识别的输入拼写。

### 添加或修正翻译

编辑 [`src/locales/`](src/locales/) 下对应命名空间的字典文件。键和 `{placeholder}` 名称必须与该命名空间的英文字典一致；缺失的键以英文显示，多余的键永远不会被读取。注册新命名空间时，添加其文件，并在 [`src/locales/index.ts`](src/locales/index.ts) 中加入一个条目。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节——点击展开</summary>

本节解释该语言包的构建方式；可观察行为已在[使用本包](#use-this-package)中说明。

### 设计理念

本包是一个只注入 `locale` 服务的 client 插件。它的 `apply` 先用 `ctx.locale.addLanguage({ id: 'pt-BR', fallback: 'en' })` 注册语言定义，再对每个命名空间调用一次 `ctx.locale.register(ns, 'pt-BR', dictionary)`，每次调用都是自身拥有的 effect。卸载插件会移除该语言和所有字典，生效中的 `pt-BR` 选择会回到浏览器派生或默认 locale。

### 命名空间归属

每份字典属于渲染其键的插件所拥有的命名空间，例如 `chat`、`sidebarRight` 或 `settings.models`。本包不导入这些插件，只镜像它们的键集合。与英文字典的对齐由本包的行为测试和评审检查，而不是编译器，因为逐 locale 的 `register` 形式没有类型约束。

### 源码地图

| 文件 | 职责 |
|---|---|
| [`src/client/index.ts`](src/client/index.ts) | client 插件：注册语言和每个命名空间字典 |
| [`src/index.ts`](src/index.ts) | node 半侧：空的 `apply`，使插件出现在 Host 组合中 |
| [`src/locales/index.ts`](src/locales/index.ts) | 命名空间表 `PT_BR_DICTIONARIES` |
| [`src/locales/`](src/locales/) | 每个命名空间一份 pt-BR 字典 |

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

当仅阅读本包不足以解答问题时，请继续阅读以下页面，了解它所扩展的注册表和它所属的 client 组。

- [Locale 插件](../locale/README.zh.md)——本包所扩展的语言 catalog、fallback 链与字典注册表。
- [客户端组地图](../README.zh.md)——本包所属的浏览器半侧。

-----

<a id="model-experience"></a>
## 模型体验

无。该语言包属于浏览器侧 UI 插件，不注册任何面向模型的内容。

#### KV Cache 影响

无；该包既不组装也不发送提供方请求。

## 已知限制与暂缓事项

<a id="known-limitations-and-deferred-work"></a>


这些限制说明葡萄牙语覆盖在哪些地方不完整。它们是当前包约束，不是待办事项清单。

- **不覆盖 Electron 外壳文案**——桌面应用用自己的字典解析对话框和菜单，与本浏览器语言包相互独立。
- **注册表持有的文本只读取一次翻译**——在 slot 渲染路径之外于注册时捕获的文案在重新注册前保持注册时的语言，与 locale 插件文档所述一致。
- **复数规则逐键处理**——pt-BR 口语中零也按单数处理，但共享的 `.one`／`.other` 键约定只在数量为一时选择 `.one`。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者的工作上下文——点击展开</summary>

无。

</details>

**运行时不变式：** 不发布伴生入口。本包没有可供交叉核对的独立运行时来源；注册与释放由行为测试覆盖。
