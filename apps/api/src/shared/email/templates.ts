function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
    .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; }
    .body { padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; line-height: 1.6; }
    .footer { text-align: center; padding: 10px; color: #9ca3af; font-size: 12px; }
    .btn { display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin: 10px 0; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: bold; }
    .status-agendado { background: #fef3c7; color: #92400e; }
    .status-saiu { background: #dbeafe; color: #1e40af; }
    .status-entregue { background: #d1fae5; color: #065f46; }
    .status-falhou { background: #fee2e2; color: #991b1b; }
  </style></head><body>
    <div class="header"><h1>${title}</h1></div>
    <div class="body">${body}</div>
    <div class="footer">ERPoraqui - Sistema de Gestao Empresarial</div>
  </body></html>`;
}

export function entregaAgendadaHtml(nomeCliente: string, numeroPedido: string, dataAgendamento: string, token: string, baseUrl: string): string {
  return baseTemplate('Entrega Agendada', `
    <p>Ola <strong>${nomeCliente}</strong>,</p>
    <p>Seu pedido <strong>#${numeroPedido}</strong> foi agendado para entrega.</p>
    <p><strong>Data agendada:</strong> ${dataAgendamento}</p>
    <p><span class="status status-agendado">AGENDADO</span></p>
    <p>Acompanhe o status da sua entrega:</p>
    <p><a href="${baseUrl}/rastreio/${token}" class="btn">Rastrear Entrega</a></p>
  `);
}

export function entregaSaiuHtml(nomeCliente: string, numeroPedido: string, token: string, baseUrl: string): string {
  return baseTemplate('Pedido Saiu para Entrega', `
    <p>Ola <strong>${nomeCliente}</strong>,</p>
    <p>Seu pedido <strong>#${numeroPedido}</strong> saiu para entrega!</p>
    <p><span class="status status-saiu">SAIU PARA ENTREGA</span></p>
    <p>Acompanhe em tempo real:</p>
    <p><a href="${baseUrl}/rastreio/${token}" class="btn">Rastrear Entrega</a></p>
  `);
}

export function entregaEntregueHtml(nomeCliente: string, numeroPedido: string, tokenAvaliacao: string, baseUrl: string): string {
  return baseTemplate('Pedido Entregue!', `
    <p>Ola <strong>${nomeCliente}</strong>,</p>
    <p>Seu pedido <strong>#${numeroPedido}</strong> foi entregue com sucesso!</p>
    <p><span class="status status-entregue">ENTREGUE</span></p>
    <p>Ajude-nos a melhorar! Avalie sua experiencia:</p>
    <p><a href="${baseUrl}/avaliar/${tokenAvaliacao}" class="btn">Avaliar Experiencia</a></p>
  `);
}

export function entregaFalhouHtml(nomeCliente: string, numeroPedido: string, motivo: string, token: string, baseUrl: string): string {
  return baseTemplate('Tentativa de Entrega sem Sucesso', `
    <p>Ola <strong>${nomeCliente}</strong>,</p>
    <p>Nao foi possivel entregar seu pedido <strong>#${numeroPedido}</strong>.</p>
    <p><strong>Motivo:</strong> ${motivo}</p>
    <p><span class="status status-falhou">TENTATIVA FALHOU</span></p>
    <p>Entraremos em contato para reagendar. Acompanhe o status:</p>
    <p><a href="${baseUrl}/rastreio/${token}" class="btn">Acompanhar</a></p>
  `);
}

export function avaliacaoConviteHtml(nomeCliente: string, numeroPedido: string, tokenAvaliacao: string, baseUrl: string): string {
  return baseTemplate('Como Foi Sua Experiencia?', `
    <p>Ola <strong>${nomeCliente}</strong>,</p>
    <p>Seu pedido <strong>#${numeroPedido}</strong> foi entregue. Gostariamos de saber sua opiniao!</p>
    <p>Avalie a loja, o pedido e a entrega:</p>
    <p><a href="${baseUrl}/avaliar/${tokenAvaliacao}" class="btn">Avaliar Agora</a></p>
  `);
}
