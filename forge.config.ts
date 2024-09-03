import type { ForgeConfig } from '@electron-forge/shared-types';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import packageJson from './package.json';
import path from 'node:path';

const {
  version,
  name,
  productName,
  description,
  author,
} = packageJson;
const iconDir = path.resolve(__dirname, 'src', 'assets', 'images', 'icons');

const commonLinuxConfig = {
  name: name,
  productName: productName,
  bin: productName,
  categories: ['Video', 'Utility'],
  mimeType: ['x-scheme-handler/comet'],
};

const config: ForgeConfig = {
  packagerConfig: {
    name: productName,
    executableName: productName,
    icon: 'src/assets/images/icons/icon',
    appBundleId: 'com.thavarshan.comet',
    appCategoryType: 'public.app-category.video',
    asar: {
      unpack: "**/node_modules/{ffmpeg-static,ffprobe-static}/**",
    },
    win32metadata: {
      CompanyName: 'Jerome Thayananthajothy',
      OriginalFilename: 'Comet',
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch: string) => ({
        name: productName,
        authors: author.name,
        exe: `${productName}.exe`,
        iconUrl: 'https://raw.githubusercontent.com/stellar-comet/comet/main/src/assets/images/icons/icon.ico',
        loadingGif: 'src/assets/images/loading.gif',
        noMsi: true,
        setupExe: `${name}-${version}-${arch}-setup.exe`,
        setupIcon: path.resolve(iconDir, 'setup-icon.ico'),
        certificateFile: path.resolve(__dirname, 'tools/certs/dev-cert.pfx'),
        certificatePassword: process.env.CERT_PASSWORD,
      }),
    },
    {
      name: '@electron-forge/maker-appx',
      platforms: ['win32'],
      config: {
        packageName: 'JeromeThayananthajothy.CometApp',
        packageDisplayName: `${productName}App`,
        packageDescription: description,
        packageVersion: `${version}.0`,
        publisher: 'CN=E0D72A6F-3D67-49D6-9EA4-99FAFB4620E5',
        publisherDisplayName: 'Jerome Thayananthajothy',
        devCert: path.resolve(__dirname, 'tools/certs/dev-cert.pfx'),
        certPass: process.env.CERT_PASSWORD,
        windowsKit: process.env.WINDOWS_KIT_PATH,
        icon: path.resolve(iconDir, 'icon.ico')
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be
      // Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration,
      // it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry`
          // in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ]
};

export default config;
