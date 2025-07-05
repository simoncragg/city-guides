const echoMessage = async (request: Request): Promise<Response> => {

  if (request.method !== "POST") {
    return createResponse({ message: "Method Not Allowed" }, 405);
  }

  const body = await request.text();
  return new Response(body, { status: 200 });
}

const createResponse = (body: Record<string, unknown>, status: number): Response => {
  return new Response(JSON.stringify(body), { status });
}

export default echoMessage;
