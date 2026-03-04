import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logoDermacore from "@/assets/logo_dermacore.png";

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/"><img src={logoDermacore} alt="DermaCore" className="h-8 w-auto" /></Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: Março de 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Introdução</h2>
            <p>A DermaCore valoriza a privacidade dos seus usuários e está comprometida com a proteção de dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018). Esta Política descreve como coletamos, usamos, armazenamos e protegemos suas informações.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Dados Coletados</h2>
            <p>Coletamos as seguintes categorias de dados:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dados de cadastro:</strong> nome, e-mail, telefone, CPF/CNPJ da clínica.</li>
              <li><strong>Dados de uso:</strong> informações sobre como você utiliza a Plataforma, incluindo logs de acesso, páginas visitadas e funcionalidades utilizadas.</li>
              <li><strong>Dados de pacientes:</strong> informações inseridas pelo usuário na gestão de seus pacientes (nome, contato, histórico).</li>
              <li><strong>Dados de pagamento:</strong> processados por parceiros de pagamento certificados (Stripe). A DermaCore não armazena dados de cartão de crédito.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Finalidade do Tratamento</h2>
            <p>Utilizamos seus dados para: (a) fornecer e manter os serviços da Plataforma; (b) processar pagamentos e gerenciar assinaturas; (c) enviar comunicações relevantes sobre o serviço; (d) melhorar a experiência do usuário; (e) cumprir obrigações legais e regulatórias.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Base Legal</h2>
            <p>O tratamento de dados pessoais pela DermaCore é realizado com base nas seguintes hipóteses legais previstas na LGPD: execução de contrato, consentimento do titular, interesse legítimo do controlador e cumprimento de obrigação legal.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Compartilhamento de Dados</h2>
            <p>Seus dados podem ser compartilhados com: (a) provedores de infraestrutura e serviços essenciais para o funcionamento da Plataforma; (b) processadores de pagamento; (c) autoridades competentes, quando exigido por lei. Não vendemos ou comercializamos dados pessoais a terceiros.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Cookies e Tecnologias de Rastreamento</h2>
            <p>Utilizamos cookies e tecnologias similares para melhorar a experiência de navegação, manter sessões ativas e coletar dados analíticos. Você pode gerenciar as preferências de cookies através das configurações do seu navegador.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Segurança dos Dados</h2>
            <p>Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados, incluindo: criptografia em trânsito e em repouso, controle de acesso baseado em funções (RBAC), isolamento de dados por clínica (Row Level Security) e backups regulares.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Retenção de Dados</h2>
            <p>Seus dados são mantidos enquanto sua conta estiver ativa ou conforme necessário para cumprir obrigações legais. Após o encerramento da conta, os dados serão mantidos pelo prazo legal aplicável e, em seguida, eliminados de forma segura.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Direitos do Titular</h2>
            <p>Conforme a LGPD, você tem direito a: (a) confirmação da existência de tratamento; (b) acesso aos dados; (c) correção de dados incompletos ou desatualizados; (d) anonimização, bloqueio ou eliminação de dados desnecessários; (e) portabilidade dos dados; (f) eliminação dos dados tratados com consentimento; (g) revogação do consentimento.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Encarregado de Proteção de Dados (DPO)</h2>
            <p>Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados, entre em contato com nosso Encarregado de Proteção de Dados pelo e-mail: <a href="mailto:privacidade@dermacore.com" className="text-primary hover:underline">privacidade@dermacore.com</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Alterações nesta Política</h2>
            <p>Esta Política pode ser atualizada periodicamente. Notificaremos os usuários sobre alterações significativas por meio da Plataforma ou por e-mail.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
