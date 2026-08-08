import { renderBaseEmailLayout } from './base';

export interface OrderStatusEmailData {
  userName: string;
  userDesignation?: string;
  orderNumber: string;
  newStatus: 'PREPARING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | string;
  notes?: string | null;
}

export function renderOrderStatusEmail(data: OrderStatusEmailData): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pcyc-space.vercel.app';
  const prefix =
    data.userDesignation === 'BROTHER'
      ? 'Brother'
      : data.userDesignation === 'SISTER'
      ? 'Sister'
      : 'Friend';

  let statusBadge = 'Order Update';
  let statusHeadline = 'Order Status Updated';
  let messageBody = `Your order <strong>#${data.orderNumber}</strong> has been updated.`;

  switch (data.newStatus) {
    case 'PREPARING':
      statusBadge = 'Preparing Order';
      statusHeadline = 'Your Items are Being Prepared';
      messageBody = `Our team is currently preparing and packing your merchandise items for Order <strong>#${data.orderNumber}</strong>.`;
      break;
    case 'SHIPPED':
      statusBadge = 'Order Dispatched';
      statusHeadline = 'Your Order Has Been Shipped';
      messageBody = `Great news! Order <strong>#${data.orderNumber}</strong> has been dispatched or is ready for pickup at the youth camp merch booth.`;
      break;
    case 'COMPLETED':
      statusBadge = 'Order Completed';
      statusHeadline = 'Order Completed & Delivered';
      messageBody = `Order <strong>#${data.orderNumber}</strong> has been marked as completed. We hope you enjoy your PCYC items!`;
      break;
    case 'CANCELLED':
      statusBadge = 'Order Cancelled';
      statusHeadline = 'Order Cancelled';
      messageBody = `Order <strong>#${data.orderNumber}</strong> has been cancelled.`;
      break;
  }

  const contentHtml = `
    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #2c3324;">
      Dear ${prefix} ${data.userName},
    </p>
    <p style="margin: 0 0 20px 0;">
      ${messageBody}
    </p>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f4e3; border: 1px solid #e6dfcb; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 16px 20px; font-size: 13px; color: #2c3324; line-height: 1.7;">
          <p style="margin: 0;"><strong>Order Number:</strong> #${data.orderNumber}</p>
          <p style="margin: 0;"><strong>Current Status:</strong> <span style="font-weight: 700; color: #2c3324;">${data.newStatus}</span></p>
          ${data.notes ? `<p style="margin: 6px 0 0 0;"><strong>Notice / Tracking:</strong> ${data.notes}</p>` : ''}
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 13px; color: #707666; text-align: center;">
      Thank you for supporting the Philippine Christadelphian Youth Conference!
    </p>
  `;

  return renderBaseEmailLayout({
    previewText: `Order #${data.orderNumber} update: ${data.newStatus}`,
    badge: statusBadge,
    title: statusHeadline,
    subtitle: `Order #${data.orderNumber}`,
    contentHtml,
    ctaButton: {
      text: 'View in Member Space',
      url: `${appUrl}/portal`,
    },
  });
}
