import { collections } from "@hypermode/functions-as";

export function isSpam(title: string): f64 {
  const response = collections.search(
    "spamCollection",
    "byTitle",
    title, // the text to search for
    1, // the number of results to return
  );

  if (response.objects.length == 0) {
    return 0;
  }

  return response.objects[0].score;
}

export function addSpam(id: string, title: string): string {
  const results = collections.upsert("spamCollection", id, title);
  return results.status;
}
