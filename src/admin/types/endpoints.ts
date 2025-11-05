// ----------------------------------------------------------------------
 export type IEndpointsState = {
    isLoading: boolean;
    error: Error | string | null;
    endpoints: Record<string, string>;
  };
  