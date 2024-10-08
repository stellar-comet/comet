/**
 * @jest-environment node
 */

import { setupGlobals } from '../../src/preload';
import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { IpcEvent } from '../../src/enum/ipc-event';

jest.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: jest.fn(),
  },
  ipcRenderer: {
    invoke: jest.fn(),
    sendSync: jest.fn(),
    send: jest.fn(),
    on: jest.fn(),
    removeAllListeners: jest.fn(),
  },
  webUtils: {
    getPathForFile: jest.fn(),
  },
}));

describe('setupGlobals', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should expose electron API in main world', async () => {
    await setupGlobals();

    expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith('electron', {
      arch: process.arch,
      platform: process.platform,
      selectDirectory: expect.any(Function),
      getSystemTheme: expect.any(Function),
      getDesktopPath: expect.any(Function),
      getFilePath: expect.any(Function),
      cancelItemConversion: expect.any(Function),
      cancelConversion: expect.any(Function),
      convertMedia: expect.any(Function),
      send: expect.any(Function),
      on: expect.any(Function),
      removeAllListeners: expect.any(Function),
    });
  });

  test('should invoke DIALOG_SELECT_DIRECTORY event', async () => {
    await setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];

    await electron.selectDirectory();

    expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvent.DIALOG_SELECT_DIRECTORY);
  });

  test('should sendSync GET_SYSTEM_THEME event', async () => {
    await setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];

    electron.getSystemTheme();

    expect(ipcRenderer.sendSync).toHaveBeenCalledWith(IpcEvent.GET_SYSTEM_THEME);
  });

  test('should invoke GET_DESKTOP_PATH event', async () => {
    await setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];

    await electron.getDesktopPath();

    expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvent.GET_DESKTOP_PATH);
  });

  test('should return getPathForFile from webUtils', async () => {
    await setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];

    const mockFile = {} as File;
    electron.getFilePath(mockFile);

    expect(webUtils.getPathForFile).toHaveBeenCalledWith(mockFile);
  });

  test('should invoke CANCEL_CONVERSION event', async () => {
    await setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];

    await electron.cancelConversion();

    expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvent.CANCEL_CONVERSION);
  });

  test('should invoke CANCEL_ITEM_CONVERSION event with id', async () => {
    await setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];

    await electron.cancelItemConversion(1);

    expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvent.CANCEL_ITEM_CONVERSION, 1);
  });

  test('should invoke CONVERT_MEDIA event with correct arguments', async () => {
    await setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];

    await electron.convertMedia('1', '/mock/path/video.mp4', 'mp4', '/mock/save');

    expect(ipcRenderer.invoke).toHaveBeenCalledWith(IpcEvent.CONVERT_MEDIA, {
      id: '1',
      filePath: '/mock/path/video.mp4',
      outputFormat: 'mp4',
      saveDirectory: '/mock/save',
    });
  });

  test('should send a message to a channel', () => {
    setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];
    const args = ['arg1', 'arg2'];

    electron.send('channel', ...args);

    expect(ipcRenderer.send).toHaveBeenCalledWith('channel', ...args);
  });

  test('should add an event listener for a channel', () => {
    setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];
    const callback = jest.fn();

    electron.on('channel', callback);

    expect(ipcRenderer.on).toHaveBeenCalledWith('channel', callback);
  });

  test('should remove all listeners for a channel', () => {
    setupGlobals();
    const electron = (contextBridge.exposeInMainWorld as jest.Mock).mock.calls[0][1];

    electron.removeAllListeners('channel');

    expect(ipcRenderer.removeAllListeners).toHaveBeenCalledWith('channel');
  });
});
