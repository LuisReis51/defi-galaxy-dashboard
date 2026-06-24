import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GalaxyStore, Network, Token, ViewState, WalletActivity } from './types';

export const useGalaxyStore = create<GalaxyStore>()(
  subscribeWithSelector((set) => ({
    view: 'galaxy',
    networks: [],
    tokens: [],
    selectedNetwork: null,
    selectedToken: null,
    walletActivity: [],
    isLoading: true,
    tokensLoading: false,
    isTransitioning: false,
    isPaused: false,
    cameraTarget: [0, 0, 0],

    setView: (v: ViewState) => set({ view: v }),

    selectNetwork: (n: Network) =>
      set({
        selectedNetwork: n,
        selectedToken: null,
        view: 'planet',
        isTransitioning: true,
        cameraTarget: n.position,
      }),

    selectToken: (t: Token) =>
      set((state) => ({
        selectedToken: t,
        view: 'token',
        isTransitioning: true,
        cameraTarget: state.selectedNetwork?.position ?? [0, 0, 0],
      })),

    back: () =>
      set((state) => {
        if (state.view === 'token') {
          return {
            view: 'planet',
            selectedToken: null,
            isTransitioning: true,
            cameraTarget: state.selectedNetwork?.position ?? [0, 0, 0],
          };
        }
        return {
          view: 'galaxy',
          selectedNetwork: null,
          selectedToken: null,
          isTransitioning: true,
          cameraTarget: [0, 0, 0],
        };
      }),

    setNetworks: (networks: Network[]) => set({ networks, isLoading: false }),

    setTokens: (tokens: Token[]) => set({ tokens }),

    setTokensLoading: (tokensLoading: boolean) => set({ tokensLoading }),

    setWalletActivity: (walletActivity: WalletActivity[]) => set({ walletActivity }),

    setCameraTarget: (cameraTarget: [number, number, number]) => set({ cameraTarget }),

    setTransitioning: (isTransitioning: boolean) => set({ isTransitioning }),

    setPaused: (isPaused: boolean) => set({ isPaused }),
  }))
);

export const selectCurrentTokens = (networkId: string) => (state: GalaxyStore) =>
  state.tokens.filter((t) => t.networkId === networkId);
