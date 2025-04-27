export interface ElectronAPI {
  store: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
  isElectron: boolean;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}