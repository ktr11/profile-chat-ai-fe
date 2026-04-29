export default function AboutMe() {
  return (
    <section id="about" className="py-20 px-4 lg:px-8 bg-base-200/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-base-content mb-10">About Me</h2>
        <div className="flex flex-col gap-6 text-base-content/80 leading-relaxed">
          <p>
            2017年より大手SIerにて中古車オークションシステムの開発に従事。Java / Spring Boot を軸に、
            要件定義からリリース判断まで一貫して担当するサブリーダーとして、累計20件以上の案件を完遂してきました。
          </p>
          <p>
            2022年より大手IT企業にて、大手ECプラットフォームと連携した組み込み型保険サービスの開発・保守・運用に従事。
            マイクロサービスアーキテクチャによるWebAPI開発と大量データのバッチ処理を担い、
            案件リーダーとして複数サービスにまたがる大規模システム移管を完遂しました。
          </p>
          <p>
            AI活用にも積極的で、GitHub CopilotやChatGPTを業務に導入。
            脆弱性診断の自動化やコード生成の活用により、特定業務の工数を最大83%削減した実績があります。
            現在は個人開発としてLangGraph × Amazon Bedrockを用いたAIチャットボットを構築中です。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            {[
              { label: "経験年数", value: "8年+" },
              { label: "リリース案件", value: "20件+" },
              { label: "工数削減", value: "最大83%" },
            ].map((stat) => (
              <div key={stat.label} className="card bg-base-100 shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-base-content/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
