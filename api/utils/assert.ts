export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

export default function assert(condition: unknown, message: string, status = 500): asserts condition {
  if (!condition) {
    throw new HttpError(status, message);
  }
};
