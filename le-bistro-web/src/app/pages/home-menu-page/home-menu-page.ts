import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderDraftService } from '../../services/order-draft.service';

interface HomeMenuOption {
  title: string;
  description: string;
  route: string;
  icon: string;
  accentClass: string;
}

@Component({
  selector: 'app-home-menu-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-menu-page.html',
  styleUrl: './home-menu-page.scss',
})
export class HomeMenuPageComponent implements OnInit {
  private readonly orderDraftService = inject(OrderDraftService);

  options: HomeMenuOption[] = [
    {
      title: 'Cozinha',
      description: 'Acompanhe pedidos confirmados, em preparo e prontos em tempo real.',
      route: '/kitchen',
      icon: '🍳',
      accentClass: 'accent-kitchen',
    },
    {
      title: 'Cardápio',
      description:
        'Visualize os pratos cadastrados e envie um item direto para a criação do pedido.',
      route: '/menu-items',
      icon: '🍽️',
      accentClass: 'accent-menu',
    },
    {
      title: 'Novo pedido',
      description: 'Monte um novo pedido para a mesa e envie direto para o fluxo da cozinha.',
      route: '/orders/new',
      icon: '🧾',
      accentClass: 'accent-new-order',
    },
    {
      title: 'Histórico',
      description: 'Consulte pedidos anteriores, detalhes dos itens e a linha do tempo dos status.',
      route: '/orders/history',
      icon: '📜',
      accentClass: 'accent-history',
    },
    {
      title: 'Admin cardápio',
      description: 'Cadastre e visualize todos os itens do cardápio, incluindo ativos e inativos.',
      route: '/menu-items/admin',
      icon: '🛠️',
      accentClass: 'accent-menu',
    },
    {
      title: 'Admin ingredientes',
      description: 'Cadastre ingredientes, unidades e estoque para usar nas receitas dos pratos.',
      route: '/ingredients/admin',
      icon: '🧪',
      accentClass: 'accent-ingredients',
    },
  ];

  ngOnInit(): void {
    this.orderDraftService.clearDraft();
  }
}
