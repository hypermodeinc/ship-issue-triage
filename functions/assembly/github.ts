import { JSON } from "json-as";
import { http } from "@hypermode/functions-as";
@json
export class Label {
    name!: string;
}
@json
export class User {
    login!: string;
}

@json
export class Issue {
  title!: string;
  body!: string;
  created_at!: string;
  labels : Label[] = [];
  user: User | null = null;
  // The URL of the issue on GitHub, after the issue is created.
  @alias("html_url")
  url: string | null = null;
}

export function createGithubIssue(
    owner: string,
    repo: string,
    title: string,
    body: string,
  ): Issue {
    // The URL for creating an issue in a GitHub repository.
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
  
    // Create a new request with the URL, method, and headers.
    const request = new http.Request(url, {
      method: "POST",
      headers: http.Headers.from([
        // Do not pass an Authorization header here. See note above.
        ["Accept", "application/vnd.github+json"],
        ["X-GitHub-Api-Version", "2022-11-28"],
        ["Content-Type", "application/json"],
      ]),
  
      // The request body will be sent as JSON from the Issue object passed here.
      body: http.Content.from(<Issue>{ title, body }),
    } as http.RequestOptions);
  
    // Send the request and check the response status.
    // NOTE: If you are using a private repository, and you get a 404 error, that could
    // be an authentication issue. Make sure you have created a token as described above.
    const response = http.fetch(request);
    if (!response.ok) {
      throw new Error(
        `Failed to create issue. Received: ${response.status} ${response.statusText}`,
      );
    }
  
    // The response will contain the issue data, including the URL of the issue on GitHub.
    return response.json<Issue>();
  }

export function getGithubIssues(
    owner: string,
    repo: string,
    since: string
  ): Issue[] {
    // The URL for getting issues in a GitHub repository.
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?since=${since}&per_page=100`;
    console.log(`getGithubIssues: ${url}`)
    // Create a new request with the URL, method, and headers.
    const request = new http.Request(url, {
      method: "GET",
      headers: http.Headers.from([
        // Do not pass an Authorization header here. See note above.
        ["Accept", "application/vnd.github+json"],
        ["X-GitHub-Api-Version", "2022-11-28"],
        ["Content-Type", "application/json"],
      ])
    } as http.RequestOptions);
  
    // Send the request and check the response status.
    // NOTE: If you are using a private repository, and you get a 404 error, that could
    // be an authentication issue. Make sure you have created a token as described above.
    const response = http.fetch(request);
    if (!response.ok) {
      throw new Error(
        `Failed to read issue. Received: ${response.status} ${response.statusText}`,
      );
    }

    const issues = response.json<Issue[]>();
    
    // The response will contain the issue data, including the URL of the issue on GitHub.
    return  issues;
  }
