import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logoDermacore from "@/assets/logo_dermacore.png";

export default function TermosDeUso() {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: Março de 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar a plataforma DermaCore ("Plataforma"), você declara ter lido, compreendido e concordado com estes Termos de Uso. A utilização da Plataforma implica aceitação integral destes termos. Caso não concorde com qualquer disposição, você não deverá utilizar a Plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Descrição do Serviço</h2>
            <p>A DermaCore é uma plataforma SaaS (Software as a Service) de gestão para clínicas de estética, oferecendo funcionalidades como: gerenciamento de leads e pacientes, agendamento, orçamentos, relatórios financeiros, automações de comunicação e gestão de equipe.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Cadastro e Conta</h2>
            <p>Para utilizar a Plataforma, o usuário deve criar uma conta fornecendo informações verdadeiras, atualizadas e completas. O usuário é responsável pela segurança de suas credenciais de acesso e por todas as atividades realizadas em sua conta.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Planos e Pagamento</h2>
            <p>A DermaCore oferece diferentes planos de assinatura com funcionalidades e limites variados. O pagamento é recorrente e processado de forma segura. O usuário pode cancelar sua assinatura a qualquer momento, sendo o acesso mantido até o final do período já pago. Não há reembolso proporcional para cancelamentos antecipados, exceto nos casos previstos pelo Código de Defesa do Consumidor.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Uso Adequado</h2>
            <p>O usuário compromete-se a utilizar a Plataforma de forma lícita e ética, não devendo: (a) violar leis ou regulamentos aplicáveis; (b) transmitir dados falsos, enganosos ou de terceiros sem autorização; (c) tentar acessar áreas restritas do sistema ou comprometer sua segurança; (d) utilizar a Plataforma para fins diversos daqueles para os quais foi projetada.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Dados e Privacidade</h2>
            <p>O tratamento de dados pessoais realizado pela DermaCore segue as disposições da Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018). Para informações detalhadas, consulte nossa <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Propriedade Intelectual</h2>
            <p>Todos os direitos de propriedade intelectual da Plataforma, incluindo software, design, marca, logotipos e conteúdo, pertencem à DermaCore. O usuário recebe apenas uma licença limitada, não exclusiva e revogável para utilizar a Plataforma conforme os termos da assinatura contratada.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Responsabilidade do Usuário</h2>
            <p>O usuário é integralmente responsável pelos dados inseridos na Plataforma, incluindo informações de pacientes. A DermaCore não se responsabiliza por decisões médicas, diagnósticos ou tratamentos realizados com base nas informações gerenciadas pela Plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Limitação de Responsabilidade</h2>
            <p>A DermaCore empenha-se em manter a Plataforma disponível e segura, mas não garante funcionamento ininterrupto. Em nenhuma hipótese a DermaCore será responsável por danos indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso da Plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Alterações nos Termos</h2>
            <p>A DermaCore reserva-se o direito de modificar estes Termos a qualquer momento, notificando os usuários sobre alterações relevantes. O uso continuado da Plataforma após as modificações constitui aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Foro e Legislação Aplicável</h2>
            <p>Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca da sede da DermaCore para dirimir quaisquer controvérsias decorrentes destes Termos.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">12. Contato</h2>
            <p>Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: <a href="mailto:contato@dermacore.com" className="text-primary hover:underline">contato@dermacore.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
