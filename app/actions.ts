"use server";

export async function setData(data: FormData) {
  const story = data.get("story");

  console.log(story);

  const response = await fetch(`http://localhost:3000/api/story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.API_KEY!,
    },
    body: JSON.stringify(story),
  });

  const responseData = await response.json();

  return responseData;
}
