function createResponse (body: Record<string, unknown>, status: number = 200): Response {
  return new Response(JSON.stringify(body), { 
      status,
      headers: { 
        "Content-Type": "application/json"
      }
    }
  );
}

export default createResponse;
