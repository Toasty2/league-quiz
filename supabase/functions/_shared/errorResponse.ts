export function errorResponse(err, status, corsHeaders) {
  const message = err && err.message ? err.message : String(err);
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
