export type Project = {
  title: string;
  description: string;
  techs: string[];
  url?: string;
  github?: string;
  status: "completed" | "in_progress";
};

export const projects: Project[] = [
  {
    title: "profile-chat-ai",
    description:
      "自己紹介AIチャットボット。Next.js BFF + FastAPI + LangGraph + Amazon Bedrock（Claude Haiku 3.5）によるSSEストリーミング構成。RAGにS3 Vectorsを採用。",
    techs: ["Next.js", "TypeScript", "FastAPI", "Python", "LangGraph", "Amazon Bedrock", "DynamoDB", "S3 Vectors"],
    github: "https://github.com/ktr11",
    status: "in_progress",
  },
  {
    title: "組み込み型保険サービス開発",
    description:
      "大手ECプラットフォームと連携した保険サービスのマイクロサービスAPI開発。案件リーダーとして4名を率い、複数サービスにまたがる大規模システム移管を完遂。AIツール活用により特定業務の工数を最大83%削減。",
    techs: ["Java", "Spring Boot", "AWS", "Kubernetes", "MySQL", "GitHub Actions"],
    status: "completed",
  },
  {
    title: "中古車オークションシステム開発",
    description:
      "国内最大級の中古車オークションシステムのエンハンス開発。サブリーダーとして累計20件以上の案件をリリース。データ移行を伴う大規模改修でスクリプト作成からデータ整合性の担保まで担当。",
    techs: ["Java", "Spring Boot", "Oracle", "JavaScript", "jQuery"],
    status: "completed",
  },
];
