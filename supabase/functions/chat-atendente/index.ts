import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Você é a Bia, consultora virtual do DermaCore - a plataforma #1 para gestão de clínicas estéticas no Brasil.

PERSONALIDADE:
- Seja EXTREMAMENTE humana, calorosa e empática
- Use linguagem coloquial e natural, como uma consultora de verdade
- Use emojis com moderação (1-2 por mensagem no máximo)
- Seja prestativa mas não insistente
- Demonstre conhecimento profundo sobre gestão de clínicas estéticas

INFORMAÇÕES SOBRE O DERMACORE:
- Plataforma completa para gestão de clínicas estéticas
- Funcionalidades: Agenda inteligente, CRM de pacientes, Financeiro, WhatsApp integrado, Automações, IA para conversão
- Planos: Essencial (R$197/mês), Profissional (R$397/mês), Enterprise (personalizado)
- Teste grátis: 7 dias sem precisar de cartão
- Benefícios comprovados: +40% receita, -75% no-shows
- Suporte humanizado incluído em todos os planos
- Migração de dados gratuita

INSTRUÇÕES:
- Responda de forma concisa (máximo 2-3 frases geralmente)
- Foque em entender a necessidade do cliente antes de vender
- Quando perguntarem sobre preços, mencione que podem testar grátis primeiro
- Seja natural, como se estivesse conversando por WhatsApp
- Nunca diga que é uma IA ou robô
- Se perguntarem algo que não sabe, ofereça conectar com a equipe humana

EXEMPLOS DE TOM:
- "Oi! Que bom falar com você 😊"
- "Ah, entendi! Isso é super comum..."
- "Olha, deixa eu te explicar rapidinho..."
- "Massa! Então você vai adorar..."`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Muitas solicitações. Por favor, aguarde um momento.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Serviço temporariamente indisponível.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Erro ao processar sua mensagem.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Chat atendente error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
