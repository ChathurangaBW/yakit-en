# Package Publishing TODO

Package publishing has been prepared, but it is not enabled for automatic release from this repository.

## Current package metadata

* Package name: `@chathurangabw/yakit-english-ui`
* Package version: `1.0.0-en.0`
* Registry target: `https://npm.pkg.github.com`
* License: `AGPL-3.0`
* Repository: `https://github.com/ChathurangaBW/yakit-en`
* Upstream attribution: `https://github.com/yaklang/yakit`

## Preconditions before publishing

* Release tag `v1.0.0-en` exists or is ready to create.
* Build succeeds.
* Lint, typecheck, and tests pass, or any remaining failures are documented.
* License metadata and attribution remain correct.
* README and release notes remain aligned with the unofficial localization-fork status.
* Remaining Chinese text review is completed for the release scope.

## What is configured

* Root package metadata now identifies the repository as an unofficial English localization fork.
* A manual GitHub Actions workflow named `publish-package.yml` is prepared for GitHub Packages.
* A manual GitHub Actions workflow named `build-release-assets.yml` is prepared for Windows, macOS, and Linux desktop artifacts.
* The workflow runs install, lint, typecheck, tests, and build before attempting publish.
* The workflow uses GitHub's built-in `GITHUB_TOKEN` and does not require committed tokens.

## What is still missing or manual

* A repository owner must decide whether GitHub Packages is the intended registry for this project.
* A repository owner must create and publish the GitHub Release after reviewing the release notes and localization scope.
* If package visibility or permissions require repository settings changes, those must be applied in GitHub.
* If a different package name or registry is preferred, update `package.json` and the workflow before publishing.
* macOS signing and Windows code signing are not configured in the new fork-safe workflow; unsigned assets may still be produced unless signing steps are added with repository secrets.

## Do not publish

Do not publish packages automatically from local development credentials. Do not commit npm tokens, GitHub tokens, signing keys, `.env` files, local configs, logs, or private keys.
