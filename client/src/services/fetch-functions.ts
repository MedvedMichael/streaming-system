export const getHeaders = (
  accessToken: string
): { "Content-Type": string; Authorization: string } => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
});

export const get = async (
  path: string,
  accessToken: string
): Promise<unknown> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: "GET",
    headers: getHeaders(accessToken),
  });
  if (!res.ok) {
    throw new Error("Error");
  }
  const result = await res.json();
  return result;
};

export const patch = async (
  path: string,
  body: Record<string, unknown>,
  accessToken: string,
  cookies = false
): Promise<Response> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: getHeaders(accessToken),
    credentials: cookies ? "include" : "omit",
  });
  if (!res.ok) {
    throw new Error("Error");
  }

  return res;
};

export const post = async (
  path: string,
  body?: Record<string, unknown>
): Promise<unknown> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Invalid request");
  }
  return await res.json();
};
