

## Problema
A seção Hero ("Transforme sua Clínica Estética") ocupa `min-h-screen` (100% da altura da tela), o que fica adequado em telas de MacBook (~900px de altura), mas excessivamente alta em monitores desktop maiores (1080p, 1440p, 4K).

## Solucao

Alterar o arquivo `src/components/landing/HeroSection.tsx`:

1. **Remover `min-h-screen`** da section principal e substituir por uma altura mais controlada que se adapte melhor a telas grandes
2. **Ajustar o padding vertical** para que o conteudo fique bem proporcionado sem forcar altura total da viewport

### Detalhes tecnicos

No elemento `<section>`, trocar:
- `min-h-screen` por `min-h-[85vh]` com um `max-h-[900px]` para limitar em telas grandes
- Ajustar `py-12` para manter o espaçamento proporcional

Isso garante que em MacBooks a seção continue visualmente igual, mas em monitores maiores não fique com espaço vazio excessivo.

