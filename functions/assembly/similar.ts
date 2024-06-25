import { collections } from "@hypermode/functions-as";

// Define the structure we expect for the output of the similarity search function.
@json
export class SimilarIssue {
  id!: string;
  title!: string;
  similarity!: f64;
}

const collectionName = "issuesCollection";
const searchMethod = "titleEmbedding";

export function similarIssues(title: string): SimilarIssue[] {
  const response = collections.search(
    collectionName,
    searchMethod,
    title,
    3,
    true,
  );
  const result = response.objects.map<SimilarIssue>((object) => {
    return <SimilarIssue>{
      id: object.key,
      title: object.text,
      similarity: object.score,
    };
  });

  return result;
}

export function addIssue(id: string, title: string): string {
  collections.upsert(collectionName, id, title);

  return "success";
}
