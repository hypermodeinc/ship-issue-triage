import { collections } from "@hypermode/functions-as";

// Define the structure we expect for the output of the similarity search function.
@json
export class SimilarIssue {
  id!: string;
  title!: string;
  similarity!: f64;
}

const SPAM_COLLECTION = "spamCollection";

export function isSpam(title: string): f32 {
  let score: f32 = 0.0;
  const response = collections.search(
    SPAM_COLLECTION,
    "titleEmbedding",
    title,
    1,
    true,
  );
  if (response.objects.length > 0) {
    score = <f32>response.objects[0].score;
  }

  return score;
}

export function addSpam(id: string, title: string): string {
  collections.upsert(SPAM_COLLECTION, id, title);

  return "success";
}
