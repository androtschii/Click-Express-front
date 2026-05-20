import React from "react";
import { useLanguage } from "../../context/LanguageContext";

interface PrivacyPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
}

const SECTIONS_EN = [
  { title: "Information We Collect", body: "We collect information you provide directly, including your name, email address, phone number, and messages submitted through our contact and quote forms. We also automatically collect usage data such as pages visited, browser type, and IP address via cookies and analytics tools." },
  { title: "How We Use Your Information", body: "We use collected information to respond to inquiries, process freight bookings, improve site functionality, and send relevant updates about our services. We do not use your data for unsolicited marketing without your explicit consent." },
  { title: "Cookies", body: "Our site uses cookies to maintain your preferences (such as theme and language), keep you logged in, and analyze traffic. You can accept or decline non-essential cookies via the banner shown on your first visit. Refusing cookies will not prevent you from using the site." },
  { title: "Data Sharing", body: "We do not sell or rent your personal data to third parties. Information may be shared with trusted service providers (e.g., cloud hosting, analytics) solely to operate our platform, and only under strict confidentiality agreements." },
  { title: "Data Retention", body: "Personal data is retained as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us at clickexpress.inc@gmail.com. We will respond within 30 days." },
  { title: "Your Rights", body: "Depending on your jurisdiction, you may have the right to access, correct, or delete your personal information, object to processing, and request data portability. To exercise any of these rights, please contact us directly." },
  { title: "Security", body: "We implement industry-standard security measures including HTTPS, encrypted data storage, and access controls to protect your information. However, no method of transmission over the internet is 100% secure." },
  { title: "Changes to This Policy", body: "We may update this privacy policy periodically. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes your acceptance of the revised policy." },
  { title: "Contact", body: "If you have questions about this privacy policy or how we handle your data, contact us at: clickexpress.inc@gmail.com or call +1 786-202-6599. Address: Hallandale Beach, FL 33009." },
];

const SECTIONS_RU = [
  { title: "Собираемые данные", body: "Мы собираем информацию, которую вы предоставляете напрямую: имя, email, телефон и сообщения из контактных форм. Автоматически собирается статистика использования (посещённые страницы, браузер, IP) с помощью cookies и аналитики." },
  { title: "Использование данных", body: "Собранные данные используются для ответа на запросы, обработки заказов на перевозку, улучшения сайта и отправки актуальной информации об услугах. Мы не используем ваши данные для несанкционированных рассылок." },
  { title: "Cookies", body: "Сайт использует cookies для сохранения настроек (тема, язык), поддержания сеанса и анализа трафика. Вы можете принять или отклонить необязательные cookies через баннер при первом посещении." },
  { title: "Передача данных третьим лицам", body: "Мы не продаём и не сдаём в аренду ваши личные данные. Информация может передаваться доверенным поставщикам услуг (хостинг, аналитика) исключительно для работы платформы, строго в рамках соглашений о конфиденциальности." },
  { title: "Срок хранения данных", body: "Личные данные хранятся пока ваш аккаунт активен или пока это необходимо для оказания услуг. Вы можете запросить удаление данных в любое время, написав на clickexpress.inc@gmail.com. Ответим в течение 30 дней." },
  { title: "Ваши права", body: "В зависимости от юрисдикции вы можете иметь право на доступ, исправление или удаление своих данных, возражение против обработки и перенос данных. Для реализации прав обратитесь к нам напрямую." },
  { title: "Безопасность", body: "Мы применяем отраслевые стандарты безопасности: HTTPS, шифрование данных, контроль доступа. Однако ни один метод передачи данных в интернете не является полностью безопасным." },
  { title: "Изменения политики", body: "Настоящая политика может периодически обновляться. Изменения публикуются на этой странице с указанием даты. Продолжение использования сайта означает принятие обновлённой политики." },
  { title: "Контакты", body: "По вопросам политики конфиденциальности обращайтесь: clickexpress.inc@gmail.com или +1 786-202-6599. Адрес: Hallandale Beach, FL 33009." },
];

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ theme = "dark", onBack }) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const sections = lang === "ru" ? SECTIONS_RU : SECTIONS_EN;

  const bg = isDark ? "#080808" : "#f5f5f5";
  const cardBg = isDark ? "#0f0f0f" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const textColor = isDark ? "#fff" : "#1a1a1a";
  const bodyColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "48px clamp(20px,5vw,64px) 80px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#CC0000", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 32, padding: 0 }}>
            ← {lang === "ru" ? "Назад" : "Back"}
          </button>
        )}
        <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>
          {lang === "ru" ? "Политика конфиденциальности" : "Privacy Policy"}
        </div>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(30px,5vw,50px)", color: textColor, textTransform: "uppercase", lineHeight: 1, marginBottom: 12 }}>
          {lang === "ru" ? "КОНФИДЕН" : "PRIVACY "}<span style={{ color: "#CC0000" }}>{lang === "ru" ? "ЦИАЛЬНОСТЬ" : "POLICY"}</span>
        </h1>
        <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: bodyColor, marginBottom: 40 }}>
          {lang === "ru" ? "Последнее обновление: май 2025" : "Last updated: May 2025"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sections.map((sec, i) => (
            <div key={i} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 6, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 4, background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 800, fontSize: 11, color: "#CC0000" }}>{i + 1}</span>
                </div>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 16, color: textColor, margin: 0 }}>{sec.title}</h3>
              </div>
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: bodyColor, lineHeight: 1.75, margin: 0 }}>{sec.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
