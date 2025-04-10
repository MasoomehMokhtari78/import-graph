import { Octokit } from "@octokit/rest";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

const octokit = new Octokit();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");

  if (!repo) {
    return new Response(
      JSON.stringify({ error: "Missing repo param" }, { status: 400 })
    );
  }

  const [owner, repoName] = repo.split("/");

  try {
    const repoData = await octokit.repos.get({ owner, repo: repoName });
    const branch = repoData.data.default_branch;

    const treeData = await octokit.git.getTree({
      owner,
      repo: repoName,
      tree_sha: branch,
      recursive: true,
    });

    const files = treeData.data.tree.filter(
      (file) => file.type === "blob" && file.path.match(/\.(js|jsx|ts|tsx)$/)
    );

    const graph = {};

    for (const file of files) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${file.path}`;
      const code = await fetch(rawUrl).then((response) => response.text());

      try {
        const ast = parser.parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        });

        const imports = [];

        traverse(ast, {
          ImportDeclaration({ node }) {
            imports.push(node.source.value);
          },
        });

        const componentName = file.path
          .split("/")
          .pop()
          .replace(/\.(js|jsx|ts|tsx)$/, "");

        graph[componentName] = imports;
      } catch (err) {
        console.warn(`⚠️ Skipping file ${file.path}: ${err.message}`);
      }
    }

    const nodes = new Set();
    const links = [];

    for (const [source, targets] of Object.entries(graph)) {
      nodes.add(source);
      for (const target of targets) {
        const cleanedTarget = target
          .split("/")
          .pop()
          .replace(/\.(js|jsx|ts|tsx)$/, "");
        nodes.add(cleanedTarget);
        links.push({ source, target: cleanedTarget });
      }
    }

    return new Response(
      JSON.stringify({ nodes: Array.from(nodes).map((id) => ({ id })), links }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch or parse repo" }),
      { status: 500 }
    );
  }
}
