import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  text: string;
  sender: "user" | "attendant";
  timestamp: Date;
}

const attendantResponses = [
  {
    triggers: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "hey", "eai", "e ai"],
    responses: [
      "Oi! 😊 Que bom falar com você! Como posso te ajudar hoje?",
      "Olá! Fico feliz em te atender. Em que posso ajudar?",
      "Oi! Tudo bem? Estou aqui para esclarecer qualquer dúvida sobre o ClinicPro!"
    ]
  },
  {
    triggers: ["preço", "preco", "valor", "quanto custa", "plano", "planos", "mensalidade"],
    responses: [
      "Temos planos a partir de R$197/mês! O legal é que você pode testar 7 dias grátis antes de decidir. Quer que eu te explique as diferenças entre eles?",
      "Nossos planos são bem flexíveis! O Essencial começa em R$197, o Profissional em R$397 e temos o Enterprise personalizado. Qual te interessa mais?",
      "Sobre valores: temos opções pra todos os tamanhos de clínica! Posso te mandar mais detalhes por email se preferir 😊"
    ]
  },
  {
    triggers: ["funciona", "como funciona", "funcionalidade", "recurso", "recursos", "o que faz"],
    responses: [
      "O ClinicPro é completo! Você gerencia agenda, pacientes, finanças, WhatsApp integrado e ainda tem IA que ajuda a aumentar seus agendamentos. Quer saber mais sobre alguma função específica?",
      "A gente cuida de tudo: agendamentos automáticos, lembretes por WhatsApp, controle financeiro, relatórios... Basicamente você foca nos pacientes e a gente cuida do resto! 💜",
      "É uma plataforma all-in-one! Agenda inteligente, CRM de pacientes, financeiro, marketing automatizado... O que mais te interessa?"
    ]
  },
  {
    triggers: ["teste", "testar", "trial", "experimentar", "gratis", "grátis", "gratuito"],
    responses: [
      "Claro! São 7 dias completamente grátis, sem precisar de cartão. É só criar a conta e começar a usar! Quer o link?",
      "O teste é bem tranquilo: 7 dias com acesso total, sem compromisso. Se não gostar, sem problema nenhum! 😊",
      "Pode testar à vontade! 7 dias grátis pra você explorar tudo. Posso te ajudar a configurar se quiser!"
    ]
  },
  {
    triggers: ["whatsapp", "zap", "mensagem", "automação", "automatico", "automático"],
    responses: [
      "A integração com WhatsApp é demais! Você envia lembretes automáticos, confirma consultas, faz follow-up... tudo sem esforço. Seus pacientes adoram!",
      "O WhatsApp fica integrado direto na plataforma! Dá pra ver todo histórico do paciente enquanto conversa, usar templates prontos, automatizar lembretes... 🚀",
      "A automação do WhatsApp reduziu os no-shows das clínicas em até 75%! É tipo ter uma secretária 24h trabalhando pra você."
    ]
  },
  {
    triggers: ["suporte", "ajuda", "dúvida", "duvida", "problema"],
    responses: [
      "Nosso suporte é super dedicado! Respondemos rápido e te acompanhamos na implantação. Não vai ficar perdido, prometo! 💜",
      "Pode contar com a gente! Temos suporte por chat, email e até calls se precisar. O importante é você ter sucesso com a plataforma.",
      "A gente não te abandona depois da venda não! Suporte humanizado e treinamento inclusos em todos os planos 😊"
    ]
  },
  {
    triggers: ["migração", "migracao", "dados", "importar", "trocar", "mudar"],
    responses: [
      "Fazemos a migração dos seus dados sem custo! Nossa equipe cuida de tudo pra você não perder nada. Super tranquilo!",
      "Não precisa se preocupar com isso! A gente importa sua base de pacientes e histórico. É tudo por nossa conta 😊",
      "A transição é suave! Ajudamos a trazer seus dados e ainda treinamos sua equipe. Zero dor de cabeça!"
    ]
  }
];

const defaultResponses = [
  "Hmm, deixa eu entender melhor... Você quer saber sobre nossos planos, funcionalidades ou como funciona o teste grátis?",
  "Boa pergunta! Posso te ajudar com informações sobre preços, recursos da plataforma ou agendar uma demonstração. O que prefere?",
  "Estou aqui pra ajudar! Me conta mais sobre o que você precisa - gestão de agenda, WhatsApp, financeiro...?",
  "Entendi! Se quiser, posso te explicar como o ClinicPro pode ajudar sua clínica. Ou prefere fazer o teste grátis direto?"
];

const getResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  for (const category of attendantResponses) {
    if (category.triggers.some(trigger => lowerMessage.includes(trigger))) {
      return category.responses[Math.floor(Math.random() * category.responses.length)];
    }
  }
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export const ChatAtendente = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Oi! Sou a Bia, consultora do ClinicPro 💜 Como posso te ajudar hoje?",
      sender: "attendant",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simula tempo de digitação natural (1.5-3s)
    const typingTime = 1500 + Math.random() * 1500;
    
    setTimeout(() => {
      const response = getResponse(userMessage.text);
      const attendantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "attendant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, attendantMessage]);
      setIsTyping(false);
    }, typingTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[70vh]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback className="bg-primary/10 text-primary">B</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Bia</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online agora
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-[10px] mt-1 ${
                    message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-full bg-secondary border-0 focus-visible:ring-primary"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Consultora disponível 24h
        </p>
      </div>
    </div>
  );
};
