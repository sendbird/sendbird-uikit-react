export interface PocStateType {
  poc: SendbirdChat,
  loading: boolean,
}

const initialState: PocStateType = {
  loading: false,
  poc: {} as SendbirdChat,
};
