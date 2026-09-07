import { WhatsAppOutlined } from '@ant-design/icons';
import { useBusinessSettingsContext } from '../../contexts/BusinessSettingsContext';
import { formatWhatsAppNumber } from '@/lib/whatsapp';

export function WhatsAppFAB() {
  const { whatsapp } = useBusinessSettingsContext();
  const waLink = `https://wa.me/${formatWhatsAppNumber(whatsapp)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppOutlined className="text-3xl" />
    </a>
  );
}
