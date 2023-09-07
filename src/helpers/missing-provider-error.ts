export class MissingProviderError extends Error {
  constructor(hook: string, provider: string) {
    super(`${hook} must be used within a ${provider}`);
  }
}
