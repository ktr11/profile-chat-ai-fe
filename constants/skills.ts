export type Skill = {
  name: string;
  category: string;
  years: number;
  comment: string;
};

export const skills: Skill[] = [
  { name: "Java / Spring Boot", category: "Backend", years: 8, comment: "主力言語。大規模WebAPI・バッチ処理の設計から実装まで" },
  { name: "Go", category: "Backend", years: 2, comment: "シンプルな構文と高パフォーマンスが好み" },
  { name: "Python", category: "Backend", years: 2, comment: "AI連携・自動化スクリプトに活用" },
  { name: "Node.js", category: "Backend", years: 2, comment: "BFF・サーバーレス用途" },
  { name: "TypeScript / Next.js", category: "Frontend", years: 1, comment: "App Router + Tailwind CSS で開発中" },
  { name: "AWS", category: "Infrastructure", years: 3, comment: "DynamoDB, S3, Lambda など" },
  { name: "MySQL / Oracle", category: "Database", years: 7, comment: "大規模データ移行・チューニング経験あり" },
  { name: "GitHub Actions", category: "DevOps", years: 3, comment: "CI/CD パイプライン構築・運用自動化" },
  { name: "GitHub Copilot / Claude Code", category: "AI Tools", years: 2, comment: "業務プロセスへのAI導入・工数83%削減を実現" },
  { name: "Kubernetes (PaaS)", category: "Infrastructure", years: 3, comment: "Cloud Foundry 環境でのコンテナ運用" },
];
