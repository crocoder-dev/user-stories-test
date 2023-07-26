"use server";

export async function setData(data: FormData) {
  const story = data.get("story");

  console.log(story);

  const response = await fetch(`${process.env.SITE_URL}/api/story`, {
    method: "POST",
    cache: 'no-store',
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.API_KEY!,
    },
    body: JSON.stringify(story),
  });

  const responseData = await response.json();

  return responseData;
}
