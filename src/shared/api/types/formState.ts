export interface AddClientFormState {
  success: boolean;
  error: string | null;
}

export const initialState: AddClientFormState = {
  success: false,
  error: null,
};
