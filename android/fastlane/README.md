fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android beta

```sh
[bundle exec] fastlane android beta
```

Submit a new Beta Build to Crashlytics Beta

### android android_stage_deploy_to_firebase_app_distribution

```sh
[bundle exec] fastlane android android_stage_deploy_to_firebase_app_distribution
```

firebase app distribution에 android stage 앱 배포하는 lane

### android android_prod_deploy_to_play_store_distribution

```sh
[bundle exec] fastlane android android_prod_deploy_to_play_store_distribution
```

play store에 android prod 앱 배포하는 lane

### android deploy

```sh
[bundle exec] fastlane android deploy
```

Deploy a new version to the Google Play

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
