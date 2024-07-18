import { collections } from "@hypermode/functions-as";

// Define the structure we expect for the output of the similarity search function.
@json
class SimilarIssue {
  id!: string;
  title!: string;
  similarity!: f64;
}

export function similarIssues(title: string): SimilarIssue[] {
  const response = collections.search(
    "issuesCollection",
    "byTitle",
    title, // the text to search for
    3, // return the top 3 results
    true, // include text in the results
  );

  return response.objects.map<SimilarIssue>(
    (o) =>
      <SimilarIssue>{
        id: o.key,
        title: o.text,
        similarity: o.score,
      },
  );
}
