# Yakit English UI

Unofficial English-language fork/localization of Yakit, a cyber security all-in-one platform based on Yaklang.

This is not the official Yakit project. Original project: https://github.com/yaklang/yakit

Original authors/copyright holders retain their rights. This fork only changes language/localization unless otherwise stated.

Modified by ChathurangaBW for English localization on 2026-07-04.

## Upstream

- Original project: https://github.com/yaklang/yakit
- Official website: https://yaklang.io/
- Official documentation: https://yaklang.io/products/intro/
- Technical white paper: https://yaklang.oss-cn-beijing.aliyuncs.com/yakit-technical-white-paper.pdf

## What Changed

- English UI text is enabled as the default locale.
- English documentation text is provided for this fork.
- No intentional functional changes are made by the localization work.

## About Yakit

Yakit is a graphical client for Yaklang, a cyber security domain-specific language. It provides an integrated security testing workflow, including MITM traffic interception, Web Fuzzer, plugin execution, reverse connection tooling, and other Yaklang-powered capabilities.

Yakit uses a gRPC server for the Yak engine. In practice, the Yakit GUI controls engine capabilities through that server. The engine can be deployed locally or remotely.

## Highlights

1. MITM interception workflow for authorized application security testing.
2. Web Fuzzer for HTTP replay and fuzz testing.
3. Yaklang script and plugin execution during security workflows.
4. Reverse Shell, reverse-connection detection, and protocol multiplexing support.
5. Plugin store and extensible Yaklang-based tooling.

## Usage

Download and installation instructions are available from the official Yakit website:

https://yaklang.com/

Learning materials and upstream documentation are available at:

https://yaklang.io/products/intro/

## Development Setup

Prerequisites:

- Node.js 18.x and Yarn 1.x
- Git
- Windows, macOS, or Linux

Install dependencies:

```bash
yarn
```

Install renderer dependencies:

```bash
yarn install-render
```

Start development:

```bash
yarn dev
```

Useful scripts:

- Build renderer only: `yarn build-render`
- Build startup renderer only: `yarn build-link-render`
- Start Electron only after the renderer is running on port 3000: `yarn start-electron`
- Package Windows build: `yarn pack-win`

## Syncing Upstream

This repository should be kept in sync with upstream `yaklang/yakit`. Future upstream changes should be merged carefully, preserving upstream copyright notices, license files, security warnings, and legal disclaimers while reapplying English localization where needed.

## License

Yakit is licensed under AGPL-3.0. The original `LICENSE.md` remains the authoritative license text for this repository. This fork does not relicense Yakit and does not claim ownership of the original project.

## Security And Legal Disclaimer

1. This tool is intended only for legally authorized enterprise security work and personal learning. If you need to test this tool, build your own test target environment.
2. When using this tool for detection or testing, you must ensure your actions comply with local laws and regulations and that you have obtained sufficient authorization. Do not scan unauthorized targets.
3. Reverse engineering, decompiling, attempting to decipher source code, implanting backdoors, spreading malware, and similar misuse are prohibited.
4. If you need to use Yakit for commercial purposes, ensure that you have obtained official authorization from the appropriate rights holders.

You are responsible for any illegal activity conducted while using this tool. The original project authors and this localization fork do not assume legal or joint liability for your misuse.

Before installing or using this tool, carefully read and fully understand all relevant terms. Unless you have fully read, understood, and accepted those terms, do not install or use this tool.
